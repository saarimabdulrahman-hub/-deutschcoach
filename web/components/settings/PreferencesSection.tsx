"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function PreferencesSection() {
  const { user } = useAuth();
  const [dailyGoalCards, setDailyGoalCards] = useState(
    user?.settings?.daily_goal_cards ?? 20
  );
  const [quizSize, setQuizSize] = useState(
    user?.settings?.quiz_size ?? 10
  );
  const [remindersEnabled, setRemindersEnabled] = useState(
    user?.settings?.reminders_enabled ?? false
  );
  const [reminderTime, setReminderTime] = useState("09:00");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch<{ message: string }>("/user/profile", {
        settings: {
          daily_goal_cards: dailyGoalCards,
          quiz_size: quizSize,
          reminders_enabled: remindersEnabled,
        },
      });
      setMessage({
        type: "success",
        text: "Preferences saved successfully.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save preferences.",
      });
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full max-w-xs px-4 py-2 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-slate-500";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <div
          className="p-3 rounded-xl text-sm"
          style={{
            color: message.type === "success" ? "var(--color-success)" : "var(--color-error-text)",
            background: message.type === "success"
              ? "rgba(34,197,94,0.1)"
              : "var(--color-error-bg)",
            border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.2)" : "var(--color-error-border)"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Daily Card Goal
        </label>
        <input
          type="number"
          min={5}
          max={100}
          value={dailyGoalCards}
          onChange={(e) => setDailyGoalCards(Number(e.target.value))}
          className={inputClass}
          style={{
            background: "var(--color-page-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--color-accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--color-border)";
            e.target.style.boxShadow = "none";
          }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          Number of flashcards to review each day.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Quiz Size
        </label>
        <select
          value={quizSize}
          onChange={(e) => setQuizSize(Number(e.target.value))}
          className={inputClass}
          style={{
            background: "var(--color-page-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          {[5, 10, 15, 20, 25, 30].map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
        </select>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          Number of questions per quiz session.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Reminders
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={remindersEnabled}
          onClick={() => setRemindersEnabled(!remindersEnabled)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          style={{
            background: remindersEnabled ? "var(--color-accent)" : "var(--color-border)",
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              remindersEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {remindersEnabled && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className={inputClass}
            style={{
              background: "var(--color-page-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-accent)";
              e.target.style.boxShadow = "0 0 0 3px var(--color-active-bg)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
        style={{
          color: "var(--color-text)",
          background: "var(--color-accent-gradient)",
          boxShadow: "0 4px 14px var(--color-accent-glow)",
        }}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
}
