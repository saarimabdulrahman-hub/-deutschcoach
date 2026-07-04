from pydantic import BaseModel
from typing import Optional


class VocabEntryOut(BaseModel):
    id: int
    german: str
    english: str
    part_of_speech: str
    gender: Optional[str] = None
    plural_form: Optional[str] = None
    example_sentence: Optional[str] = None
    difficulty_rank: int

    class Config:
        from_attributes = True


class LessonListItem(BaseModel):
    id: int
    title: str
    unit: int
    order: int
    topics: list
    completed: bool = False

    class Config:
        from_attributes = True


class LessonDetail(BaseModel):
    lesson: dict
    vocabulary: list[VocabEntryOut]
    exercises: list
    grammar_topics: list


class CurriculumLevel(BaseModel):
    level: str
    title: str
    lesson_count: int
    completed_count: int
