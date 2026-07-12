"""Emma AI Tutor — Request / Response / SSE schemas (Sprint 14)."""
from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Request ─────────────────────────────────────────────────────────────

class EmmaLessonContext(BaseModel):
    """Injected lesson context — Emma always knows this."""
    lesson_title: str = ""
    lesson_id: int | None = None
    level: str = "A1"
    stage: str = ""                         # e.g. "vocabulary", "grammar"
    stage_label: str = ""                   # e.g. "Vocabulary"
    vocabulary: list[str] = Field(default_factory=list)
    grammar_pattern: str | None = None
    current_exercise: str | None = None     # the question or item front
    progress_step: int = 1
    progress_total: int = 1
    recent_mistakes: list[str] = Field(default_factory=list)


class EmmaChatMessage(BaseModel):
    role: str   # "learner" | "emma"
    text: str
    timestamp: float | None = None


class EmmaRequest(BaseModel):
    message: str = ""                       # the current learner message
    history: list[EmmaChatMessage] = Field(default_factory=list)   # truncated history (last N)
    context: EmmaLessonContext = Field(default_factory=EmmaLessonContext)
    stream: bool = False                    # server-sent events vs single response
    prompt_version: str = "v1"             # for tracing / A/B


# ── Response (non-streaming) ────────────────────────────────────────────

class EmmaResponse(BaseModel):
    reply: str
    corrections: list[dict] = Field(default_factory=list)
    prompt_version: str = "v1"


# ── SSE streaming event shapes ──────────────────────────────────────────

class EmmaStreamStart(BaseModel):
    event: str = "start"
    prompt_version: str = "v1"


class EmmaStreamDelta(BaseModel):
    event: str = "delta"
    text: str


class EmmaStreamDone(BaseModel):
    event: str = "done"
    full_text: str
    corrections: list[dict] = Field(default_factory=list)


class EmmaStreamError(BaseModel):
    event: str = "error"
    detail: str
