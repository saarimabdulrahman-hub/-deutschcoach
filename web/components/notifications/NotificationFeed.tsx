/**
 * NotificationFeed — Scrollable notification feed with infinite scroll
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { NotificationCard } from "./NotificationCard";
import { NotificationFilters } from "./NotificationFilters";
import { EmptyState } from "@/components/ui/EmptyState";

type FilterKey = "all" | "unread" | "read";
const PAGE_SIZE = 20;

// Mock data — replace with API call
const MOCK_NOTIFICATIONS: any[] = [
  { id: "1", type: "lesson", title: "Lesson complete!", message: "You finished A1: Greetings.", read: false, createdAt: "2 min ago" },
  { id: "2", type: "streak", title: "5-day streak! 🔥", message: "Keep it going — you're on fire!", read: false, createdAt: "1 hour ago" },
  { id: "3", type: "review", title: "Cards ready for review", message: "You have 12 cards waiting.", read: true, createdAt: "3 hours ago" },
  { id: "4", type: "quiz", title: "Quiz score: 85%", message: "Great work on the A1 vocabulary quiz.", read: true, createdAt: "1 day ago" },
  { id: "5", type: "system", title: "Welcome to DeutschFlow!", message: "Start your first lesson to begin learning.", read: true, createdAt: "3 days ago" },
];

export function NotificationFeed() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  }).slice(0, page * PAGE_SIZE);

  const counts = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    read: notifications.filter((n) => n.read).length,
  };

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const handleArchive = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setPage((p) => p + 1);
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <NotificationFilters active={filter} onChange={setFilter} counts={counts} />

      <div aria-live="polite" aria-label="Notifications feed" style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-subtle)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <EmptyState
            variant="first-use"
            icon="🔔"
            title="No notifications"
            description={filter === "unread" ? "No unread notifications" : "You're all caught up!"}
          />
        ) : (
          filtered.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} onArchive={handleArchive} />
          ))
        )}
        <div ref={loaderRef} style={{ height: "1px" }} />
      </div>

      {filtered.length < notifications.length && (
        <p style={{ textAlign: "center", fontSize: "var(--type-label-sm)", color: "var(--color-text-muted)" }}>
          Scroll for more
        </p>
      )}
    </div>
  );
}
