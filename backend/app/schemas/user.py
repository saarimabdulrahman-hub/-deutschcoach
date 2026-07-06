from pydantic import BaseModel, ConfigDict
from typing import Optional


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    settings: Optional[dict] = None


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    subscription_tier: str
    trial_ends_at: Optional[str] = None
    daily_streak: int
    target_level: str
    settings: dict
    created_at: str

    model_config = ConfigDict(from_attributes=True)
