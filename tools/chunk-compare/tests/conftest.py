"""Fixtures loading real WP HTML from data/ for integration tests."""

from __future__ import annotations

from pathlib import Path

import pytest

# Project root is 3 levels up from tests/
PROJECT_ROOT = Path(__file__).resolve().parents[3]
WP_HTML_DIR = PROJECT_ROOT / "data" / "wp-html"
WP_RENDERED_DIR = PROJECT_ROOT / "data" / "wp-rendered"


@pytest.fixture
def wp_about_html() -> str:
    return (WP_HTML_DIR / "about.html").read_text(encoding="utf-8")


@pytest.fixture
def wp_homepage_html() -> str:
    return (WP_HTML_DIR / "homepage.html").read_text(encoding="utf-8")


@pytest.fixture
def wp_blog_post_html() -> str:
    return (WP_HTML_DIR / "blog-post.html").read_text(encoding="utf-8")


@pytest.fixture
def wp_corporate_campuses_fragment() -> str:
    return (WP_RENDERED_DIR / "corporate-campuses.html").read_text(encoding="utf-8")
