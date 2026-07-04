from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from app.models.grammar import GrammarTopic
from app.models.lesson import Lesson
from app.routers.auth_dependency import require_auth
from app.schemas.grammar import GrammarTopicOut, GrammarTopicDetail

router = APIRouter(prefix="/grammar", tags=["Grammar"])


@router.get("/", response_model=list[GrammarTopicOut])
def list_grammar(
    q: str = Query(None, description="Search query"),
    level: str = Query(None, description="Filter by CEFR level"),
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    query = db.query(GrammarTopic)
    if q:
        query = query.filter(
            GrammarTopic.title.ilike(f"%{q}%")
            | GrammarTopic.content.ilike(f"%{q}%")
        )
    if level:
        query = query.filter(GrammarTopic.level == level)
    return query.order_by(GrammarTopic.level, GrammarTopic.title).all()


@router.get("/{slug}", response_model=GrammarTopicDetail)
def get_grammar_topic(
    slug: str,
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    topic = db.query(GrammarTopic).filter(GrammarTopic.slug == slug).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Grammar topic not found")

    # Resolve related lessons
    related = []
    if topic.related_lesson_ids:
        lessons = (
            db.query(Lesson)
            .filter(Lesson.id.in_(topic.related_lesson_ids))
            .all()
        )
        related = [
            {
                "id": l.id,
                "title": l.title,
                "level": l.level.value if hasattr(l.level, "value") else l.level,
                "unit": l.unit,
            }
            for l in lessons
        ]

    return GrammarTopicDetail(
        id=topic.id,
        slug=topic.slug,
        title=topic.title,
        level=topic.level.value if hasattr(topic.level, "value") else topic.level,
        content=topic.content,
        examples=topic.examples or [],
        related_lessons=related,
    )
