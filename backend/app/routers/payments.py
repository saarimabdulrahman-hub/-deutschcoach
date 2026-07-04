import os

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from database import get_db
from app.models.user import User, SubscriptionTier
from app.routers.auth_dependency import require_auth
from app.schemas.payment import CheckoutRequest, PlanOut

router = APIRouter(prefix="/payments", tags=["Payments"])

PLANS = [
    {
        "tier": "starter",
        "levels": "A1 -> A2",
        "monthly_price": 8,
        "annual_price": 72,
        "features": [
            "All A1 lessons",
            "All A2 lessons",
            "Basic SRS flashcards",
            "7-day free trial",
        ],
    },
    {
        "tier": "plus",
        "levels": "A1 -> B1",
        "monthly_price": 12,
        "annual_price": 108,
        "features": [
            "Everything in Starter",
            "All B1 lessons",
            "Advanced quizzes",
            "Grammar reference",
            "7-day free trial",
        ],
    },
    {
        "tier": "pro",
        "levels": "A1 -> C1",
        "monthly_price": 18,
        "annual_price": 162,
        "features": [
            "Everything in Plus",
            "B2 + C1 lessons",
            "Unlimited custom flashcards",
            "Priority support",
            "7-day free trial",
        ],
    },
]

# Price lookup — replace these with real Stripe Price IDs from the dashboard.
PRICE_IDS = {
    "starter_monthly": "price_starter_monthly_placeholder",
    "starter_annual": "price_starter_annual_placeholder",
    "plus_monthly": "price_plus_monthly_placeholder",
    "plus_annual": "price_plus_annual_placeholder",
    "pro_monthly": "price_pro_monthly_placeholder",
    "pro_annual": "price_pro_annual_placeholder",
}


@router.get("/plans", response_model=list[PlanOut])
def get_plans():
    return [PlanOut(**p) for p in PLANS]


@router.post("/checkout")
def create_checkout(
    body: CheckoutRequest,
    user: User = Depends(require_auth),
):
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    price_key = f"{body.tier}_{body.billing_cycle}"
    price_id = PRICE_IDS.get(price_key)
    if not price_id:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown plan: tier={body.tier}, billing_cycle={body.billing_cycle}",
        )

    try:
        session = stripe.checkout.Session.create(
            customer_email=user.email,
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            subscription_data={"trial_period_days": 7},
            success_url=os.getenv("CORS_ORIGIN", "http://localhost:3000") + "/dashboard?checkout=success",
            cancel_url=os.getenv("CORS_ORIGIN", "http://localhost:3000") + "/signup?checkout=cancelled",
            metadata={"tier": body.tier},
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            os.getenv("STRIPE_WEBHOOK_SECRET", ""),
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")
        tier_meta = (session.get("metadata") or {}).get("tier")

        user = db.query(User).filter(User.email == session.get("customer_email")).first()
        if user:
            user.stripe_customer_id = customer_id
            user.stripe_subscription_id = subscription_id
            if tier_meta and tier_meta in SubscriptionTier.__members__:
                user.subscription_tier = SubscriptionTier[tier_meta]
            else:
                user.subscription_tier = SubscriptionTier.starter
            user.trial_ends_at = None  # Trial is handled by Stripe now
            db.commit()

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        user = (
            db.query(User)
            .filter(User.stripe_subscription_id == subscription["id"])
            .first()
        )
        if user:
            user.subscription_tier = SubscriptionTier.free
            user.stripe_subscription_id = None
            db.commit()

    return {"status": "ok"}


@router.get("/history")
def billing_history(
    user: User = Depends(require_auth),
):
    if not user.stripe_customer_id:
        return {"invoices": []}

    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    try:
        invoices = stripe.Invoice.list(customer=user.stripe_customer_id, limit=12)
        return {
            "invoices": [
                {
                    "id": inv.id,
                    "amount": inv.amount_paid / 100,
                    "status": inv.status,
                    "date": inv.created,
                }
                for inv in invoices.data
            ]
        }
    except stripe.error.StripeError:
        return {"invoices": []}
