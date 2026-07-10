"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardData } from "@/types";
import { ErrorState } from "@/components/ui/ErrorState";

const GREETINGS = [
  { hi: "Guten Morgen", en: "Good morning" },
  { hi: "Guten Tag", en: "Good afternoon" },
  { hi: "Guten Abend", en: "Good evening" },
];
function getGreeting() { const h = new Date().getHours(); return h < 12 ? GREETINGS[0] : h < 18 ? GREETINGS[1] : GREETINGS[2]; }
function formatDate() { return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase(); }

// ── Hero ────────────────────────────────────────────────────
function Hero() {
  const router = useRouter();
  return (
    <div className="relative overflow-hidden rounded-[20px] h-[220px] flex items-center"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1040 25%, #2d1060 50%, #1a1040 75%, #0a0a1a 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
      {/* Moon glow */}
      <div className="absolute right-[15%] top-[10%] w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(213,108,255,0.12) 0%, rgba(162,75,255,0.06) 30%, transparent 70%)", filter: "blur(4px)" }} />
      <div className="absolute right-[12%] top-[8%] w-20 h-20 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
      {/* Stars */}
      {[[15,15],[70,10],[55,40],[85,55],[25,70],[60,80],[10,50]].map(([x,y],i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{ left:`${x}%`, top:`${y}%`, width:2, height:2, background:"rgba(255,255,255,0.3)" }} />
      ))}

      <div className="relative z-10 flex items-center w-full px-8 sm:px-12">
        <div className="flex-1 max-w-lg">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Welcome to DeutschFlow</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3" style={{ color: "#fff" }}>
            Your German learning<br />journey starts here
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Structured lessons, smart flashcards, and an AI tutor—<br />everything you need to go from zero to fluent.
          </p>
          <div className="flex items-center gap-4 mt-4 text-[10px] sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span>✓ Beginner-friendly</span> <span>⏱ 10 min lessons</span> <span>📚 80+ lessons</span>
          </div>
        </div>
        <div className="hidden lg:block ml-auto rounded-2xl p-5 w-[260px] flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "#fff" }}>Ready to begin?</p>
          <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Start your first lesson and see your progress here.</p>
          <button onClick={() => router.push("/curriculum")}
            className="w-full px-5 py-2.5 rounded-xl text-sm font-bold glossy-accent flex items-center justify-center gap-2">
            Start Your First Lesson
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Plan Card ────────────────────────────────────────────────
function PlanCard({ icon, iconBg, title, subtitle, footer, href }: {
  icon: string; iconBg: string; title: string; subtitle: string; footer: string; href: string;
}) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(href)}
      className="text-left rounded-2xl p-5 transition-all duration-250 hover:-translate-y-1 w-full"
      style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: iconBg }}>{icon}</div>
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{title}</p>
      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>{subtitle}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>{footer}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </div>
    </button>
  );
}

// ── Stat Cell ────────────────────────────────────────────────
function StatCell({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-xl p-4 transition-all duration-250 hover:-translate-y-0.5"
      style={{ background: "var(--color-card-alt)", border: "1px solid var(--color-border)" }}>
      <span className="text-lg mb-2 block">{icon}</span>
      <p className="text-lg font-bold mb-0.5" style={{ color: "var(--color-text)" }}>{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>{label}</p>
    </div>
  );
}

// ── Progress Ring ────────────────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 58; const circ = 2 * Math.PI * r; const off = circ - (pct / 100) * circ;
  return (
    <div className="relative w-36 h-36 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
        <defs><linearGradient id="prg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7B3FFB" /><stop offset="100%" stopColor="#A24BFF" /></linearGradient></defs>
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <circle cx="65" cy="65" r={r} fill="none" stroke="url(#prg)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1s ease", filter: "drop-shadow(0 0 8px rgba(123,63,251,0.3))" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: "#fff" }}>{pct}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: "var(--color-text-muted)" }}>Complete</span>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() { return (<div className="space-y-6"><div className="flex gap-4"><div className="flex-1 space-y-2"><div className="h-4 w-32 rounded shimmer" /><div className="h-8 w-64 rounded shimmer" /></div><div className="flex gap-3">{[...Array(2)].map((_,i)=><div key={i} className="h-20 w-36 rounded-2xl shimmer" />)}</div></div><div className="h-[220px] rounded-[20px] shimmer" /><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[...Array(3)].map((_,i)=><div key={i} className="h-32 rounded-2xl shimmer" />)}</div><div className="h-80 rounded-2xl shimmer" /><div className="grid grid-cols-2 gap-4">{[...Array(2)].map((_,i)=><div key={i} className="h-56 rounded-2xl shimmer" />)}</div></div>); }

// ── Main ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<DashboardData>({ queryKey: ["dashboard"], queryFn: () => api.get("/dashboard") });
  if (isLoading) return <Skeleton />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : "Failed to load dashboard data."} onRetry={() => queryClient.invalidateQueries({ queryKey: ["dashboard"] })} />;
  const firstName = (user?.name || "Student").split(" ")[0];
  const greeting = getGreeting();

  return (
    <div className="space-y-5 sm:space-y-6 pb-4" style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* ── Greeting + Stats ───────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>{formatDate()}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: "var(--color-text)" }}>{greeting.hi}, {firstName}! 👋</h1>
          <p className="text-xs sm:text-sm mt-1.5" style={{ color: "var(--color-text-muted)" }}>Kleine Schritte jeden Tag, große Fortschritte fürs Leben.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <div className="rounded-2xl p-4 flex items-center gap-3 min-w-[140px]"
            style={{ background: "var(--color-card-elevated)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <span className="text-2xl">🔥</span>
            <div><p className="text-xl font-bold" style={{ color: "#fff" }}>{data.streak}</p><p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Day Streak</p><p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{data.streak > 0 ? "Keep going!" : "Start today!"}</p></div>
          </div>
          <div className="rounded-2xl p-4 flex flex-col justify-center min-w-[160px]"
            style={{ background: "var(--color-card-elevated)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>Current Level</p>
            <div className="flex items-center gap-2 mb-2"><span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>A1</span><span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>A1 Beginner</span></div>
            <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}><div className="h-full rounded-full" style={{ width: `${data.level_progress_pct}%`, background: "var(--color-accent-gradient)" }} /></div>
            <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>120 / 300 XP to A2</p>
          </div>
        </div>
      </div>

      {/* ── Hero ───────────────────────────── */}
      <Hero />

      {/* ── Today's Plan ──────────────────── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Today's Plan</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PlanCard icon="📖" iconBg="rgba(77,163,255,0.1)" title="Your First Lesson" subtitle="Greetings & Introductions" footer="10 min · Beginner-friendly" href={data.continue_lesson ? `/curriculum/${data.continue_lesson.level.toLowerCase()}/${data.continue_lesson.id}` : "/curriculum"} />
          <PlanCard icon="Aa" iconBg="rgba(162,75,255,0.1)" title="German Grammar" subtitle="Understand how sentences work" footer="Start with articles & pronouns" href="/grammar" />
          <PlanCard icon="🗣️" iconBg="rgba(45,229,115,0.1)" title="Practice Speaking" subtitle="Chat with Emma — your AI coach" footer="No experience needed" href="/chat" />
        </div>
      </div>

      {/* ── Your Progress ─────────────────── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Your Progress</p>
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8">
            <ProgressRing pct={data.level_progress_pct} />
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold mb-1" style={{ color: "var(--color-text)" }}>{data.level_progress_pct === 0 ? "Ready to begin" : `${data.level_progress_pct}% complete`}</p>
              <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>Start your first lesson to see your progress here.</p>
              <button onClick={() => router.push("/curriculum")} className="px-5 py-2 rounded-xl text-sm font-medium transition-all" style={{ background: "transparent", color: "var(--color-accent-light)", border: "1px solid var(--color-accent)" }}>View Roadmap</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCell icon="📖" value={`${data.level_progress_pct > 0 ? Math.max(1, Math.round(data.level_progress_pct / 6)) : 0} / 80`} label="Lessons Completed" />
            <StatCell icon="📝" value={`${data.weakest_words.length > 0 ? data.weakest_words.length * 5 : 0} words`} label="Vocabulary Learned" />
            <StatCell icon="📖" value={`${data.level_progress_pct > 0 ? Math.max(1, Math.round(data.level_progress_pct / 10)) : 0} topics`} label="Grammar Topics" />
            <StatCell icon="✅" value={`${data.avg_quiz_score > 0 ? data.avg_quiz_score : 0}%`} label="Quiz Accuracy" />
            <StatCell icon="🃏" value={`${data.cards_due_today} cards`} label="Cards to Review" />
            <StatCell icon="⏱" value={`${data.level_progress_pct > 0 ? Math.max(1, Math.round(data.level_progress_pct / 6) * 10) : 0}m`} label="Study Time" />
          </div>
        </div>
      </div>

      {/* ── Review + Activity ─────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 sm:p-6 space-y-4" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>Review & Practice</p>
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(123,63,251,0.1)" }}>🃏</div><div className="flex-1"><p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Flashcards Complete</p><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Nothing due — excellent work!</p></div><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></div>
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(46,213,115,0.1)" }}>🎯</div><div className="flex-1"><p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Discover Your Level</p><p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Find out what you already know</p></div><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></div>
        </div>
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>Recent Activity</p>
          <div className="text-center py-6"><span className="text-3xl mb-3 block">🌱</span><p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>Your journey begins</p><p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>Complete your first lesson to see activity here.</p>
            <button onClick={() => router.push("/curriculum")} className="px-5 py-2.5 rounded-xl text-sm font-bold glossy-accent">Start Lesson &rarr;</button></div>
        </div>
      </div>

      {/* ── Tip of the Day ────────────────── */}
      <div className="rounded-2xl p-5 sm:p-6 flex items-center gap-6 relative overflow-hidden" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>Tip of the Day</p>
          <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: "var(--color-text-secondary)" }}>Review before bed — sleep helps your brain consolidate new vocabulary.</p>
          <button onClick={() => router.push("/curriculum")} className="text-xs font-medium hover:underline" style={{ color: "var(--color-accent-light)" }}>Browse lessons →</button>
        </div>
        <div className="hidden sm:block flex-shrink-0" style={{ width: 80, height: 80 }}>
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <rect x="10" y="50" width="60" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
            <rect x="14" y="42" width="16" height="10" rx="5" fill="rgba(162,75,255,0.15)" />
            <rect x="30" y="38" width="38" height="16" rx="8" fill="rgba(123,63,251,0.1)" />
            <circle cx="26" cy="28" r="10" fill="rgba(255,255,255,0.08)" />
            <rect x="28" y="30" width="16" height="12" rx="2" fill="rgba(162,75,255,0.2)" transform="rotate(-5 36 36)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
