"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-page-bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--color-accent)" }} />
      </div>
    );
  }

  if (user) return null;

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
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" />
              <path d="M8 8h9a3.5 3.5 0 0 1 0 7H8V8Z" fill="url(#flag-black-lp)" opacity="0.9" />
              <rect x="8" y="15" width="12" height="2.5" fill="url(#flag-red-lp)" opacity="0.9" />
              <rect x="8" y="17.5" width="12" height="2.5" fill="url(#flag-gold-lp)" opacity="0.9" />
              <defs>
                <linearGradient id="flag-black-lp" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#cbd5e1"/></linearGradient>
                <linearGradient id="flag-red-lp" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#ef4444"/><stop offset="1" stopColor="#dc2626"/></linearGradient>
                <linearGradient id="flag-gold-lp" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#facc15"/><stop offset="1" stopColor="#eab308"/></linearGradient>
              </defs>
            </svg>
            <p className="text-xs font-semibold tracking-[3px] uppercase" style={{ color: "var(--color-text-muted)" }}>
              Est 2026
            </p>
          </div>

          <div className="text-[72px] leading-[0.95] -tracking-[2px]">
            <span className="font-extralight" style={{ color: "var(--color-text)" }}>GERMAN</span>
            <br />
            <span
              className="font-bold"
              style={{ background: "var(--color-accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
            >
              TUTOR
            </span>
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
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="26" height="26" rx="7" fill="var(--color-card-bg)" stroke="var(--color-border)" strokeWidth="1.5" />
              <path d="M8 8h9a3.5 3.5 0 0 1 0 7H8V8Z" fill="#e2e8f0" opacity="0.9" />
              <rect x="8" y="15" width="12" height="2.5" fill="#ef4444" opacity="0.9" />
              <rect x="8" y="17.5" width="12" height="2.5" fill="#eab308" opacity="0.9" />
            </svg>
            <h1 className="font-bold text-sm tracking-widest uppercase" style={{ color: "var(--color-text)" }}>
              GERMAN <span style={{ color: "var(--color-active-text)" }}>TUTOR</span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Welcome back</h2>
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Sign in to continue learning</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm mt-8" style={{ color: "var(--color-text-muted)" }}>
            New to German Tutor?{" "}
            <Link href="/signup" className="hover:text-indigo-300 font-medium transition-colors" style={{ color: "var(--color-active-text)" }}>
              Start your free trial &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
