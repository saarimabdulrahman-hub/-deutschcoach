/**
 * Chat interface copy
 */

export const chat = {
  welcome: {
    greeting: "I'm Emma, your German tutor. I explain, correct, and practice with you — without just handing you the answers.",
    recentlyLearned: "Recently learned",
    practiceThese: "Practice these →",
    tryIn: "Try in {mode} mode",
    startFirstLesson: "Start your first lesson today! 🌱",
  },
  modes: {
    label: "Try These",
    roleplay: "Act out a situation",
    grammar: "Break down a rule",
    vocab: "Grow my word bank",
    writing: "Make my German natural",
    pronunciation: "Nail the pronunciation",
    exam: "Crush the next exam",
  },
  input: {
    roleplayPlaceholder: "Start the roleplay…",
    writingPlaceholder: "Paste or type your German…",
    defaultPlaceholder: "Ask Emma anything…",
    attachFile: "Attach a file",
    send: "Send message",
  },
  context: {
    label: "Context",
    lesson: "Lesson: {name}",
    vocab: "Vocab: {words}",
  },
  summary: {
    title: "Session Summary",
    words: "Words discussed",
    grammar: "Grammar explained",
    corrections: "Corrections",
    phrases: "Useful phrases",
    correctionCount: "{count} correction{s} this session",
  },
  recentTopics: "Recent Topics",
  noActivity: "No recent activity yet",
  error: "Sorry, I couldn't respond right now. Please try again.",
} as const;
