# DeutschFlow — Learning Principles

**Version:** 1.0
**Last Updated:** 2026-07-11

---

## Overview

DeutschFlow's learning methodology combines three evidence-based approaches:

1. **Structured Curriculum** — CEFR-aligned progression from A1 (Beginner) to C1 (Advanced)
2. **Spaced Repetition** — SM-2 algorithm for vocabulary retention
3. **AI-Guided Practice** — Conversational AI tutor for application and reinforcement

These three pillars work together: the curriculum introduces concepts, SRS ensures retention, and AI practice builds fluency.

---

## CEFR Progression

### Level Structure

| Level | Name | Lessons (Current) | Target | Real-World Outcome |
|-------|------|-------------------|--------|-------------------|
| A1 | Beginner | 5 | 16-20 | Introduce yourself, order food, ask directions |
| A2 | Elementary | 4 | 16-20 | Travel, shopping, daily routines, simple conversations |
| B1 | Intermediate | 4 | 16-20 | Job interviews, media, relationships, opinions |
| B2 | Upper Intermediate | 5 | 16-20 | Politics, culture, science, complex ideas |
| C1 | Advanced | 5 | 16-20 | Academic writing, literature, debate, philosophy |

### Level Design Philosophy

Each level builds on the previous one. Vocabulary, grammar, and situational context increase in complexity. A learner should complete one level before the next becomes relevant — but no level is locked. Advanced learners can jump ahead.

**Current state:** 23 lessons across all 5 levels. A1 has the most content (5 lessons). Target is 16-20 lessons per level for comprehensive coverage.

### Lesson Structure

Every lesson follows a consistent YAML + Markdown format in `backend/data/curriculum/{level}/{id}.md`:

```yaml
---
title: "Lesson title in German"
level: A1
unit: 1
order: 1
topics: ["greetings", "introductions"]
vocabulary:       # 5-10 words with german, english, pos, gender, plural, example
grammar:          # Grammar topics with slug, title, description, examples
exercises:        # 3-5 exercises: fill-blank, multiple-choice, translate
---
# Lesson content in Markdown
```

### Lesson Content Sections

1. **Dialogue** — Realistic conversation using lesson vocabulary and grammar
2. **Vocabulary** — Practice instructions with word list
3. **Grammar** — Explanation with tables and examples
4. **Practice** — Exercise instructions linking to sidebar exercises

---

## Vocabulary Methodology

### Selection Criteria

Vocabulary is selected based on:
1. **Frequency** — Most commonly used German words first (A1 = top 500 words)
2. **Thematic relevance** — Words grouped by real-world scenario (restaurant, travel, work)
3. **CEFR alignment** — Vocabulary appropriate for the target level

### Presentation

Each vocabulary entry includes:
- **German word** with article (der/die/das for nouns)
- **English translation**
- **Part of speech** (noun, verb, adjective, greeting, phrase)
- **Gender** (for nouns: m, f, n)
- **Plural form** (for nouns)
- **Example sentence** showing the word in context
- **Conjugation** (for verbs: full present tense)

### Flashcard Design

Vocabulary cards use a flip interaction:
- **Front:** German word + part of speech + speak button (pronunciation)
- **Back:** English translation + example sentence + speak button
- **Interaction:** Tap to flip, tap speak button for audio

### Spaced Repetition Integration

Every vocabulary word completed in a lesson is automatically seeded into the SRS system (`POST /srs/seed-lesson`). The SM-2 algorithm schedules reviews at optimal intervals.

---

## Grammar Methodology

### Approach

Grammar is taught **in context**, not in isolation. Each lesson introduces grammar concepts that appear in the lesson's dialogue and vocabulary. The Grammar Reference page provides a searchable, filterable knowledge base.

### Grammar in Lessons

Grammar sections within lessons:
1. Name the concept in clear English (e.g., "Personal Pronouns in Nominative")
2. Explain the rule concisely
3. Show a reference table (e.g., conjugation chart)
4. Provide example sentences from the lesson's vocabulary

### Grammar Reference

The standalone Grammar page (`/grammar`) is a searchable reference, not a learning path. It supports:
- Free-text search with debounced input (300ms)
- Level filtering (All, A1, A2, B1, B2, C1)
- Topic cards linking to detailed explanations
- Table of contents sidebar with scroll spy for long articles
- Related lessons linking back to the curriculum

---

## Dialogue Methodology

### Purpose

Dialogues serve as the primary "real-world" application of vocabulary and grammar. Every lesson should include at least one dialogue.

### Format

Dialogues are rendered as styled conversation blocks:
- Header: "Dialogue" label + speak button (reads entire dialogue aloud)
- Left accent border (3px, accent color)
- Italic text with character labels (**Name:** text)
- Each line is a separate `<p>` for readability

### Design

Dialogues should:
- Use only vocabulary and grammar introduced in the lesson or prior lessons
- Feature 2-3 speakers
- Be 6-10 lines (short enough to memorize, long enough to be useful)
- Represent a realistic scenario the learner might encounter

---

## Exercise Philosophy

### Types

| Type | Format | Tests |
|------|--------|-------|
| `fill-blank` | "___ heiße Maria. (ich)" → "Ich" | Grammar, conjugation |
| `multiple-choice` | Prompt + 4 options → correct answer | Vocabulary, comprehension |
| `translate` | "My name is Peter." → "Mein Name ist Peter." | Production, recall |

### Design

- Exercises are numbered and grouped under an "Exercises" section header with question count
- Answers are hidden behind a "Reveal Answer" button (no raw `<details>` elements)
- Revealed answers show in a bordered box with "Answer" label
- Feedback is immediate (correct/incorrect) in quiz mode; lesson exercises are self-check

### Quiz Engine

The quiz generator (`backend/app/quiz/generator.py`) creates quiz sessions from:
- Current lesson vocabulary
- Level-specific vocabulary
- Weakest words (lowest SRS scores)

Quiz sessions are DB-backed with 1-hour TTL auto-cleanup. Question types are randomized within the selected source.

---

## Review Philosophy (Spaced Repetition)

### Algorithm

DeutschFlow implements the **SM-2 algorithm** (SuperMemo 2), the most widely validated spaced repetition algorithm:

- **Rating scale:** 0 (complete blackout) to 5 (perfect recall)
- **Interval growth:** I(n) = I(n-1) × EF (easiness factor)
- **Ease adjustment:** EF changes based on rating quality
- **Status progression:** New → Learning → Reviewing → Mastered

### Review Flow

1. Card front shown (German word)
2. Learner mentally recalls meaning
3. Tap to flip → card back shown (English + example)
4. Rate recall quality (0-5)
5. SM-2 schedules next review
6. Next card presented

### Motivation

- **Progress bar:** "Card 3 of 12" with percentage
- **Session complete:** "Session Complete! You reviewed 12 cards."
- **All caught up:** "No cards due right now. Come back later."
- **Stats display:** New / Learning / Reviewing / Mastered counters with color-coded progress bars

---

## AI Tutor Philosophy (Emma)

### Persona

Emma is an **English-speaking German language coach**. She explains concepts in English, provides German examples, and corrects learner attempts with explanations — never just "that's wrong."

### Design Principles

1. **English-first explanations** — "In German, the verb goes in the second position" not "Das Verb steht an zweiter Position"
2. **Corrections with explanations** — Every correction includes WHY it was wrong
3. **Scenario-based practice** — Casual chat, restaurant, shopping, travel, job interview, doctor
4. **Level-appropriate** — Adapts complexity to the learner's self-identified level

### Technical Implementation

- Backend: FastAPI endpoint (`POST /chat/send`)
- AI: Anthropic-compatible API (currently DeepSeek)
- Context: Full conversation history sent with each message
- Scenarios: Pre-defined system prompts for role-play contexts

---

## Learning Analytics Philosophy

### What We Track

- Lesson completion (per-lesson, per-level)
- SRS card status (new, learning, reviewing, mastered)
- Quiz scores (per-session, running average)
- Streak (consecutive days with activity)
- Activity log (lesson, quiz, review, streak events)

### What We Don't Track (By Design)

- Time spent per screen (creates pressure)
- "Falling behind" metrics (discouraging)
- Comparison to other learners (unless opt-in social features added)

### Dashboard Visualization

The dashboard answers "how am I doing?" without creating anxiety:
- Level progress ring (positive: "73% complete")
- Streak counter (motivating: "5-day streak!")
- Cards due (actionable: "12 cards to review")
- Activity timeline (reflective: "Completed A1 Greetings 3h ago")

---

## Motivation Strategy

### Intrinsic Motivation

DeutschFlow prioritizes intrinsic motivation over extrinsic rewards:

1. **Visible progress** — Progress rings, completion percentages, level advancement
2. **Competence** — Quiz scores, mastered vocabulary counts, SRS progression
3. **Autonomy** — Self-directed learning path, multiple entry points (curriculum, quiz, chat, grammar)
4. **Relatedness** — AI tutor provides personalized interaction

### What We Avoid

- ❌ Experience points (XP) — gamification that distracts from learning
- ❌ Streak freezes — artificial engagement mechanics
- ❌ Notifications about "falling behind" — pressure tactics
- ❌ Cartoon characters or mascots — undermines the serious, premium feel
- ❌ Timed exercises — creates anxiety, not learning

### What We Use Instead

- ✅ Streak counter — positive reinforcement for consistency
- ✅ Progress rings — visual satisfaction of completion
- ✅ "All caught up!" — celebration of diligence
- ✅ Tip of the day — genuine learning advice, not filler
- ✅ German greeting — immersive without being overwhelming

---

## Content Creation Guidelines

When creating new lessons, follow these rules:

1. **One concept per lesson** — Don't introduce personal pronouns AND verb conjugation in the same lesson
2. **8-12 vocabulary words** — Enough to be substantial, not overwhelming
3. **3-5 exercises** — Cover each vocabulary item or grammar concept
4. **Dialogue first** — Write the dialogue, then extract vocabulary and grammar from it
5. **Realistic scenarios** — "At the bakery" not "The space station"
6. **Spiral review** — Later lessons should reuse vocabulary from earlier lessons
7. **Native-checked** — All German content should be reviewed by a native speaker before publishing
