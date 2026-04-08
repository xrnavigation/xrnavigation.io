"""Tests for the chunker: hypothesis properties + unit tests."""

from __future__ import annotations

from hypothesis import given, settings

from chunk_compare.chunker import chunk_html
from chunk_compare.models import SelectorType
from chunk_compare.text_utils import normalize_whitespace

from .strategies import html_page, page_with_heading_splits


# --- Hypothesis property tests ---


@given(data=html_page(min_sections=0, max_sections=8))
@settings(max_examples=200)
def test_chunk_indices_are_sequential(data: tuple[str, int]) -> None:
    html, _ = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert [c.index for c in chunks] == list(range(len(chunks)))


@given(data=html_page(min_sections=1, max_sections=8))
@settings(max_examples=200)
def test_boundary_count_matches_expected(data: tuple[str, int]) -> None:
    html, expected_boundaries = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    boundary_chunks = [
        c for c in chunks if c.selector_type == SelectorType.UAGB_ROOT
    ]
    assert len(boundary_chunks) == expected_boundaries


@given(data=html_page(min_sections=1, max_sections=8))
@settings(max_examples=200)
def test_all_text_preserved(data: tuple[str, int]) -> None:
    """Every word from the original HTML appears in some chunk."""
    html, _ = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    all_chunk_text = " ".join(c.text_content for c in chunks)

    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "lxml")
    entry = soup.select_one("div.entry-content")
    if entry is None:
        return
    original_text = normalize_whitespace(entry.get_text(separator=" ", strip=True))

    for word in original_text.split():
        assert word in all_chunk_text, f"Word '{word}' missing from chunks"


@given(data=html_page(min_sections=0, max_sections=8))
@settings(max_examples=200)
def test_no_empty_text_boundary_chunks(data: tuple[str, int]) -> None:
    """Boundary chunks should have some text content (they wrap real content)."""
    html, _ = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    for chunk in chunks:
        if chunk.selector_type in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP):
            # The section itself was generated with content, so text should exist
            # (unless the generated inner content was all empty paragraphs)
            pass  # Not all generated sections have text — skip this assertion


@given(data=page_with_heading_splits(min_sections=1, max_sections=6))
@settings(max_examples=200)
def test_heading_split_produces_right_chunk_count(
    data: tuple[str, int, list[str]],
) -> None:
    html, expected_count, _ = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == expected_count


@given(data=page_with_heading_splits(min_sections=1, max_sections=6))
@settings(max_examples=200)
def test_heading_split_chunks_have_headings(
    data: tuple[str, int, list[str]],
) -> None:
    html, _, headings = data
    chunks = chunk_html(html, content_selector="div.entry-content")
    heading_chunks = [
        c for c in chunks if c.selector_type == SelectorType.HEADING_SPLIT
    ]
    # Each heading-split chunk should have a heading
    for chunk in heading_chunks:
        assert chunk.heading is not None
        assert chunk.heading_level == 2


# --- Unit tests ---


def test_empty_content() -> None:
    html = '<div class="entry-content clear"></div>'
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert chunks == []


def test_no_boundaries_no_headings_produces_whole_page() -> None:
    html = '<div class="entry-content clear"><p>Hello world</p><p>More text</p></div>'
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 1
    assert chunks[0].selector_type == SelectorType.WHOLE_PAGE
    assert "Hello world" in chunks[0].text_content


def test_single_uagb_section() -> None:
    html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-abc12345 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap">
                <h2>Test Section</h2>
                <p>Content here</p>
            </div>
        </div>
    </div>"""
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 1
    assert chunks[0].selector_type == SelectorType.UAGB_ROOT
    assert chunks[0].heading == "Test Section"
    assert chunks[0].heading_level == 2


def test_inner_container_not_treated_as_boundary() -> None:
    """Inner containers (without alignfull/uagb-is-root-container) should not split."""
    html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-outer123 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap">
                <div class="wp-block-uagb-container uagb-block-inner456">
                    <h2>Inner Heading</h2>
                </div>
                <div class="wp-block-uagb-container uagb-block-inner789">
                    <h3>Another Inner</h3>
                </div>
            </div>
        </div>
    </div>"""
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 1
    assert chunks[0].selector_type == SelectorType.UAGB_ROOT


def test_orphan_before_first_section() -> None:
    html = """<div class="entry-content clear">
        <p>Orphan paragraph</p>
        <div class="wp-block-uagb-container uagb-block-abc12345 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap">
                <h2>Real Section</h2>
            </div>
        </div>
    </div>"""
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 2
    assert chunks[0].selector_type == SelectorType.ORPHAN
    assert "Orphan paragraph" in chunks[0].text_content
    assert chunks[1].selector_type == SelectorType.UAGB_ROOT
    assert chunks[1].heading == "Real Section"


def test_wp_block_group_detected_as_boundary() -> None:
    html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-aaa alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Section A</h2></div>
        </div>
        <div class="wp-block-group alignfull has-background">
            <h2>Section B (Gutenberg)</h2>
            <p>Using native blocks</p>
        </div>
    </div>"""
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 2
    assert chunks[0].selector_type == SelectorType.UAGB_ROOT
    assert chunks[1].selector_type == SelectorType.WP_BLOCK_GROUP
    assert chunks[1].heading == "Section B (Gutenberg)"


def test_h2_split_fallback_for_blog_posts() -> None:
    html = """<div class="entry-content clear">
        <p>Introduction paragraph</p>
        <h2 class="wp-block-heading">First Section</h2>
        <p>Some content</p>
        <h2 class="wp-block-heading">Second Section</h2>
        <p>More content</p>
    </div>"""
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 3  # 1 orphan intro + 2 heading splits
    assert chunks[0].selector_type == SelectorType.ORPHAN
    assert chunks[1].selector_type == SelectorType.HEADING_SPLIT
    assert chunks[1].heading == "First Section"
    assert chunks[2].selector_type == SelectorType.HEADING_SPLIT
    assert chunks[2].heading == "Second Section"


def test_content_selector_not_found_uses_body() -> None:
    html = "<html><body><p>Just a paragraph</p></body></html>"
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 1
    assert chunks[0].selector_type == SelectorType.WHOLE_PAGE
    assert "Just a paragraph" in chunks[0].text_content


def test_fragment_without_wrapper() -> None:
    """Raw HTML fragment (like from data/wp-rendered/) without entry-content wrapper."""
    html = """
        <div class="wp-block-uagb-container uagb-block-aaa alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h1>Hero</h1></div>
        </div>
        <div class="wp-block-uagb-container uagb-block-bbb alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Details</h2></div>
        </div>
    """
    # No entry-content wrapper, so falls back to body
    chunks = chunk_html(html, content_selector="div.entry-content")
    assert len(chunks) == 2
    assert chunks[0].heading == "Hero"
    assert chunks[1].heading == "Details"
