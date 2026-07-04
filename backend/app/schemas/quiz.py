from pydantic import BaseModel
from typing import Optional


class QuizGenerateRequest(BaseModel):
    lesson_id: Optional[int] = None
    level: Optional[str] = None
    vocab_ids: Optional[list[int]] = None
    count: int = 20


class QuizSubmitAnswer(BaseModel):
    question_id: str
    answer: str


class QuizSubmitRequest(BaseModel):
    answers: list[QuizSubmitAnswer]


class QuizQuestionOut(BaseModel):
    id: str
    type: str
    prompt: str
    options: Optional[list[str]] = None
    hint: Optional[str] = None


class QuizSessionOut(BaseModel):
    session_id: str
    questions: list[QuizQuestionOut]


class QuizResultItem(BaseModel):
    question_id: str
    correct: bool
    your_answer: str
    correct_answer: str
    feedback: Optional[str] = None


class QuizResultOut(BaseModel):
    score_pct: float
    questions_total: int
    questions_correct: int
    results: list[QuizResultItem]
