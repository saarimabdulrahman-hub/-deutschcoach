"use client";

import { useRouter } from "next/navigation";

interface Props {
  cardsDue: number;
  quizAvg: number;
}

interface Action {
  key: string;
  label: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  size: "lg" | "md" | "sm";
}

export function QuickGrid({ cardsDue, quizAvg }: Props) {
  const router = useRouter();

  const actions: Action[] = [
    {
      key: "review",
      label: "Daily Review",
      desc: cardsDue > 0 ? `${cardsDue} cards due` : "All caught up!",
      href: "/review",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "#818cf8",
      bg: "rgba(99,102,241,0.1)",
      size: "lg",
    },
    {
      key: "quiz",
      label: "Quiz",
      desc: quizAvg > 0 ? `Avg: ${quizAvg}%` : "Test yourself",
      href: "/quiz",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "#34d399",
      bg: "rgba(52,211,153,0.1)",
      size: "sm",
    },
    {
      key: "chat",
      label: "AI Tutor",
      desc: "Practice speaking",
      href: "/chat",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: "#38bdf8",
      bg: "rgba(56,189,248,0.1)",
      size: "sm",
    },
    {
      key: "grammar",
      label: "Grammar",
      desc: "Browse topics",
      href: "/grammar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: "#f472b6",
      bg: "rgba(244,114,182,0.1)",
      size: "md",
    },
    {
      key: "curriculum",
      label: "Lessons",
      desc: "A1–C1 curriculum",
      href: "/curriculum",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.1)",
      size: "md",
    },
  ];

  // Asymmetric grid: lg tile takes 2 cols on desktop, md tiles share row, sm tiles fill gaps
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider px-1" style={{ color: "var(--color-text-muted)" }}>
        Quick Actions
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const isReview = action.key === "review";
          return (
            <button
              key={action.key}
              onClick={() => router.push(action.href)}
              className={`group relative text-left rounded-2xl transition-all duration-200 hover:-translate-y-0.5 ${
                isReview ? "lg:col-span-2" : ""
              }`}
              style={{
                background: isReview && cardsDue > 0
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))"
                  : "var(--color-card-bg)",
                border: isReview && cardsDue > 0
                  ? "1px solid rgba(99,102,241,0.25)"
                  : "1px solid var(--color-border)",
                padding: action.size === "lg" ? "1.25rem" : "1rem",
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 30px ${action.color}10` }} />

              <div className="relative flex items-center gap-3">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: action.bg,
                    color: action.color,
                    width: action.size === "lg" ? 44 : 36,
                    height: action.size === "lg" ? 44 : 36,
                  }}
                >
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
                    {action.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {action.desc}
                  </p>
                </div>
                {isReview && cardsDue > 0 && (
                  <span className="absolute top-0 right-0 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}>
                    {cardsDue}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
