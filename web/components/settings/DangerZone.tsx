"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export function DangerZone() {
  const { logout } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "type-delete">("idle");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleInitialClick() {
    setStep("confirm");
  }

  function handleFirstConfirm() {
    setStep("type-delete");
  }

  function handleCancel() {
    setStep("idle");
    setDeleteInput("");
    setError(null);
  }

  async function handleDelete() {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    setError(null);
    try {
      await api.post<{ message: string }>("/user/delete-account");
      logout();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete account."
      );
      setDeleting(false);
    }
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--color-error-bg)",
        border: "2px solid var(--color-error-border)",
      }}
    >
      <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-error-text)" }}>Danger Zone</h2>
      <p className="text-sm mb-4" style={{ color: "var(--color-error-text)" }}>
        Once you delete your account, there is no going back. Please be certain.
      </p>

      {error && (
        <div
          className="p-3 rounded-xl text-sm mb-4"
          style={{
            background: "var(--color-error-bg)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error-text)",
          }}
        >
          {error}
        </div>
      )}

      {step === "idle" && (
        <button
          onClick={handleInitialClick}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Account
        </button>
      )}

      {step === "confirm" && (
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: "var(--color-error-text)" }}>
            Are you sure? This permanently deletes all your progress, SRS data,
            and account.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFirstConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium"
            >
              Yes, I want to delete
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "type-delete" && (
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: "var(--color-error-text)" }}>
            Type <code className="px-1 rounded" style={{ background: "var(--color-error-bg)" }}>DELETE</code> to
            confirm:
          </p>
          <input
            type="text"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder='Type "DELETE"'
            className="w-full max-w-xs px-3 py-2 rounded-xl text-sm outline-none"
            style={{
              background: "var(--color-page-bg)",
              border: "1px solid var(--color-error-border)",
              color: "var(--color-text)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-error-text)";
              e.target.style.boxShadow = "0 0 0 3px var(--color-error-bg)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-error-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleteInput !== "DELETE" || deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
