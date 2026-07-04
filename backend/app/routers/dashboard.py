from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date
from sqlalchemy import func

from database import get_db
from app.models.user import User
from app.models.srs import SRSState
from app.models.quiz import QuizResult
from app.models.lesson_progress import LessonProgress
from app.models.lesson import Lesson
from app.models.vocab import VocabEntry
from app.routers.auth_dependency import require_auth
from app.schemas.dashboard import DashboardData, ContinueLesson, ActivityItem, WeakWord

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/", response_model=DashboardData)
def get_dashboard(
    db: Session = Depends(get_db),
    user: User = Depends(require_auth),
):
    now = datetime.utcnow()
    today = date.today()

    # Streak — reset to 0 if user hasn't been active today
    streak = user.daily_streak
    if user.last_active_date is None or user.last_active_date != today:
        streak = 0

    # Cards due today
    cards_due = (
        db.query(func.count(SRSState.id))
        .filter(SRSState.user_id == user.id, SRSState.next_review_at <= now)
        .scalar()
    ) or 0

    # Average quiz score
    avg_score = (
        db.query(func.avg(QuizResult.score_pct))
        .filter(QuizResult.user_id == user.id)
        .scalar()
    ) or 0.0

    # Level progress — % of lessons completed at user's target level
    target = user.target_level.value if hasattr(user.target_level, "value") else str(user.target_level)
    total_lessons = (
        db.query(func.count(Lesson.id))
        .filter(Lesson.level == target)
        .scalar()
    ) or 0
    completed_lessons = (
        db.query(func.count(LessonProgress.id))
        .filter(
            LessonProgress.user_id == user.id,
            LessonProgress.completed_at.isnot(None),
        )
        .join(Lesson, LessonProgress.lesson_id == Lesson.id)
        .filter(Lesson.level == target)
        .scalar()
    ) or 0
    progress_pct = round((completed_lessons / total_lessons) * 100, 1) if total_lessons > 0 else 0.0

    # Continue learning — most recent in-progress lesson
    lp = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user.id,
            LessonProgress.completed_at.is_(None),
        )
        .order_by(LessonProgress.id.desc())
        .first()
    )
    continue_lesson = None
    if lp:
        lesson = db.query(Lesson).filter(Lesson.id == lp.lesson_id).first()
        if lesson:
            continue_lesson = ContinueLesson(
                id=lesson.id,
                title=lesson.title,
                level=lesson.level.value if hasattr(lesson.level, "value") else str(lesson.level),
                unit=lesson.unit,
                progress_pct=50.0,  # approximate — no granular progress tracking yet
            )

    # Recent activity — last 5 quiz results
    activities: list[ActivityItem] = []
    quizzes = (
        db.query(QuizResult)
        .filter(QuizResult.user_id == user.id)
        .order_by(QuizResult.created_at.desc())
        .limit(5)
        .all()
    )
    for q in quizzes:
        activities.append(
            ActivityItem(
                type="quiz",
                description=f"Quiz — {q.score_pct:.0f}% ({q.questions_correct}/{q.questions_total})",
                timestamp=q.created_at,
            )
        )

    # Weakest words — top 5 SRS cards with most lapses
    weakest: list[WeakWord] = []
    weak_cards = (
        db.query(SRSState)
        .filter(SRSState.user_id == user.id, SRSState.lapses > 0)
        .order_by(SRSState.lapses.desc())
        .limit(5)
        .all()
    )
    if weak_cards:
        vocab_ids = [w.vocab_entry_id for w in weak_cards]
        vocab_map = {
            v.id: v
            for v in db.query(VocabEntry).filter(VocabEntry.id.in_(vocab_ids)).all()
        }
        for w in weak_cards:
            v = vocab_map.get(w.vocab_entry_id)
            if v:
                weakest.append(WeakWord(id=v.id, german=v.german, english=v.english, lapses=w.lapses))

    return DashboardData(
        streak=streak,
        cards_due_today=cards_due,
        avg_quiz_score=round(float(avg_score), 1),
        level_progress_pct=progress_pct,
        continue_lesson=continue_lesson,
        recent_activity=activities,
        weakest_words=weakest,
    )
