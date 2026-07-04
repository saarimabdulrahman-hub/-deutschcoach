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
    <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
      <h2 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h2>
      <p className="text-sm text-red-600 mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      {error && (
        <div className="p-3 rounded-lg text-sm bg-red-100 text-red-700 border border-red-300 mb-4">
          {error}
        </div>
      )}

      {step === "idle" && (
        <button
          onClick={handleInitialClick}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Account
        </button>
      )}

      {step === "confirm" && (
        <div className="space-y-3">
          <p className="text-sm text-red-700 font-medium">
            Are you sure? This permanently deletes all your progress, SRS data,
            and account.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleFirstConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
            >
              Yes, I want to delete
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === "type-delete" && (
        <div className="space-y-3">
          <p className="text-sm text-red-700 font-medium">
            Type <code className="bg-red-100 px-1 rounded">DELETE</code> to
            confirm:
          </p>
          <input
            type="text"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder='Type "DELETE"'
            className="w-full max-w-xs px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={deleteInput !== "DELETE" || deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {deleting ? "Deleting..." : "Delete My Account"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
