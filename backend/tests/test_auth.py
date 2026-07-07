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


def test_full_password_reset_flow():
    """Complete password reset flow: signup -> forgot -> reset -> login with new password."""
    import uuid
    unique_email = f"reset_test_{uuid.uuid4().hex[:8]}@example.com"
    new_password = "resetpass123"

    # 1. Signup
    resp = client.post("/auth/signup", json={
        "name": "Reset Tester",
        "email": unique_email,
        "password": "oldpass123",
    })
    assert resp.status_code in (200, 201)

    # 2. Forgot password – creates token
    resp = client.post("/auth/forgot-password", json={"email": unique_email})
    assert resp.status_code == 200

    # 3. Fetch the token from the DB
    db = SessionLocal()
    from app.models.user import User
    user = db.query(User).filter(User.email == unique_email).first()
    assert user is not None
    from app.models.reset_token import PasswordResetToken
    reset_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.user_id == user.id, PasswordResetToken.used == False)
        .order_by(PasswordResetToken.id.desc())
        .first()
    )
    assert reset_token is not None
    token = reset_token.token

    # 4. Reset password
    resp = client.post("/auth/reset-password", json={
        "token": token,
        "new_password": new_password,
    })
    assert resp.status_code == 200

    # 5. Login with new password
    resp = client.post("/auth/login", json={
        "email": unique_email,
        "password": new_password,
    })
    assert resp.status_code == 200

    # 6. Old password should not work
    resp = client.post("/auth/login", json={
        "email": unique_email,
        "password": "oldpass123",
    })
    assert resp.status_code == 401

    # Cleanup
    from app.models.srs import SRSState
    from app.models.quiz import QuizResult
    from app.models.lesson_progress import LessonProgress
    db.query(SRSState).filter(SRSState.user_id == user.id).delete()
    db.query(QuizResult).filter(QuizResult.user_id == user.id).delete()
    db.query(LessonProgress).filter(LessonProgress.user_id == user.id).delete()
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    db.close()


def test_reset_password_invalid_token():
    """Reset with an invalid token should fail."""
    resp = client.post("/auth/reset-password", json={
        "token": "invalid-token-that-doesnt-exist",
        "new_password": "whocares123",
    })
    assert resp.status_code == 400


def test_reset_password_already_used_token():
    """A token that has already been used should fail."""
    import uuid
    unique_email = f"usedtoken_{uuid.uuid4().hex[:8]}@example.com"

    # Signup
    client.post("/auth/signup", json={
        "name": "Used Token Tester",
        "email": unique_email,
        "password": "pass12345",
    })
    # Request reset
    client.post("/auth/forgot-password", json={"email": unique_email})
    # Get token
    db = SessionLocal()
    from app.models.user import User
    user = db.query(User).filter(User.email == unique_email).first()
    from app.models.reset_token import PasswordResetToken
    reset_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.user_id == user.id, PasswordResetToken.used == False)
        .order_by(PasswordResetToken.id.desc())
        .first()
    )
    token = reset_token.token

    # Use token once — should succeed
    resp = client.post("/auth/reset-password", json={"token": token, "new_password": "pass1"})
    assert resp.status_code == 200

    # Use same token again — should fail
    resp = client.post("/auth/reset-password", json={"token": token, "new_password": "pass2"})
    assert resp.status_code == 400

    # Cleanup
    from app.models.srs import SRSState
    from app.models.quiz import QuizResult
    from app.models.lesson_progress import LessonProgress
    db.query(SRSState).filter(SRSState.user_id == user.id).delete()
    db.query(QuizResult).filter(QuizResult.user_id == user.id).delete()
    db.query(LessonProgress).filter(LessonProgress.user_id == user.id).delete()
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == user.id).delete()
    db.delete(user)
    db.commit()
    db.close()
