/**
 * Error message templates
 * Pattern: [What went wrong] + [Why it happened] + [How to fix it]
 */

export const errors = {
  network: "Network error. Please check your connection and try again.",
  server: "Something went wrong on our end. Please try again in a moment.",
  timeout: "The request timed out. Please check your connection and try again.",
  notFound: "The page you're looking for doesn't exist or has been moved.",
  unauthorized: "Please sign in to access this feature.",
  forbidden: "You don't have permission to perform this action.",
  validation: {
    required: "{field} is required.",
    email: "Invalid email format. Enter a valid email address (e.g., name@example.com).",
    minLength: "{field} must be at least {min} characters.",
    maxLength: "{field} must be no more than {max} characters.",
    passwordMatch: "Passwords do not match.",
    passwordStrength: "Password must contain at least one uppercase letter, one number, and one special character.",
    termsRequired: "You must agree to the terms to continue.",
  },

  // Domain-specific
  dashboard: {
    loadFailed: "Failed to load dashboard data.",
  },
  curriculum: {
    loadFailed: "Failed to load curriculum.",
    lessonLoadFailed: "Failed to load lesson content.",
  },
  chat: {
    sendFailed: "Sorry, I couldn't respond right now. Please try again.",
    loadFailed: "Failed to load chat history.",
  },
  quiz: {
    loadFailed: "Failed to load quiz questions.",
    submitFailed: "Failed to submit quiz answers. Please try again.",
  },
  settings: {
    saveFailed: "Failed to save changes. Please try again.",
    loadFailed: "Failed to load settings.",
  },
  auth: {
    loginFailed: "Invalid email or password. Please try again.",
    signupFailed: "Failed to create account. This email may already be registered.",
    resetFailed: "Failed to reset password. The link may have expired.",
    sessionExpired: "Your session has expired. Please sign in again.",
  },
} as const;
