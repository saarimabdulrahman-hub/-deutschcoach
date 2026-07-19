"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ReviewSidebar } from "@/components/review/ReviewSidebar";
import { SRSStats } from "@/components/srs/SRSStats";
import type { DashboardData } from "@/types";

interface SRSStatsData {
  new: number; learning: number; reviewing: number; mastered: number;
  total_due_today: number;
}

const SECTION_INFO: Record<string, { title: string; desc: string }> = {
  "spaced-repetition": { title: "Spaced Repetition", desc: "The SM-2 algorithm optimises your review schedule so you remember more in less time." },
  flashcards: { title: "Flashcards", desc: "Review due flashcards and reinforce your vocabulary." },
  mistakes: { title: "Mistakes", desc: "Words you've missed before — review them to strengthen your memory." },
  "weak-words": { title: "Weak Words", desc: "Your most challenging vocabulary, prioritised for review." },
  bookmarks: { title: "Bookmarks", desc: "Saved words and exercises for quick access." },
};

export default function ReviewSlugPage() {
  const params = useParams();
  const slug = params.slug as string;
  const info = SECTION_INFO[slug] || { title: slug, desc: "" };

  const { data: stats, isLoading } = useQuery<SRSStatsData>({
    queryKey: ["srs-stats"], queryFn: () => api.get("/srs/stats"), staleTime: 30_000,
  });

  const { data: dash } = useQuery<DashboardData>({
    queryKey: ["dashboard"], queryFn: () => api.get("/dashboard"),
  });

  const streak = dash?.streak ?? 0;

  return (
    <div className="flex" style={{ gap: 0, margin: "0 -24px", minHeight: "calc(100vh - 72px)" }}>
      <ReviewSidebar activeItem={slug} streak={streak} />
      <div className="flex-1 overflow-y-auto p-6" style={{ background: "#080611" }}>
        <div className="max-w-4xl space-y-6 pb-8">
          {/* Header */}
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFF", margin: 0 }}>{info.title}</h1>
            {info.desc && <p style={{ fontSize: "14px", color: "#A8A4BC", margin: "4px 0 0" }}>{info.desc}</p>}
          </div>

          {/* SRS Stats */}
          {stats && <SRSStats data={stats} />}

          {/* ── SPACED REPETITION ── */}
          {slug === "spaced-repetition" && (
            <>
              {/* Hero Banner */}
              <div className="relative flex items-center overflow-hidden" style={{ borderRadius: "24px", minHeight: "200px", background: "linear-gradient(135deg, #131127, #1B1730)", border: "1px solid rgba(255,255,255,.05)" }}>
                <div className="px-8 py-6" style={{ flex: "0.6 1 0%", position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#A855F7", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>Review Overview</p>
                  <h2 style={{ fontSize: "36px", fontWeight: 700, color: "#FFF", margin: 0, lineHeight: 1.1 }}>You're all set!</h2>
                  <p style={{ fontSize: "14px", color: "#A8A4BC", marginTop: "8px", maxWidth: "360px", lineHeight: 1.5 }}>No cards due right now. Great work staying on top of your reviews.</p>
                  {/* Stats card floating */}
                  {stats && (
                    <div className="flex items-center gap-3 mt-4">
                      <div className="rounded-xl px-4 py-2.5 text-center" style={{ background: "rgba(16,18,32,.65)", border: "1px solid rgba(255,255,255,.05)" }}>
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,.3)", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Cards Reviewed Today</p>
                        <p style={{ fontSize: "24px", fontWeight: 700, color: "#22C55E", margin: "2px 0 0" }}>18 <span style={{ fontSize: "12px", fontWeight: 400, color: "#22C55E" }}>✓ Excellent</span></p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Right: Brain illustration */}
                <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: "200px" }}>
                  <div style={{ position: "relative", width: "160px", height: "160px" }}>
                    {/* Neon rings */}
                    <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(168,85,247,.15)", boxShadow: "0 0 30px rgba(168,85,247,.08)" }} />
                    <div className="absolute inset-4 rounded-full" style={{ border: "1.5px solid rgba(236,73,153,.12)", boxShadow: "0 0 20px rgba(236,73,153,.06)" }} />
                    <div className="absolute inset-8 rounded-full" style={{ border: "1.5px solid rgba(168,85,247,.1)" }} />
                    {/* Brain icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <path d="M32 8C22 8 14 16 14 26c0 5 2 9.5 5 13l-3 11 12-5c5 2 10 2 15 0l12 5-3-11c3-3.5 5-8 5-13 0-10-8-18-18-18z" fill="url(#bG)" opacity="0.85"/>
                        <path d="M26 28c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5" stroke="rgba(255,255,255,.2)" strokeWidth="1.5" fill="none"/>
                        <defs><radialGradient id="bG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#A855F7"/><stop offset="100%" stopColor="#6D28D9"/></radialGradient></defs>
                      </svg>
                    </div>
                    {/* Particles */}
                    <span className="absolute" style={{ top: "8%", right: "10%", width: "4px", height: "4px", borderRadius: "50%", background: "#C084FC", boxShadow: "0 0 6px rgba(192,132,252,.5)" }} />
                    <span className="absolute" style={{ bottom: "15%", left: "8%", width: "3px", height: "3px", borderRadius: "50%", background: "#EC4899", boxShadow: "0 0 4px rgba(236,73,153,.4)" }} />
                    <span className="absolute" style={{ top: "40%", right: "2%", width: "3px", height: "3px", borderRadius: "50%", background: "#A855F7", boxShadow: "0 0 4px rgba(168,85,247,.4)" }} />
                  </div>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-4 gap-5">
                {[
                  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z" fill="url(#fG2)" stroke="none"/><defs><linearGradient id="fG2" x1="2" y1="2" x2="22" y2="22"><stop offset="0%" stopColor="#F97316"/><stop offset="100%" stopColor="#EAB308"/></linearGradient></defs></svg>, value: `${dash?.streak ?? 0}`, label: "Day Streak", color: "#F97316" },
                  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#A855F7" strokeWidth="2" fill="none"/><path d="M12 7v5l4 2" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/></svg>, value: `${stats?.mastered ?? 0}`, label: "Mastered", color: "#A855F7" },
                  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="14 14" strokeLinecap="round"/></svg>, value: `${stats ? Math.round((stats.mastered / Math.max(stats.new + stats.learning + stats.reviewing + stats.mastered, 1)) * 100) : 0}%`, label: "Retention", color: "#22C55E" },
                  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#C084FC" strokeWidth="2" fill="none"/><line x1="3" y1="9" x2="21" y2="9" stroke="#C084FC" strokeWidth="2"/></svg>, value: "12", label: "Longest Streak", color: "#C084FC" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[18px] p-5 flex items-center gap-3" style={{ background: "#1B1730", border: "1px solid rgba(255,255,255,.05)" }}>
                    <span style={{ color: stat.color, filter: `drop-shadow(0 0 6px ${stat.color}30)` }}>{stat.icon}</span>
                    <div>
                      <p style={{ fontSize: "20px", fontWeight: 700, color: "#FFF", margin: 0, lineHeight: 1.2 }}>{stat.value}</p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,.35)", margin: 0 }}>{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Queue */}
              <div className="rounded-[20px] overflow-hidden" style={{ background: "#1B1730", border: "1px solid rgba(255,255,255,.05)" }}>
                <div className="flex items-center justify-between px-5 py-4">
                  <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#FFF", margin: 0 }}>Review Queue</h2>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer" style={{ background: "linear-gradient(90deg, #6D3BFF, #FF3CA6)", color: "#FFF" }}>Study All</button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium border-none cursor-pointer" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.5)", border: "1px solid rgba(255,255,255,.06)" }}>Filter</button>
                  </div>
                </div>
                {/* Table header */}
                <div className="px-5 py-2 flex items-center gap-3 text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,.25)", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                  <span style={{ width: "24px" }} />
                  <span style={{ width: "24px" }}>🔊</span>
                  <span style={{ flex: 1 }}>German Word</span>
                  <span style={{ flex: 1 }}>Translation</span>
                  <span style={{ width: "80px" }}>Next Review</span>
                  <span style={{ width: "60px", textAlign: "center" }}>Interval</span>
                  <span style={{ width: "60px", textAlign: "center" }}>Ease</span>
                  <span style={{ width: "20px" }} />
                </div>
                {/* Table rows */}
                {[
                  { word: "der Fortschritt", trans: "progress", review: "Due now", interval: "1 day", ease: "Hard", easeColor: "#EF4444" },
                  { word: "die Gelegenheit", trans: "opportunity", review: "Due now", interval: "1 day", ease: "Medium", easeColor: "#F59E0B" },
                  { word: "entwickeln", trans: "develop", review: "Due now", interval: "1 day", ease: "Hard", easeColor: "#EF4444" },
                  { word: "Herausforderung", trans: "challenge", review: "Due now", interval: "1 day", ease: "Medium", easeColor: "#F59E0B" },
                  { word: "Veränderung", trans: "change", review: "Tomorrow", interval: "2 days", ease: "Easy", easeColor: "#22C55E" },
                ].map((row, i) => (
                  <div key={i} className="px-5 flex items-center gap-3 text-sm" style={{ height: "68px", borderTop: "1px solid rgba(255,255,255,.04)" }}>
                    <input type="checkbox" style={{ accentColor: "#A855F7" }} />
                    <span style={{ color: "rgba(255,255,255,.3)", cursor: "pointer" }}>🔊</span>
                    <span style={{ flex: 1, color: "#FFF", fontWeight: 500 }}>{row.word}</span>
                    <span style={{ flex: 1, color: "#A8A4BC" }}>{row.trans}</span>
                    <span style={{ width: "80px", color: row.review === "Due now" ? "#EF4444" : "#A8A4BC", fontSize: "12px" }}>{row.review}</span>
                    <span style={{ width: "60px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,.4)" }}>{row.interval}</span>
                    <span style={{ width: "60px", textAlign: "center", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", color: row.easeColor, background: `${row.easeColor}15` }}>{row.ease}</span>
                    <span style={{ width: "20px", color: "rgba(255,255,255,.2)", cursor: "pointer" }}>⋮</span>
                  </div>
                ))}
              </div>

              {/* How It Works */}
              <div className="rounded-[20px] p-6" style={{ background: "#1B1730", border: "1px solid rgba(255,255,255,.05)" }}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#FFF", margin: "0 0 16px" }}>How It Works</h2>
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { num: "①", title: "Learn", desc: "New words introduced at optimal intervals." },
                    { num: "②", title: "Review", desc: "Recall words actively to strengthen memory." },
                    { num: "③", title: "Remember", desc: "Spaced repetition moves knowledge to long-term memory." },
                  ].map((step) => (
                    <div key={step.num} className="p-4 rounded-xl" style={{ background: "rgba(16,18,32,.5)", border: "1px solid rgba(255,255,255,.04)" }}>
                      <p style={{ fontSize: "24px", margin: "0 0 6px" }}>{step.num}</p>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#FFF", margin: 0 }}>{step.title}</p>
                      <p style={{ fontSize: "12px", color: "#A8A4BC", margin: "4px 0 0", lineHeight: 1.4 }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
                {/* Pro Tip */}
                <div className="flex items-start gap-3 mt-5 p-5 rounded-[18px]" style={{ background: "rgba(168,85,247,.06)", border: "1px solid rgba(168,85,247,.1)" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>💡</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#FFF", margin: 0 }}>Pro Tip</p>
                    <p style={{ fontSize: "12px", color: "#A8A4BC", margin: "2px 0 0", lineHeight: 1.4 }}>Review your cards daily — even 5 minutes helps. Consistency builds stronger neural pathways than cramming.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {slug === "flashcards" && (
            <div className="rounded-2xl p-5 text-center" style={{ background: "#141629", border: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontSize: "36px", marginBottom: "12px" }}>📋</p>
              <p style={{ fontSize: "14px", color: "#FFF", fontWeight: 600, margin: 0 }}>Flashcard Review</p>
              <p style={{ fontSize: "12px", color: "#A8A4BC", margin: "4px 0 0" }}>Head to the Overview page to review your due cards.</p>
            </div>
          )}

          {slug === "mistakes" && (
            <div className="rounded-2xl p-5 text-center" style={{ background: "#141629", border: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontSize: "36px", marginBottom: "12px" }}>✖</p>
              <p style={{ fontSize: "14px", color: "#FFF", fontWeight: 600, margin: 0 }}>Mistakes Review</p>
              <p style={{ fontSize: "12px", color: "#A8A4BC", margin: "4px 0 0" }}>Review words you've previously missed to improve retention.</p>
            </div>
          )}

          {slug === "weak-words" && (
            <div className="rounded-2xl p-5" style={{ background: "#141629", border: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFF", margin: "0 0 12px" }}>Your Weak Words</p>
              {dash?.weakest_words?.length ? (
                <div className="space-y-2">
                  {dash.weakest_words.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(16,18,32,.5)", border: "1px solid rgba(255,255,255,.04)" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#FFF" }}>{w.german}</span>
                      <span style={{ fontSize: "12px", color: "#A8A4BC" }}>{w.english} · {w.lapses}× missed</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "#A8A4BC", margin: 0, textAlign: "center", padding: "20px" }}>No weak words — great work!</p>
              )}
            </div>
          )}

          {slug === "bookmarks" && (
            <div className="rounded-2xl p-5 text-center" style={{ background: "#141629", border: "1px solid rgba(255,255,255,.05)" }}>
              <p style={{ fontSize: "36px", marginBottom: "12px" }}>🔖</p>
              <p style={{ fontSize: "14px", color: "#FFF", fontWeight: 600, margin: 0 }}>Bookmarks</p>
              <p style={{ fontSize: "12px", color: "#A8A4BC", margin: "4px 0 0" }}>Your saved words and exercises will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
