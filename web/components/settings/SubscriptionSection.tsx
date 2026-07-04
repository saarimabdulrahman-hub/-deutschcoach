"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Plan } from "@/types";

export function SubscriptionSection() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const currentTier = user?.subscription_tier || "free";

  useEffect(() => {
    async function fetchPlans() {
      try {
        const data = await api.get<Plan[]>("/payments/plans");
        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-800">Subscription</h2>

      {/* Current plan */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          You are on the{" "}
          <span className="font-semibold capitalize">{currentTier}</span> plan.
        </p>
      </div>

      {/* Upgrade options (only if free tier) */}
      {currentTier === "free" && (
        <div>
          <h3 className="text-md font-semibold text-neutral-700 mb-3">
            Available Plans
          </h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-neutral-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-neutral-400 text-sm">
              No plans available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans
                .filter((p) => p.tier !== "free")
                .map((plan) => (
                  <div
                    key={plan.tier}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="font-semibold text-neutral-800 capitalize mb-2">
                      {plan.tier}
                    </div>
                    <div className="text-2xl font-bold text-neutral-800 mb-1">
                      ${plan.monthly_price}
                      <span className="text-sm font-normal text-neutral-400">
                        /mo
                      </span>
                    </div>
                    {plan.annual_price > 0 && (
                      <div className="text-xs text-neutral-400 mb-3">
                        ${plan.annual_price}/year
                      </div>
                    )}
                    <ul className="text-xs text-neutral-500 space-y-1 mb-4">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-green-500">&check;</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                      Upgrade
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Manage Billing */}
      <div className="border-t pt-4 space-y-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("Stripe Customer Portal will be available soon.");
          }}
          className="inline-block text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Manage Billing (Stripe Customer Portal)
        </a>

        <div>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-sm text-red-500 hover:text-red-600 underline"
            >
              Cancel Subscription
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 mb-2">
                Are you sure you want to cancel your subscription?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    alert(
                      "Subscription cancellation will be available soon."
                    );
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                >
                  Yes, Cancel
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded text-xs font-medium hover:bg-neutral-300"
                >
                  Keep Subscription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
