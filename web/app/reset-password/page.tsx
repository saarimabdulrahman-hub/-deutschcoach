"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err?.message || "Invalid or expired reset token.");
    }
    setLoading(false);
  }

  if (!token) return <p style={{ color: "var(--color-error-text)" }}>Missing reset token.</p>;
  if (success) return <p style={{ color: "var(--color-success)" }}>Password reset! Redirecting to login...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm p-3 rounded-lg" style={{ background: "var(--color-error-bg)", color: "var(--color-error-text)" }}>{error}</p>}
      <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: "var(--color-input-bg)", border: "1px solid var(--color-input-border)", color: "var(--color-text)" }} />
      <input type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required
        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
        style={{ background: "var(--color-input-bg)", border: "1px solid var(--color-input-border)", color: "var(--color-text)" }} />
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all"
        style={{ background: "var(--color-accent-gradient)", color: "#fff", boxShadow: "var(--color-accent-glow)" }}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-page-bg)" }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>Set new password</h1>
          <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>Enter your new password below.</p>
          <Suspense fallback={<p style={{ color: "var(--color-text-muted)" }}>Loading...</p>}>
            <ResetForm />
          </Suspense>
          <Link href="/" className="inline-block mt-4 text-sm font-medium" style={{ color: "var(--color-accent)" }}>← Back to login</Link>
        </div>
      </div>
    </div>
  );
}
