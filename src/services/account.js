// src/services/account.js
// Self-serve account deletion utilities.
// - Re-auth (password or OAuth popup)
// - Delete user's posts (and answers for their questions)
// - Delete /users/{uid}
// - Optional Storage cleanup for user folders
// - Delete Auth user

import { auth, db, storage } from "@/firebase/app";
import {
    collection, query, where, getDocs, doc, deleteDoc
} from "firebase/firestore";
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    GithubAuthProvider,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    deleteUser
} from "firebase/auth";
import {
    ref, listAll, deleteObject
} from "firebase/storage";

// Firestore collection names (keep in sync with your env)
const FS_POSTS = import.meta.env.VITE_FS_COLLECTION_POSTS || "posts";

// ----- Re-auth -----
export async function reauthenticateCurrentUser({ password } = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in.");

    const primaryProvider = user.providerData?.[0]?.providerId || "password";

    // email/password path
    if (primaryProvider === "password") {
        if (!user.email) throw new Error("Account has no email.");
        if (!password) throw new Error("Please enter your password to continue.");
        const cred = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, cred);
        return;
    }

    // OAuth popup path
    let provider;
    if (primaryProvider === "google.com") provider = new GoogleAuthProvider();
    else if (primaryProvider === "github.com") provider = new GithubAuthProvider();
    else {
        // Fallback: try Google popup
        provider = new GoogleAuthProvider();
    }
    await reauthenticateWithPopup(user, provider);
}

// ----- Storage recursive delete (best-effort, ignore errors) -----
async function deleteFolder(path) {
    try {
        const root = ref(storage, path);
        const stack = [root];
        while (stack.length) {
            const cur = stack.pop();
            // listAll can throw if folder doesn't exist yet
            // eslint-disable-next-line no-await-in-loop
            const res = await listAll(cur).catch(() => null);
            if (!res) continue;
            res.items.forEach((item) => stack.push(item));
            res.prefixes.forEach((p) => stack.push(p));
            // If it's a file (has bucket/path), delete it
            if ("bucket" in cur) {
                // eslint-disable-next-line no-await-in-loop
                await deleteObject(cur).catch(() => { });
            }
        }
    } catch {
        // ignore storage cleanup errors
    }
}

// ----- Answers purge for a question -----
async function deleteAnswersForQuestion(postId) {
    const answersCol = collection(db, FS_POSTS, postId, "answers");
    const snap = await getDocs(answersCol);
    const promises = snap.docs.map((d) => deleteDoc(d.ref).catch(() => { }));
    await Promise.all(promises);
}

// ----- Posts purge for a user -----
async function deleteAllUserPosts(uid) {
    const postsCol = collection(db, FS_POSTS);
    const q = query(postsCol, where("author.uid", "==", uid));
    const snap = await getDocs(q);

    // Delete answers for questions first, then the post
    for (const d of snap.docs) {
        const data = d.data();
        if (data?.type === "question") {
            await deleteAnswersForQuestion(d.id);
        }
        await deleteDoc(d.ref);
    }
}

// ----- Public: main entry -----
export async function deleteMyAccount({ password } = {}) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in.");

    // 1) Re-auth (required by Firebase to allow sensitive ops)
    await reauthenticateCurrentUser({ password });

    const uid = user.uid;

    // 2) Delete user posts (and answers for their questions)
    await deleteAllUserPosts(uid);

    // 3) Delete users/{uid} profile doc
    await deleteDoc(doc(db, "users", uid)).catch(() => { });

    // 4) Optional storage cleanup
    await Promise.all([
        deleteFolder(`articles/${uid}`),
        deleteFolder(`tutorials/${uid}`),
        deleteFolder(`avatars/${uid}`),
    ]);

    // 5) Delete the Auth user (this also signs them out)
    await deleteUser(user);
}
