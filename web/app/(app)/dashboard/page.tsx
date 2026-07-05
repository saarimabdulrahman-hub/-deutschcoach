"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardData } from "@/types";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";
import { WeakestWords } from "@/components/dashboard/WeakestWords";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ErrorState } from "@/components/ui/ErrorState";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded shimmer" />
        <div className="h-4 w-40 rounded shimmer" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl shimmer" />
        ))}
      </div>
      <div className="h-40 rounded-2xl shimmer" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-56 rounded-2xl shimmer" />
        <div className="h-56 rounded-2xl shimmer" />
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => api.get("/dashboard"),
  });

  if (isLoading) return <DashboardSkeleton />;
  if (error || !data)
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load dashboard data."}
        onRetry={() => queryClient.invalidateQueries({ queryKey: ["dashboard"] })}
      />
    );

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const firstName = (user?.name || "Student").split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            {getGreeting()}, {firstName} <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>{today}</p>
        </div>
        {/* Streak pill */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-full"
          style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
        >
          <span className="text-lg">🔥</span>
          <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{data.streak} day streak</span>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid data={data} />

      {/* Continue Learning + Quick Actions side by side */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {data.continue_lesson ? (
            <ContinueLearning lesson={data.continue_lesson} />
          ) : (
            <div
              className="rounded-2xl p-6 flex items-center justify-center"
              style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", minHeight: "120px" }}
            >
              <div className="text-center">
                <p className="text-3xl mb-2">📚</p>
                <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Ready to start learning?</p>
                <button
                  onClick={() => router.push("/curriculum")}
                  className="mt-3 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "var(--color-accent-gradient)", color: "#fff" }}
                >
                  Browse lessons →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-2">
          {[
            { label: "Daily Review", icon: "🃏", href: "/review", subtitle: `${data.cards_due_today} cards due` },
            { label: "Take a Quiz", icon: "✅", href: "/quiz", subtitle: `Avg: ${data.avg_quiz_score}%` },
            { label: "Practice Chat", icon: "🗣️", href: "/chat", subtitle: "German conversation" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all hover:-translate-y-0.5"
              style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
            >
              <span className="text-xl flex-shrink-0">{action.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{action.label}</div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{action.subtitle}</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Weakest Words + Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <RecentActivity items={data.recent_activity} />
        <WeakestWords words={data.weakest_words} />
      </div>
    </div>
  );
}
