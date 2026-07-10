"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";

interface PlanItem {
  icon: string;
  label: string;
  desc: string;
  href: string;
  color: string;
  bg: string;
}

interface Props {
  cardsDue: number;
  quizAvg: number;
  streak: number;
  hasLesson: boolean;
}

export function TodayPlan({ cardsDue, quizAvg, streak, hasLesson }: Props) {
  const router = useRouter();

  const items: PlanItem[] = [
    {
      icon: "📖",
      label: hasLesson ? "Continue Lesson" : "Start a Lesson",
      desc: hasLesson ? "Pick up where you left off" : "Begin your first German lesson",
      href: hasLesson ? "#continue" : "/curriculum",
      color: "#a78bfa",
      bg: "rgba(124,58,237,0.08)",
    },
    {
      icon: "🃏",
      label: "Daily Review",
      desc: cardsDue > 0 ? `${cardsDue} card${cardsDue !== 1 ? "s" : ""} waiting` : "All caught up!",
      href: "/review",
      color: "#818cf8",
      bg: "rgba(99,102,241,0.08)",
    },
    {
      icon: "🗣️",
      label: "Practice Speaking",
      desc: "Chat with Emma — your AI language coach",
      href: "/chat",
      color: "#38bdf8",
      bg: "rgba(56,189,248,0.08)",
    },
    {
      icon: "✅",
      label: "Test Yourself",
      desc: quizAvg > 0 ? `Your quiz average: ${quizAvg}%` : "Take a quick knowledge quiz",
      href: "/quiz",
      color: "#34d399",
      bg: "rgba(52,211,153,0.08)",
    },
  ];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
        Today's Plan
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="text-left rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 group"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight" style={{ color: "var(--color-text)" }}>{item.label}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
