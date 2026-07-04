"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  async function handleRegister(name: string, email: string, password: string) {
    await signup(name, email, password);
    setSignupData({ name, email, password });
    setStep("tiers");
  }

  function handleTierSelect(tier: string, billingCycle: string) {
    // The TierSelector handles the checkout API call and redirect internally.
    // This callback exists for any additional side-effects if needed.
    void tier;
    void billingCycle;
  }

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

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          {step === "register" ? "Create your account" : "Choose your plan"}
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          {step === "register"
            ? "Start your free 7-day trial. No credit card required."
            : "All plans include a 7-day free trial. Cancel anytime."}
        </p>

        {/* Register step */}
        {step === "register" && (
          <div className="max-w-md mx-auto bg-neutral-900/80 backdrop-blur-sm rounded-xl p-8 border border-neutral-800 shadow-2xl">
            <SignupForm onComplete={handleRegister} />

            <p className="text-neutral-400 text-center mt-6 text-sm">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        )}

        {/* Tier selection step */}
        {step === "tiers" && (
          <div>
            <TierSelector onSelect={handleTierSelect} />
          </div>
        )}
      </div>
    </div>
  );
}
