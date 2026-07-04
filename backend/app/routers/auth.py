import os
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from app.models.user import User, SubscriptionTier
from app.models.reset_token import PasswordResetToken
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


def create_token(user_id: int) -> str:
    expire_minutes = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(
        payload,
        os.getenv("JWT_SECRET"),
        algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
    )


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "subscription_tier": (
            user.subscription_tier.value
            if hasattr(user.subscription_tier, "value")
            else user.subscription_tier
        ),
        "trial_ends_at": (
            user.trial_ends_at.isoformat() if user.trial_ends_at else None
        ),
        "daily_streak": user.daily_streak,
        "target_level": (
            user.target_level.value
            if hasattr(user.target_level, "value")
            else user.target_level
        ),
        "settings": user.settings,
        "created_at": (
            user.created_at.isoformat() if user.created_at else None
        ),
    }


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    password_hash = bcrypt.hashpw(
        req.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        name=req.name,
        email=req.email,
        password_hash=password_hash,
        subscription_tier=SubscriptionTier.free,
        trial_ends_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id)
    return AuthResponse(user=user_to_dict(user), token=token)


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not bcrypt.checkpw(
        req.password.encode("utf-8"), user.password_hash.encode("utf-8")
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_token(user.id)
    return AuthResponse(user=user_to_dict(user), token=token)


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    message = {
        "message": "If an account with that email exists, a reset token has been generated."
    }

    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Don't reveal whether the email exists
        return message

    token_str = secrets.token_urlsafe(32)
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token_str,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1),
        used=False,
    )
    db.add(reset_token)
    db.commit()

    # Print token to console for development (email integration is future work)
    print(f"[DEV] Password reset token for {user.email}: {token_str}")

    return message


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    reset_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == req.token)
        .first()
    )

    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    if reset_token.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has already been used",
        )

    if reset_token.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired",
        )

    new_hash = bcrypt.hashpw(
        req.new_password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    user = db.query(User).filter(User.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found",
        )

    user.password_hash = new_hash
    reset_token.used = True
    db.commit()

    return {"message": "Password has been reset successfully"}
