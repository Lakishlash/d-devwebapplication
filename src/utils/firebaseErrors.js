// src/utils/firebaseErrors.js
import { TEXT } from '@/config/text';

const M = {
    'auth/invalid-email': TEXT.errors.email,
    'auth/user-not-found': TEXT.errors.loginFailed,
    'auth/wrong-password': TEXT.errors.loginFailed,
    'auth/invalid-credential': TEXT.errors.loginFailed,
    'auth/email-already-in-use': 'That email is already in use.',
    'auth/weak-password': TEXT.errors.pwWeak,
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/requires-recent-login': 'Please log out and log in again, then retry.',
};

export function mapAuthError(err) {
    const code = err?.code || '';
    return M[code] || TEXT.errors.generic;
}
