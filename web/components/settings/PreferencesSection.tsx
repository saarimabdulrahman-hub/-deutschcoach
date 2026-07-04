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

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-800">Preferences</h2>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          Daily Card Goal
        </label>
        <input
          type="number"
          min={5}
          max={100}
          value={dailyGoalCards}
          onChange={(e) => setDailyGoalCards(Number(e.target.value))}
          className="w-full max-w-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-neutral-400 mt-1">
          Number of flashcards to review each day.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-1">
          Quiz Size
        </label>
        <select
          value={quizSize}
          onChange={(e) => setQuizSize(Number(e.target.value))}
          className="w-full max-w-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {[5, 10, 15, 20, 25, 30].map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
        </select>
        <p className="text-xs text-neutral-400 mt-1">
          Number of questions per quiz session.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-neutral-600">
          Reminders
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={remindersEnabled}
          onClick={() => setRemindersEnabled(!remindersEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            remindersEnabled ? "bg-blue-600" : "bg-neutral-300"
          }`}
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
          <label className="block text-sm font-medium text-neutral-600 mb-1">
            Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
}
