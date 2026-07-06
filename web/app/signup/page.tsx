"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import SignupForm from "@/components/auth/SignupForm";
import TierSelector from "@/components/auth/TierSelector";

type SignupStep = "register" | "tiers";

export default function SignupPage() {
  const { user, isLoading, signup } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<SignupStep>("register");
  const [signupData, setSignupData] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);
  const [tierError, setTierError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Step 1: Collect name/email/password ONLY (do not create account yet)
  function handleRegister(name: string, email: string, password: string) {
    setSignupData({ name, email, password });
    setStep("tiers");
  }

  // Step 2: On tier select, create account then redirect to Stripe checkout
  async function handleTierSelect(tier: string, billingCycle: string) {
    if (!signupData) return;
    setTierError(null);
    try {
      // Create the account first
      await signup(signupData.name, signupData.email, signupData.password);

      // Try Stripe checkout — if it fails (Stripe not configured), skip to dashboard
      try {
        const result = await api.post<{ url: string }>("/payments/checkout", {
          tier,
          billing_cycle: billingCycle,
        });
        window.location.href = result.url;
      } catch {
        // Stripe not configured — skip payment, go to dashboard
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setTierError(message);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-page-bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--color-accent)" }} />
      </div>
    );
  }

  // If already logged in, show nothing while redirecting
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Brand ───────────────── */}
      <div
        className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between py-12 px-12"
        style={{
          background:
            "linear-gradient(160deg, #0a0a0a 0%, #171717 30%, #1a1a1a 60%, #0f0f0f 100%)",
        }}
      >
        {/* Metallic sheen */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-250px",
            left: "-120px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 60%)",
            transform: "rotate(-15deg)",
          }}
        />

        {/* Accent line */}
        <div
          className="absolute left-12 top-12"
          style={{
            width: "1px",
            height: "80px",
            background: "linear-gradient(to bottom, rgba(124,58,237,0.6), transparent)",
          }}
        />

        {/* Top content */}
        <div className="relative z-10">
          <p className="text-base font-semibold tracking-[2px] uppercase mb-10" style={{ color: "var(--color-text)" }}>
            <span
              style={{
                background: "var(--color-accent-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              German
            </span>{" "}
            <span style={{ color: "var(--color-border)" }}>· Est 2026</span>
          </p>

          <div className="text-[72px] leading-[0.95] -tracking-[2px]">
            <span className="font-extralight" style={{ color: "var(--color-text)" }}>GERMAN</span>
            <br />
            <span className="font-bold" style={{ color: "var(--color-text)" }}>TUTOR</span>
          </div>

          <div
            className="my-8"
            style={{
              width: "56px",
              height: "1.5px",
              background: "var(--color-accent-gradient)",
            }}
          />

          <p className="text-sm leading-relaxed max-w-[300px]" style={{ color: "var(--color-text-muted)" }}>
            Structured German learning from A1 to C1. Real SM-2 flashcards, curated lessons, and measurable progress.
          </p>
        </div>

        {/* Bottom content */}
        <div className="relative z-10">
          <div className="flex gap-[3px] mb-3">
            <div className="h-0.5 rounded-sm" style={{ width: "20px", background: "var(--color-accent-dark)" }} />
            <div className="h-0.5 rounded-sm" style={{ width: "10px", background: "var(--color-border)" }} />
            <div className="h-0.5 rounded-sm" style={{ width: "5px", background: "var(--color-card-bg)" }} />
          </div>
          <p className="text-[11px] tracking-[1.5px] uppercase" style={{ color: "var(--color-border)" }}>
            Learn · Practice · Master
          </p>
        </div>
      </div>

      {/* ── Right Panel — Form ────────────────── */}
      <div
        className="flex-1 flex items-center justify-center px-6"
        style={{ background: "var(--color-page-bg)" }}
      >
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--color-badge-bg)", color: "var(--color-text)" }}
            >
              G
            </div>
            <h1 className="font-bold text-sm tracking-widest uppercase" style={{ color: "var(--color-text)" }}>
              German Tutor
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {step === "register" ? "Create your account" : "Choose your plan"}
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
              {step === "register"
                ? "Start your free 7-day trial. No credit card required."
                : "All plans include a 7-day free trial. Cancel anytime."}
            </p>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-6">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${step === "register" ? "w-8" : "w-4"}`}
                style={{ background: step === "register" ? "var(--color-accent)" : "var(--color-badge-bg)" }}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${step === "tiers" ? "w-8" : "w-4"}`}
                style={{ background: step === "tiers" ? "var(--color-accent)" : "var(--color-border)" }}
              />
            </div>
          </div>

          {/* Register step */}
          {step === "register" && (
            <div className="rounded-xl p-8 border shadow-2xl" style={{ background: "var(--color-card-bg)", borderColor: "var(--color-border)" }}>
              <SignupForm onComplete={handleRegister} />

              <p className="text-center mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
                Already have an account?{" "}
                <Link
                  href="/"
                  className="hover:text-indigo-300 font-medium transition-colors"
                  style={{ color: "var(--color-active-text)" }}
                >
                  Log in
                </Link>
              </p>
            </div>
          )}

          {/* Tier selection step */}
          {step === "tiers" && (
            <div>
              {tierError && (
                <div className="mb-6 p-4 rounded-xl border text-sm flex items-center gap-3"
                  style={{
                    background: "var(--color-error-bg)",
                    borderColor: "var(--color-error-border)",
                    color: "var(--color-error-text)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-error-text)" }} />
                  {tierError}
                </div>
              )}
              <TierSelector onSelect={handleTierSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
