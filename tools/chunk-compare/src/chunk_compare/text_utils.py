from __future__ import annotations

import re


def normalize_whitespace(text: str) -> str:
    """Collapse all whitespace runs to single spaces, strip."""
    return re.sub(r"\s+", " ", text).strip()


def normalize_heading(text: str) -> str:
    """Lowercase + normalize_whitespace for heading comparison."""
    return normalize_whitespace(text).lower()


def text_similarity(a: str, b: str) -> float:
    """Return 0.0-1.0 similarity using rapidfuzz token_sort_ratio."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    from rapidfuzz.fuzz import token_sort_ratio

    return token_sort_ratio(a, b) / 100.0
