/**
 * BottomSheet — Slide-up panel from bottom with drag-to-dismiss
 * Reference: 03_LAYOUTS/008_Mobile_Application_Shell.md
 */

"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[]; // percentages: [25, 50, 75, 100]
  initialSnap?: number;
}

export function BottomSheet({
  open, onClose, children,
  snapPoints = [25, 50, 75, 100], initialSnap = 50,
}: BottomSheetProps) {
  const [snap, setSnap] = useState(initialSnap);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setDragging(true);
    startYRef.current = e.clientY;
    currentYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    currentYRef.current = e.clientY;
    const diff = currentYRef.current - startYRef.current;
    const newSnap = Math.max(snapPoints[0], Math.min(snapPoints[snapPoints.length - 1], snap - diff / window.innerHeight * 100));
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${100 - newSnap}%)`;
    }
  }, [dragging, snap, snapPoints]);

  const handlePointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const diff = currentYRef.current - startYRef.current;
    if (diff > 50) {
      // Find the next lower snap point
      const currentIdx = snapPoints.indexOf(snap);
      if (currentIdx > 0) setSnap(snapPoints[currentIdx - 1]);
      else onClose();
    } else if (diff < -50) {
      // Next higher snap point
      const currentIdx = snapPoints.indexOf(snap);
      if (currentIdx < snapPoints.length - 1) setSnap(snapPoints[currentIdx + 1]);
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${100 - snap}%)`;
    }
  }, [dragging, snap, snapPoints, onClose]);

  // Reset snap when opened
  useEffect(() => {
    if (open) setSnap(initialSnap);
  }, [open, initialSnap]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-overlay)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          height: `${snap}vh`,
          background: "var(--color-surface-1)",
          borderTopLeftRadius: "var(--radius-lg)",
          borderTopRightRadius: "var(--radius-lg)",
          boxShadow: "var(--elevation-4)",
          transform: `translateY(${100 - snap}%)`,
          transition: dragging ? "none" : "transform 0.3s ease",
          display: "flex", flexDirection: "column",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {/* Drag handle */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            display: "flex", justifyContent: "center", padding: "12px", cursor: "grab", touchAction: "none",
          }}
        >
          <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "var(--color-border-subtle)" }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 var(--space-4) var(--space-4)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
