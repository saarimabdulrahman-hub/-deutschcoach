from pydantic import BaseModel
from typing import Optional


class GrammarTopicOut(BaseModel):
    id: int
    slug: str
    title: str
    level: str

    class Config:
        from_attributes = True


class GrammarTopicDetail(BaseModel):
    id: int
    slug: str
    title: str
    level: str
    content: str
    examples: list
    related_lessons: list = []  # list of {id, title, level, unit}

    class Config:
        from_attributes = True
