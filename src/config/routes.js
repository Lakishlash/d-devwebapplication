// src/config/routes.js
// Centralised route constants (no hardcoding in components)
export const ROUTES = Object.freeze({
    HOME: "/",
    NEW_POST: "/post/new",

    // Top-level sections
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

    // Payments
    CHECKOUT: "/checkout",

    // Info pages
    FAQS: "/faqs",
    HELP: "/help",
    SUPPORT: "/contact",

    // Legal
    PRIVACY: "/privacy",
    TERMS: "/terms",
    CODE_OF_CONDUCT: "/code-of-conduct",
});

