"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileSection() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.patch<{ message: string }>("/user/profile", { name, email });
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return;
    setPasswordError("");
    setPasswordSuccess("");
    setChangingPassword(true);
    try {
      await api.post("/user/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password changed!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setPasswordError(e.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  const inputClass = "w-full max-w-md px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 placeholder:text-slate-500";

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
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="pt-6" style={{ borderTop: "1px solid var(--color-border)" }}>
        <h3 className="text-md font-semibold mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Change Password
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              style={{
                background: "var(--color-page-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              placeholder="Enter current password"
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
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              style={{
                background: "var(--color-page-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              placeholder="Enter new password"
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

          {passwordError && (
            <p className="text-sm" style={{ color: "var(--color-error-text)" }} role="alert">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className="text-sm" style={{ color: "var(--color-success)" }} role="alert">
              {passwordSuccess}
            </p>
          )}

          <button
            type="button"
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
            style={{ background: "var(--color-page-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </div>

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
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
