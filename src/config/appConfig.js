// src/config/appConfig.js
// Central app config — fully env-driven (no hardcoding).

const read = (key, { required = true, fallback } = {}) => {
    const val = import.meta.env[key];
    if (required && (val === undefined || val === "")) {
        throw new Error(`Missing env: ${key}`);
    }
    return val ?? fallback;
};

export const APP_CONFIG = {
    FS_COLLECTION_POSTS: read("VITE_FS_COLLECTION_POSTS"),     // e.g., "posts"
    STORAGE_ARTICLES_ROOT: read("VITE_STORAGE_ARTICLES_ROOT"), // e.g., "articles"
};

// Consistent storage paths
export const storagePaths = {
    articleImagePath: (docId, fileName) =>
        `${APP_CONFIG.STORAGE_ARTICLES_ROOT}/${docId}/${fileName}`,
};
