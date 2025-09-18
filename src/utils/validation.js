// src/utils/validation.js
export function isEmail(value) {
    if (typeof value !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function minLen(value, n = 6) {
    return typeof value === 'string' && value.length >= n;
}
