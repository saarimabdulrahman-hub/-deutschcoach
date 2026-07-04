from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    tier: str  # starter, plus, pro
    billing_cycle: str  # monthly, annual


class PlanOut(BaseModel):
    tier: str
    levels: str
    monthly_price: int
    annual_price: int
    features: list[str]
