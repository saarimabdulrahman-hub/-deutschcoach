from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from app.routers import auth, curriculum, grammar, quiz, srs, dashboard, payments, user, chat

load_dotenv()

app = FastAPI(title="DeutschCoach API", version="1.0.0")

origins = os.getenv("CORS_ORIGIN", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(curriculum.router)
app.include_router(grammar.router)
app.include_router(quiz.router)
app.include_router(srs.router)
app.include_router(dashboard.router)
app.include_router(payments.router)
app.include_router(user.router)
app.include_router(chat.router)


@app.on_event("startup")
def on_startup():
    from database import SessionLocal
    from app.curriculum_loader import sync_curriculum
    db = SessionLocal()
    try:
        sync_curriculum(db)
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}
