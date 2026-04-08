from __future__ import annotations

from bs4 import BeautifulSoup, NavigableString, Tag

from .models import Chunk, SelectorType
from .text_utils import normalize_whitespace


def _is_uagb_root(el: Tag) -> bool:
    """Check if element is a UAGB root container boundary."""
    if el.name != "div":
        return False
    classes = el.get("class", [])
    return (
        "wp-block-uagb-container" in classes
        and "alignfull" in classes
        and "uagb-is-root-container" in classes
    )


def _is_wp_block_group(el: Tag) -> bool:
    """Check if element is a wp-block-group full-width boundary."""
    if el.name != "div":
        return False
    classes = el.get("class", [])
    return "wp-block-group" in classes and "alignfull" in classes


def _extract_heading(el: Tag) -> tuple[str | None, int | None]:
    """Find first h1/h2/h3 (the element itself or a descendant) and return (text, level)."""
    for level in (1, 2, 3):
        # Check if the element itself is the heading
        if el.name == f"h{level}":
            text = normalize_whitespace(el.get_text())
            if text:
                return text, level
        # Then check descendants
        heading = el.find(f"h{level}")
        if heading:
            text = normalize_whitespace(heading.get_text())
            if text:
                return text, level
    return None, None


def _extract_text(el: Tag) -> str:
    """Get all text content, whitespace-normalized."""
    return normalize_whitespace(el.get_text(separator=" ", strip=True))


def _make_chunk(
    index: int,
    elements: list[Tag],
    selector_type: SelectorType,
) -> Chunk:
    """Build a Chunk from one or more elements."""
    if len(elements) == 1:
        el = elements[0]
        heading, heading_level = _extract_heading(el)
        text_content = _extract_text(el)
        html = str(el)
        element_id = el.get("id") if isinstance(el, Tag) else None
    else:
        # Multiple elements grouped together (orphan buffer)
        heading = None
        heading_level = None
        for el in elements:
            if isinstance(el, Tag):
                heading, heading_level = _extract_heading(el)
                if heading:
                    break
        text_parts = []
        html_parts = []
        for el in elements:
            if isinstance(el, Tag):
                text_parts.append(_extract_text(el))
                html_parts.append(str(el))
            elif isinstance(el, NavigableString) and str(el).strip():
                text_parts.append(normalize_whitespace(str(el)))
                html_parts.append(str(el))
        text_content = normalize_whitespace(" ".join(text_parts))
        html = "\n".join(html_parts)
        element_id = None

    return Chunk(
        index=index,
        heading=heading,
        heading_level=heading_level,
        text_content=text_content,
        html=html,
        selector_type=selector_type,
        element_id=element_id,
    )


def _tier1_chunk(content_root: Tag) -> list[Chunk] | None:
    """Tier 1: split at UAGB root containers and wp-block-group boundaries.

    Returns list of chunks if any boundaries found, None otherwise.
    """
    orphan_buffer: list[Tag] = []
    chunks: list[Chunk] = []
    found_boundary = False

    for child in content_root.children:
        if isinstance(child, NavigableString):
            if str(child).strip():
                orphan_buffer.append(child)
            continue

        if not isinstance(child, Tag):
            continue

        if _is_uagb_root(child):
            selector_type = SelectorType.UAGB_ROOT
        elif _is_wp_block_group(child):
            selector_type = SelectorType.WP_BLOCK_GROUP
        else:
            orphan_buffer.append(child)
            continue

        found_boundary = True

        # Flush orphan buffer before this boundary
        if orphan_buffer:
            chunks.append(_make_chunk(len(chunks), orphan_buffer, SelectorType.ORPHAN))
            orphan_buffer = []

        chunks.append(_make_chunk(len(chunks), [child], selector_type))

    if not found_boundary:
        return None

    # Flush trailing orphan buffer
    if orphan_buffer:
        chunks.append(_make_chunk(len(chunks), orphan_buffer, SelectorType.ORPHAN))

    return chunks


def _tier2_heading_split(content_root: Tag) -> list[Chunk] | None:
    """Tier 2: split at H2 boundaries for pages without UAGB containers.

    Returns list of chunks if any H2s found, None otherwise.
    """
    # Collect all direct children
    children: list[Tag | NavigableString] = [
        c for c in content_root.children
        if isinstance(c, Tag) or (isinstance(c, NavigableString) and str(c).strip())
    ]

    if not children:
        return None

    # Check if any H2s exist as direct children or within direct children
    has_h2 = False
    for child in children:
        if isinstance(child, Tag):
            if child.name == "h2":
                has_h2 = True
                break
            # Also check for H2 wrapped in a div (common in WP block markup)
            if child.find("h2", recursive=False):
                has_h2 = True
                break

    if not has_h2:
        return None

    chunks: list[Chunk] = []
    current_group: list[Tag] = []

    for child in children:
        is_h2_boundary = False
        if isinstance(child, Tag):
            if child.name == "h2":
                is_h2_boundary = True
            elif child.find("h2", recursive=False):
                is_h2_boundary = True

        if is_h2_boundary and current_group:
            # Flush current group as a chunk
            selector = SelectorType.HEADING_SPLIT if chunks else SelectorType.ORPHAN
            # First group (before any H2) is orphan; subsequent are heading splits
            # Actually: if the first group has no H2, it's orphan. Otherwise it's a split.
            first_group_has_h2 = any(
                (isinstance(el, Tag) and (el.name == "h2" or el.find("h2", recursive=False)))
                for el in current_group
            )
            if first_group_has_h2:
                selector = SelectorType.HEADING_SPLIT
            else:
                selector = SelectorType.ORPHAN
            chunks.append(_make_chunk(len(chunks), current_group, selector))
            current_group = []

        current_group.append(child)

    # Flush last group
    if current_group:
        first_group_has_h2 = any(
            (isinstance(el, Tag) and (el.name == "h2" or el.find("h2", recursive=False)))
            for el in current_group
        )
        selector = SelectorType.HEADING_SPLIT if first_group_has_h2 else SelectorType.ORPHAN
        chunks.append(_make_chunk(len(chunks), current_group, selector))

    return chunks if chunks else None


def chunk_html(
    html: str,
    content_selector: str = "div.entry-content",
) -> list[Chunk]:
    """Parse HTML and split into chunks at section boundaries.

    Uses two-tier chunking:
    1. UAGB root containers / wp-block-group boundaries
    2. H2 heading boundaries (fallback for blog posts)
    3. Single WHOLE_PAGE chunk (final fallback)

    Args:
        html: Full page HTML or content fragment.
        content_selector: CSS selector for the content wrapper.
            If not found, treats the entire input as the content area.

    Returns:
        Ordered list of Chunk objects covering all content.
    """
    soup = BeautifulSoup(html, "lxml")

    # Find content root
    content_root = soup.select_one(content_selector)
    if content_root is None:
        # Fallback: use the body or root element
        content_root = soup.body or soup

    # Tier 1: UAGB root containers
    result = _tier1_chunk(content_root)
    if result is not None:
        return result

    # Tier 2: H2 heading splits
    result = _tier2_heading_split(content_root)
    if result is not None:
        return result

    # Tier 3: whole page fallback (only if there's actual content)
    if not content_root.get_text(strip=True):
        return []
    return [_make_chunk(0, [content_root], SelectorType.WHOLE_PAGE)]
