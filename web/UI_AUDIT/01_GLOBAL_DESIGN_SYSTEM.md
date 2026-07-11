# Global Design System

> **Status:** 🟢 Populated (v1.0.0) · **Version:** 1.0.0 · **Last Updated:** 2026-07-11

> **This is the source of truth.** Every other document in `UI_AUDIT/` inherits the principles defined here and must reference this file rather than redefining global rules. This document defines *principles and system architecture only* — it deliberately avoids concrete values (hex codes, pixel sizes, easing curves), which live in their dedicated documents and asset files.

## Metadata

| Field | Value |
|-------|-------|
| **Purpose** | Define the foundational design language, philosophy, and system rules that govern the entire dashboard. |
| **Scope** | Global principles: philosophy, visual language, hierarchy, elevation, glass, borders, radius, shadow, glow, and cross-cutting rules. Excludes concrete token values and component-specific detail. |
| **Dependencies** | None. This is the root document; all others depend on it. |
| **Related Documents** | Every document in `UI_AUDIT/` (see [§19 Future Documents](#19-future-documents)). |
| **Status** | 🟢 Complete — principles defined; ready to be referenced by downstream documents. |
| **Version** | 1.0.0 |
| **Author** | Design Systems |
| **Last Updated** | 2026-07-11 |
| **Notes** | Concrete values are intentionally deferred. See cross-references throughout. |

## Table of Contents

1. [Purpose](#1-purpose)
2. [Design Philosophy](#2-design-philosophy)
3. [Visual Language](#3-visual-language)
4. [Visual Hierarchy](#4-visual-hierarchy)
5. [Component Philosophy](#5-component-philosophy)
6. [Elevation System](#6-elevation-system)
7. [Glassmorphism](#7-glassmorphism)
8. [Border Philosophy](#8-border-philosophy)
9. [Corner Radius System](#9-corner-radius-system)
10. [Shadow System](#10-shadow-system)
11. [Glow System](#11-glow-system)
12. [Color Philosophy](#12-color-philosophy)
13. [Typography Philosophy](#13-typography-philosophy)
14. [Layout Philosophy](#14-layout-philosophy)
15. [Motion Philosophy](#15-motion-philosophy)
16. [Accessibility Philosophy](#16-accessibility-philosophy)
17. [Design Rules](#17-design-rules)
18. [Common Mistakes](#18-common-mistakes)
19. [Future Documents](#19-future-documents)
20. [Summary](#20-summary)

---

## 1. Purpose

The design system exists to make the dashboard feel like **one product built by one team**, not a collection of independently designed screens. It is the shared vocabulary — the agreed-upon set of principles, patterns, and constraints — that every surface, component, and interaction is measured against.

**Why consistency matters.** Consistency is not an aesthetic preference; it is a usability guarantee. When a card, a button, or a glow behaves the same way everywhere, the learner stops *learning the interface* and starts *learning German*. Predictability reduces cognitive load, builds trust, and lets attention flow to content rather than chrome. Inconsistency does the opposite: every small deviation forces the eye to re-interpret the screen, and the product begins to feel unstable and amateur — regardless of how polished any single element is.

**Inheritance model.** Every component inherits from this document. A card does not decide its own border treatment; it inherits the [Border Philosophy](#8-border-philosophy). A button does not invent its own elevation; it inherits the [Elevation System](#6-elevation-system). When a downstream document needs a global rule, it **references this file** rather than restating it. This keeps a single source of truth: change a principle here, and the whole system changes coherently.

> **Principle:** *Decide once, apply everywhere.* If a rule appears in two documents, one of them is wrong.

---

## 2. Design Philosophy

The dashboard should feel **premium, modern, confident, minimal, futuristic, AI-first, educational, highly structured, elegant, readable, and professional.** Each of these is a deliberate target, not a mood-board adjective.

| Quality | What it means here | How we achieve it |
|---------|--------------------|-------------------|
| **Premium** | The product feels considered and expensive. | Restraint, precise alignment, soft light, generous space. |
| **Modern** | It looks like 2026, not 2016. | Dark surfaces, glass, ambient gradients, subtle motion. |
| **Confident** | Nothing apologizes for its presence; nothing shouts. | Clear hierarchy, decisive spacing, few but strong accents. |
| **Minimal** | Only what earns its place remains. | Remove decoration that doesn't communicate. |
| **Futuristic** | Suggests intelligence and forward motion. | Neon-purple ambient light, glow-based depth. |
| **AI-first** | Feels like a thinking companion, not a form. | Calm surfaces, focus-supporting light, conversational tone. |
| **Educational** | Supports sustained reading and focus. | High contrast for text, low visual noise. |
| **Highly structured** | Everything sits on an invisible grid. | Consistent rhythm, alignment, and modular blocks. |
| **Elegant** | Details resolve quietly and correctly. | Consistent radii, hairline borders, soft shadows. |
| **Readable** | Text is never the weak point. | Contrast discipline, hierarchy, whitespace. |
| **Professional** | It could ship at Linear or Vercel. | System-level consistency over one-off flourishes. |

**What the dashboard is *never*:**

- **Never playful** — no bouncy motion, no novelty, no gimmicks. Learning is the reward; the UI should not compete for delight.
- **Never cartoonish** — no thick outlines, no candy colors, no oversized rounded blobs. Illustrations are flat and restrained.
- **Never flashy** — no aggressive animation, no rainbow gradients, no decoration for its own sake.

> **Why.** The audience is a focused learner spending long sessions with the product. Playful or flashy interfaces are fatiguing and erode credibility over time. A calm, premium, structured surface signals competence and lets the learner trust the tool — exactly the emotional posture an educational, AI-first product needs.

---

## 3. Visual Language

The visual identity is a **dark, glass, ambient-purple** aesthetic — cinematic where it should be (imagery), and clinically clean where it must be (functional UI).

**Dark theme philosophy.** The base is a deep navy, never pure black. True black is harsh, flattens depth, and produces uncomfortable contrast with glowing accents. A dark-navy foundation absorbs ambient purple light gracefully, makes surfaces feel like layered glass floating in space, and keeps long reading sessions comfortable.

**Glassmorphism.** Elevated surfaces read as frosted glass — subtle translucency, background blur, and a faint bright inner edge. Glass communicates layering without heavy borders or shadows. (See [§7 Glassmorphism](#7-glassmorphism).)

**Subtle translucency.** Transparency is measured and intentional, used to imply that a surface sits *above* an ambient background, never so much that legibility suffers.

**Layered gradients.** Depth comes from stacked, low-contrast gradients — surface tints, radial ambient light, and directional sheen — rather than from opaque fills. Gradients are atmospheric, not decorative.

**Purple ambient lighting.** A signature neon-purple glow washes the environment like light from an off-screen source. It unifies the palette, creates a sense of place, and gives the product its identity.

**Soft glows.** Emphasis is created by light, not by weight. A gentle purple bloom around a focal element draws the eye without adding mass.

**Minimal shadows.** Shadows exist only to seat elements softly; they are diffuse and low-opacity, never dark slabs. (See [§10 Shadow System](#10-shadow-system).)

**Rounded geometry.** Consistent, moderate corner radii make the interface feel modern and friendly-but-serious. (See [§9 Corner Radius System](#9-corner-radius-system).)

**Clean spacing, balanced whitespace, high readability.** Space is a first-class material. Generous, rhythmic spacing gives content room to breathe, reinforces grouping, and is the primary tool for making the dashboard feel premium.

> **Identity in one line:** *Frosted-glass surfaces, floating in a deep-navy space, lit by ambient neon purple.*

---

## 4. Visual Hierarchy

Attention flows top-to-bottom through intentional tiers. Each region has a defined role and a defined visual weight; nothing competes with the level above it.

```
        ┌─────────────────────────────┐
        │ Navbar        (orientation)  │  ← quiet, persistent, recessive
        ├─────────────────────────────┤
        │ Greeting      (identity)     │  ← personal, warm, secondary
        ├─────────────────────────────┤
        │ Hero          (anchor)       │  ← DOMINANT visual anchor
        ├─────────────────────────────┤
        │ Today's Plan  (action)       │  ← primary next steps
        ├─────────────────────────────┤
        │ Progress      (status)       │  ← self-assessment
        ├─────────────────────────────┤
        │ KPI           (analytics)    │  ← unified metric grid
        ├─────────────────────────────┤
        │ Bottom Cards  (support)      │  ← activity + tips, lowest weight
        └─────────────────────────────┘
```

**Why this order exists:**

1. **Navbar first, but quietest.** Orientation must always be available, but it is infrastructure. It never draws focus. (Detailed in [07_NAVBAR.md](./07_NAVBAR.md).)
2. **Greeting establishes identity.** A brief, human moment ("Guten Morgen") personalizes the session before work begins. (See [08_HEADER_AND_TOP_STATS.md](./08_HEADER_AND_TOP_STATS.md).)
3. **Hero is the dominant anchor.** It is the emotional and directional center of the page — the largest surface, the richest lighting, the clearest call to action. Everything else is calibrated *below* it. (See [09_HERO_BANNER.md](./09_HERO_BANNER.md).)
4. **Today's Plan turns intent into action.** Immediately after the hero motivates, the plan tells the learner exactly what to do next. (See [10_TODAYS_PLAN.md](./10_TODAYS_PLAN.md).)
5. **Progress provides orientation-in-the-journey.** Where am I? (See [11_PROGRESS_AND_KPI.md](./11_PROGRESS_AND_KPI.md).)
6. **KPI reads as one analytics instrument**, not six unrelated widgets — a scannable grid of status.
7. **Bottom cards support without demanding.** Recent activity and tips are useful but never urgent; they carry the least weight. (See [13_BOTTOM_SECTION.md](./13_BOTTOM_SECTION.md).)

> **Rule:** A lower tier must never out-shout a higher tier. If the KPI grid visually competes with the hero, the hierarchy is broken. Detailed hierarchy mechanics live in [02_VISUAL_HIERARCHY.md](./02_VISUAL_HIERARCHY.md).

---

## 5. Component Philosophy

The dashboard is assembled from a small set of **reusable primitives**. Every repeated component is built from the same construction principles so that learning one instance teaches all instances.

Core primitives governed by this system:

- **Cards** — the fundamental container. One padding rhythm, one radius family, one border and glow treatment. (See [assets/cards.md](./assets/cards.md).)
- **Buttons** — instantly recognizable, with a clear primary/secondary/ghost distinction. (See [assets/buttons.md](./assets/buttons.md).)
- **Inputs** — glass surfaces with consistent radius and focus treatment. (See [assets/inputs.md](./assets/inputs.md).)
- **Navigation** — persistent, recessive, with a single clear active state. (See [assets/navigation.md](./assets/navigation.md).)
- **Badges & Tags** — compact status/labels sharing one radius and tint logic. (See [assets/colors.md](./assets/colors.md).)
- **Progress Rings** — circular progress with consistent stroke, track, and gradient logic.
- **Icons** — uniform sizing, always seated inside a rounded container, never floating raw on a surface. (See [assets/iconography.md](./assets/iconography.md).)
- **Illustrations** — flat, restrained, purple-gradient vector art. (See [assets/illustrations.md](./assets/illustrations.md).)

**Construction principles that apply to every component:**

1. **Same anatomy** — a component's parts (icon container → label → value → description → affordance) appear in the same order everywhere.
2. **Same materials** — identical border, radius, and glow language inherited from this document.
3. **Same states** — default, hover, focus, active, and disabled behave consistently across the library.
4. **Composition over variation** — new needs are met by composing existing primitives, not by inventing new ones.

> **Principle:** *If two components do the same job, they should look and behave the same way.* The catalog of components and their variants is maintained in [14_COMPONENT_LIBRARY.md](./14_COMPONENT_LIBRARY.md).

---

## 6. Elevation System

Elevation communicates *what sits above what*. In this system, elevation is achieved primarily through **light, contrast, and layering — not heavy shadows.**

```
Elevation ladder (lowest → highest):

  Background        deep-navy ambient space, faint radial purple wash
      ↓
  Cards             translucent glass surface, hairline border, faint glow
      ↓
  Raised Cards      slightly brighter surface + marginally stronger glow
      ↓
  Hero              richest lighting, largest surface, strongest ambient bloom
      ↓
  Buttons           solid accent fill, self-lit with purple glow
      ↓
  Hover             temporary lift: brighter border + intensified glow
```

**How elevation is achieved:**

- **Glow** — higher elements carry a slightly stronger ambient bloom.
- **Contrast** — a raised surface is a touch brighter than the one beneath it.
- **Borders** — a marginally more visible hairline edge separates a raised layer.
- **Brightness** — surface tint increases subtly with elevation.
- **Layering** — translucency lets a higher surface read as floating *over* the ambient background.

**How elevation is *not* achieved:** by stacking dark, hard-edged drop shadows. Heavy shadows contradict the dark, luminous aesthetic and make surfaces feel pasted-on rather than lit.

> **Note:** Elevation deltas are intentionally *small*. The difference between a card and a raised card should be felt, not announced. Concrete elevation mapping lives in [assets/elevation.md](./assets/elevation.md).

---

## 7. Glassmorphism

Glassmorphism is the primary way surfaces express layering.

**Its ingredients:**

- **Transparency** — the surface lets a hint of the ambient background through, implying it floats above it.
- **Blur** — the background seen through the surface is blurred, producing a frosted-glass read and preserving legibility of foreground content.
- **Border opacity** — a faint, low-opacity edge (purple-tinted, never bright white) defines the pane. (See [§8 Border Philosophy](#8-border-philosophy).)
- **Reflection** — a subtle brighter sheen along the top edge suggests light catching glass.
- **Ambient lighting** — the surface picks up the environment's purple glow, tying it to the scene.

**When to use glass:**

- Elevated containers that should feel like they float (hero CTA card, floating panels, the navbar surface).
- Surfaces layered directly over rich imagery or gradients, where blur aids legibility.

**When *not* to use glass:**

- Dense, text-heavy functional cards where maximum legibility and performance matter more than atmosphere — a solid (or near-solid) surface is calmer and clearer.
- Deeply nested elements — stacking many translucent layers muddies contrast and hurts readability.
- Anywhere blur would reduce text contrast below accessible thresholds. (See [16_ACCESSIBILITY.md](./16_ACCESSIBILITY.md).)

> **Warning:** Glass is a seasoning, not a base. Overusing translucency produces a hazy, low-contrast interface. Reach for it to signal *floating and special*, not as the default for every card.

---

## 8. Border Philosophy

Borders define surfaces quietly.

- **Thin** — borders are hairline-weight. They separate; they do not frame.
- **Purple-tinted** — borders carry a faint purple tint so they belong to the ambient palette rather than fighting it.
- **Low opacity** — the edge is barely-there in the resting state, becoming slightly more present on hover to signal interactivity.
- **Consistent** — the same border treatment applies to every card, input, and glass surface, so the whole interface feels cut from one material.

**Absolute rule: no harsh white borders.** A bright, opaque white outline is the single fastest way to make this aesthetic look cheap. Borders are soft, tinted, and recessive. (Concrete opacity/tint values live in [assets/borders.md](./assets/borders.md).)

> **Principle:** *A border should be noticed only when you look for it.*

---

## 9. Corner Radius System

Consistent corner radius is one of the strongest signals of a designed-as-a-system product. Mismatched radii — even by a few pixels — read as accidental and break the sense of craft.

**Radius hierarchy (largest → smallest):**

```
Large cards / hero   ──►  most generous radius   (soft, premium containers)
Buttons              ──►  medium radius          (approachable, tappable)
Inputs               ──►  medium radius          (matches buttons for pairing)
Badges / pills       ──►  small–to–pill radius   (compact labels)
Icon containers      ──►  small radius           (tight rounded squares)
```

**Principles:**

- Radii come from a **single defined scale**, not ad-hoc values. (Scale lives in [assets/radii.md](./assets/radii.md).)
- Radius should scale *loosely* with element size — larger surfaces take larger radii — but always snap to the defined scale.
- Nested elements use an equal-or-smaller radius than their container; a child never appears rounder than its parent.

> **Rule:** Two cards on the same screen must never have different corner radii. If they do, it is a bug.

---

## 10. Shadow System

Shadows in this system are **atmospheric, not structural.**

- **Soft ambient shadows** — diffuse, wide, and low-opacity, used only to gently seat a surface in space.
- **Purple-tinted shadows** — where a shadow reads as colored light, it leans toward the ambient purple rather than neutral gray/black, reinforcing the "lit environment" identity.
- **No harsh black shadows** — hard, dark drop shadows are prohibited; they contradict the luminous dark theme and flatten the glass aesthetic.
- **No heavy elevation** — shadows never do the job of borders or contrast. Depth comes from the [Elevation System](#6-elevation-system) and the [Glow System](#11-glow-system); shadow is a supporting whisper.

> **Note:** If a shadow is visible as a distinct dark shape, it is too strong. Concrete shadow tokens live in [assets/shadows.md](./assets/shadows.md).

---

## 11. Glow System

Glow is the signature depth-and-emphasis tool of this design language. It replaces the work that heavy shadows do in conventional UIs.

| Glow type | Role |
|-----------|------|
| **Primary glow** | The ambient purple wash that establishes the environment and unifies the palette. |
| **Hero glow** | The strongest, most cinematic bloom, marking the hero as the dominant anchor. |
| **Button glow** | A self-lit halo that makes primary actions feel active and reachable. |
| **Navigation glow** | A restrained highlight on the active nav item — just enough to confirm location. |
| **Hover glow** | A temporary intensification on interaction, signaling responsiveness. |
| **Icon glow** | A faint tint behind an icon container, tying it to its semantic color. |

**Governing principle:** *Glow supports focus; it never dominates it.* Glow guides the eye toward the current focal point and reinforces the hierarchy in [§4](#4-visual-hierarchy). The moment glow becomes the subject — competing accents, everything blooming at once — it stops guiding and starts distracting.

> **Rule:** Only one element should carry the strongest glow on a given screen (normally the hero or the primary action). Everything else glows *less*.

---

## 12. Color Philosophy

> **Scope guard:** This section defines the *roles* color plays. It does **not** define color values. All concrete values — hex codes, opacities, gradients, contrast pairs — are defined in **[04_COLOR_SYSTEM.md](./04_COLOR_SYSTEM.md)** and **[assets/colors.md](./assets/colors.md)**. Downstream documents must reference those, never hard-code color.

Color is used sparingly and semantically. In a dark, minimal environment, a little color carries a lot of meaning.

- **Primary Accent** — the brand's signature action color; used for primary buttons, active navigation, key highlights, and progress. It is the loudest color and therefore the rarest.
- **Secondary Accent** — a lighter/brighter companion to the primary, used in gradients, glows, heading emphasis, and hover states.
- **Success** — reserved for completion, correctness, and positive learning outcomes (e.g., vocabulary mastered).
- **Warning** — reserved for accuracy, streak jeopardy, and attention-worthy states.
- **Information** — reserved for neutral informational accents such as time and learning cues.
- **Surface colors** — the family of dark-navy backgrounds and glass tints that form the environment and containers.
- **Semantic colors** — a fixed set where each hue means one thing, everywhere. A color's meaning is never overloaded.

> **Principle:** *Color is meaning, not decoration.* Saturated color appears only as a semantic accent — never as arbitrary styling. Full role→value mapping: [04_COLOR_SYSTEM.md](./04_COLOR_SYSTEM.md).

---

## 13. Typography Philosophy

> **Scope guard:** No font sizes, weights, or families are defined here. Those live in **[05_TYPOGRAPHY.md](./05_TYPOGRAPHY.md)** and **[assets/typography.md](./assets/typography.md)**.

Typography expresses hierarchy through **relationships**, not decoration.

- **Hierarchy over ornament** — headings, section labels, titles, metrics, and body text form clear, repeatable tiers. The reader always knows what is a heading, what is a label, and what is a value.
- **Restraint** — a small number of styles, used consistently, communicates more clearly than many bespoke treatments.
- **Readability first** — in an educational product, sustained legibility outranks stylistic flourish. Contrast and rhythm serve reading.
- **Consistency** — the same text role uses the same style everywhere; a "section label" looks identical in every section.

> **Principle:** *Type hierarchy should be legible with the colors removed.* Weight, size, and spacing alone must convey structure. See [05_TYPOGRAPHY.md](./05_TYPOGRAPHY.md).

---

## 14. Layout Philosophy

> **Scope guard:** Concrete spacing scale, grid columns, and breakpoints are defined in **[06_SPACING_GRID_LAYOUT.md](./06_SPACING_GRID_LAYOUT.md)** and **[assets/spacing.md](./assets/spacing.md)** / **[assets/grid.md](./assets/grid.md)**.

Layout is where "highly structured" is earned.

- **Grid** — every element aligns to a single underlying grid. Nothing is placed by eye. The grid is the reason the dashboard feels intentional rather than assembled from independent widgets.
- **Spacing** — space follows a consistent rhythm drawn from a fixed scale. Related elements sit closer; unrelated elements sit farther apart (proximity = grouping).
- **Alignment** — shared edges and baselines run across the whole page. Misalignment, even slight, is the most common tell of an amateur layout.
- **Margins** — consistent outer margins frame the page and keep content off the edges.
- **Whitespace** — treated as an active material, not leftover space. Balanced whitespace is the primary driver of the premium feel.

> **Principle:** *If it doesn't sit on the grid, it doesn't ship.* See [03_LAYOUT_BLUEPRINT.md](./03_LAYOUT_BLUEPRINT.md) and [06_SPACING_GRID_LAYOUT.md](./06_SPACING_GRID_LAYOUT.md).

---

## 15. Motion Philosophy

> **Scope guard:** Concrete timings, easing curves, and animation tokens live in **[15_INTERACTIONS_AND_ANIMATIONS.md](./15_INTERACTIONS_AND_ANIMATIONS.md)** and **[assets/animations.md](./assets/animations.md)**.

Motion confirms interaction; it never performs.

- **Subtle animations** — motion is small in amplitude and short in duration. It acknowledges an action and then gets out of the way.
- **Hover** — hover states lift gently: a brighter border, a touch more glow. Elements never jump, bounce, or animate aggressively.
- **Micro-interactions** — small, purposeful responses (a control acknowledging a click) reinforce that the product is alive and responsive.
- **Smooth transitions** — state changes ease rather than snap, keeping the interface calm.
- **Never distracting** — if an animation pulls attention away from content, it is wrong. Motion serves focus.

> **Principle:** *The best motion is felt, not watched.* Respect reduced-motion preferences (see [16_ACCESSIBILITY.md](./16_ACCESSIBILITY.md)). Full spec: [15_INTERACTIONS_AND_ANIMATIONS.md](./15_INTERACTIONS_AND_ANIMATIONS.md).

---

## 16. Accessibility Philosophy

> **Scope guard:** Standards, contrast targets, and test procedures live in **[16_ACCESSIBILITY.md](./16_ACCESSIBILITY.md)**.

Accessibility is a design constraint from the start, not a retrofit.

- **Contrast** — text and essential UI must meet accessible contrast against their surfaces. The dark, glass aesthetic must never win at legibility's expense; contrast is non-negotiable.
- **Keyboard navigation** — every interactive element is reachable and operable by keyboard, in a logical order.
- **Focus indicators** — focus is always visible and unambiguous, expressed in the system's glow/border language so it feels native rather than bolted-on.
- **Readability** — type sizing, spacing, and contrast support long, comfortable reading sessions for a learning audience.

> **Principle:** *If the aesthetic and accessibility conflict, accessibility wins — then we make it beautiful within that constraint.* See [16_ACCESSIBILITY.md](./16_ACCESSIBILITY.md).

---

## 17. Design Rules

A checklist-grade set of rules. Every screen and component is measured against these.

**Layout & grid**
1. Every card and element aligns to the underlying grid.
2. Maintain a consistent spacing rhythm drawn from the defined scale.
3. Shared edges and baselines must align across the page.
4. Outer page margins are consistent on every screen.
5. No floating elements without a clear purpose.
6. Proximity encodes grouping: related items sit closer, unrelated items farther.

**Shape & surface**
7. No inconsistent border radii — all radii come from the defined scale.
8. A child element is never rounder than its parent.
9. All cards share one padding rhythm; identical card types have identical padding.
10. Borders are thin, purple-tinted, and low-opacity — never harsh white.
11. Surfaces feel cut from one material: same border, radius, and glow language.

**Light, glow & elevation**
12. Glow must always support hierarchy, never dominate it.
13. Only one element carries the strongest glow on a given screen.
14. Elevation is achieved through light, contrast, and layering — not heavy shadows.
15. No harsh black shadows; shadows are soft, diffuse, and low-opacity.
16. Elevation deltas between adjacent layers stay subtle.

**Color**
17. Never use saturated color outside its semantic accent role.
18. A semantic color means exactly one thing, everywhere.
19. Never hard-code color; reference the color system.
20. The primary accent is the rarest, loudest color — used only for true priorities.

**Typography**
21. Typography must follow the defined hierarchy.
22. The same text role uses the same style everywhere.
23. Hierarchy must remain legible with color removed.
24. Avoid oversized typography that breaks rhythm or shouts.

**Components**
25. Buttons must be immediately recognizable as buttons.
26. Repeated components share identical construction and states.
27. Meet new needs by composing existing primitives, not inventing new ones.
28. Icons are uniformly sized and always seated in a rounded container.

**Hierarchy & focus**
29. The hero remains the dominant visual anchor.
30. Navigation must never compete with the hero.
31. KPI cards function as a single unified analytics grid, not isolated widgets.
32. A lower hierarchy tier never out-shouts a higher one.
33. Cards on the same screen should feel related, like a family.

**Motion & interaction**
34. Motion is subtle, short, and purposeful — never distracting.
35. Hover lifts gently (border + glow); elements never bounce or jump.
36. Respect reduced-motion preferences.

**Discipline**
37. Avoid unnecessary visual noise; remove anything that doesn't communicate.
38. Never introduce a one-off value when a system token exists.
39. Accessibility constraints outrank aesthetic preferences.
40. When in doubt, choose restraint.

---

## 18. Common Mistakes

Anti-patterns that violate the system. Treat any of these as a defect.

| Mistake | Why it's wrong | Correct approach |
|---------|----------------|------------------|
| **Random spacing** | Breaks rhythm; the page feels assembled by accident. | Use the fixed spacing scale ([06](./06_SPACING_GRID_LAYOUT.md)). |
| **Mixed border radii** | Destroys the sense of one designed system. | Snap all radii to the scale ([assets/radii.md](./assets/radii.md)). |
| **Heavy shadows** | Contradicts the luminous dark aesthetic; looks pasted-on. | Use glow, contrast, and layering ([§6](#6-elevation-system), [§11](#11-glow-system)). |
| **Inconsistent icon sizes** | Reads as careless; disrupts alignment. | Uniform icon sizing in rounded containers ([assets/iconography.md](./assets/iconography.md)). |
| **Misaligned cards** | The fastest tell of an amateur layout. | Align everything to the grid ([§14](#14-layout-philosophy)). |
| **Flat gradients** | Dead, lifeless surfaces with no depth. | Layered, low-contrast ambient gradients ([§3](#3-visual-language)). |
| **Random colors** | Color loses meaning; the palette fragments. | Semantic color only ([§12](#12-color-philosophy)). |
| **Different card padding** | Same components look unrelated. | One padding rhythm per card type ([assets/cards.md](./assets/cards.md)). |
| **Oversized typography** | Shouts, breaks hierarchy and rhythm. | Follow the type scale ([05](./05_TYPOGRAPHY.md)). |
| **Visual clutter** | Raises cognitive load; erodes the premium feel. | Remove non-communicating decoration ([§2](#2-design-philosophy)). |
| **Harsh white borders** | Cheapens the whole aesthetic instantly. | Thin, purple-tinted, low-opacity edges ([§8](#8-border-philosophy)). |
| **Glow everywhere** | Nothing stands out when everything glows. | One dominant glow per screen ([§11](#11-glow-system)). |

---

## 19. Future Documents

How responsibility is divided across the `UI_AUDIT/` repository. Each document owns its concern; this document owns the principles they all inherit.

**Foundations**
- [00 · README](./README.md) — project purpose, philosophy, reading order, standards, and conventions.
- **01 · Global Design System** *(this document)* — root principles and system architecture.
- [02 · Visual Hierarchy](./02_VISUAL_HIERARCHY.md) — mechanics of attention, emphasis, and z-order.
- [03 · Layout Blueprint](./03_LAYOUT_BLUEPRINT.md) — page skeleton, regions, and breakpoint map.
- [04 · Color System](./04_COLOR_SYSTEM.md) — **all** color values, gradients, and contrast pairs.
- [05 · Typography](./05_TYPOGRAPHY.md) — font families, type scale, weights, spacing.
- [06 · Spacing, Grid & Layout](./06_SPACING_GRID_LAYOUT.md) — spacing scale, grid, alignment rules.

**Sections**
- [07 · Navbar](./07_NAVBAR.md) — top navigation anatomy and states.
- [08 · Header & Top Stats](./08_HEADER_AND_TOP_STATS.md) — greeting block and stat cards.
- [09 · Hero Banner](./09_HERO_BANNER.md) — the dominant anchor and its CTA.
- [10 · Today's Plan](./10_TODAYS_PLAN.md) — the three action cards.
- [11 · Progress & KPI](./11_PROGRESS_AND_KPI.md) — progress card and the unified KPI grid.
- [12 · Review & Practice](./12_REVIEW_AND_PRACTICE.md) — the review/practice cards.
- [13 · Bottom Section](./13_BOTTOM_SECTION.md) — recent activity and tip of the day.

**Systems**
- [14 · Component Library](./14_COMPONENT_LIBRARY.md) — catalog of primitives, variants, and states.
- [15 · Interactions & Animations](./15_INTERACTIONS_AND_ANIMATIONS.md) — motion, hover, transitions.
- [16 · Accessibility](./16_ACCESSIBILITY.md) — standards, contrast, keyboard, focus, testing.
- [17 · Visual Effects](./17_VISUAL_EFFECTS.md) — glass, glow, bloom, gradients, blend modes.
- [18 · Responsive Behavior](./18_RESPONSIVE_BEHAVIOR.md) — breakpoints and reflow.

**Verification**
- [19 · Final Gap Analysis](./19_FINAL_GAP_ANALYSIS.md) — open questions, gaps, risks, sign-off.
- [20 · Implementation Checklist](./20_IMPLEMENTATION_CHECKLIST.md) — build/QA checklist.

**Supporting folders**
- [`assets/`](./assets/) — token references: colors, gradients, shadows, borders, spacing, typography, iconography, illustrations, buttons, cards, inputs, navigation, animations, elevation, grid, radii, glossary.
- [`diagrams/`](./diagrams/) — ASCII diagrams: page layout, navbar, hero, KPI, component relationships, spacing, hierarchy map.
- [`checklists/`](./checklists/) — per-area verification checklists and final review.

---

## 20. Summary

The dashboard is a **premium, AI-first educational interface**: frosted-glass surfaces floating in a deep-navy space, lit by ambient neon-purple. It feels modern, confident, minimal, and highly structured — and it is *never* playful, cartoonish, or flashy, because its job is to earn a focused learner's trust over long sessions.

Depth comes from **light, not weight**: subtle translucency, layered gradients, soft glows, hairline purple-tinted borders, and a consistent corner-radius family — with heavy shadows deliberately avoided. Emphasis is created by glow that *supports* focus rather than competing for it, with a single dominant glow per screen.

Everything sits on **one invisible grid** with a consistent spacing rhythm and balanced whitespace, which is what makes the product feel intentional rather than assembled. Attention flows in a deliberate hierarchy — Navbar → Greeting → **Hero (the anchor)** → Today's Plan → Progress → KPI → Bottom Cards — and no lower tier is ever allowed to out-shout a higher one.

Color and type are treated as **meaning and structure**, not decoration: saturated color appears only in fixed semantic roles, and typographic hierarchy stays legible with the color removed. Motion is small and purposeful, accessibility is a first-class constraint, and every repeated component is built from the same primitives with the same states.

**In one sentence:** *A calm, luminous, glass-and-purple system where consistency is the feature, light does the work of shadow, and the hero always leads.*

> Concrete values are intentionally not defined here. For any specific number, follow the cross-reference to the owning document.

---

## Change Log

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0.0 | 2026-07-11 | Design Systems | Fully populated the global design system: philosophy, visual language, hierarchy, elevation, glass, borders, radius, shadow, glow, color/type/layout/motion/a11y philosophy, 40 design rules, common mistakes, future-document map, and summary. |
| 0.1.0 | 2026-07-11 | TODO | Initial framework scaffold — headings & TODO placeholders only. |
