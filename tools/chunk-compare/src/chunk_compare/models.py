from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class SelectorType(Enum):
    UAGB_ROOT = "uagb-root"
    WP_BLOCK_GROUP = "wp-block-group"
    HEADING_SPLIT = "heading-split"
    ORPHAN = "orphan"
    WHOLE_PAGE = "whole-page"


@dataclass(frozen=True)
class Chunk:
    index: int
    heading: str | None
    heading_level: int | None
    text_content: str
    html: str
    selector_type: SelectorType
    element_id: str | None = None


@dataclass
class MatchPair:
    wp_chunk: Chunk
    hugo_chunk: Chunk
    match_method: str  # "exact_heading", "fuzzy_heading", "text_similarity", "position"
    confidence: float  # 0.0-1.0


@dataclass
class MatchResult:
    pairs: list[MatchPair] = field(default_factory=list)
    unmatched_wp: list[Chunk] = field(default_factory=list)
    unmatched_hugo: list[Chunk] = field(default_factory=list)
