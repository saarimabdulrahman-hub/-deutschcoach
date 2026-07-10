# DeutschFlow — Design System

**Version:** 1.0
**Last Updated:** 2026-07-11
**Source of Truth:** `web/app/globals.css`, `web/contexts/ThemeContext.tsx`, `web/tailwind.config.ts`

---

## Overview

DeutschFlow uses a **CSS-custom-property theming system** with 15 color themes. Every component references semantic CSS variables (`--color-text`, `--color-card-bg`, etc.) rather than hardcoded color values. This enables runtime theme switching without recompilation.

The base framework is **Tailwind CSS v4** with the `@import "tailwindcss"` directive (no `@tailwind base/components/utilities`). Custom CSS lives in `web/app/globals.css`.

---

## Color Palette

### Semantic Tokens

These are the ONLY color tokens components should reference. Never use raw hex values in components.

```
--color-page-bg         Page background
--color-card-bg         Card, modal, dropdown surface
--color-border          Borders, dividers
--color-text            Primary text, headings
--color-text-muted      Secondary/muted text, placeholders
--color-text-secondary  Body text, descriptions
--color-hover-bg        Hover state background
--color-active-bg       Active/selected state background
--color-active-text     Active/selected state text
--color-badge-bg        Badge/chip background
--color-badge-text      Badge/chip text
--color-accent          Primary accent (borders, icons)
--color-accent-light    Light accent variant
--color-accent-dark     Dark accent variant
--color-accent-gradient Accent gradient (buttons, progress bars)
--color-accent-glow     Accent glow/shadow
--color-sidebar-bg      Sidebar background
--color-header-bg       Header background
--color-input-bg        Input field background
--color-input-border    Input field border
--color-input-focus     Input field focus ring
--color-error-bg        Error state background
--color-error-border    Error state border
--color-error-text      Error state text
--color-success         Success state (green)
--color-warning         Warning state (amber)
--color-skeleton        Skeleton loading animation
```

### Theme Variants

15 dark-mode themes available:

| Theme | Accent | Character |
|-------|--------|-----------|
| Indigo (default) | `#6366f1` | Professional, calm |
| Ocean | `#0ea5e9` | Fresh, modern |
| Steel | `#64748b` | Neutral, minimal |
| Onyx | `#e5e5e5` | High contrast, bold |
| Mono | `#a3a3a3` | Grayscale, focused |
| Amber | `#d97706` | Warm, energetic |
| Sunset | `#f97316` | Vibrant, creative |
| Copper | `#e6a040` | Earthy, grounded |
| Cherry | `#dc2626` | Intense, passionate |
| Rose | `#e11d48` | Soft, elegant |
| Plum | `#a855f7` | Rich, luxurious |
| Lavender | `#8b5cf6` | Gentle, creative |
| Emerald | `#059669` | Natural, balanced |
| Forest | `#4ade80` | Bright, fresh |
| Mint | `#14b8a6` | Cool, refreshing |

**Usage:** Import `THEME_LIST` from `@/contexts/ThemeContext` for theme picker UIs. Never hardcode the theme list.

---

## Typography

### Font Family

```css
font-family: system-ui, -apple-system, sans-serif;
```

System font stack — no web font loading. Optimized for readability on all platforms.

### Type Scale

| Token | Mobile | Desktop | Usage |
|-------|--------|---------|-------|
| `text-3xl` (30px) | `sm:text-3xl` | `text-3xl` | Page titles |
| `text-2xl` (24px) | Default | Default | Section headings, dashboard stats |
| `text-xl` (20px) | Default | Default | Card titles, branding |
| `text-base` (16px) | Default | Default | Body text (rarely used) |
| `text-sm` (14px) | Default | Default | Primary body text, buttons, labels |
| `text-xs` (12px) | Default | Default | Secondary text, captions, badges |
| `text-[10px]` | Default | Default | Micro-labels, tab bar |

**Rule:** Use responsive prefixes (`sm:text-3xl text-2xl`) for page titles. Body text should remain `text-sm` site-wide.

### Font Weights

- **Bold** (`font-bold`): Headings, stat numbers, active nav items
- **Semibold** (`font-semibold`): Card titles, button text, labels
- **Medium** (`font-medium`): Supporting text, links
- **Normal** (default): Body text, descriptions
- **Light** (`font-light`): Branding text ("Deutsch" in header logo)

### Tracking

- `tracking-wider`: Uppercase micro-labels (badges, section headers)
- `tracking-widest`: Date labels, brand accent text
- `tracking-[1px]`: Brand name in header

---

## Spacing System

### Section Spacing

All pages use `space-y-6 sm:space-y-8` as their root container spacing. Individual sections may use tighter spacing where appropriate.

| Context | Mobile | Desktop |
|---------|--------|---------|
| Page root | `space-y-6` | `sm:space-y-8` |
| Card grid gaps | `gap-3` or `gap-4` | `sm:gap-4` or `gap-4` |
| Card internal padding | `p-4` or `p-5` | `sm:p-5` or `sm:p-6` |
| Header padding | `px-4` | `sm:px-6` |
| Main content padding | `p-4` | `sm:p-6` |
| Bottom padding (mobile nav) | `pb-20` | `sm:pb-6` |

### Maximum Content Width

- Page container: `max-w-7xl` (1280px), centered with `mx-auto`
- Lesson content: no max-width beyond page container (fills available space)
- Wide screens: content is centered, not stretched to viewport edge

---

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | `rounded-2xl` (16px) |
| Hero cards | `rounded-3xl` (24px) or `rounded-[2rem]` (32px) |
| Buttons | `rounded-xl` (12px) |
| Input fields | `rounded-xl` (12px) |
| Badges, pills | `rounded-full` |
| Icon containers | `rounded-xl` (12px) |
| Modals, dropdowns | `rounded-xl` (12px) |

**Rule:** No `rounded-sm`, `rounded-md`, or `rounded-lg`. Stick to `rounded-xl` and `rounded-2xl` for consistency.

---

## Shadows & Elevation

DeutschFlow is a dark-theme app. Shadows are used sparingly — primarily for hover states and modal elevation. The page itself is flat.

| Context | Value |
|---------|-------|
| Card hover lift | `hover:-translate-y-0.5` (2px lift, no shadow) |
| Primary button glow | `boxShadow: "0 4px 20px rgba(124,58,237,0.3)"` |
| Dropdown menu | `boxShadow: "0 10px 25px rgba(0,0,0,0.3)"` |
| Active stat card | `boxShadow: "0 0 0 3px rgba(124,58,237,0.12)"` (outline glow) |

**Rule:** Avoid heavy box-shadows on static elements. Use them only for floating UI (dropdowns, modals) and interactive feedback (hover, focus).

---

## Iconography

### Shared Icons

Located in `web/components/ui/Icons.tsx`. Use these exported components instead of inline SVGs:

```
Check, ChevronDown, Search, ArrowLeft, ArrowRight,
Play, Pause, Stop, Settings, Book, Clock, SignOut
```

**Usage:**
```tsx
import { Check, ArrowRight } from "@/components/ui/Icons";
<Check className="h-5 w-5" style={{ color: "var(--color-success)" }} />
```

**Rule:** If an icon is used more than twice, add it to Icons.tsx. Inline SVGs are acceptable for single-use icons only.

### Emoji Icons

Emojis are used as visual accents throughout the app (lesson cards, quick actions, tips). They must always be wrapped in a fixed-size container:

```tsx
// ✅ Correct — emoji size is locked
<div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
     style={{ background: card.bg }}>{icon}</div>

// ❌ Wrong — emoji can vary in rendered size
<span className="text-xl">{icon}</span>
```

---

## Component Patterns

### Cards

```tsx
<div className="rounded-2xl p-5 sm:p-6"
     style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
  {/* content */}
</div>
```

All cards must have:
- `rounded-2xl` border radius
- `var(--color-card-bg)` background
- `1px solid var(--color-border)` border
- Responsive padding (`p-5 sm:p-6`)

### Buttons

**Primary (call-to-action):**
```tsx
<button className="px-6 py-3 rounded-xl text-sm font-semibold"
        style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>
  Action
</button>
```

**Secondary:**
```tsx
<button className="px-6 py-3 rounded-xl text-sm font-medium"
        style={{ background: "var(--color-card-bg)", color: "var(--color-text-secondary)",
                 border: "1px solid var(--color-border)" }}>
  Cancel
</button>
```

**Ghost:**
```tsx
<button className="text-sm hover:text-slate-200 transition-colors"
        style={{ color: "var(--color-text-muted)" }}>
  Back
</button>
```

### Input Fields

```tsx
<input className="w-full px-4 py-3 rounded-xl text-sm outline-none placeholder:text-slate-500"
       style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)",
                color: "var(--color-text)" }}
       onFocus={(e) => e.target.style.borderColor = "var(--color-input-focus)"}
       onBlur={(e) => e.target.style.borderColor = "var(--color-border)"} />
```

### Loading States

Use the `.shimmer` CSS class for skeleton loading:

```tsx
<div className="h-8 rounded shimmer" style={{ width: "200px" }} />
```

### Empty States

```tsx
<div className="text-center py-8">
  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
       style={{ background: "rgba(124,58,237,0.08)" }}>📚</div>
  <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>Title</p>
  <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>Description with next action</p>
  <button>CTA →</button>
</div>
```

Empty states must always include:
1. An icon or illustration placeholder
2. A descriptive title
3. An explanation of what to do next
4. A call-to-action button

### Error States

Use the shared `ErrorState` component from `@/components/ui/ErrorState`. It accepts `message` and optional `onRetry`.

---

## Responsive Breakpoints

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile phones |
| `sm:` | 640px | Tablets, large phones landscape |
| `lg:` | 1024px | Desktop |

**Rules:**
- Mobile-first: base styles are for mobile, `sm:` and `lg:` add complexity
- Only use `sm:` and `lg:` breakpoints — avoid `md:` and `xl:` for consistency
- Bottom tab bar visible at base, hidden at `sm:hidden`
- Desktop navigation visible at `sm:flex`, hidden at base
- Sidebars (chat scenarios, TOC, vocabulary) visible at `lg:`, stacked at smaller sizes

---

## Layout Grids

### Page Container

All authenticated pages inherit this layout from `(app)/layout.tsx`:

```
<main id="main-content" className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20 sm:pb-6">
```

### Content Grids

For two-column layouts (activity + sidebar):
```
grid sm:grid-cols-2 gap-6          // Equal columns
grid lg:grid-cols-[1fr_320px] gap-8 // Content + fixed sidebar
```

For stat/metric cards:
```
grid grid-cols-2 lg:grid-cols-4 gap-3  // 2-col mobile, 4-col desktop
```

For lesson/grammar cards:
```
grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3
```

**Rule:** Always start with 2 columns on mobile. Never use 1 column at base unless the content genuinely needs full width.
