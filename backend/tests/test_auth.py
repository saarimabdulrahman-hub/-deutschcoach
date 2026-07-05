"""Tests for auth endpoints."""
import pytest
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, Base, engine
from app.models.user import User, SubscriptionTier

client = TestClient(app)

TEST_EMAIL = "test_auth@example.com"
TEST_PASSWORD = "test1234"
TEST_NAME = "Test User"


@pytest.fixture(autouse=True)
def cleanup():
    """Remove test user after each test."""
    yield
    db = SessionLocal()
    user = db.query(User).filter(User.email == TEST_EMAIL).first()
    if user:
        # Also clean up related data
        from app.models.srs import SRSState
        from app.models.quiz import QuizResult
        from app.models.lesson_progress import LessonProgress
        from app.models.reset_token import PasswordResetToken
        db.query(SRSState).filter(SRSState.user_id == user.id).delete()
        db.query(QuizResult).filter(QuizResult.user_id == user.id).delete()
        db.query(LessonProgress).filter(LessonProgress.user_id == user.id).delete()
        db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete()
        db.delete(user)
        db.commit()
    db.close()


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_signup():
    resp = client.post("/auth/signup", json={
        "name": TEST_NAME,
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
    })
    assert resp.status_code in (200, 201)
    data = resp.json()
    assert "token" in data
    assert data["user"]["email"] == TEST_EMAIL
    assert data["user"]["name"] == TEST_NAME
    assert data["user"]["subscription_tier"] == "free"
    assert data["user"]["trial_ends_at"] is not None


def test_signup_duplicate():
    # First signup
    client.post("/auth/signup", json={
        "name": TEST_NAME, "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    # Duplicate
    resp = client.post("/auth/signup", json={
        "name": TEST_NAME, "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    assert resp.status_code == 409


def test_login():
    # Ensure user exists
    client.post("/auth/signup", json={
        "name": TEST_NAME, "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    resp = client.post("/auth/login", json={
        "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert data["user"]["email"] == TEST_EMAIL


def test_login_wrong_password():
    client.post("/auth/signup", json={
        "name": TEST_NAME, "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    resp = client.post("/auth/login", json={
        "email": TEST_EMAIL, "password": "wrong",
    })
    assert resp.status_code == 401


def test_login_nonexistent():
    resp = client.post("/auth/login", json={
        "email": "nobody@example.com", "password": "x",
    })
    assert resp.status_code == 401


def test_forgot_password():
    client.post("/auth/signup", json={
        "name": TEST_NAME, "email": TEST_EMAIL, "password": TEST_PASSWORD,
    })
    resp = client.post("/auth/forgot-password", json={"email": TEST_EMAIL})
    assert resp.status_code == 200
    assert "message" in resp.json()


def test_forgot_password_nonexistent():
    resp = client.post("/auth/forgot-password", json={"email": "nobody@example.com"})
    assert resp.status_code == 200  # Never reveals whether user exists


def test_protected_endpoint_no_token():
    resp = client.get("/dashboard/")
    assert resp.status_code in (401, 403)


def test_protected_endpoint_bad_token():
    resp = client.get("/dashboard/", headers={"Authorization": "Bearer badtoken"})
    assert resp.status_code == 401
