from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class SRSReviewRequest(BaseModel):
    card_id: int
    rating: int  # 0-5


class SRSCustomRequest(BaseModel):
    german: str
    english: str
    notes: Optional[str] = None


class SRSSeedRequest(BaseModel):
    lesson_id: int


class SRSCardOut(BaseModel):
    id: int
    vocab_entry: dict  # {id, german, english, example_sentence, part_of_speech}
    status: str
    easiness_factor: float
    interval_days: int
    repetitions: int
    lapses: int

    model_config = ConfigDict(from_attributes=True)


class SRSStats(BaseModel):
    new: int
    learning: int
    reviewing: int
    mastered: int
    total_due_today: int
