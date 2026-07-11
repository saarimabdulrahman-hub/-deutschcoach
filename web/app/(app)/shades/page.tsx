"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { DashboardData } from "@/types";

// ═══════════════════════════════════════════════════════════════════
// VIOLET SHADE COMPARISON — 8 premium violet palettes
// Visit: http://localhost:3456/shades
// ═══════════════════════════════════════════════════════════════════

const SHADES = [
  {
    name: "Deep Amethyst",
    desc: "Rich royal violet — our current signature",
    page: "#05040F", card: "#111127", border: "rgba(186,120,255,0.18)",
    accent: "#A855F7", light: "#C084FC", glow: "#D946EF",
    gradient: "linear-gradient(135deg, #A855F7, #C084FC, #D946EF)",
  },
  {
    name: "Plum Noir",
    desc: "Darker, moodier — luxury editorial feel",
    page: "#0A0518", card: "#150F2E", border: "rgba(200,140,255,0.15)",
    accent: "#9333EA", light: "#A855F7", glow: "#C084FC",
    gradient: "linear-gradient(135deg, #7E22CE, #9333EA, #A855F7)",
  },
  {
    name: "Lavender Mist",
    desc: "Lighter, airier — soft and inviting",
    page: "#0D0A28", card: "#1A1540", border: "rgba(210,180,255,0.2)",
    accent: "#B57BFF", light: "#C99BFF", glow: "#E0C0FF",
    gradient: "linear-gradient(135deg, #A24BFF, #C07BFF, #E0B0FF)",
  },
  {
    name: "Cosmic Indigo",
    desc: "Deep blue-violet — serious and focused",
    page: "#06061E", card: "#0E0D30", border: "rgba(150,140,240,0.16)",
    accent: "#6366F1", light: "#818CF8", glow: "#A5B4FC",
    gradient: "linear-gradient(135deg, #4F46E5, #6366F1, #818CF8)",
  },
  {
    name: "Berry Burst",
    desc: "Warm pink-violet — energetic and modern",
    page: "#0C0618", card: "#1A0F2D", border: "rgba(240,130,200,0.18)",
    accent: "#C026D3", light: "#D946EF", glow: "#F472B6",
    gradient: "linear-gradient(135deg, #A21CAF, #C026D3, #D946EF)",
  },
  {
    name: "Twilight Velvet",
    desc: "Balanced violet-blue — calm and premium",
    page: "#08091A", card: "#121330", border: "rgba(170,150,230,0.17)",
    accent: "#7C3AED", light: "#8B5CF6", glow: "#A78BFA",
    gradient: "linear-gradient(135deg, #6D28D9, #7C3AED, #8B5CF6)",
  },
  {
    name: "Orchid Bloom",
    desc: "Bright violet — Duolingo-inspired energy",
    page: "#0B0722", card: "#191338", border: "rgba(200,160,255,0.2)",
    accent: "#A24BFF", light: "#C480FF", glow: "#E0A0FF",
    gradient: "linear-gradient(135deg, #8B46FF, #B570FF, #D99BFF)",
  },
  {
    name: "Midnight Pansy",
    desc: "Near-black violet — ultra-premium dark",
    page: "#030312", card: "#0D0B24", border: "rgba(160,120,220,0.14)",
    accent: "#7E22CE", light: "#9333EA", glow: "#A855F7",
    gradient: "linear-gradient(135deg, #581C87, #7E22CE, #9333EA)",
  },
];

function MiniDashboard({ shade, data }: { shade: typeof SHADES[0]; data: DashboardData | null }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: shade.page,
        borderRadius: 24,
        padding: 20,
        border: `2px solid ${hovered ? shade.border : "rgba(255,255,255,0.04)"}`,
        boxShadow: hovered ? `0 0 60px ${shade.accent}22` : "0 0 20px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "pointer",
      }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>{shade.name}</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>{shade.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[shade.accent, shade.light, shade.glow].map((c, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: 5, background: c }} />
          ))}
        </div>
      </div>

      {/* Mini hero */}
      <div style={{
        height: 80, borderRadius: 14, marginBottom: 12,
        background: `linear-gradient(120deg, ${shade.accent}44, ${shade.glow}33, ${shade.accent}22)`,
        border: `1px solid ${shade.border}`,
        display: "flex", alignItems: "center", padding: "0 16px",
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.7)", margin: 0 }}>WELCOME TO DEUTSCHFLOW</p>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: "2px 0 0" }}>Your journey starts here</p>
        </div>
        <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "6px 12px", fontSize: 9, fontWeight: 700, color: "#fff" }}>Start →</div>
      </div>

      {/* Mini cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {["Lesson", "Review", "Progress"].map((label, i) => (
          <div key={i} style={{
            background: shade.card, borderRadius: 12, padding: "10px 12px",
            border: `1px solid ${shade.border}`,
          }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: shade.gradient, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>
              {String.fromCharCode(65 + i)}
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#fff", margin: 0 }}>{label}</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>View →</p>
          </div>
        ))}
      </div>

      {/* Color chips */}
      <div style={{ marginTop: 12, display: "flex", gap: 6, justifyContent: "center" }}>
        {[shade.page, shade.card, shade.accent, shade.light, shade.glow].map((c, i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: "1px solid rgba(255,255,255,0.1)" }} title={c} />
        ))}
      </div>
    </div>
  );
}

export default function ShadesPage() {
  const { user } = useAuth();
  const { data } = useQuery<DashboardData>({ queryKey: ["dashboard"], queryFn: () => api.get("/dashboard") });

  return (
    <div style={{ background: "#030312", minHeight: "100vh", padding: 32 }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 8 }}>8 Violet Shades — Side by Side</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 600, margin: "0 auto" }}>
            Actual dashboard surfaces rendered with different violet palettes. Hover each card to see the glow effect. Pick one and it gets applied.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {SHADES.map((shade) => (
            <MiniDashboard key={shade.name} shade={shade} data={data || null} />
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 32 }}>
          Tell me which shade to apply: "Deep Amethyst", "Plum Noir", "Lavender Mist", "Cosmic Indigo", "Berry Burst", "Twilight Velvet", "Orchid Bloom", or "Midnight Pansy"
        </p>
      </div>
    </div>
  );
}
