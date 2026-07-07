from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

from app.routers import auth, curriculum, grammar, quiz, srs, dashboard, payments, user, chat

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("deutschcoach")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: sync curriculum to DB. Shutdown: no-op."""
    from database import SessionLocal
    from app.curriculum_loader import sync_curriculum

    db = SessionLocal()
    try:
        sync_curriculum(db)
        logger.info("Curriculum synced successfully")
    except Exception:
        logger.exception("Failed to sync curriculum")
    finally:
        db.close()

    yield  # Application runs here


app = FastAPI(title="DeutschCoach API", version="1.0.0", lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGIN", "")
if cors_origins:
    origins = [o.strip() for o in cors_origins.split(",")]
else:
    # Allow all origins when not explicitly configured (dev + free-tier deployments)
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
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


@app.get("/health")
def health():
    return {"status": "ok"}
