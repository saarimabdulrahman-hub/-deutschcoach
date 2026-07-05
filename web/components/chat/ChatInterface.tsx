"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
  corrections?: Array<{ error: string; correction: string; explanation: string }>;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Array<{ key: string; name: string }>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    api
      .get<{ scenarios: Array<{ key: string; name: string }> }>("/chat/scenarios")
      .then((r) => setScenarios(r.scenarios))
      .catch(() => {});
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post<{
        reply: string;
        corrections: Array<{ error: string; correction: string; explanation: string }>;
      }>("/chat/send", {
        messages: [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        scenario,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          corrections: res.corrections,
        },
      ]);
    } catch (e: unknown) {
      const detail =
        e instanceof Error ? e.message : "Sorry, I couldn't respond. Is the chat feature configured?";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: detail },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Scenario sidebar — desktop only */}
      <div className="hidden md:flex flex-col gap-2 w-48 flex-shrink-0 overflow-y-auto">
        <button
          onClick={() => setScenario(null)}
          className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: !scenario ? "var(--color-accent)" : "var(--color-card-bg)",
            color: !scenario ? "#fff" : "var(--color-text-secondary)",
            border: !scenario ? "none" : "1px solid var(--color-border)",
          }}
        >
          Free Chat
        </button>
        {scenarios.map((s) => (
          <button
            key={s.key}
            onClick={() => setScenario(s.key)}
            className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: scenario === s.key ? "var(--color-accent)" : "var(--color-card-bg)",
              color: scenario === s.key ? "#fff" : "var(--color-text-secondary)",
              border: scenario === s.key ? "none" : "1px solid var(--color-border)",
            }}
          >
            {s.name}
          </button>
        ))}
        <div
          className="mt-4 p-3 rounded-lg text-xs"
          style={{
            background: "var(--color-hover-bg)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--color-text-secondary)" }}>
            Tips
          </p>
          <ul className="space-y-1 list-disc pl-3">
            <li>Type in German — the tutor will correct mistakes</li>
            <li>Use English if you are stuck</li>
            <li>Pick a scenario for role-play practice</li>
          </ul>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div
          className="flex-1 overflow-y-auto space-y-4 p-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">&#x1F5E3;&#xFE0F;</div>
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                German Conversation Practice
              </h2>
              <p
                className="text-sm max-w-md mx-auto"
                style={{ color: "var(--color-text-muted)" }}
              >
                {scenario
                  ? `Scenario: ${scenario}. Start the conversation in German!`
                  : "Chat freely in German. The tutor will correct mistakes and introduce new vocabulary naturally."}
              </p>
              {/* Mobile scenario chips */}
              <div className="flex gap-2 justify-center mt-4 md:hidden flex-wrap">
                {scenarios.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setScenario(s.key)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background:
                        scenario === s.key
                          ? "var(--color-accent)"
                          : "var(--color-card-bg)",
                      color:
                        scenario === s.key
                          ? "#fff"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[80%]">
                <div
                  className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "var(--color-accent-gradient)",
                          color: "#fff",
                          borderBottomRightRadius: "4px",
                        }
                      : {
                          background: "var(--color-card-bg)",
                          color: "var(--color-text-secondary)",
                          border: "1px solid var(--color-border)",
                          borderBottomLeftRadius: "4px",
                        }
                  }
                >
                  {msg.content}
                </div>
                {msg.corrections &&
                  msg.corrections.length > 0 &&
                  msg.corrections[0].explanation && (
                    <div
                      className="mt-1.5 mx-1 px-3 py-1.5 rounded-lg text-xs"
                      style={{
                        background: "var(--color-hover-bg)",
                        color: "var(--color-active-text)",
                        border: "1px solid var(--color-active-bg)",
                      }}
                    >
                      &#x1F4A1; {msg.corrections[0].explanation}
                    </div>
                  )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl text-sm"
                style={{
                  background: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span className="flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-accent)",
                      animationDelay: "0ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-accent)",
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-accent)",
                      animationDelay: "300ms",
                    }}
                  />
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="flex gap-2 mt-3 pt-3"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={
              scenario
                ? `Type in German for the ${scenario} scenario...`
                : "Schreib etwas auf Deutsch..."
            }
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-500"
            style={{
              background: "var(--color-card-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
            style={{
              background: "var(--color-accent-gradient)",
              color: "#fff",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
