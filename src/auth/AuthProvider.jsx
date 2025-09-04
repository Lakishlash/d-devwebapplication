// src/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db, storage } from '@/firebase/app';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    updatePassword as fbUpdatePassword,
    sendPasswordResetEmail,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    onSnapshot,
    setDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DEFAULT_AVATAR =
    import.meta.env.VITE_DEFAULT_AVATAR_URL || '/assets/default-avatar.svg';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unsubProfile, setUnsubProfile] = useState(null);

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (u) => {
            setUser(u);

            if (unsubProfile) {
                unsubProfile();
                setUnsubProfile(null);
            }

            if (u) {
                const userRef = doc(db, 'users', u.uid);

                const snap = await getDoc(userRef);
                if (!snap.exists()) {
                    await setDoc(
                        userRef,
                        {
                            email: u.email,
                            firstName: u.displayName?.split(' ')?.[0] || '',
                            lastName: u.displayName?.split(' ')?.slice(1).join(' ') || '',
                            photoURL: u.photoURL || DEFAULT_AVATAR,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp(),
                        },
                        { merge: true }
                    );
                }

                const unsub = onSnapshot(userRef, (d) => setProfile(d.data() || null));
                setUnsubProfile(() => unsub);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            unsubAuth();
            if (unsubProfile) unsubProfile();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function uploadAvatar(uid, file) {
        if (!file) return null;
        const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase();
        const path = `avatars/${uid}/avatar_${Date.now()}.${ext}`;
        const r = ref(storage, path);
        const res = await uploadBytes(r, file, { contentType: file.type || 'image/jpeg' });
        return await getDownloadURL(res.ref);
    }

    async function register({ firstName, lastName, email, password, file }) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;

        let photoURL = DEFAULT_AVATAR;
        if (file) {
            try { photoURL = await uploadAvatar(uid, file); } catch { }
        }

        await updateProfile(cred.user, {
            displayName: `${firstName} ${lastName}`.trim(),
            photoURL,
        });

        await setDoc(
            doc(db, 'users', uid),
            {
                firstName,
                lastName,
                email,
                photoURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        return cred.user;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    async function updateNamesAndAvatar({ firstName, lastName, file }) {
        if (!auth.currentUser) throw new Error('Not authenticated');
        const uid = auth.currentUser.uid;

        let photoURL = profile?.photoURL || auth.currentUser.photoURL || DEFAULT_AVATAR;
        if (file) {
            photoURL = await uploadAvatar(uid, file);
        }

        await updateProfile(auth.currentUser, {
            displayName: `${firstName} ${lastName}`.trim(),
            photoURL,
        });

        await updateDoc(doc(db, 'users', uid), {
            firstName,
            lastName,
            photoURL,
            updatedAt: serverTimestamp(),
        });

        return true;
    }

    async function updatePassword(newPassword) {
        if (!auth.currentUser) throw new Error('Not authenticated');
        await fbUpdatePassword(auth.currentUser, newPassword);
    }

    function resetPassword(email) {
        // Firebase always resolves even if email doesn’t exist (to avoid user enumeration)
        return sendPasswordResetEmail(auth, email);
    }

    const value = useMemo(
        () => ({
            user,
            profile,
            loading,
            DEFAULT_AVATAR,
            register,
            login,
            logout,
            updateNamesAndAvatar,
            updatePassword,
            resetPassword,
        }),
        [user, profile, loading]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
