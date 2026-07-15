/**
 * LoginForm — Using react-hook-form + Zod validation
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginInput } from "@/lib/forms";
import { AuthDivider } from "./AuthDivider";
import { SocialLoginButtons } from "./SocialLoginButtons";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err?.detail || err?.message || "Invalid credentials");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ marginBottom: "var(--space-2)" }}>
        <h1 style={{ fontSize: "var(--type-heading-lg)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>Welcome back</h1>
        <p style={{ fontSize: "var(--type-body-md)", color: "var(--color-text-secondary)", margin: "4px 0 0" }}>Sign in to continue learning</p>
      </div>

      {serverError && (
        <div role="alert" style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--color-error-bg)", border: "1px solid var(--color-error-border)", color: "var(--color-error-text)", fontSize: "var(--type-body-sm)" }}>
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Input
          variant="email"
          label="Email address"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
          autoComplete="email"
        />

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "var(--type-label-md)", fontWeight: 600, color: "var(--color-text-primary)" }}>Password</span>
            <Link href="/forgot-password" style={{ fontSize: "var(--type-label-sm)", fontWeight: 500, color: "var(--color-accent-text)", textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${errors.password ? "var(--color-error-border)" : "var(--color-border-subtle)"}`,
              background: "var(--color-surface-1)",
              color: "var(--color-text-primary)",
              fontSize: "var(--type-body-md)",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-border-focus)"; }}
            onBlur={(e) => { e.target.style.borderColor = errors.password ? "var(--color-error-border)" : "var(--color-border-subtle)"; }}
          />
          {errors.password?.message && (
            <p role="alert" style={{ fontSize: "var(--type-label-sm)", color: "var(--color-error-text)", margin: "4px 0 0" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" loading={isSubmitting} style={{ width: "100%" }}>
          Sign in
        </Button>
      </form>

      <AuthDivider />

      <SocialLoginButtons />

      <p style={{ textAlign: "center", fontSize: "var(--type-body-sm)", color: "var(--color-text-muted)", margin: 0 }}>
        Don't have an account?{' '}
        <Link href="/signup" style={{ color: "var(--color-accent-text)", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
      </p>
    </div>
  );
}
