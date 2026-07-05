// Constants for the app's single-password access gate. Single source of truth
// for the session cookie name and lifetime.

export const SESSION_COOKIE = "pd_session";

// 30 days, in seconds, so the installed PWA stays logged in.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
