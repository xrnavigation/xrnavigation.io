"""Hypothesis strategies for generating synthetic HTML with known structure."""

from __future__ import annotations

import hypothesis.strategies as st
from hypothesis import assume


def _safe_text() -> st.SearchStrategy[str]:
    """Text that won't break HTML parsing."""
    return st.text(
        alphabet=st.characters(
            whitelist_categories=("L", "N", "Zs"),
            blacklist_characters="<>&\"'",
        ),
        min_size=1,
        max_size=60,
    ).filter(lambda t: t.strip())


def _paragraph_text() -> st.SearchStrategy[str]:
    return st.text(
        alphabet=st.characters(
            whitelist_categories=("L", "N", "Zs", "P"),
            blacklist_characters="<>&\"'",
        ),
        min_size=0,
        max_size=200,
    )


@st.composite
def html_inner_content(draw: st.DrawFn) -> str:
    """Generate plausible inner HTML for a section (heading + paragraphs)."""
    has_heading = draw(st.booleans())
    parts: list[str] = []

    if has_heading:
        level = draw(st.sampled_from([1, 2, 3]))
        text = draw(_safe_text())
        parts.append(f'<h{level} class="uagb-heading-text">{text}</h{level}>')

    n_paragraphs = draw(st.integers(min_value=0, max_value=3))
    for _ in range(n_paragraphs):
        text = draw(_paragraph_text())
        parts.append(f"<p>{text}</p>")

    return "\n".join(parts)


@st.composite
def section_boundary(draw: st.DrawFn) -> str:
    """Generate a UAGB root container section wrapping inner content."""
    hash_id = draw(st.from_regex(r"[a-f0-9]{8}", fullmatch=True))
    inner = draw(html_inner_content())
    return (
        f'<div class="wp-block-uagb-container uagb-block-{hash_id} '
        f'alignfull uagb-is-root-container">'
        f'<div class="uagb-container-inner-blocks-wrap">{inner}</div></div>'
    )


@st.composite
def orphan_element(draw: st.DrawFn) -> str:
    """Generate an element that is NOT a section boundary."""
    inner = draw(html_inner_content())
    return f'<div class="some-other-thing">{inner}</div>'


@st.composite
def html_page(
    draw: st.DrawFn,
    min_sections: int = 0,
    max_sections: int = 8,
) -> tuple[str, int]:
    """Generate a content area with known section count.

    Returns (html_string, expected_boundary_count).
    """
    n_sections = draw(st.integers(min_value=min_sections, max_value=max_sections))
    parts: list[str] = []

    # Optionally add orphan content before first section
    if n_sections > 0 and draw(st.booleans()):
        parts.append(draw(orphan_element()))

    for _ in range(n_sections):
        parts.append(draw(section_boundary()))

    body = "\n".join(parts)
    html = f'<div class="entry-content clear">{body}</div>'
    return html, n_sections


@st.composite
def matched_page_pair(
    draw: st.DrawFn,
) -> tuple[str, str, list[str]]:
    """Generate two HTML pages with identical section headings.

    Returns (wp_html, hugo_html, list_of_heading_texts).
    """
    n = draw(st.integers(min_value=1, max_value=6))
    headings = [draw(_safe_text()) for _ in range(n)]
    # Ensure headings are unique so matching is unambiguous
    assume(len(set(h.lower().strip() for h in headings)) == n)

    def make_page(heading_list: list[str]) -> str:
        sections = []
        for i, h in enumerate(heading_list):
            sections.append(
                f'<div class="wp-block-uagb-container uagb-block-{i:08x} '
                f'alignfull uagb-is-root-container">'
                f'<div class="uagb-container-inner-blocks-wrap">'
                f'<h2 class="uagb-heading-text">{h}</h2>'
                f"<p>Content for section {i}</p>"
                f"</div></div>"
            )
        return '<div class="entry-content clear">' + "\n".join(sections) + "</div>"

    wp_html = make_page(headings)
    hugo_html = make_page(headings)
    return wp_html, hugo_html, headings


@st.composite
def page_with_heading_splits(
    draw: st.DrawFn,
    min_sections: int = 1,
    max_sections: int = 6,
) -> tuple[str, int, list[str]]:
    """Generate blog-post-style HTML with H2 boundaries (no UAGB containers).

    Returns (html, expected_h2_section_count, list_of_heading_texts).
    """
    n = draw(st.integers(min_value=min_sections, max_value=max_sections))
    headings = [draw(_safe_text()) for _ in range(n)]

    parts: list[str] = []

    # Optionally add intro paragraph before first H2
    has_intro = draw(st.booleans())
    if has_intro:
        intro = draw(_paragraph_text())
        parts.append(f"<p>{intro}</p>")

    for h in headings:
        parts.append(f'<h2 class="wp-block-heading">{h}</h2>')
        n_paras = draw(st.integers(min_value=0, max_value=2))
        for _ in range(n_paras):
            text = draw(_paragraph_text())
            parts.append(f"<p>{text}</p>")

    body = "\n".join(parts)
    html = f'<div class="entry-content clear">{body}</div>'

    # Expected chunk count: n heading sections + (1 orphan intro if present)
    expected_chunks = n + (1 if has_intro else 0)
    return html, expected_chunks, headings
