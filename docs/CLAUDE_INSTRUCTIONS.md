# Claude Instructions — DeutschFlow Development

**Version:** 1.0
**Last Updated:** 2026-07-11
**Applies to:** All Claude Code sessions in this repository

---

## First Action in Every Session

Before writing ANY code or making ANY changes:

1. **Read the documentation in this order:**
   - `docs/PRODUCT_VISION.md` — Understand what we're building and why
   - `docs/DESIGN_SYSTEM.md` — Know the visual language and component patterns
   - `docs/UX_GUIDELINES.md` — Understand the user experience principles
   - `docs/LEARNING_PRINCIPLES.md` — Understand how learning works in this product

2. **Read the project CLAUDE.md** at the repository root — it contains technical architecture and common commands.

3. **Explore the relevant code** before proposing changes. Understand the existing patterns, components, and data flow.

---

## Core Operating Principles

### 1. This is a Learning Platform, Not a Generic Web App

Every feature, component, and interaction must serve the goal of teaching German to complete beginners. Before implementing anything, ask:

- Does this help a beginner learn German?
- Is this clear to someone who knows zero German?
- Does this follow the learning principles in `LEARNING_PRINCIPLES.md`?

If the answer to any of these is "no," reconsider the approach.

### 2. Preserve the Design System

- **Never introduce new colors.** Use the semantic CSS variables (`--color-text`, `--color-card-bg`, etc.). See `DESIGN_SYSTEM.md` for the full palette.
- **Never introduce new spacing values.** Use the established spacing scale (`gap-3`, `p-5`, `sm:p-6`, etc.).
- **Never introduce new border radius values.** `rounded-xl` and `rounded-2xl` only.
- **Never create a new loading/empty/error state pattern.** Use the existing `ErrorState`, `EmptyState`, and `.shimmer` patterns.

### 3. Reuse, Don't Duplicate

- **Icons:** Check `web/components/ui/Icons.tsx` first. If an icon exists, use it. If you need an icon that doesn't exist, add it there.
- **Theme data:** Import `THEME_LIST` from `@/contexts/ThemeContext`. Never hardcode the 15-theme array.
- **Components:** Check `web/components/ui/` for shared components before creating new ones.
- **Hooks:** Check `web/hooks/` before creating new hooks.

### 4. Mobile-First, Always

- Base styles are for mobile (0px+)
- `sm:` prefix for tablet (640px+)
- `lg:` prefix for desktop (1024px+)
- Never use `md:` or `xl:` breakpoints
- Test at 375px, 768px, and 1440px
- All touch targets must be ≥ 44px

### 5. Accessibility is Not Optional

- Every interactive element gets `:focus-visible` styling (it's already in `globals.css`)
- Every icon-only button gets `aria-label`
- Every form input gets a `<label>` (even if `sr-only`)
- Every page supports keyboard navigation
- Respect `prefers-reduced-motion`
- Print styles are already in `globals.css` — ensure new content prints well

### 6. Components Follow Patterns

**Cards:**
```tsx
<div className="rounded-2xl p-5 sm:p-6"
     style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)" }}>
```

**Buttons (primary):**
```tsx
<button className="px-6 py-3 rounded-xl text-sm font-semibold"
        style={{ background: "var(--color-accent-gradient)", color: "#fff" }}>
```

**Buttons (secondary):**
```tsx
<button className="px-6 py-3 rounded-xl text-sm font-medium"
        style={{ background: "var(--color-card-bg)", color: "var(--color-text-secondary)",
                 border: "1px solid var(--color-border)" }}>
```

### 7. Empty States Guide the User

Every empty state must include:
1. An emoji or icon placeholder
2. A descriptive title
3. A "what to do next" explanation
4. A call-to-action button

Never show "0" or an empty box to a new user.

### 8. Think Like a Product Designer Before Writing Code

Before implementing:
1. What problem does this solve for the learner?
2. Where does it fit in the information hierarchy (see `UX_GUIDELINES.md`)?
3. Is this consistent with the existing design language?
4. How does this work on mobile?
5. What does the empty state look like?
6. What does the loading state look like?
7. What does the error state look like?

### 9. Validate Changes

After every change:
1. `cd web && npm run build` — must compile successfully with zero errors
2. Visual check — is the spacing, typography, and color usage consistent?
3. Responsive check — does it work at 375px, 768px, and 1440px?
4. Accessibility check — are focus states visible? Are ARIA labels present?

### 10. Commit with Context

Commit messages should explain WHY, not just WHAT:
```
feat: add lesson completion celebration with confetti and next-lesson preview

The previous flow dropped learners at a dead end after completing a
lesson. Now they see a celebratory state with clear next actions.

- Confetti animation on completion
- "Review Flashcards" primary CTA
- "Next: [Lesson Name]" secondary link
- Auto-redirects to Review after 1.8s
```

---

## Architecture Constraints

### Frontend (`web/`)

- **Framework:** Next.js 16 (App Router) with Turbopack
- **Styling:** Tailwind CSS v4 + CSS custom properties for theming
- **State:** React Query v5 for server state, React Context for auth/theme
- **Components:** "use client" where needed, server components otherwise
- **API:** Centralized in `web/lib/api.ts` — always use the `api` object, never raw fetch

### Backend (`backend/`)

- **Framework:** FastAPI with SQLAlchemy 2.0
- **Database:** SQLite (dev) / MySQL (prod) via Alembic migrations
- **Auth:** JWT with bcrypt password hashing
- **SRS:** SM-2 algorithm in `backend/app/srs/engine.py` — pure function, no side effects

### Shared (`packages/shared/`)

- **Types:** Shared TypeScript interfaces — keep backend and frontend types in sync

---

## File Organization

```
web/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (metadata, providers)
│   ├── page.tsx            # Login page
│   ├── signup/             # Registration
│   ├── (app)/              # Authenticated route group
│   │   ├── layout.tsx      # App shell (header, nav, main)
│   │   ├── dashboard/      # Dashboard page
│   │   ├── curriculum/     # Learn page + lesson detail
│   │   ├── chat/           # AI chat
│   │   ├── review/         # SRS flashcards
│   │   ├── quiz/           # Quiz
│   │   ├── grammar/        # Grammar reference + detail
│   │   └── settings/       # Profile, subscription, preferences
├── components/
│   ├── ui/                 # Shared UI (TabBar, Logo, ErrorState, Icons, etc.)
│   ├── dashboard/          # Dashboard-specific components
│   ├── curriculum/         # Learn-specific components
│   ├── chat/               # Chat-specific components
│   ├── quiz/               # Quiz-specific components
│   ├── srs/                # Flashcard-specific components
│   ├── grammar/            # Grammar-specific components
│   ├── auth/               # Login/signup forms
│   └── settings/           # Settings sections
├── contexts/               # React contexts (Auth, Theme, Providers)
├── hooks/                  # Custom hooks
├── lib/                    # Utilities (api client)
└── types/                  # TypeScript interfaces
```

**Rule:** Put shared components in `ui/`. Put feature-specific components in their feature directory. If a component is used by multiple features, it belongs in `ui/`.

---

## Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|---------|------|
| Hardcode colors (`#6366f1`) | Use `var(--color-accent)` |
| Create a new theme array | Import `THEME_LIST` from ThemeContext |
| Use `md:` or `xl:` breakpoints | Use `sm:` and `lg:` only |
| Inline SVG for icons used > 2 times | Add to `Icons.tsx` and import |
| Show "0" or empty box to new users | Always provide an encouraging empty state with CTA |
| Add new spacing values | Use existing `gap-3`, `p-5`, `space-y-6`, etc. |
| Skip loading state | Add shimmer skeletons matching the page layout |
| Skip error state | Use `ErrorState` component with retry |
| Create a new card style | Use the standard card pattern |
| Call hooks after conditional returns | All hooks must be before `if (loading) return` |
| Import from `useSpeech` directly | Use `useSentenceSpeech` (lesson content) or `useWordSpeech` (single words) |

---

## Before Major Changes

1. Read ALL documentation in `docs/`
2. Explore the relevant code thoroughly
3. Present your design approach before implementing
4. Get approval before making structural changes
5. Implement in small, testable increments
6. Build after every meaningful change
7. Commit with descriptive messages

---

## Documentation Maintenance

These docs are living documents. Update them when:
- A new design pattern is established
- The color palette changes
- A new component is added to `ui/`
- The learning methodology evolves
- New features change the user flow

The `CLAUDE.md` at the repo root should stay focused on technical commands and architecture. Detailed guidance lives in `docs/`.
