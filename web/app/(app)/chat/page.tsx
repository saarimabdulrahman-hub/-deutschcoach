"use client";

import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
        Practice Chat
      </h1>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Practice German conversation with an AI tutor. Mistakes are corrected
        naturally.
      </p>
      <ChatInterface />
    </div>
  );
}
