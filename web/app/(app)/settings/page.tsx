"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { DangerZone } from "@/components/settings/DangerZone";
import { useTheme, THEME_LIST } from "@/contexts/ThemeContext";

// ── Section nav ────────────────────────────────────────────────────

interface SettingsSection {
  key: string; label: string; icon: string;
}

const SECTIONS: SettingsSection[] = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "subscription", label: "Subscription", icon: "💳" },
  { key: "learning", label: "Learning", icon: "🎯" },
  { key: "appearance", label: "Appearance", icon: "🎨" },
  { key: "audio", label: "Audio", icon: "🔊" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "accessibility", label: "Accessibility", icon: "♿" },
  { key: "privacy", label: "Privacy", icon: "🔒" },
  { key: "account", label: "Account", icon: "⚠️" },
];

// ── Section renderers ──────────────────────────────────────────────

function LearningSection() {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Daily Goal</label>
        <div className="flex items-center gap-3">
          {[5, 10, 15, 20, 30].map((n) => (
            <button key={n} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: n === 10 ? "var(--color-accent-gradient)" : "var(--color-card-bg)", color: n === 10 ? "#fff" : "var(--color-text-secondary)", border: n === 10 ? "none" : "1px solid var(--color-border)" }}>
              {n} min
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Your daily learning target. We'll celebrate when you hit it.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Reminder Time</label>
        <select className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
          <option>08:00</option><option>09:00</option><option>12:00</option><option>18:00</option><option>20:00</option><option>Off</option>
        </select>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>We'll send a gentle nudge — never a guilt trip.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Native Language</label>
          <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
            <option>English</option><option>Español</option><option>Français</option><option>العربية</option><option>हिन्दी</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Learning Language</label>
          <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" disabled
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)", opacity: 0.6 }}>
            <option>Deutsch (German)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Speech Speed</label>
          <div className="flex items-center gap-2">
            {[0.75, 0.9, 1, 1.1, 1.25].map((s) => (
              <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: s === 0.9 ? "var(--color-accent-gradient)" : "var(--color-card-bg)", color: s === 0.9 ? "#fff" : "var(--color-text-secondary)", border: s === 0.9 ? "none" : "1px solid var(--color-border)" }}>
                {s}×
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Preferred Voice</label>
          <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}>
            <option>Female (Warm)</option><option>Male (Clear)</option><option>Neutral</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Review Frequency</label>
        <div className="flex items-center gap-3">
          {["Light", "Standard", "Intensive"].map((l) => (
            <button key={l} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: l === "Standard" ? "var(--color-accent-gradient)" : "var(--color-card-bg)", color: l === "Standard" ? "#fff" : "var(--color-text-secondary)", border: l === "Standard" ? "none" : "1px solid var(--color-border)" }}>
              {l}
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>How often spaced-repetition cards surface. More = faster review, less = lighter daily load.</p>
      </div>
    </div>
  );
}

function AudioSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Auto-play audio</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Play pronunciation automatically when opening a dialogue or vocabulary card</p>
        </div>
        <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: "var(--color-accent-gradient)" }}>
          <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>Download audio for offline</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Pre-cache audio clips when on Wi-Fi so they're available offline</p>
        </div>
        <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: "var(--color-border)" }}>
          <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-all" />
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-5">
      {[
        { label: "Daily reminder", desc: "A gentle nudge to keep your streak going", on: true },
        { label: "Lesson complete", desc: "Celebrate when you finish a lesson", on: true },
        { label: "Review ready", desc: "When spaced-repetition cards are due", on: true },
        { label: "Weekly summary", desc: "Your progress, delivered once a week", on: false },
        { label: "Product updates", desc: "New features and improvements", on: false },
      ].map((n) => (
        <div key={n.label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{n.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{n.desc}</p>
          </div>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: n.on ? "var(--color-accent-gradient)" : "var(--color-border)" }}>
            <span className={`absolute w-5 h-5 rounded-full bg-white transition-all ${n.on ? "right-0.5" : "left-0.5"}`} style={{ top: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AccessibilitySection() {
  return (
    <div className="space-y-5">
      {[
        { label: "Reduced motion", desc: "Disable all animations and transitions", on: false },
        { label: "High contrast", desc: "Increase contrast for better readability", on: false },
        { label: "Large text", desc: "Scale typography by 125%", on: false },
        { label: "Keyboard focus visible", desc: "Always show focus indicators", on: true },
      ].map((a) => (
        <div key={a.label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{a.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{a.desc}</p>
          </div>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: a.on ? "var(--color-accent-gradient)" : "var(--color-border)" }}>
            <span className={`absolute w-5 h-5 rounded-full bg-white transition-all ${a.on ? "right-0.5" : "left-0.5"}`} style={{ top: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="space-y-5">
      {[
        { label: "Share learning stats", desc: "Anonymised progress data helps us improve DeutschFlow", on: true },
        { label: "Personalised tips", desc: "Use your activity to suggest what to study next", on: true },
      ].map((p) => (
        <div key={p.label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{p.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{p.desc}</p>
          </div>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: p.on ? "var(--color-accent-gradient)" : "var(--color-border)" }}>
            <span className={`absolute w-5 h-5 rounded-full bg-white transition-all ${p.on ? "right-0.5" : "left-0.5"}`} style={{ top: 2 }} />
          </div>
        </div>
      ))}
      <button className="text-sm font-medium hover:underline" style={{ color: "var(--color-accent-light)" }}>Download my data</button>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState<string>("profile");

  return (
    <div className="pb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--color-hover-bg)" }}>⚙️</div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Settings</h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage your profile, learning preferences, and account</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="lg:w-48 flex-shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
          {SECTIONS.map((s) => {
            const isActive = active === s.key;
            const isDanger = s.key === "account";
            return (
              <button key={s.key} onClick={() => setActive(s.key)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left whitespace-nowrap transition-all text-xs sm:text-sm font-medium"
                style={{
                  background: isActive ? "var(--color-hover-bg)" : "transparent",
                  color: isActive ? (isDanger ? "var(--color-error-text)" : "var(--color-active-text)") : "var(--color-text-secondary)",
                  border: isActive ? "1px solid var(--color-accent)" : "1px solid transparent",
                }}>
                <span className="text-base flex-shrink-0">{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
            {active === "profile" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Profile</h2>
                <ProfileSection />
              </>
            )}

            {active === "subscription" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Subscription</h2>
                <SubscriptionSection />
              </>
            )}

            {active === "learning" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Learning</h2>
                <LearningSection />
              </>
            )}

            {active === "appearance" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Appearance</h2>
                <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Choose a theme. Changes apply instantly.</p>
                <div className="flex flex-wrap gap-2.5">
                  {THEME_LIST.map((t) => (
                    <button key={t.key} onClick={() => setTheme(t.key)} title={t.label}
                      className="w-9 h-9 rounded-full transition-all hover:scale-125 flex items-center justify-center"
                      style={{
                        background: t.color,
                        boxShadow: theme === t.key ? `0 0 0 3px var(--color-page-bg), 0 0 0 5px ${t.color}` : "none",
                        transform: theme === t.key ? "scale(1.15)" : "scale(1)",
                      }}>
                      {theme === t.key && <span className="text-white text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}

            {active === "audio" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Audio</h2>
                <AudioSection />
              </>
            )}

            {active === "notifications" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Notifications</h2>
                <NotificationsSection />
              </>
            )}

            {active === "accessibility" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Accessibility</h2>
                <AccessibilitySection />
              </>
            )}

            {active === "privacy" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Privacy & Data</h2>
                <PrivacySection />
              </>
            )}

            {active === "account" && (
              <>
                <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-error-text)" }}>Account</h2>
                <DangerZone />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
