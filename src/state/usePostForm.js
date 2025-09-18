// src/state/usePostForm.js
// Central form state + validation for New Post
// Supports all three types: question | article | tutorial
// - Keeps API stable for your existing forms/components
// - Ensures tags helpers always exist and never crash
// - NEVER hardcodes limits: uses SCHEMA.maxTags / SCHEMA.minTitleLen

import { useMemo, useState, useCallback } from "react";
import { POST_TYPES, SCHEMA } from "@/data/postSchema";

// Read limits from schema (with safe fallbacks)
const MAX_TAGS = Number(SCHEMA?.maxTags ?? 3);
const MIN_TITLE = Number(SCHEMA?.minTitleLen ?? 10);

export function usePostForm(initialType = POST_TYPES.QUESTION) {
    /* ------------------------ kind ------------------------ */
    const [postType, setPostType] = useState(
        Object.values(POST_TYPES).includes(initialType) ? initialType : POST_TYPES.QUESTION
    );

    /* ----------------------- common ----------------------- */
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]); // always an array

    // unified image state used by Article & Tutorial forms
    const [imageUrl, setImageUrl] = useState(null);  // useful for edit flows
    const [imageFile, setImageFile] = useState(null);

    /* ---------------------- question ---------------------- */
    const [questionBody, setQuestionBody] = useState("");

    /* ----------------------- article ---------------------- */
    const [articleAbstract, setArticleAbstract] = useState("");
    const [articleContent, setArticleContent] = useState("");

    /* ---------------------- tutorial ---------------------- */
    const [tutorialDescription, setTutorialDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);

    /* -------------------- tag helpers --------------------- */
    // Add a tag (case-insensitive dedupe, max SCHEMA.maxTags)
    const addTag = useCallback((raw) => {
        const v = (raw ?? "").trim();
        if (!v) return;
        setTags((prev) => {
            const arr = Array.isArray(prev) ? prev : [];
            if (arr.length >= MAX_TAGS) return arr;
            const exists = arr.some((t) => t.toLowerCase() === v.toLowerCase());
            return exists ? arr : [...arr, v];
        });
    }, []);

    // Remove a specific tag
    const removeTag = useCallback((t) => {
        setTags((prev) => (Array.isArray(prev) ? prev.filter((x) => x !== t) : []));
    }, []);

    // Pop the last tag (useful for Backspace behavior in TagsInput)
    const popTag = useCallback(() => {
        setTags((prev) => (Array.isArray(prev) ? prev.slice(0, Math.max(prev.length - 1, 0)) : []));
    }, []);

    /* --------------------- validation --------------------- */
    const errors = useMemo(() => {
        const e = {};

        // Title validation
        if (!title?.trim() || title.trim().length < MIN_TITLE) {
            e.title = `Title must be at least ${MIN_TITLE} characters.`;
        }

        // Tags validation
        if (!Array.isArray(tags)) {
            e.tags = "Tags must be a list.";
        } else if (tags.length > MAX_TAGS) {
            e.tags = `Please add up to ${MAX_TAGS} tags.`;
        }

        // Type-specific validation
        if (postType === POST_TYPES.QUESTION) {
            if (!questionBody?.trim()) e.questionBody = "Please describe your problem.";
            // keep article/tutorial-only fields ignored
        } else if (postType === POST_TYPES.ARTICLE) {
            if (!articleAbstract?.trim()) e.articleAbstract = "Please add a short abstract.";
            if (!articleContent?.trim()) e.articleContent = "Please add the article text.";
        } else if (postType === POST_TYPES.TUTORIAL) {
            if (!tutorialDescription?.trim()) e.tutorialDescription = "Please add a description.";
            // media optional by design
        }

        return e;
    }, [
        postType,
        title,
        tags,
        questionBody,
        articleAbstract,
        articleContent,
        tutorialDescription,
    ]);

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    // no-op; kept for compatibility with existing forms
    const onBlur = () => { };

    /* ------------------------ reset ----------------------- */
    const reset = useCallback(() => {
        setTitle("");
        setTags([]);
        setImageUrl(null);
        setImageFile(null);

        setQuestionBody("");

        setArticleAbstract("");
        setArticleContent("");

        setTutorialDescription("");
        setVideoFile(null);
        // NOTE: keep current postType unchanged so the user stays on the tab they chose
    }, []);

    /* ------------------------ API ------------------------- */
    return {
        // kind
        postType, setPostType,

        // shared
        title, setTitle,
        tags, addTag, removeTag, popTag,

        imageUrl, setImageUrl,
        imageFile, setImageFile,

        // question
        questionBody, setQuestionBody,

        // article
        articleAbstract, setArticleAbstract,
        articleContent, setArticleContent,

        // tutorial
        tutorialDescription, setTutorialDescription,
        videoFile, setVideoFile,

        // validation / UX
        errors, isValid, onBlur, reset,
    };
}
