/**
 * Notification copy — Success, warning, error, info messages
 */

export const notifications = {
  auth: {
    loginSuccess: { title: "Welcome back! 🎉", message: "You've been signed in successfully." },
    signupSuccess: { title: "Account created! 🎉", message: "Welcome to DeutschFlow. Start your first lesson!" },
    logoutSuccess: { title: "Signed out", message: "You've been signed out successfully." },
    passwordResetSent: { title: "Email sent", message: "If that email exists, we've sent a reset link." },
    passwordResetSuccess: { title: "Password reset", message: "Your password has been updated. You can now sign in." },
  },
  learning: {
    lessonComplete: { title: "Lesson complete! 🎉", message: "Great work on completing this lesson." },
    quizComplete: { title: "Quiz submitted!", message: "Check your results to see how you did." },
    streakAchievement: { title: "Streak achieved! 🔥", message: "You've reached a {count}-day streak!" },
  },
  review: {
    complete: { title: "Review complete! 🎉", message: "All cards reviewed. Great work staying on top of your learning." },
  },
  settings: {
    saved: { title: "Changes saved", message: "Your settings have been updated successfully." },
    saveFailed: { title: "Failed to save", message: "Your changes couldn't be saved. Please try again." },
  },
  general: {
    error: { title: "Something went wrong", message: "Please try again. If the problem persists, contact support." },
    offline: { title: "You're offline", message: "Some features may be unavailable until you reconnect." },
    online: { title: "Back online", message: "Your connection has been restored." },
  },
} as const;
