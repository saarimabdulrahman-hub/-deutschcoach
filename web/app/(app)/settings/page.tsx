"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, THEME_LIST } from "@/contexts/ThemeContext";

type Section = "profile" | "learning" | "appearance" | "notifications" | "subscription" | "account";

const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M2.5 16c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg> },
  { key: "learning", label: "Learning", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="3" y1="7" x2="15" y2="7" stroke="currentColor" strokeWidth="1.5"/><line x1="6" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: "appearance", label: "Appearance", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="9" y1="1" x2="9" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="15" x2="9" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="1" y1="9" x2="3" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="15" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { key: "notifications", label: "Notifications", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.5c-3 0-5 2.5-5 5.5v2L3 13h12l-1-3V8c0-3-2-5.5-5-5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M6.5 13a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg> },
  { key: "subscription", label: "Subscription", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/><line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5"/><circle cx="9" cy="11" r="1.5" fill="currentColor"/></svg> },
  { key: "account", label: "Account", icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l7 4v5c0 4-3 6-7 7-4-1-7-3-7-7V6l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/></svg> },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="relative inline-flex h-6 w-11 items-center rounded-full transition-all border-none cursor-pointer flex-shrink-0"
      style={{ background: on ? "linear-gradient(90deg, #6D3BFF, #FF3CA6)" : "rgba(255,255,255,.08)" }}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-all ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState<Section>("profile");

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Learning preferences
  const [dailyGoal, setDailyGoal] = useState(user?.settings?.daily_goal_cards ?? 10);
  const [quizSize, setQuizSize] = useState(user?.settings?.quiz_size ?? 10);
  const [reminders, setReminders] = useState(user?.settings?.reminders_enabled ?? true);

  // Notifications
  const [notifSettings, setNotifSettings] = useState(user?.settings?.notifications ?? { daily: true, lessons: true, review: true, weekly: false, updates: false });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Debounced save for settings
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      setSettingsSaving(true);
      try {
        await api.patch("/user/profile", {
          settings: { daily_goal_cards: dailyGoal, quiz_size: quizSize, reminders_enabled: reminders, notifications: notifSettings }
        });
      } catch { /* silent */ }
      finally { setSettingsSaving(false); }
    }, 800);
    return () => clearTimeout(timer);
  }, [dailyGoal, quizSize, reminders, notifSettings]);

  // Delete account
  const [deleteStep, setDeleteStep] = useState<"idle" | "confirm" | "type">("idle");
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setProfileMsg(null);
    try { await api.patch("/user/profile", { name, email }); setProfileMsg({ type: "success", text: "Profile updated." }); }
    catch { setProfileMsg({ type: "error", text: "Failed to update profile." }); }
    finally { setSaving(false); }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) return;
    setChangingPassword(true); setPasswordMsg("");
    try { await api.post("/user/change-password", { current_password: currentPassword, new_password: newPassword }); setPasswordMsg("Password changed!"); setCurrentPassword(""); setNewPassword(""); }
    catch (e: any) { setPasswordMsg(e.message || "Failed"); }
    finally { setChangingPassword(false); }
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try { await api.post("/user/delete-account"); logout(); router.push("/"); }
    catch { setDeleting(false); }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#A855F7" }} /></div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6D3BFF, #FF3CA6)", boxShadow: "0 0 20px rgba(109,59,255,.25)" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#FFF" strokeWidth="1.8" fill="none"/><circle cx="11" cy="11" r="3" stroke="#FFF" strokeWidth="1.5" fill="none"/><line x1="11" y1="3" x2="11" y2="5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/><line x1="11" y1="17" x2="11" y2="19" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFF", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,.4)", margin: "4px 0 0" }}>Manage your profile, learning preferences, and account</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* ── Sidebar Navigation ── */}
        <div className="flex flex-col flex-shrink-0" style={{ width: "220px" }}>
          <nav className="flex flex-col gap-1 rounded-2xl p-3" style={{ background: "#101627", border: "1px solid rgba(255,255,255,.06)" }}>
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.key;
              const isDanger = item.key === "account";
              return (
                <button key={item.key} onClick={() => setActive(item.key)}
                  className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all border-none cursor-pointer"
                  style={{
                    background: isActive ? (isDanger ? "rgba(239,68,68,.1)" : "rgba(168,85,247,.12)") : "transparent",
                    border: isActive ? (isDanger ? "1px solid rgba(239,68,68,.2)" : "1px solid rgba(168,85,247,.2)") : "1px solid transparent",
                    color: isActive ? (isDanger ? "#EF4444" : "#FFF") : "rgba(255,255,255,.4)",
                    boxShadow: isActive && !isDanger ? "0 0 12px rgba(168,85,247,.08)" : "none",
                  }}>
                  <span style={{ width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl p-6" style={{ background: "#101627", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.12)" }}>
            {/* ── PROFILE ── */}
            {active === "profile" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFF", margin: "0 0 20px" }}>Profile</h2>
                {profileMsg && (
                  <div className="p-3 rounded-xl text-xs mb-4" style={{ color: profileMsg.type === "success" ? "#22C55E" : "#EF4444", background: profileMsg.type === "success" ? "rgba(34,197,94,.08)" : "rgba(239,68,68,.08)", border: `1px solid ${profileMsg.type === "success" ? "rgba(34,197,94,.15)" : "rgba(239,68,68,.15)"}` }}>
                    {profileMsg.text}
                  </div>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,.5)", marginBottom: "6px" }}>Full name</p>
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full max-w-md px-4 outline-none" style={{ height: "48px", borderRadius: "12px", background: "#0A0C18", border: "1px solid rgba(255,255,255,.06)", color: "#FFF", fontSize: "14px" }}
                      onFocus={e => { e.target.style.borderColor = "#A855F7"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.06)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,.5)", marginBottom: "6px" }}>Email</p>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full max-w-md px-4 outline-none" style={{ height: "48px", borderRadius: "12px", background: "#0A0C18", border: "1px solid rgba(255,255,255,.06)", color: "#FFF", fontSize: "14px" }}
                      onFocus={e => { e.target.style.borderColor = "#A855F7"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.06)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                  <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(90deg, #6D3BFF, #FF3CA6)", color: "#FFF", boxShadow: "0 4px 16px rgba(109,59,255,.25)" }}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>

                {/* Change Password */}
                <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#FFF", margin: "0 0 16px" }}>Change Password</h3>
                  <div className="space-y-3 max-w-md">
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full px-4 outline-none" style={{ height: "48px", borderRadius: "12px", background: "#0A0C18", border: "1px solid rgba(255,255,255,.06)", color: "#FFF", fontSize: "14px" }}
                      onFocus={e => { e.target.style.borderColor = "#A855F7"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.06)"; e.target.style.boxShadow = "none"; }} />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password" className="w-full px-4 outline-none" style={{ height: "48px", borderRadius: "12px", background: "#0A0C18", border: "1px solid rgba(255,255,255,.06)", color: "#FFF", fontSize: "14px" }}
                      onFocus={e => { e.target.style.borderColor = "#A855F7"; e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,.12)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.06)"; e.target.style.boxShadow = "none"; }} />
                    {passwordMsg && <p style={{ fontSize: "12px", color: passwordMsg.includes("changed") ? "#22C55E" : "#EF4444" }}>{passwordMsg}</p>}
                    <button type="button" onClick={handleChangePassword} disabled={changingPassword} className="px-5 py-2 rounded-xl text-xs font-medium border-none cursor-pointer" style={{ border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.6)", background: "transparent" }}>
                      {changingPassword ? "Changing..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── LEARNING ── */}
            {active === "learning" && (
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFF", margin: 0 }}>Learning Preferences</h2>
                  {settingsSaving && <span style={{ fontSize: "11px", color: "rgba(255,255,255,.3)" }}>Saving...</span>}
                </div>
                <div className="space-y-6">
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,.5)", marginBottom: "8px" }}>Daily Goal</p>
                    <div className="flex gap-2">
                      {[5, 10, 15, 20, 30].map(n => (
                        <button key={n} onClick={() => setDailyGoal(n)} className="px-4 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-all"
                          style={{ background: dailyGoal === n ? "linear-gradient(135deg, #6D3BFF, #FF3CA6)" : "rgba(255,255,255,.04)", color: dailyGoal === n ? "#FFF" : "rgba(255,255,255,.35)", border: dailyGoal === n ? "none" : "1px solid rgba(255,255,255,.06)" }}>
                          {n} min
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,.5)", marginBottom: "8px" }}>Quiz Size</p>
                    <select value={quizSize} onChange={e => setQuizSize(Number(e.target.value))} className="px-4 outline-none" style={{ height: "44px", borderRadius: "12px", background: "#0A0C18", border: "1px solid rgba(255,255,255,.06)", color: "#FFF", fontSize: "13px", minWidth: "160px" }}>
                      {[5, 10, 15, 20, 25, 30].map(n => <option key={n} value={n}>{n} questions</option>)}
                    </select>
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#FFF", margin: 0 }}>Daily Reminders</p>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,.3)", margin: "2px 0 0" }}>Get reminded to practice daily</p>
                    </div>
                    <Toggle on={reminders} onChange={setReminders} />
                  </div>
                </div>
              </div>
            )}

            {/* ── APPEARANCE ── */}
            {active === "appearance" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFF", margin: "0 0 20px" }}>Appearance</h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", marginBottom: "16px" }}>Choose a theme. Changes apply instantly.</p>
                <div className="flex flex-wrap gap-3">
                  {THEME_LIST.map((t) => (
                    <button key={t.key} onClick={() => setTheme(t.key)} title={t.label}
                      className="w-10 h-10 rounded-full transition-all border-none cursor-pointer flex items-center justify-center"
                      style={{ background: t.color, boxShadow: theme === t.key ? `0 0 0 3px #090B17, 0 0 0 5px ${t.color}` : "none", transform: theme === t.key ? "scale(1.15)" : "scale(1)" }}>
                      {theme === t.key && <span style={{ fontSize: "11px", color: t.label === "Onyx" ? "#000" : "#FFF" }}>✓</span>}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,.2)", marginTop: "12px" }}>{THEME_LIST.find(t => t.key === theme)?.label}</p>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {active === "notifications" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFF", margin: "0 0 20px" }}>Notifications</h2>
                <div className="space-y-4 max-w-md">
                  {[
                    { key: "daily", label: "Daily reminder", desc: "Remind you to practice every day" },
                    { key: "lessons", label: "Lesson complete", desc: "When you finish a lesson" },
                    { key: "review", label: "Review ready", desc: "When SRS reviews are due" },
                    { key: "weekly", label: "Weekly summary", desc: "Weekly progress report" },
                    { key: "updates", label: "Product updates", desc: "New features and improvements" },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between py-1">
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "#FFF", margin: 0 }}>{n.label}</p>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,.3)", margin: "2px 0 0" }}>{n.desc}</p>
                      </div>
                      <Toggle on={notifSettings[n.key as keyof typeof notifSettings]} onChange={v => setNotifSettings({ ...notifSettings, [n.key]: v })} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUBSCRIPTION ── */}
            {active === "subscription" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFF", margin: "0 0 20px" }}>Subscription</h2>
                <div className="rounded-xl p-4 mb-5" style={{ background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.15)" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", margin: 0 }}>You are on the <span style={{ color: "#A855F7", fontWeight: 600, textTransform: "capitalize" }}>{user?.subscription_tier || "free"}</span> plan.</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { tier: "Starter", price: "$9", features: ["A1-A2 content", "Basic SRS", "50 cards/day"] },
                    { tier: "Plus", price: "$19", features: ["A1-B1 content", "Full SRS", "Unlimited cards", "AI Tutor"] },
                    { tier: "Pro", price: "$29", features: ["A1-C1 content", "Full SRS", "Unlimited cards", "AI Tutor", "Offline mode"] },
                  ].map((plan, i) => (
                    <div key={plan.tier} className="rounded-xl p-4 flex flex-col" style={{ background: i === 1 ? "rgba(168,85,247,.06)" : "#0A0C18", border: i === 1 ? "1px solid rgba(168,85,247,.2)" : "1px solid rgba(255,255,255,.05)" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFF", margin: "0 0 4px" }}>{plan.tier}</p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: "#FFF", margin: "0 0 12px" }}>{plan.price}<span style={{ fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,.3)" }}>/mo</span></p>
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        {plan.features.map(f => (
                          <li key={f} style={{ fontSize: "12px", color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-4" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full py-2 rounded-xl text-xs font-semibold border-none cursor-pointer"
                        style={{ background: i === 1 ? "linear-gradient(90deg, #6D3BFF, #FF3CA6)" : "rgba(255,255,255,.05)", color: i === 1 ? "#FFF" : "rgba(255,255,255,.4)" }}>
                        {i === 1 ? "Upgrade" : i === 0 ? "Current" : "Upgrade"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {active === "account" && (
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#EF4444", margin: "0 0 12px" }}>Account</h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", marginBottom: "16px" }}>Once you delete your account, there is no going back.</p>
                {deleteStep === "idle" && (
                  <button onClick={() => setDeleteStep("confirm")} className="px-4 py-2 rounded-xl text-sm font-medium border-none cursor-pointer" style={{ background: "rgba(239,68,68,.12)", color: "#EF4444" }}>
                    Delete Account
                  </button>
                )}
                {deleteStep === "confirm" && (
                  <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.12)" }}>
                    <p style={{ fontSize: "13px", color: "#EF4444", marginBottom: "12px" }}>This permanently deletes all your progress, SRS data, and account.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteStep("type")} className="px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer" style={{ background: "#EF4444", color: "#FFF" }}>Yes, delete</button>
                      <button onClick={() => setDeleteStep("idle")} className="px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.4)" }}>Cancel</button>
                    </div>
                  </div>
                )}
                {deleteStep === "type" && (
                  <div className="rounded-xl p-4" style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.12)" }}>
                    <p style={{ fontSize: "13px", color: "#EF4444", marginBottom: "8px" }}>Type <span style={{ fontWeight: 700 }}>DELETE</span> to confirm:</p>
                    <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder='Type "DELETE"' className="w-full max-w-xs px-3 outline-none mb-3" style={{ height: "40px", borderRadius: "10px", background: "#0A0C18", border: "1px solid rgba(239,68,68,.2)", color: "#FFF", fontSize: "13px" }}
                      onFocus={e => { e.target.style.borderColor = "#EF4444"; e.target.style.boxShadow = "0 0 0 3px rgba(239,68,68,.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "rgba(239,68,68,.2)"; e.target.style.boxShadow = "none"; }} />
                    <div className="flex gap-2">
                      <button onClick={handleDeleteAccount} disabled={deleteInput !== "DELETE" || deleting} className="px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer" style={{ background: deleteInput === "DELETE" ? "#EF4444" : "rgba(239,68,68,.3)", color: "#FFF" }}>
                        {deleting ? "Deleting..." : "Delete My Account"}
                      </button>
                      <button onClick={() => { setDeleteStep("idle"); setDeleteInput(""); }} className="px-4 py-2 rounded-xl text-xs font-medium border-none cursor-pointer" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.4)" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
