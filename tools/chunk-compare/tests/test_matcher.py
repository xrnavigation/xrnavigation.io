"""Tests for the matcher: hypothesis properties + unit tests."""

from __future__ import annotations

from hypothesis import given, settings

from chunk_compare.chunker import chunk_html
from chunk_compare.matcher import match_chunks

from .strategies import matched_page_pair


# --- Hypothesis property tests ---


@given(data=matched_page_pair())
@settings(max_examples=200)
def test_bijective_matching(data: tuple[str, str, list[str]]) -> None:
    """Each chunk appears in at most one match pair."""
    wp_html, hugo_html, _ = data
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    wp_indices = [p.wp_chunk.index for p in result.pairs]
    hugo_indices = [p.hugo_chunk.index for p in result.pairs]
    assert len(wp_indices) == len(set(wp_indices)), "WP chunk matched twice"
    assert len(hugo_indices) == len(set(hugo_indices)), "Hugo chunk matched twice"


@given(data=matched_page_pair())
@settings(max_examples=200)
def test_identical_inputs_match_perfectly(
    data: tuple[str, str, list[str]],
) -> None:
    """Pages with identical headings should produce perfect 1:1 matching."""
    wp_html, hugo_html, _ = data
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    assert len(result.pairs) == len(wp_chunks)
    assert result.unmatched_wp == []
    assert result.unmatched_hugo == []


@given(data=matched_page_pair())
@settings(max_examples=200)
def test_order_preserved_for_identical_order(
    data: tuple[str, str, list[str]],
) -> None:
    """Hugo indices should be monotonically increasing for same-order inputs."""
    wp_html, hugo_html, _ = data
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    hugo_order = [p.hugo_chunk.index for p in result.pairs]
    assert hugo_order == sorted(hugo_order), "Hugo order should be monotonic"


@given(data=matched_page_pair())
@settings(max_examples=200)
def test_all_chunks_accounted_for(
    data: tuple[str, str, list[str]],
) -> None:
    """Every chunk should be either in a pair or in unmatched."""
    wp_html, hugo_html, _ = data
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    matched_wp = {p.wp_chunk.index for p in result.pairs}
    unmatched_wp = {c.index for c in result.unmatched_wp}
    all_wp = {c.index for c in wp_chunks}
    assert matched_wp | unmatched_wp == all_wp

    matched_hugo = {p.hugo_chunk.index for p in result.pairs}
    unmatched_hugo = {c.index for c in result.unmatched_hugo}
    all_hugo = {c.index for c in hugo_chunks}
    assert matched_hugo | unmatched_hugo == all_hugo


# --- Unit tests ---


def test_empty_inputs() -> None:
    result = match_chunks([], [])
    assert result.pairs == []
    assert result.unmatched_wp == []
    assert result.unmatched_hugo == []


def test_extra_wp_section_is_unmatched() -> None:
    wp_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Alpha</h2></div></div>
        <div class="wp-block-uagb-container uagb-block-00000002 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Beta</h2></div></div>
        <div class="wp-block-uagb-container uagb-block-00000003 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Gamma</h2></div></div>
    </div>"""
    hugo_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Alpha</h2></div></div>
        <div class="wp-block-uagb-container uagb-block-00000003 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Gamma</h2></div></div>
    </div>"""
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    assert len(result.pairs) == 2
    assert len(result.unmatched_wp) == 1
    assert result.unmatched_wp[0].heading is not None
    assert result.unmatched_wp[0].heading.lower() == "beta"
    assert result.unmatched_hugo == []


def test_extra_hugo_section_is_unmatched() -> None:
    wp_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Alpha</h2></div></div>
    </div>"""
    hugo_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Alpha</h2></div></div>
        <div class="wp-block-uagb-container uagb-block-00000002 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Beta</h2></div></div>
    </div>"""
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    assert len(result.pairs) == 1
    assert result.pairs[0].wp_chunk.heading == "Alpha"
    assert result.unmatched_wp == []
    assert len(result.unmatched_hugo) == 1
    assert result.unmatched_hugo[0].heading == "Beta"


def test_fuzzy_heading_match() -> None:
    """Minor heading differences should still match."""
    wp_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>The Challenge</h2></div></div>
    </div>"""
    hugo_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>The Challenge:</h2></div></div>
    </div>"""
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    assert len(result.pairs) == 1
    assert result.unmatched_wp == []
    assert result.unmatched_hugo == []


def test_text_similarity_match_for_headingless_chunks() -> None:
    """Chunks without headings should match by text content."""
    wp_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap">
                <p>Audiom redefines mapping with its cross-sensory design.</p>
            </div></div>
    </div>"""
    hugo_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap">
                <p>Audiom redefines mapping with its cross-sensory design.</p>
            </div></div>
    </div>"""
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    assert len(result.pairs) == 1
    assert result.pairs[0].match_method in ("exact_heading", "text_similarity")


def test_confidence_values_are_valid() -> None:
    wp_html = """<div class="entry-content clear">
        <div class="wp-block-uagb-container uagb-block-00000001 alignfull uagb-is-root-container">
            <div class="uagb-container-inner-blocks-wrap"><h2>Section</h2></div></div>
    </div>"""
    hugo_html = wp_html
    wp_chunks = chunk_html(wp_html, content_selector="div.entry-content")
    hugo_chunks = chunk_html(hugo_html, content_selector="div.entry-content")
    result = match_chunks(wp_chunks, hugo_chunks)

    for pair in result.pairs:
        assert 0.0 <= pair.confidence <= 1.0
