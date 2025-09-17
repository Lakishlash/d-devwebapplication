// src/firebase/storage.js
// Storage helpers: article image + tutorial thumbnail/video uploads with progress.

import { storage } from "./app";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function uploadArticleImage({ uid, file }, onProgress) {
    const root = import.meta.env.VITE_STORAGE_ARTICLES_ROOT || "articles";
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const path = `${root}/${uid}/article_${Date.now()}.${ext}`;
    return uploadWithProgress(path, file, onProgress);
}

export function uploadTutorialThumb({ uid, file }, onProgress) {
    const root = import.meta.env.VITE_STORAGE_TUTORIALS_ROOT || "tutorials";
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const path = `${root}/${uid}/thumb_${Date.now()}.${ext}`;
    return uploadWithProgress(path, file, onProgress);
}

export function uploadTutorialVideo({ uid, file }, onProgress) {
    const root = import.meta.env.VITE_STORAGE_TUTORIALS_ROOT || "tutorials";
    const ext = (file.name?.split(".").pop() || "mp4").toLowerCase();
    const path = `${root}/${uid}/video_${Date.now()}.${ext}`;
    return uploadWithProgress(path, file, onProgress);
}

// internal
function uploadWithProgress(path, file, onProgress) {
    const r = ref(storage, path);
    const task = uploadBytesResumable(r, file, { contentType: file.type || "application/octet-stream" });
    return new Promise((resolve, reject) => {
        task.on(
            "state_changed",
            (snap) => {
                if (typeof onProgress === "function" && snap.totalBytes > 0) {
                    onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
                }
            },
            reject,
            async () => {
                const downloadURL = await getDownloadURL(task.snapshot.ref);
                resolve({ downloadURL, path });
            }
        );
    });
}
