"use client";

export default function ShowcasePage() {
  return (
    <div style={{ background: "#05040F", minHeight: "100vh", padding: 32, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Premium Enhancement Catalog</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)" }}>Real CSS enhancements applied to the DeutschFlow dashboard</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16 }}>
          {/* 1. Glossy Borders */}
          <Card title="Glossy Violet Glass Borders" tag="BORDERS" cat="Surface" desc="Cards get glossy borders with violet edge glow (rgba 186,120,255 at 22%). Premium glass separation.">
            <div style={{ height: 160, borderRadius: 14, background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%), #111127", border: "2px solid rgba(186,120,255,0.22)", boxShadow: "0 0 45px rgba(168,85,247,0.12), 0 2px 0 0 rgba(255,255,255,0.04) inset", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 48 }}>✨</span>
            </div>
          </Card>

          {/* 2. Active Nav Pill */}
          <Card title="Luminous Active Nav Pill" tag="NAV" cat="Navigation" desc="Active tab uses gradient pill with inner glow and violet shadow. Unmistakable focus.">
            <div style={{ height: 160, borderRadius: 14, background: "#0C0922", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "linear-gradient(135deg, #A855F7, #C084FC, #D946EF)", borderRadius: 12, padding: "10px 22px", color: "#fff", fontWeight: 700, fontSize: 14, boxShadow: "0 0 22px rgba(168,85,247,0.4), 0 1px 0 0 rgba(255,255,255,0.15) inset", border: "1px solid rgba(255,255,255,0.15)" }}>Dashboard</div>
            </div>
          </Card>

          {/* 3. Gradient Progress */}
          <Card title="Signature Gradient Progress" tag="PROGRESS" cat="Metrics" desc="Progress uses #A855F7→#D946EF gradient on dark #2A2A45 track. Smooth fill animation.">
            <div style={{ height: 160, borderRadius: 14, background: "#111127", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
              <div style={{ width: "80%", height: 8, borderRadius: 99, background: "#2A2A45", overflow: "hidden" }}>
                <div style={{ width: "65%", height: "100%", background: "linear-gradient(135deg, #A855F7, #C084FC, #D946EF)", borderRadius: 99 }} />
              </div>
              <div style={{ width: "60%", height: 6, borderRadius: 99, background: "#2A2A45", overflow: "hidden" }}>
                <div style={{ width: "40%", height: "100%", background: "linear-gradient(90deg, #A855F7, #D946EF)", borderRadius: 99 }} />
              </div>
            </div>
          </Card>

          {/* 4. Glass CTA */}
          <Card title="Floating Glass CTA Panel" tag="GLASS" cat="Hero" desc="backdrop-blur(28px) with translucent violet bg and bright purple border. Premium float.">
            <div style={{ height: 160, borderRadius: 14, background: "linear-gradient(120deg, #35105D, #8B5CF6, #D946EF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "rgba(10,6,25,.35)", backdropFilter: "blur(28px)", border: "1px solid rgba(216,180,255,.3)", borderRadius: 18, padding: "16px 24px", color: "#fff", fontWeight: 700, fontSize: 15, boxShadow: "0 16px 48px rgba(0,0,0,.5), 0 0 40px rgba(168,85,247,.15)" }}>Start Your First Lesson →</div>
            </div>
          </Card>

          {/* 5. Colored Icons */}
          <Card title="Colored KPI Icon Tiles" tag="ICONS" cat="KPI Cards" desc="Each metric gets a distinct colored icon bg: blue/green/purple/orange/cyan. Instant recognition.">
            <div style={{ height: 160, borderRadius: 14, background: "#111127", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 16 }}>
              {[{bg:"rgba(59,130,246,.14)",c:"#3B82F6",i:"📘"},{bg:"rgba(34,197,94,.14)",c:"#22C55E",i:"🌿"},{bg:"rgba(168,85,247,.14)",c:"#A855F7",i:"🧩"},{bg:"rgba(245,158,11,.14)",c:"#F59E0B",i:"🎯"},{bg:"rgba(56,189,248,.14)",c:"#38BDF8",i:"⏱"}].map((x,i)=>(<div key={i} style={{width:40,height:40,borderRadius:10,background:x.bg,color:x.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{x.i}</div>))}
            </div>
          </Card>

          {/* 6. Hero Atmosphere */}
          <Card title="Rich Violet Hero Atmosphere" tag="HERO" cat="Atmosphere" desc="Multi-layer: gradient base + nebula + moon glow + photo + fog + vignette. Cinematic depth.">
            <div style={{ height: 160, borderRadius: 14, background: "linear-gradient(120deg, #35105D 0%, #5b1e9e 40%, #8B5CF6 70%, #D946EF 130%)", boxShadow: "0 0 60px rgba(168,85,247,.20)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 62% 30%, rgba(216,70,239,.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(168,85,247,.30), transparent 45%)" }} />
              <div style={{ position: "absolute", left: "58%", top: "8%", width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #fff 0%, #f0e6ff 30%, #c9a8ff 60%, transparent 72%)", boxShadow: "0 0 60px 20px rgba(216,180,255,.45)" }} />
              <div style={{ position: "relative", zIndex: 2, padding: "20px 30px", color: "#fff", fontWeight: 800, fontSize: 20 }}>Your German learning<br/>journey starts here</div>
            </div>
          </Card>

          {/* 7. Inter Font */}
          <Card title="Inter Font + Premium Typography" tag="FONTS" cat="Typography" desc="Inter (400-800 weights) from Google Fonts. Cleaner rendering, tighter spacing, professional feel.">
            <div style={{ height: 160, borderRadius: 14, background: "#111127", display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, gap: 6 }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>Guten Morgen, admin! 👋</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>Kleine Schritte jeden Tag, große Fortschritte fürs Leben.</p>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(186,120,255,0.6)", margin: 0 }}>SATURDAY, JULY 11</p>
            </div>
          </Card>

          {/* 8. Tip Card Photo */}
          <Card title="Enhanced Tip Card with Illustration" tag="IMAGES" cat="Cards" desc="88×88 rounded tile with radial purple gradient + emoji. Beautiful, theme-matching visuals.">
            <div style={{ height: 160, borderRadius: 14, background: "#111127", display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: 20 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".13em", textTransform: "uppercase", color: "#7C7C95", marginBottom: 8 }}>Tip of the Day</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.4, marginBottom: 10 }}>Review before bed — sleep helps your brain consolidate new vocabulary.</p>
                <span style={{ fontSize: 12, color: "#C084FC" }}>Browse lessons →</span>
              </div>
              <div style={{ width: 88, height: 88, borderRadius: 16, background: "radial-gradient(circle at 40% 35%, rgba(168,85,247,.25), rgba(217,70,239,.12) 60%, transparent)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📖</div>
            </div>
          </Card>

          {/* 9. Branded Shadows */}
          <Card title="Signature Violet Drop Shadow" tag="SHADOWS" cat="Depth" desc="Violet-tinted box-shadows (not black). Cards feel luminous and floating, not heavy.">
            <div style={{ height: 160, borderRadius: 14, background: "#05040F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#111127", borderRadius: 16, padding: "20px 36px", border: "1px solid rgba(186,120,255,0.18)", boxShadow: "0 0 50px rgba(168,85,247,0.2), 0 0 80px rgba(168,85,247,0.08)", color: "#fff", fontWeight: 700 }}>Floating Card</div>
            </div>
          </Card>

          {/* 10. Brand Logo */}
          <Card title="Premium Logo + Brand Mark" tag="BRAND" cat="Identity" desc="Purple gradient 'D' square + bold 'DeutschFlow' with subtle glow. Instantly recognizable.">
            <div style={{ height: 160, borderRadius: 14, background: "rgba(8,7,20,.72)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg, #A855F7, #C084FC, #D946EF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, boxShadow: "0 0 18px rgba(168,85,247,.5)", color: "#fff" }}>D</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>DeutschFlow</span>
            </div>
          </Card>

          {/* 11. Ambient Glow */}
          <Card title="Radial Ambient Page Glow" tag="AMBIENT" cat="Atmosphere" desc="Soft violet radial light at 70% from top. Subtle ambient illumination behind all content.">
            <div style={{ height: 160, borderRadius: 14, background: "radial-gradient(ellipse 900px 500px at 70% -5%, rgba(168,85,247,.10), transparent 60%), #05040F", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 48 }}>🌌</span>
            </div>
          </Card>

          {/* 12. Hover Lift */}
          <Card title="Smooth Card Hover Lift" tag="HOVER" cat="Motion" desc="Cards lift 3px on hover with enhanced purple border glow. 200ms ease — felt, not noticed.">
            <div style={{ height: 160, borderRadius: 14, background: "#111127", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#111127", borderRadius: 16, padding: "18px 32px", border: "1px solid rgba(186,120,255,0.22)", boxShadow: "0 0 45px rgba(168,85,247,.15)", transform: "translateY(-3px)", color: "#fff", fontWeight: 700, transition: "transform .2s ease" }}>Hovering Card ↑</div>
            </div>
          </Card>
        </div>

        {/* Signature Enhancements */}
        <div style={{ marginTop: 40, padding: 32, borderRadius: 20, background: "linear-gradient(135deg, rgba(168,85,247,.08), rgba(217,70,239,.05))", border: "1px solid rgba(186,120,255,0.15)" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8, textAlign: "center" }}>All Applied Enhancements</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, textAlign: "center" }}>These are now live on the dashboard. Every enhancement uses real CSS.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
            {[
              ["✨ Glossy Borders", "Cards use rgba(186,120,255,0.18) with violet glow", "rgba(168,85,247,.14)", "#C084FC"],
              ["🎨 Gradient Accents", "#A855F7→#D946EF on progress, nav, badges", "rgba(217,70,239,.14)", "#D946EF"],
              ["📐 Layered Depth", "Inset highlights + colored shadows on all cards", "rgba(59,130,246,.14)", "#3B82F6"],
              ["🪟 Glassmorphism", "Hero CTA: backdrop-blur(28px) floating panel", "rgba(56,189,248,.14)", "#38BDF8"],
              ["🔤 Inter Font", "Google Fonts Inter, weights 400-800", "rgba(34,197,94,.14)", "#22C55E"],
              ["🌙 Atmospheric Glow", "Radial violet page bg + hero nebula layers", "rgba(245,158,11,.14)", "#F59E0B"],
              ["🖼️ Photo Illustrations", "Tip cards with glowing illustration tiles", "rgba(168,85,247,.14)", "#C084FC"],
              ["💜 Branded Shadows", "Violet-tinted box-shadows, not black", "rgba(217,70,239,.14)", "#D946EF"],
            ].map(([n,d,b,c],i) => (
              <div key={i} style={{ padding: 14, borderRadius: 14, background: "rgba(17,17,39,0.6)", border: "1px solid rgba(186,120,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: b, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: c, flexShrink: 0 }}>{n.split(" ")[0]}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{n.split(" ").slice(1).join(" ")}</p>
                </div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.4, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, tag, cat, desc, children }: { title: string; tag: string; cat: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent 40%), #111127", border: "1px solid rgba(186,120,255,0.18)", borderRadius: 20, padding: 20, boxShadow: "0 0 35px rgba(168,85,247,.08)" }}>
      <div style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden" }}>{children}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={{ background: "linear-gradient(135deg, #A855F7, #D946EF)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 7 }}>{tag}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>{cat}</span>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{title}</h3>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{desc}</p>
    </div>
  );
}
