from pydantic import BaseModel, ConfigDict
from typing import Optional


class GrammarTopicOut(BaseModel):
    id: int
    slug: str
    title: str
    level: str

    model_config = ConfigDict(from_attributes=True)


class GrammarTopicDetail(BaseModel):
    id: int
    slug: str
    title: str
    level: str
    content: str
    examples: list
    related_lessons: list = []  # list of {id, title, level, unit}

    model_config = ConfigDict(from_attributes=True)
