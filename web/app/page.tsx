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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  // If already logged in, show nothing while redirecting
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-4">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-950 pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Tagline */}
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Deutsch lernen. Jeden Tag.
        </h1>

        {/* Login card */}
        <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl p-8 border border-neutral-800 shadow-2xl">
          <LoginForm />
        </div>

        {/* Signup link */}
        <p className="text-neutral-400 text-center mt-6">
          New to DeutschCoach?{" "}
          <Link
            href="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Sign up &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
