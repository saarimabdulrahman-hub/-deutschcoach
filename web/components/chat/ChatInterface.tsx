"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  corrections?: Array<{ error: string; correction: string; explanation: string }>;
}

const SCENARIO_ICONS: Record<string, string> = {
  casual: "💬", restaurant: "🍽️", shopping: "🛍️", travel: "🚆",
  "job-interview": "💼", doctor: "🏥",
};

const SUGGESTED_PHRASES: Record<string, string[]> = {
  casual: ["Hallo! Wie geht's?", "Was machst du gern?", "Erzähl mir von deiner Familie."],
  restaurant: ["Ich möchte bitte bestellen.", "Was können Sie empfehlen?", "Die Rechnung, bitte."],
  shopping: ["Ich suche ein Geschenk.", "Haben Sie das in Größe M?", "Was kostet das?"],
  travel: ["Wann fährt der nächste Zug?", "Eine Fahrkarte nach Berlin, bitte.", "Wo ist der Ausgang?"],
  "job-interview": ["Ich habe 5 Jahre Erfahrung.", "Warum möchten Sie hier arbeiten?", "Was sind Ihre Stärken?"],
  doctor: ["Ich habe Schmerzen hier.", "Seit drei Tagen habe ich Fieber.", "Brauche ich ein Rezept?"],
};

export function ChatInterface() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Array<{ key: string; name: string }>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const userName = (user?.name || "You").split(" ")[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    api.get<{ scenarios: Array<{ key: string; name: string }> }>("/chat/scenarios")
      .then((r) => setScenarios(r.scenarios))
      .catch(() => {});
  }, []);

  async function send(text?: string) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post<{ reply: string; corrections: Array<{ error: string; correction: string; explanation: string }> }>(
        "/chat/send",
        { messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })), scenario }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply, corrections: res.corrections }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Entschuldigung, ich konnte nicht antworten. Versuch es noch einmal." }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = scenario ? SUGGESTED_PHRASES[scenario] || SUGGESTED_PHRASES.casual : SUGGESTED_PHRASES.casual;

  return (
    <div className="flex h-[calc(100vh-9rem)] gap-0">
      {/* ── Scenario sidebar ── */}
      <div className="hidden lg:flex flex-col w-52 flex-shrink-0 border-r mr-4 pr-3 overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3 px-1" style={{ color: "var(--color-text-muted)" }}>Scenarios</p>

        <button
          onClick={() => setScenario(null)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1"
          style={{
            background: !scenario ? "var(--color-accent)" : "transparent",
            color: !scenario ? "#fff" : "var(--color-text-secondary)",
          }}
        >
          <span className="text-lg">💬</span> Free Chat
        </button>

        {scenarios.map((s) => (
          <button
            key={s.key}
            onClick={() => setScenario(s.key)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1"
            style={{
              background: scenario === s.key ? "var(--color-accent)" : "transparent",
              color: scenario === s.key ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            <span className="text-lg">{SCENARIO_ICONS[s.key] || "🎯"}</span>
            {s.name}
          </button>
        ))}

        <div className="mt-auto pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: "var(--color-text-muted)" }}>How to use</p>
          <div className="text-xs leading-relaxed px-1" style={{ color: "var(--color-text-muted)" }}>
            <p className="mb-1.5">• Type in German — mistakes are corrected gently</p>
            <p className="mb-1.5">• Use English if you're stuck</p>
            <p>• Try a scenario for role-play</p>
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile scenario bar */}
        <div className="lg:hidden flex gap-2 mb-3 overflow-x-auto pb-1">
          <button onClick={() => setScenario(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
            style={{ background: !scenario ? "var(--color-accent)" : "var(--color-card-bg)", color: !scenario ? "#fff" : "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
            💬 Free
          </button>
          {scenarios.map((s) => (
            <button key={s.key} onClick={() => setScenario(s.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
              style={{ background: scenario === s.key ? "var(--color-accent)" : "var(--color-card-bg)", color: scenario === s.key ? "#fff" : "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
              {SCENARIO_ICONS[s.key] || ""} {s.name}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 px-1" style={{ scrollBehavior: "smooth" }}>
          {messages.length === 0 && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🗣️</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                {scenario ? `${SCENARIO_ICONS[scenario] || ""} ${scenario.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} Scenario` : "German Conversation Practice"}
              </h2>
              <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--color-text-muted)" }}>
                {scenario
                  ? `You're now in a ${scenario.replace("-", " ")} scenario. Start speaking German!`
                  : "Chat freely in German. Your AI tutor corrects mistakes and introduces new words naturally."}
              </p>

              {/* Suggested phrases */}
              <div className="max-w-sm mx-auto">
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Try saying</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(phrase); }}
                      className="px-4 py-2 rounded-full text-sm transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--color-card-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={msg.role === "user"
                  ? { background: "var(--color-accent-gradient)", color: "#fff" }
                  : { background: "var(--color-card-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
              >
                {msg.role === "user" ? userName.charAt(0).toUpperCase() : "🇩🇪"}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "var(--color-accent-gradient)", color: "#fff", borderBottomRightRadius: "4px" }
                    : { background: "var(--color-card-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", borderBottomLeftRadius: "4px" }}
                >
                  {msg.content}
                </div>
                {msg.corrections && msg.corrections.length > 0 && msg.corrections[0].explanation && (
                  <div className="mt-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: "var(--color-hover-bg)", color: "var(--color-active-text)", border: "1px solid var(--color-active-bg)" }}>
                    💡 {msg.corrections[0].explanation}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--color-card-bg)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                🇩🇪
              </div>
              <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
                <span className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "120ms" }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--color-accent)", animationDelay: "240ms" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={scenario ? `Type in German... (${scenario.replace("-", " ")})` : "Schreib etwas auf Deutsch..."}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none placeholder:text-slate-500"
            style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", color: "var(--color-text)" }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-input-focus)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 hover:-translate-y-0.5"
            style={{ background: "var(--color-accent-gradient)", color: "#fff" }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
