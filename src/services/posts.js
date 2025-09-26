// services/posts.js (full)
// Central Firestore/Storage service for Dev@Deakin posts.

import { db, storage } from "@/firebase/app";
import {
    addDoc, collection, doc, deleteDoc, getDoc, onSnapshot,
    orderBy, query, where, serverTimestamp, updateDoc, limit as qLimit, getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* -------------------- ENV -------------------- */
const FS_POSTS = import.meta.env.VITE_FS_COLLECTION_POSTS || "posts";
const STORAGE_ARTICLES_ROOT = import.meta.env.VITE_STORAGE_ARTICLES_ROOT || "articles";
const STORAGE_TUTORIALS_ROOT = import.meta.env.VITE_STORAGE_TUTORIALS_ROOT || "tutorials";
const STORAGE_QA_ROOT = import.meta.env.VITE_STORAGE_QA_ROOT || "qa";

/* ------------------ UTILITIES ----------------- */
const safeStr = (v) => (v == null ? "" : String(v));
function sanitizeForFirestore(any) {
    if (Array.isArray(any)) return any.map(sanitizeForFirestore);
    if (any && typeof any === "object") {
        const out = {};
        for (const [k, v] of Object.entries(any)) out[k] = v === undefined ? null : sanitizeForFirestore(v);
        return out;
    }
    return any === undefined ? null : any;
}
function asItem(docSnap) { const data = docSnap.data() || {}; return { id: docSnap.id, ...data }; }

/* ---------------- MEDIA UPLOADS --------------- */
async function uploadTo(root, uid, file, prefix) {
    if (!uid || !file) return null;
    const cleanName = (file.name || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${root}/${uid}/${prefix}_${Date.now()}_${cleanName}`;
    const r = ref(storage, path);
    const res = await uploadBytes(r, file, { contentType: file.type || undefined });
    return getDownloadURL(res.ref);
}
export function uploadArticleImage(uid, file) { return uploadTo(STORAGE_ARTICLES_ROOT, uid, file, "article"); }
export function uploadTutorialImage(uid, file) { return uploadTo(STORAGE_TUTORIALS_ROOT, uid, file, "thumb"); }
export function uploadTutorialVideo(uid, file) { return uploadTo(STORAGE_TUTORIALS_ROOT, uid, file, "video"); }
export function uploadQAImage(uid, file) { return uploadTo(STORAGE_QA_ROOT, uid, file, "img"); }
export function uploadQAPdf(uid, file) { return uploadTo(STORAGE_QA_ROOT, uid, file, "doc"); }

/* -------------------- CREATE ------------------ */
export async function createPost({
    type, title, tags = [], author, description, abstract, body, imageUrl, videoUrl,
}) {
    const base = {
        type: safeStr(type),
        title: safeStr(title).trim(),
        tags: Array.isArray(tags) ? tags.slice(0, 3).map(safeStr) : [],
        author: {
            uid: safeStr(author?.uid),
            name: safeStr(author?.name),
            photoURL: author?.photoURL ?? null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    let specific = {};
    if (type === "question") {
        specific = { description: safeStr(description), abstract: null, body: null, imageUrl: imageUrl ?? null, videoUrl: null };
    } else if (type === "article") {
        specific = { abstract: safeStr(abstract), body: safeStr(body), description: null, imageUrl: imageUrl ?? null, videoUrl: null };
    } else if (type === "tutorial") {
        specific = { description: safeStr(description), abstract: null, body: null, imageUrl: imageUrl ?? null, videoUrl: videoUrl ?? null };
    } else {
        throw new Error("Unsupported post type");
    }

    const payload = sanitizeForFirestore({ ...base, ...specific });
    await addDoc(collection(db, FS_POSTS), payload);
}

/* -------------------- UPDATE ------------------ */
export async function updatePost(postId, patch) {
    const refDoc = doc(db, FS_POSTS, postId);
    const snap = await getDoc(refDoc);
    if (!snap.exists()) throw new Error("Post not found");

    const payload = sanitizeForFirestore({
        ...(patch.title !== undefined ? { title: safeStr(patch.title).trim() } : {}),
        ...(patch.tags !== undefined ? { tags: Array.isArray(patch.tags) ? patch.tags.slice(0, 3).map(safeStr) : [] } : {}),
        ...(patch.description !== undefined ? { description: safeStr(patch.description) } : {}),
        ...(patch.abstract !== undefined ? { abstract: safeStr(patch.abstract) } : {}),
        ...(patch.body !== undefined ? { body: safeStr(patch.body) } : {}),
        ...(patch.imageUrl !== undefined ? { imageUrl: patch.imageUrl ?? null } : {}),
        ...(patch.videoUrl !== undefined ? { videoUrl: patch.videoUrl ?? null } : {}),
        updatedAt: serverTimestamp(),
    });

    await updateDoc(refDoc, payload);
}
export function updateTutorial(postId, { title, description, tags, imageUrl, videoUrl }) {
    return updatePost(postId, { title, description, tags, imageUrl, videoUrl });
}

/* -------------------- DELETE ------------------ */
export function deletePost(postId) { return deleteDoc(doc(db, FS_POSTS, postId)); }

/* -------------------- WATCH ONE --------------- */
export function watchPost(postId, onData, onError) {
    try {
        const refDoc = doc(db, FS_POSTS, postId);
        return onSnapshot(refDoc, (snap) => onData(snap.exists() ? asItem(snap) : null), (err) => onError?.(err));
    } catch (err) { onError?.(err); return () => { }; }
}

/* -------------------- WATCH LIST -------------- */
function watchByType(type, onData, onError) {
    try {
        const qy = query(collection(db, FS_POSTS), where("type", "==", type), orderBy("createdAt", "desc"), qLimit(100));
        return onSnapshot(qy, (snap) => onData(snap.docs.map(asItem)), (err) => onError?.(err));
    } catch (err) { onError?.(err); return () => { }; }
}
export function watchArticles(onData, onError) { return watchByType("article", onData, onError); }
export function watchQuestions(onData, onError) { return watchByType("question", onData, onError); }
export function watchTutorials(onData, onError) { return watchByType("tutorial", onData, onError); }

/* -------------------- FETCH LATEST ------------ */
async function fetchLatestByType(type, limitN = 100) {
    try {
        const qy = query(collection(db, FS_POSTS), where("type", "==", type), orderBy("createdAt", "desc"), qLimit(limitN));
        const snap = await getDocs(qy);
        return snap.docs.map(asItem);
    } catch { return []; }
}
export function fetchLatestArticles(limitN = 100) { return fetchLatestByType("article", limitN); }
export function fetchLatestTutorials(limitN = 100) { return fetchLatestByType("tutorial", limitN); }
export function fetchLatestQuestions(limitN = 100) { return fetchLatestByType("question", limitN); }

/* -------------------- TAGS -------------------- */
export function uniqueTags(items) {
    const s = new Set();
    (items || []).forEach((it) => (it?.tags || []).forEach((t) => { const x = (t || "").trim(); if (x) s.add(x); }));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
}

/* -------------------- ANSWERS ----------------- */
export function watchAnswers(postId, onData, onError, order = "asc") {
    try {
        const col = collection(db, FS_POSTS, postId, "answers");
        const qy = query(col, orderBy("createdAt", order === "desc" ? "desc" : "asc"), qLimit(200));
        return onSnapshot(qy, (snap) => onData(snap.docs.map(asItem)), (err) => onError?.(err));
    } catch (err) { onError?.(err); return () => { }; }
}

export async function addAnswer(postId, arg2, arg3) {
    const isObject = arg2 && typeof arg2 === "object" && "body" in arg2;
    const body = isObject ? arg2.body : arg2;
    const author = isObject ? arg2.author : arg3;

    const payload = sanitizeForFirestore({
        body: safeStr(body),
        author: {
            uid: safeStr(author?.uid),
            name: safeStr(author?.name),
            photoURL: author?.photoURL ?? null,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await addDoc(collection(db, FS_POSTS, postId, "answers"), payload);
}

export async function updateAnswer(postId, answerId, body) {
    const refDoc = doc(db, FS_POSTS, postId, "answers", answerId);
    await updateDoc(refDoc, { body: safeStr(body), updatedAt: serverTimestamp() });
}
export function deleteAnswer(postId, answerId) { return deleteDoc(doc(db, FS_POSTS, postId, "answers", answerId)); }

export async function deleteQuestionCascade(postId) {
    try {
        const answersCol = collection(db, FS_POSTS, postId, "answers");
        const snap = await getDocs(answersCol);
        const ops = [];
        snap.forEach((d) => { ops.push(deleteDoc(doc(db, FS_POSTS, postId, "answers", d.id)).catch(() => { })); });
        await Promise.allSettled(ops);
    } catch { }
    await deletePost(postId);
}
