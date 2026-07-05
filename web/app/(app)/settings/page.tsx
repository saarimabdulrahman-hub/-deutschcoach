"use client";

import { ProfileSection } from "@/components/settings/ProfileSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { DangerZone } from "@/components/settings/DangerZone";
import { useTheme, type ThemeName } from "@/contexts/ThemeContext";

const THEME_OPTIONS: { key: ThemeName; label: string; color: string }[] = [
  { key: "indigo", label: "Indigo", color: "#6366f1" },
  { key: "ocean", label: "Ocean", color: "#0ea5e9" },
  { key: "steel", label: "Steel", color: "#64748b" },
  { key: "onyx", label: "Onyx", color: "#e5e5e5" },
  { key: "mono", label: "Mono", color: "#a3a3a3" },
  { key: "amber", label: "Amber", color: "#d97706" },
  { key: "sunset", label: "Sunset", color: "#f97316" },
  { key: "copper", label: "Copper", color: "#e6a040" },
  { key: "cherry", label: "Cherry", color: "#dc2626" },
  { key: "rose", label: "Rose", color: "#e11d48" },
  { key: "plum", label: "Plum", color: "#a855f7" },
  { key: "lavender", label: "Lavender", color: "#8b5cf6" },
  { key: "emerald", label: "Emerald", color: "#059669" },
  { key: "forest", label: "Forest", color: "#4ade80" },
  { key: "mint", label: "Mint", color: "#14b8a6" },
];

const sectionCard = "rounded-xl p-6";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Settings</h1>

      {/* Profile */}
      <div className={sectionCard} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">👤</span>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>Profile</h2>
        </div>
        <ProfileSection />
      </div>

      {/* Subscription */}
      <div className={sectionCard} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">💳</span>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>Subscription</h2>
        </div>
        <SubscriptionSection />
      </div>

      {/* Preferences */}
      <div className={sectionCard} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">⚙️</span>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>Preferences</h2>
        </div>
        <PreferencesSection />
      </div>

      {/* Appearance */}
      <div className={sectionCard} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">🎨</span>
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>Appearance</h2>
        </div>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Choose a theme. Changes apply instantly.</p>
        <div className="flex flex-wrap gap-2.5">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              title={t.label}
              className="w-8 h-8 rounded-full transition-all hover:scale-125 flex items-center justify-center"
              style={{
                background: t.color,
                boxShadow: theme === t.key ? `0 0 0 3px var(--color-page-bg), 0 0 0 5px ${t.color}` : "none",
                transform: theme === t.key ? "scale(1.15)" : "scale(1)",
              }}
            >
              {theme === t.key && <span className="text-white text-xs">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className={sectionCard} style={{ background: "var(--color-card-bg)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">⚠️</span>
          <h2 className="text-base font-semibold" style={{ color: "#ef4444" }}>Danger Zone</h2>
        </div>
        <DangerZone />
      </div>
    </div>
  );
}
