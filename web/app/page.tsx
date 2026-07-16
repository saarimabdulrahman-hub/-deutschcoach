"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/ui/Logo";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.push("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-page-bg)" }}>
      <div className="w-full max-w-[380px] px-6">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <Logo size={32} />
        </div>

        <h1 className="text-2xl font-bold mb-1 text-center" style={{ color: "var(--color-text)" }}>Welcome back</h1>
        <p className="text-sm mb-8 text-center" style={{ color: "var(--color-text-muted)" }}>Sign in to continue learning</p>

        <LoginForm />
      </div>
    </div>
  );
}
