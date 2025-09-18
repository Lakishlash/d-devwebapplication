// src/firebase/posts.js
// Create post in Firestore matching your rules (supports question/article/tutorial).

import { db } from "@/firebase/app";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const POSTS = import.meta.env.VITE_FS_COLLECTION_POSTS || "posts";

export async function createPost({
    type,
    title,
    tags,
    // question
    description,
    // article
    abstract,
    body,
    imageUrl,
    imagePath,
    // tutorial
    videoUrl,
    videoPath,
    // author
    author, // { uid, name, photoURL? }
}) {
    const base = {
        type,
        title,
        tags: Array.isArray(tags) ? tags.slice(0, 3) : [],
        author: {
            uid: author.uid,
            name: author.name,
            photoURL: author.photoURL ?? null,
        },
        createdAt: serverTimestamp(),
    };

    let docData;
    if (type === "question") {
        docData = {
            ...base,
            description,
            abstract: null,
            body: null,
            imageUrl: null,
            videoUrl: null,
        };
    } else if (type === "article") {
        docData = {
            ...base,
            abstract,
            body,
            imageUrl: imageUrl ?? null,
            description: null,
            videoUrl: null,
        };
    } else if (type === "tutorial") {
        docData = {
            ...base,
            description,
            imageUrl: imageUrl ?? null,
            videoUrl: videoUrl ?? null,
            abstract: null,
            body: null,
        };
    } else {
        throw new Error("Unsupported post type");
    }

    // Optional storage paths (useful for later deletes) — rules don’t forbid extra fields.
    if (imagePath) docData.imagePath = imagePath;
    if (videoPath) docData.videoPath = videoPath;

    await addDoc(collection(db, POSTS), docData);
}
