"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { DangerZone } from "@/components/settings/DangerZone";
import { useTheme, type ThemeName } from "@/contexts/ThemeContext";

const THEME_OPTIONS: { key: ThemeName; label: string; accentColor: string; previewBg: string }[] = [
  { key: "indigo", label: "Indigo", accentColor: "#6366f1", previewBg: "#0f172a" },
  { key: "ocean", label: "Ocean", accentColor: "#0ea5e9", previewBg: "#0a1628" },
  { key: "steel", label: "Steel", accentColor: "#64748b", previewBg: "#0f1117" },
  { key: "onyx", label: "Onyx", accentColor: "#e5e5e5", previewBg: "#000000" },
  { key: "mono", label: "Mono", accentColor: "#a3a3a3", previewBg: "#0a0a0a" },
  { key: "amber", label: "Amber", accentColor: "#d97706", previewBg: "#0c0a09" },
  { key: "sunset", label: "Sunset", accentColor: "#f97316", previewBg: "#1a0f0a" },
  { key: "copper", label: "Copper", accentColor: "#e6a040", previewBg: "#140d08" },
  { key: "cherry", label: "Cherry", accentColor: "#dc2626", previewBg: "#1a0a0a" },
  { key: "rose", label: "Rose", accentColor: "#e11d48", previewBg: "#0f0009" },
  { key: "plum", label: "Plum", accentColor: "#a855f7", previewBg: "#150a1a" },
  { key: "lavender", label: "Lavender", accentColor: "#8b5cf6", previewBg: "#14101a" },
  { key: "emerald", label: "Emerald", accentColor: "#059669", previewBg: "#022c22" },
  { key: "forest", label: "Forest", accentColor: "#4ade80", previewBg: "#0d1a0d" },
  { key: "mint", label: "Mint", accentColor: "#14b8a6", previewBg: "#0a1a17" },
];

const SETTINGS_TABS = [
  { key: "profile", label: "Profile" },
  { key: "subscription", label: "Subscription" },
  { key: "preferences", label: "Preferences" },
  { key: "appearance", label: "Appearance" },
];

function ThemeSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--color-text)" }}>Theme</h2>
      <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
        Choose a color theme for the app. Changes apply instantly.
      </p>

      <div className="grid grid-cols-5 gap-3">
        {THEME_OPTIONS.map((t) => {
          const isActive = theme === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: t.previewBg,
                border: isActive ? `2px solid ${t.accentColor}` : "2px solid var(--color-border)",
                boxShadow: isActive ? `0 0 16px ${t.accentColor}40` : "none",
              }}
            >
              {/* Accent color circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: t.accentColor }}
              >
                {isActive && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: isActive ? t.accentColor : "var(--color-text-muted)" }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>Settings</h1>

      {/* Tab navigation */}
      <div className="flex gap-0 mb-6">
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-2.5 text-sm font-medium transition-colors hover:text-slate-200"
            style={{
              color: activeTab === tab.key ? "var(--color-text)" : "var(--color-text-muted)",
            }}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="rounded-xl p-6"
        style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}
      >
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "subscription" && <SubscriptionSection />}
        {activeTab === "preferences" && <PreferencesSection />}
        {activeTab === "appearance" && <ThemeSection />}
      </div>

      {/* Danger Zone */}
      <div className="mt-8">
        <DangerZone />
      </div>
    </div>
  );
}
