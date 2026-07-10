# DeutschFlow — UX Guidelines

**Version:** 1.0
**Last Updated:** 2026-07-11

---

## UX Philosophy

DeutschFlow is a **learning tool**, not an entertainment product. Every UX decision prioritizes clarity, guidance, and progress visibility over gamification, decorative elements, or engagement hacks.

### Core Principles

1. **The learner should never wonder "what do I do next?"** — The next action is always obvious, one click away, and visually prominent.

2. **Progress is visible, not hidden** — Progress rings, completion percentages, streak counters, and activity timelines make learning tangible.

3. **Empty states guide, not discourage** — A new user with zero data sees encouragement and a clear starting point, not empty boxes.

4. **Every interaction has feedback** — Buttons show loading spinners, hover states lift, completed items show checkmarks, errors show clear messages.

5. **Navigation is predictable** — The same 7 tabs appear on every authenticated page. The mobile bottom bar and desktop top bar are visually consistent.

---

## Beginner-First Principles

### The First-Visit Experience

A brand new user (zero lessons, zero vocabulary, zero activity) should see:

**Dashboard:**
- "Guten Morgen" greeting with their name
- Hero card: "Start speaking German today" with learning path CTA
- Stat pills showing zeros — but with encouraging labels ("Start today" instead of "No streak")
- Activity section: "Your learning journey starts here" with "Browse Lessons" button
- Quick actions: "All caught up!" for review, "Test your knowledge" for quiz

**Learn Page:**
- "Let's get started" heading (not "0% complete")
- LevelPath showing all 5 milestones with A1 highlighted
- First lesson prominently marked "Start" in the accent gradient
- Quick shortcuts to related features

### Progressive Disclosure

Don't show everything at once:
- **Dashboard:** Progress ring, continue learning, key stats, quick actions, activity, tip
- **Learn:** Level path, current level lessons, shortcuts to other features
- **Lesson:** Objectives, content, vocabulary sidebar, exercises, completion button

Each page answers one primary question:
- Dashboard → "What should I do today?"
- Learn → "What am I learning and how far have I come?"
- Lesson → "What am I learning right now?"
- Review → "What do I need to practice?"
- Quiz → "How well do I know this?"
- Grammar → "How does German work?"
- Chat → "How do I use German in conversation?"

---

## Navigation Principles

### Global Navigation (TabBar)

7 tabs, always visible, consistent order:

| Tab | Icon | Purpose |
|-----|------|---------|
| Dashboard | Home | Learning overview, daily status |
| Learn | Book | Curriculum, lessons, progression |
| Chat | Speech bubbles | AI conversation practice |
| Review | Clock | Spaced repetition flashcards |
| Quiz | Lightbulb | Knowledge testing |
| Grammar | Code brackets | Reference, explanations |
| Settings | Gear | Profile, subscription, preferences |

**Desktop:** Horizontal text tabs in the header bar
**Mobile:** Fixed bottom bar with icons + labels

### Within-Page Navigation

- **Learn → Lesson:** Click any lesson card → full lesson view with sticky back/prev/next bar
- **Lesson → Complete:** "Complete & Add to Flashcards" button → confetti → redirects to Review
- **Dashboard → Continue:** "Resume Lesson" button → direct link to in-progress lesson
- **Dashboard → Review:** "Cards to Review" stat pill → direct link to flashcards

### Breadcrumb Pattern

Lessons use a sticky top bar with:
```
← Learning Path                    ← Prev | Next →
```

---

## Information Hierarchy

Every page follows this visual priority:

1. **Primary action** — The one thing the user should do (largest, most prominent, accent-colored)
2. **Current status** — Progress, completion, streak (medium weight, supportive)
3. **Supporting detail** — Stats, activity, tips (smallest, muted)

### Page Hierarchy (by importance)

1. **Dashboard** — Home base, daily check-in
2. **Learn** — Curriculum, lessons, the core learning experience
3. **Lesson** — Content consumption, the learning itself
4. **Review** — Retention, spaced repetition
5. **Quiz** — Assessment, knowledge check
6. **Chat** — Practice, conversation
7. **Grammar** — Reference, lookup

The top 3 pages (Dashboard, Learn, Lesson) should receive the most design attention and polish.

---

## Interaction Principles

### Hover States

All interactive elements must have a hover state:
- Cards: `hover:-translate-y-0.5` (subtle lift)
- Buttons: `hover:-translate-y-0.5` + optional shadow
- Text links: `hover:text-indigo-300` (lighten)
- Lesson cards: `hover:bg-white/[0.02]` (subtle highlight)
- Action tiles: `group-hover:opacity-100` + `group-hover:scale-110` (icon animation)

### Loading States

- **Page loads:** Shimmer skeletons matching the page layout
- **Button mutations:** Spinner replacing button text + `disabled` state
- **Data fetches:** Skeleton cards in the same grid pattern as the real content

### Transitions

- Page content: 0.25s fade + slide-up (`pageIn` animation)
- Card hovers: 0.2s transform
- Progress bars: 0.5s-0.7s width transitions
- Theme changes: Instant (CSS variables switch immediately)

### Feedback

- **Completion:** Confetti emoji + celebratory message + "Review Flashcards" CTA
- **Error:** `ErrorState` component with retry button
- **Empty:** Contextual message with next action
- **Success:** Brief message with auto-dismiss or CTA

---

## Mobile UX

### Bottom Tab Bar

Seven tabs in a fixed bottom bar, always accessible. Active tab shows:
- Accent color indicator (top edge line)
- Accent-colored text

### Touch Targets

All interactive elements should be ≥ 44px in their smallest dimension. Mobile buttons use `py-3` or `py-3.5` for adequate tap area.

### Responsive Behavior

- **Cards:** Stack from 4-col → 2-col → (never 1-col for stat cards)
- **Sidebars:** Stack below content on mobile (`lg:` breakpoint)
- **Hero section:** Ring above text on mobile, side-by-side on desktop
- **Forms:** Full-width on mobile, max-width constrained on desktop
- **Navigation:** Bottom bar on mobile, top bar on desktop

### No Horizontal Scroll

No element should overflow the viewport horizontally. Test at 375px width.

---

## Accessibility Philosophy

### Standards

Target WCAG 2.1 AA compliance.

### Implementation

- **Focus rings:** All interactive elements (`button`, `a`, `input`, `select`, `textarea`, `[role="button"]`, `[tabindex]`) have visible `:focus-visible` outlines
- **Skip to content:** Keyboard-accessible link at the top of every page
- **ARIA labels:** All icon-only buttons have `aria-label`. Tab bar uses `aria-current="page"`.
- **Screen reader:** Search inputs use `<label className="sr-only">`. Navigation is semantically structured.
- **Reduced motion:** `@media (prefers-reduced-motion)` disables all animations
- **Color contrast:** Dark theme with WCAG AA-compliant text/background ratios
- **Keyboard navigation:** Tab order follows visual order. Command bar (Ctrl+K) provides quick navigation.

---

## User Flows

### Primary Flow: First Lesson

```
Signup → Dashboard (empty state) → Click "Start Learning"
→ Learn page (A1 highlighted, Lesson 1 "Start")
→ Lesson page (read content, flip vocab cards, reveal exercises)
→ "Complete & Add to Flashcards" → Confetti → Review page
→ Complete review session → Dashboard (updated stats)
```

### Daily Flow: Returning User

```
Login → Dashboard (greeting, continue lesson, cards due)
→ Click "Resume Lesson" or "Start" on Review stat pill
→ Complete lesson or review → Dashboard (updated stats)
→ Quick action: Quiz or AI Chat
```

### Exploration Flow: Self-Directed

```
Dashboard → Learn → browse levels → pick a lesson
OR
Dashboard → Grammar → search/browse topics → read explanation
OR
Dashboard → Chat → pick scenario → practice conversation
```
