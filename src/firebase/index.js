// src/firebase/index.js
// Initialize Firebase using only Vite env vars (no hardcoding).

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const need = (k) => {
    const v = import.meta.env[k];
    if (!v) throw new Error(`Missing required Firebase env: ${k}`);
    return v;
};

const firebaseConfig = {
    apiKey: need("VITE_FIREBASE_API_KEY"),
    authDomain: need("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: need("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: need("VITE_FIREBASE_STORAGE_BUCKET"),
    appId: need("VITE_FIREBASE_APP_ID"),
    // Optional keys if you decide to set them
    ...(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID && {
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    }),
    ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID && {
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    }),
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const ts = serverTimestamp;
