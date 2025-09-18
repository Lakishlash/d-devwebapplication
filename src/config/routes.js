// src/config/routes.js
// Centralised route constants (no hardcoding in components)

export const ROUTES = Object.freeze({
    HOME: "/",
    NEW_POST: "/post/new",

    // New top-level sections
    QUESTIONS: "/questions",
    ARTICLES: "/articles",
    TUTORIALS: "/tutorials",

    // 🔎 Global search
    SEARCH: "/search",

    // Account / misc
    LOGIN: "/login",
    SIGNUP: "/signup",
    PROFILE: "/profile",
    PLANS: "/plans",

    // ✅ Added for Stripe checkout (used by Plans CTA)
    CHECKOUT: "/checkout",

    // Optional static pages used in header (safe to keep even if not yet created)
    FAQS: "/faqs",
    HELP: "/help",
    SUPPORT: "/contact",
});
