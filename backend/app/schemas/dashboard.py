from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ContinueLesson(BaseModel):
    id: int
    title: str
    level: str
    unit: int
    progress_pct: float

    model_config = ConfigDict(from_attributes=True)


class ActivityItem(BaseModel):
    type: str  # "quiz", "srs_review", "lesson_completed"
    description: str
    timestamp: datetime


class WeakWord(BaseModel):
    id: int
    german: str
    english: str
    lapses: int


class DashboardData(BaseModel):
    streak: int
    cards_due_today: int
    avg_quiz_score: float
    level_progress_pct: float
    continue_lesson: Optional[ContinueLesson] = None
    recent_activity: list[ActivityItem] = []
    weakest_words: list[WeakWord] = []
