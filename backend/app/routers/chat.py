import os
import re
import json
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.routers.auth_dependency import require_auth
from app.schemas.chat import ChatRequest, ChatResponse

logger = logging.getLogger("deutschcoach.chat")

router = APIRouter(prefix="/chat", tags=["Chat"])

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_BASE_URL = os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com")
ANTHROPIC_API_URL = f"{ANTHROPIC_BASE_URL}/v1/messages"
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

SCENARIOS = {
    "restaurant": "The student is practicing ordering food. You are the waiter in an English-speaking restaurant. Ask what they'd like, recommend dishes, handle payment — all in English.",
    "job-interview": "The student is practicing professional conversation. You are an interviewer at an English-speaking company. Ask about their experience and skills in English.",
    "casual": "The student wants casual conversation practice. Be a friendly English-speaking chat partner. Talk about hobbies, travel, daily life — all in English.",
    "shopping": "The student is practicing shopping interactions. You are a store assistant in an English-speaking store. Help them browse — all in English.",
    "travel": "The student is practicing travel situations. Help with tickets, schedules, and directions at a station — all in English.",
    "doctor": "The student is practicing medical conversations. You are an English-speaking doctor. Ask about symptoms and give advice in English.",
}

TIER_LEVEL_MAX = {"free": "A1", "starter": "A2", "plus": "B1", "pro": "C1"}


def build_system_prompt(db: Session, user) -> str:
    """Build the system prompt with student context."""
    target = user.target_level.value if hasattr(user.target_level, "value") else "A1"
    tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
    max_level = TIER_LEVEL_MAX.get(tier, "A1")

    from app.models.lesson_progress import LessonProgress

    completed = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.user_id == user.id,
            LessonProgress.completed_at.isnot(None),
        )
        .count()
    )

    return f"""You are Emma, a friendly language coach. Your native language is English and you ONLY communicate in English. You help students learn foreign languages through clear English explanations.

When you mention a foreign word, format it like: "Hund" (dog). Explain grammar in English. Keep responses 2-5 sentences. Use emoji occasionally. Correct mistakes gently with hints like: (Hint: you want "gehen" not "geht").

Student level: {target} (access up to {max_level}). Lessons completed: {completed}."""


@router.post("/send", response_model=ChatResponse)
async def chat_send(
    body: ChatRequest,
    db: Session = Depends(get_db),
    user=Depends(require_auth),
):
    if not ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Chat feature is not configured. Set ANTHROPIC_API_KEY in backend/.env",
        )

    system_prompt = build_system_prompt(db, user)

    if body.scenario and body.scenario in SCENARIOS:
        system_prompt += f"\n\nSCENARIO: {SCENARIOS[body.scenario]}"

    # Build messages — prepend system prompt as first user message
    # (DeepSeek sometimes respects user messages more than the system parameter)
    api_messages: list[dict] = [{
        "role": "user",
        "content": f"INSTRUCTIONS (follow these for the entire conversation): {system_prompt}\n\n---\n\nNow the conversation begins. Remember: reply ONLY in English.",
    }]

    # Add an example assistant response that demonstrates the desired style
    api_messages.append({
        "role": "assistant",
        "content": "Hi! I'm Emma, your language coach. I'll help you learn in clear English. What would you like to practice today? 😊",
    })

    # Add the actual conversation
    for msg in body.messages[-20:]:
        content = msg.content
        if msg.role == "user":
            content = f"[reply in English only] {content}"
        api_messages.append({"role": msg.role, "content": content})

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                ANTHROPIC_API_URL,
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": ANTHROPIC_MODEL,
                    "max_tokens": 500,
                    "system": "You are Emma, an English-only language coach. Reply ONLY in English. Never write in any other language.",
                    "messages": api_messages,
                },
            )

        if resp.status_code != 200:
            logger.error("LLM API error %s: %s", resp.status_code, resp.text[:500])
            raise HTTPException(
                status_code=502,
                detail=f"LLM API error: {resp.text[:200]}",
            )

        data = resp.json()
        reply = None

        if isinstance(data.get("content"), list):
            for block in data["content"]:
                if block.get("type") == "text" and block.get("text"):
                    reply = block["text"]
                    break
            if not reply and len(data["content"]) > 0:
                first = data["content"][0]
                reply = first.get("text") or first.get("thinking") or ""

        if not reply and isinstance(data.get("choices"), list):
            reply = data["choices"][0]["message"]["content"]

        if not reply:
            logger.error("Unexpected API response format: %s", json.dumps(data)[:500])
            raise HTTPException(status_code=502, detail=f"Unexpected API response format: {json.dumps(data)[:300]}")

        # Parse corrections
        corrections: list[dict] = []
        hints = re.findall(r"\(Hint:\s*(.+?)\)", reply)
        for hint in hints:
            correction_text = ""
            error_text = ""
            if "it's" in hint:
                error_text = hint.split("it's")[0].strip().strip('"')
            if '"' in hint:
                correction_text = hint.split('"')[1] if hint.count('"') >= 2 else ""
            if not correction_text and "not" in hint:
                correction_text = hint.split("not")[-1].strip()
            corrections.append({
                "error": error_text,
                "correction": correction_text,
                "explanation": hint,
            })

        return ChatResponse(reply=reply, corrections=corrections)

    except HTTPException:
        raise
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="LLM request timed out")
    except Exception as e:
        logger.exception("Chat error")
        raise HTTPException(status_code=502, detail=f"Chat error: {str(e)[:200]}")


@router.get("/scenarios")
def get_scenarios(user=Depends(require_auth)):
    tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier)
    max_level = TIER_LEVEL_MAX.get(tier, "A1")

    level_scenarios = {
        "A1": ["casual", "shopping"],
        "A2": ["casual", "shopping", "restaurant", "travel"],
        "B1": ["casual", "shopping", "restaurant", "travel", "job-interview"],
        "C1": ["casual", "shopping", "restaurant", "travel", "job-interview", "doctor"],
    }

    available = level_scenarios.get(max_level, ["casual"])
    return {
        "scenarios": [
            {"key": k, "name": k.replace("-", " ").title()} for k in available
        ]
    }
