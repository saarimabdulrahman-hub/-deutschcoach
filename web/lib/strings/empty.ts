/**
 * Empty state messages — illustration + title + description + action
 */

export const empty = {
  dashboard: {
    firstUse: {
      title: "Welcome to DeutschFlow!",
      description: "Start your first lesson to begin your German learning journey.",
      action: "Start Learning",
    },
  },
  curriculum: {
    noLessons: {
      title: "No lessons yet",
      description: "Lessons will appear here once they're available for your level.",
    },
    noResults: {
      title: "No results found",
      description: "Try adjusting your search or filters.",
    },
  },
  chat: {
    firstMessage: {
      title: "Start a conversation",
      description: "Choose a topic below or type anything to start chatting with Emma.",
    },
  },
  quiz: {
    noQuestions: {
      title: "No questions available",
      description: "There are no quiz questions available for this topic yet.",
    },
  },
  review: {
    allCaughtUp: {
      title: "All caught up! 🎉",
      description: "No cards to review right now. Come back later or start a new lesson.",
      action: "Start a Lesson",
    },
  },
  grammar: {
    noResults: {
      title: "No grammar topics found",
      description: "Try searching for a different topic or level.",
    },
  },
  settings: {
    noData: {
      title: "No data available",
      description: "Start learning to see your statistics here.",
    },
  },
  notifications: {
    empty: {
      title: "No notifications",
      description: "We'll notify you when something important happens.",
    },
  },
} as const;
