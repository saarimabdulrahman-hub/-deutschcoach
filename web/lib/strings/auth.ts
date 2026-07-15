/**
 * Auth page copy
 */

export const auth = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to continue learning",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submit: "Sign in",
    loading: "Signing in...",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    createAccount: "Create one",
    divider: "or",
    googleLogin: "Continue with Google",
    error: "Invalid credentials",
  },

  signup: {
    title: "Create your account",
    subtitle: "Start your German learning journey",
    nameLabel: "Full name",
    namePlaceholder: "Your full name",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Password (min 6 characters)",
    terms: "I agree to the Terms of Service and Privacy Policy",
    submit: "Create account",
    loading: "Creating account...",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    error: "Signup failed. Please try again.",
  },

  forgotPassword: {
    title: "Reset your password",
    subtitle: "Enter your email and we'll send you a reset link.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    submit: "Send Reset Link",
    loading: "Sending...",
    successTitle: "Check your email",
    successMessage: "If an account with that email exists, we've sent a password reset link.",
    backToLogin: "← Back to login",
  },

  resetPassword: {
    title: "Choose new password",
    subtitle: "Must be at least 6 characters.",
    passwordLabel: "New password",
    passwordPlaceholder: "New password",
    confirmLabel: "Confirm password",
    confirmPlaceholder: "Confirm your password",
    submit: "Reset Password",
    loading: "Resetting...",
    successTitle: "Password reset",
    successMessage: "Your password has been successfully reset. You can now sign in with your new password.",
    signIn: "← Sign in",
    invalidLink: "Invalid link",
    invalidMessage: "This reset link is invalid or has expired.",
  },

  validation: {
    passwordMinLength: "Password must be at least 6 characters.",
    passwordsDoNotMatch: "Passwords do not match.",
    termsRequired: "You must agree to the terms to continue.",
    emailInvalid: "Invalid email format. Enter a valid email address (e.g., name@example.com).",
    required: "This field is required.",
  },
} as const;
