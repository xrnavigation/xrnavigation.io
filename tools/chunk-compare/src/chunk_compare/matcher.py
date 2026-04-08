from __future__ import annotations

import logging

from rapidfuzz.fuzz import ratio as fuzz_ratio
from rapidfuzz.fuzz import token_sort_ratio

from .models import Chunk, MatchPair, MatchResult
from .text_utils import normalize_heading

logger = logging.getLogger(__name__)


def match_chunks(
    wp_chunks: list[Chunk],
    hugo_chunks: list[Chunk],
    fuzzy_threshold: float = 80.0,
    text_sim_threshold: float = 0.5,
) -> MatchResult:
    """Match WordPress chunks to Hugo chunks using heading and text similarity.

    Three-pass algorithm:
    1. Exact heading match (case-insensitive, whitespace-normalized)
    2. Fuzzy heading match (rapidfuzz ratio >= fuzzy_threshold)
    3. Text content similarity (token_sort_ratio >= text_sim_threshold * 100)

    Args:
        wp_chunks: Chunks from the WordPress page.
        hugo_chunks: Chunks from the Hugo page.
        fuzzy_threshold: Minimum rapidfuzz score (0-100) for fuzzy heading match.
        text_sim_threshold: Minimum text similarity ratio (0.0-1.0) for content match.

    Returns:
        MatchResult with paired chunks and unmatched remainders.
    """
    if not wp_chunks or not hugo_chunks:
        return MatchResult(
            unmatched_wp=list(wp_chunks),
            unmatched_hugo=list(hugo_chunks),
        )

    pairs: list[MatchPair] = []
    remaining_wp = list(wp_chunks)
    remaining_hugo = list(hugo_chunks)

    # Pass 1: Exact heading match
    _pass_exact_heading(remaining_wp, remaining_hugo, pairs)

    # Pass 2: Fuzzy heading match
    _pass_fuzzy_heading(remaining_wp, remaining_hugo, pairs, fuzzy_threshold)

    # Pass 3: Text content similarity
    _pass_text_similarity(remaining_wp, remaining_hugo, pairs, text_sim_threshold)

    # Sort pairs by WP chunk index for consistent output
    pairs.sort(key=lambda p: p.wp_chunk.index)

    # Check for order crossings
    hugo_indices = [p.hugo_chunk.index for p in pairs]
    if hugo_indices != sorted(hugo_indices):
        logger.warning(
            "Order crossing detected in matched pairs: Hugo indices %s are not monotonic",
            hugo_indices,
        )

    return MatchResult(
        pairs=pairs,
        unmatched_wp=remaining_wp,
        unmatched_hugo=remaining_hugo,
    )


def _pass_exact_heading(
    remaining_wp: list[Chunk],
    remaining_hugo: list[Chunk],
    pairs: list[MatchPair],
) -> None:
    """Pass 1: match chunks with identical normalized headings."""
    # Build heading -> chunk map for Hugo side
    hugo_by_heading: dict[str, Chunk] = {}
    for chunk in remaining_hugo:
        if chunk.heading:
            key = normalize_heading(chunk.heading)
            if key not in hugo_by_heading:  # first occurrence wins
                hugo_by_heading[key] = chunk

    matched_wp: list[Chunk] = []
    matched_hugo: set[int] = set()

    for wp_chunk in remaining_wp:
        if not wp_chunk.heading:
            continue
        key = normalize_heading(wp_chunk.heading)
        hugo_chunk = hugo_by_heading.get(key)
        if hugo_chunk and hugo_chunk.index not in matched_hugo:
            pairs.append(MatchPair(
                wp_chunk=wp_chunk,
                hugo_chunk=hugo_chunk,
                match_method="exact_heading",
                confidence=1.0,
            ))
            matched_wp.append(wp_chunk)
            matched_hugo.add(hugo_chunk.index)

    for chunk in matched_wp:
        remaining_wp.remove(chunk)
    remaining_hugo[:] = [c for c in remaining_hugo if c.index not in matched_hugo]


def _pass_fuzzy_heading(
    remaining_wp: list[Chunk],
    remaining_hugo: list[Chunk],
    pairs: list[MatchPair],
    threshold: float,
) -> None:
    """Pass 2: match chunks with similar headings using fuzzy matching."""
    matched_wp: list[Chunk] = []
    matched_hugo: set[int] = set()

    for wp_chunk in remaining_wp:
        if not wp_chunk.heading:
            continue

        best_score = 0.0
        best_hugo: Chunk | None = None

        for hugo_chunk in remaining_hugo:
            if hugo_chunk.index in matched_hugo:
                continue
            if not hugo_chunk.heading:
                continue

            score = fuzz_ratio(
                normalize_heading(wp_chunk.heading),
                normalize_heading(hugo_chunk.heading),
            )
            if score >= threshold and score > best_score:
                best_score = score
                best_hugo = hugo_chunk

        if best_hugo is not None:
            pairs.append(MatchPair(
                wp_chunk=wp_chunk,
                hugo_chunk=best_hugo,
                match_method="fuzzy_heading",
                confidence=best_score / 100.0,
            ))
            matched_wp.append(wp_chunk)
            matched_hugo.add(best_hugo.index)

    for chunk in matched_wp:
        remaining_wp.remove(chunk)
    remaining_hugo[:] = [c for c in remaining_hugo if c.index not in matched_hugo]


def _pass_text_similarity(
    remaining_wp: list[Chunk],
    remaining_hugo: list[Chunk],
    pairs: list[MatchPair],
    threshold: float,
) -> None:
    """Pass 3: match remaining chunks by text content similarity."""
    matched_wp: list[Chunk] = []
    matched_hugo: set[int] = set()
    min_score = threshold * 100.0

    for wp_chunk in remaining_wp:
        if not wp_chunk.text_content:
            continue

        best_score = 0.0
        best_hugo: Chunk | None = None

        for hugo_chunk in remaining_hugo:
            if hugo_chunk.index in matched_hugo:
                continue
            if not hugo_chunk.text_content:
                continue

            score = token_sort_ratio(wp_chunk.text_content, hugo_chunk.text_content)
            if score >= min_score and score > best_score:
                best_score = score
                best_hugo = hugo_chunk

        if best_hugo is not None:
            pairs.append(MatchPair(
                wp_chunk=wp_chunk,
                hugo_chunk=best_hugo,
                match_method="text_similarity",
                confidence=best_score / 100.0,
            ))
            matched_wp.append(wp_chunk)
            matched_hugo.add(best_hugo.index)

    for chunk in matched_wp:
        remaining_wp.remove(chunk)
    remaining_hugo[:] = [c for c in remaining_hugo if c.index not in matched_hugo]
