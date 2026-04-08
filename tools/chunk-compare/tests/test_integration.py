"""Integration tests against real WP HTML fixtures."""

from __future__ import annotations

import pytest

from chunk_compare.chunker import chunk_html
from chunk_compare.models import SelectorType


class TestAboutPage:
    def test_produces_uagb_chunks(self, wp_about_html: str) -> None:
        chunks = chunk_html(wp_about_html)
        boundary_chunks = [
            c
            for c in chunks
            if c.selector_type
            in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP)
        ]
        # structural-patterns.md documents extensive UAGB usage on about page
        assert len(boundary_chunks) >= 10

    def test_first_boundary_has_heading(self, wp_about_html: str) -> None:
        chunks = chunk_html(wp_about_html)
        boundary_chunks = [
            c
            for c in chunks
            if c.selector_type
            in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP)
        ]
        assert len(boundary_chunks) > 0
        # The about page starts with a heading about XR Navigation
        first = boundary_chunks[0]
        assert first.heading is not None

    def test_indices_are_sequential(self, wp_about_html: str) -> None:
        chunks = chunk_html(wp_about_html)
        assert [c.index for c in chunks] == list(range(len(chunks)))

    def test_all_chunks_have_html(self, wp_about_html: str) -> None:
        chunks = chunk_html(wp_about_html)
        for chunk in chunks:
            assert chunk.html, f"Chunk {chunk.index} has empty html"


class TestBlogPost:
    def test_no_uagb_sections(self, wp_blog_post_html: str) -> None:
        """Blog posts use standard WP blocks, not UAGB containers."""
        chunks = chunk_html(wp_blog_post_html)
        uagb_chunks = [
            c for c in chunks if c.selector_type == SelectorType.UAGB_ROOT
        ]
        assert len(uagb_chunks) == 0

    def test_falls_back_to_heading_split_or_whole_page(
        self, wp_blog_post_html: str
    ) -> None:
        chunks = chunk_html(wp_blog_post_html)
        assert len(chunks) >= 1
        for chunk in chunks:
            assert chunk.selector_type in (
                SelectorType.HEADING_SPLIT,
                SelectorType.ORPHAN,
                SelectorType.WHOLE_PAGE,
            )

    def test_has_content(self, wp_blog_post_html: str) -> None:
        chunks = chunk_html(wp_blog_post_html)
        all_text = " ".join(c.text_content for c in chunks)
        # Blog post should have substantial text
        assert len(all_text) > 100


class TestHomepage:
    def test_produces_uagb_chunks(self, wp_homepage_html: str) -> None:
        chunks = chunk_html(wp_homepage_html)
        boundary_chunks = [
            c
            for c in chunks
            if c.selector_type
            in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP)
        ]
        # Homepage has 8+ sections per structural-patterns.md
        assert len(boundary_chunks) >= 6

    def test_indices_are_sequential(self, wp_homepage_html: str) -> None:
        chunks = chunk_html(wp_homepage_html)
        assert [c.index for c in chunks] == list(range(len(chunks)))


class TestCorporateCampusesFragment:
    def test_fragment_produces_chunks(
        self, wp_corporate_campuses_fragment: str
    ) -> None:
        """Fragment without entry-content wrapper should still chunk."""
        chunks = chunk_html(
            wp_corporate_campuses_fragment,
            content_selector="div.entry-content",
        )
        # The fragment has 4-5 UAGB root containers
        boundary_chunks = [
            c
            for c in chunks
            if c.selector_type
            in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP)
        ]
        assert len(boundary_chunks) >= 3

    def test_first_chunk_has_h1(
        self, wp_corporate_campuses_fragment: str
    ) -> None:
        chunks = chunk_html(
            wp_corporate_campuses_fragment,
            content_selector="div.entry-content",
        )
        boundary_chunks = [
            c
            for c in chunks
            if c.selector_type
            in (SelectorType.UAGB_ROOT, SelectorType.WP_BLOCK_GROUP)
        ]
        assert len(boundary_chunks) > 0
        assert boundary_chunks[0].heading is not None
        assert boundary_chunks[0].heading_level == 1
