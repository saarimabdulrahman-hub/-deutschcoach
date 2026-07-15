"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { DangerZone } from "@/components/settings/DangerZone";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { useTheme, THEME_LIST } from "@/contexts/ThemeContext";

const SECTIONS = [
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

function LearningSection() {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Daily Goal</label>
        <div className="flex items-center gap-3">
          {[5, 10, 15, 20, 30].map((n) => (
            <button key={n} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: n === 10 ? "var(--color-accent-gradient)" : "var(--color-surface-1)", color: n === 10 ? "#fff" : "var(--color-text-secondary)", border: n === 10 ? "none" : "1px solid var(--color-border-subtle)" }}>
              {n} min
            </button>
          ))}
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: "var(--color-text-muted)" }}>Your daily learning target.</p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>Reminder Time</label>
        <select className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)", color: "var(--color-text-primary)" }}>
          <option>08:00</option><option>09:00</option><option>12:00</option><option>18:00</option><option>20:00</option><option>Off</option>
        </select>
      </div>
    </div>
  );
}

function AudioSection() {
  return (
    <div className="space-y-5">
      {["Auto-play audio", "Download audio for offline"].map((label) => (
        <div key={label} className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{label}</p>
          <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: "var(--color-accent-gradient)" }}>
            <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-5">
      {[
        { label: "Daily reminder", on: true },
        { label: "Lesson complete", on: true },
        { label: "Review ready", on: true },
        { label: "Weekly summary", on: false },
        { label: "Product updates", on: false },
      ].map((n) => (
        <div key={n.label} className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{n.label}</p>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: n.on ? "var(--color-accent-gradient)" : "var(--color-border-subtle)" }}>
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
        { label: "Reduced motion", on: false },
        { label: "High contrast", on: false },
        { label: "Large text", on: false },
        { label: "Keyboard focus visible", on: true },
      ].map((a) => (
        <div key={a.label} className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{a.label}</p>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: a.on ? "var(--color-accent-gradient)" : "var(--color-border-subtle)" }}>
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
        { label: "Share learning stats", on: true },
        { label: "Personalised tips", on: true },
      ].map((p) => (
        <div key={p.label} className="flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{p.label}</p>
          <div className="w-11 h-6 rounded-full relative cursor-pointer"
            style={{ background: p.on ? "var(--color-accent-gradient)" : "var(--color-border-subtle)" }}>
            <span className={`absolute w-5 h-5 rounded-full bg-white transition-all ${p.on ? "right-0.5" : "left-0.5"}`} style={{ top: 2 }} />
          </div>
        </div>
      ))}
      <button className="text-sm font-medium hover:underline" style={{ color: "var(--color-accent-light)" }}>Download my data</button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState("profile");

  const renderSection = () => {
    switch (active) {
      case "profile": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Profile</h2><ProfileSection /></>;
      case "subscription": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Subscription</h2><SubscriptionSection /></>;
      case "learning": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Learning</h2><LearningSection /></>;
      case "appearance": return (
        <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Appearance</h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Choose a theme. Changes apply instantly.</p>
          <div className="flex flex-wrap gap-2.5">
            {THEME_LIST.map((t) => (
              <button key={t.key} onClick={() => setTheme(t.key)} title={t.label}
                className="w-9 h-9 rounded-full transition-all hover:scale-125 flex items-center justify-center"
                style={{ background: t.color, boxShadow: theme === t.key ? `0 0 0 3px var(--color-background-primary), 0 0 0 5px ${t.color}` : "none", transform: theme === t.key ? "scale(1.15)" : "scale(1)" }}>
                {theme === t.key && <span className="text-white text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      );
      case "audio": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Audio</h2><AudioSection /></>;
      case "notifications": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Notifications</h2><NotificationsSection /></>;
      case "accessibility": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Accessibility</h2><AccessibilitySection /></>;
      case "privacy": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Privacy & Data</h2><PrivacySection /></>;
      case "account": return <><h2 className="text-base font-bold mb-4" style={{ color: "var(--color-error-text)" }}>Account</h2><DangerZone /></>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: "var(--color-hover-bg)" }}>⚙️</div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>Settings</h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage your profile, learning preferences, and account</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsNav sections={SECTIONS} active={active} onSelect={setActive} />

        <div className="flex-1 min-w-0">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border-subtle)" }}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}
