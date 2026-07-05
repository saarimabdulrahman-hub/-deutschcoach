"use client";

import { useState, type FormEvent } from "react";

interface SignupFormProps {
  onComplete: (name: string, email: string, password: string) => void;
}

export default function SignupForm({ onComplete }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete(name, email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-slate-500";

  const inputStyle = {
    background: "var(--color-card-bg)",
    border: "1px solid var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Full name
        </label>
        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          autoFocus
          className={inputClass}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Email address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={inputClass}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {error && (
        <div
          className="p-3 rounded-xl text-sm flex items-center gap-3"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error-text)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-error-text)" }} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
        style={{
          color: "var(--color-text)",
          background: "var(--color-accent-gradient)",
          boxShadow: "0 4px 14px var(--color-accent-glow)",
        }}
      >
        {isSubmitting ? "Creating account..." : "Continue"}
      </button>
    </form>
  );
}
