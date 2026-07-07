"""Integration tests for curriculum, SRS, quiz, and dashboard endpoints."""
import pytest
import uuid
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def _first_a1_lesson_id(auth_headers: dict) -> int:
    """Return the database ID of the first A1 lesson (works regardless of AUTO_INCREMENT)."""
    resp = client.get("/curriculum/A1", headers=auth_headers)
    assert resp.status_code == 200
    lessons = resp.json()
    assert len(lessons) >= 1
    return lessons[0]["id"]


@pytest.fixture
def auth():
    """Create a unique test user and return auth headers."""
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    pwd = "test1234"
    client.post("/auth/signup", json={"name": "Tester", "email": email, "password": pwd})
    resp = client.post("/auth/login", json={"email": email, "password": pwd})
    assert resp.status_code == 200
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_curriculum_list(auth):
    resp = client.get("/curriculum/", headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    assert data[0]["level"] == "A1"


def test_curriculum_a1(auth):
    resp = client.get("/curriculum/A1", headers=auth)
    assert resp.status_code == 200
    assert len(resp.json()) >= 5


def test_lesson_detail(auth):
    lesson_id = _first_a1_lesson_id(auth)
    resp = client.get(f"/curriculum/A1/{lesson_id}", headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert data["lesson"]["title"] == "Erste Begegnungen"
    assert len(data["vocabulary"]) >= 5
    assert len(data["exercises"]) >= 3


def test_grammar(auth):
    resp = client.get("/grammar/", headers=auth)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_grammar_detail(auth):
    resp = client.get("/grammar/personal-pronouns-nominative", headers=auth)
    assert resp.status_code == 200
    assert resp.json()["slug"] == "personal-pronouns-nominative"


def test_srs_seed_and_stats(auth):
    lesson_id = _first_a1_lesson_id(auth)
    resp = client.post("/srs/seed-lesson", json={"lesson_id": lesson_id}, headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert data["newly_seeded"] >= 1
    assert "streak" in data

    resp = client.get("/srs/stats", headers=auth)
    assert resp.status_code == 200
    stats = resp.json()
    assert stats["total_due_today"] >= 1


def test_srs_review(auth):
    lesson_id = _first_a1_lesson_id(auth)
    client.post("/srs/seed-lesson", json={"lesson_id": lesson_id}, headers=auth)
    resp = client.get("/srs/due", headers=auth)
    cards = resp.json()
    if cards:
        resp = client.post("/srs/review", json={"card_id": cards[0]["id"], "rating": 4}, headers=auth)
        assert resp.status_code == 200


def test_quiz_generate(auth):
    resp = client.post("/quiz/generate", json={"level": "A1", "count": 3}, headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert "session_id" in data
    assert len(data["questions"]) == 3


def test_quiz_submit(auth):
    resp = client.post("/quiz/generate", json={"level": "A1", "count": 3}, headers=auth)
    session_id = resp.json()["session_id"]
    answers = [{"question_id": q["id"], "answer": "test"} for q in resp.json()["questions"]]
    resp = client.post(f"/quiz/{session_id}/submit", json={"answers": answers}, headers=auth)
    assert resp.status_code == 200
    assert "score_pct" in resp.json()


def test_dashboard(auth):
    resp = client.get("/dashboard/", headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert "streak" in data
    assert "cards_due_today" in data


def test_user_profile(auth):
    resp = client.get("/user/profile", headers=auth)
    assert resp.status_code == 200
    assert "email" in resp.json()


def test_payment_plans():
    resp = client.get("/payments/plans")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_chat_scenarios(auth):
    resp = client.get("/chat/scenarios", headers=auth)
    assert resp.status_code == 200
    assert len(resp.json()["scenarios"]) >= 1


# ── Extended SRS tests ──────────────────────────────────────────────

def test_srs_review_invalid_rating(auth):
    """Sending rating > 5 should return 400."""
    lesson_id = _first_a1_lesson_id(auth)
    client.post("/srs/seed-lesson", json={"lesson_id": lesson_id}, headers=auth)
    resp = client.get("/srs/due", headers=auth)
    cards = resp.json()
    if cards:
        resp = client.post("/srs/review", json={"card_id": cards[0]["id"], "rating": 6}, headers=auth)
        assert resp.status_code == 400


def test_srs_review_nonexistent_card(auth):
    """Reviewing a non-existent card should return 404."""
    resp = client.post("/srs/review", json={"card_id": 999999, "rating": 3}, headers=auth)
    assert resp.status_code == 404


def test_srs_custom_vocab(auth):
    """Creating a custom vocab note should return note data."""
    resp = client.post("/srs/custom", json={
        "german": "der Tisch",
        "english": "table",
        "notes": "Common furniture word"
    }, headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert data["note"]["german"] == "der Tisch"
    assert data["note"]["english"] == "table"


def test_srs_seed_nonexistent_lesson(auth):
    """Seeding a non-existent lesson should return 404."""
    resp = client.post("/srs/seed-lesson", json={"lesson_id": 999999}, headers=auth)
    assert resp.status_code == 404


# ── User profile & password tests ────────────────────────────────────

def test_user_update_profile(auth):
    """Updating the user's name should succeed."""
    resp = client.patch("/user/profile", json={"name": "Updated Name"}, headers=auth)
    assert resp.status_code == 200
    # Verify profile reflects change
    profile = client.get("/user/profile", headers=auth)
    assert profile.json()["name"] == "Updated Name"


def test_user_change_password(auth):
    """Changing password with correct current password should succeed."""
    resp = client.post("/user/change-password", json={
        "current_password": "test1234",
        "new_password": "newtest1234"
    }, headers=auth)
    assert resp.status_code == 200
    assert resp.json()["message"] == "Password changed"


def test_user_change_password_wrong_current(auth):
    """Changing password with wrong current password should fail."""
    resp = client.post("/user/change-password", json={
        "current_password": "wrongpassword",
        "new_password": "newtest1234"
    }, headers=auth)
    assert resp.status_code == 400


def test_user_change_password_too_short(auth):
    """Changing password to one less than 6 chars should fail."""
    resp = client.post("/user/change-password", json={
        "current_password": "test1234",
        "new_password": "ab"
    }, headers=auth)
    assert resp.status_code == 400


# ── Curriculum edge cases ────────────────────────────────────────────

def test_curriculum_invalid_level(auth):
    resp = client.get("/curriculum/XX", headers=auth)
    assert resp.status_code == 400


def test_lesson_not_found(auth):
    resp = client.get("/curriculum/A1/999999", headers=auth)
    assert resp.status_code == 404


def test_curriculum_lesson_id_mismatch(auth):
    """Lesson ID exists but not at the specified level should return 404."""
    # Get a lesson's real ID, then query it under a different level
    resp = client.get("/curriculum/A1", headers=auth)
    a1_lessons = resp.json()
    if a1_lessons:
        a1_id = a1_lessons[0]["id"]
        resp = client.get(f"/curriculum/B1/{a1_id}", headers=auth)
        assert resp.status_code in (403, 404)  # 403 tier access or 404 not found at level


# ── Tier access tests ────────────────────────────────────────────────

def test_free_tier_cannot_access_b1(auth):
    """A free-tier user should not be able to access B1 curriculum."""
    resp = client.get("/curriculum/B1", headers=auth)
    assert resp.status_code == 403


# ── Grammar edge cases ────────────────────────────────────────────────

def test_grammar_not_found(auth):
    resp = client.get("/grammar/nonexistent-topic-slug", headers=auth)
    assert resp.status_code == 404


# ── Dashboard with activity ───────────────────────────────────────────

def test_dashboard_has_activity_items(auth):
    """After completing a lesson, dashboard should reflect activity."""
    # Seed a lesson first to create activity
    lesson_id = _first_a1_lesson_id(auth)
    client.post("/srs/seed-lesson", json={"lesson_id": lesson_id}, headers=auth)

    resp = client.get("/dashboard/", headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert "continue_lesson" in data
    assert "recent_activity" in data
    assert "weakest_words" in data


# ── Quiz edge cases ───────────────────────────────────────────────────

def test_quiz_generate_default_count(auth):
    """Quiz generation without explicit count should use default."""
    resp = client.post("/quiz/generate", json={"level": "A1"}, headers=auth)
    assert resp.status_code == 200
    data = resp.json()
    assert "session_id" in data
    assert len(data["questions"]) >= 1


def test_quiz_submit_invalid_session(auth):
    """Submitting to a non-existent session should return 404."""
    resp = client.post("/quiz/00000000-0000-0000-0000-000000000000/submit",
                       json={"answers": []}, headers=auth)
    assert resp.status_code == 404


# ── Chat unavailable without API key ──────────────────────────────────

def test_chat_send_configured(auth):
    """Chat /send should work if API key is set, or 503 if not configured."""
    resp = client.post("/chat/send", json={
        "messages": [{"role": "user", "content": "Hallo!"}],
        "scenario": "casual"
    }, headers=auth)
    # Either the chat works (200) or returns a configuration/server error (502/503/504)
    assert resp.status_code in (200, 502, 503, 504)
