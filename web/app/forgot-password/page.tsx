"use client";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
    } catch {}
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-page-bg)" }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>Reset your password</h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            {sent ? "If that email exists, we've sent a reset link." : "Enter your email and we'll send you a reset link."}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "var(--color-input-bg)", border: "1px solid var(--color-input-border)", color: "var(--color-text)" }} />
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "var(--color-accent-gradient)", color: "#fff", boxShadow: "var(--color-accent-glow)" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <Link href="/" className="inline-block mt-4 text-sm font-medium" style={{ color: "var(--color-accent)" }}>
              ← Back to login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
