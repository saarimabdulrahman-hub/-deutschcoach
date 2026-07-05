from pydantic import BaseModel
from typing import Optional


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    scenario: Optional[str] = None  # e.g. "restaurant", "job-interview", "casual"


class ChatResponse(BaseModel):
    reply: str
    corrections: list[dict] = []  # [{error: "...", correction: "...", explanation: "..."}]
    new_vocab: list[dict] = []  # [{german: "...", english: "..."}]
