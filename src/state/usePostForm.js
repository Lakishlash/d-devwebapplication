import { useMemo, useState } from "react";
import { POST_TYPES, SCHEMA } from "../data/postSchema";

const clean = (s) => s.trim();
const toTag = (s) =>
    clean(s)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

export function usePostForm(initialType = POST_TYPES.QUESTION) {
    const [postType, setPostType] = useState(initialType);
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [questionBody, setQuestionBody] = useState("");
    const [articleAbstract, setArticleAbstract] = useState("");
    const [articleContent, setArticleContent] = useState("");
    const [touched, setTouched] = useState({});

    const errors = useMemo(() => {
        const e = {};
        if (clean(title).length < SCHEMA.minTitleLen) {
            e.title = `Title must be at least ${SCHEMA.minTitleLen} characters.`;
        }
        if (tags.length < 1 || tags.length > SCHEMA.maxTags) {
            e.tags = `Add between 1 and ${SCHEMA.maxTags} tags.`;
        }
        if (postType === POST_TYPES.QUESTION) {
            if (clean(questionBody).length === 0) e.questionBody = "Required.";
        } else {
            if (clean(articleAbstract).length === 0) e.articleAbstract = "Required.";
            if (clean(articleContent).length === 0) e.articleContent = "Required.";
        }
        return e;
    }, [title, tags, questionBody, articleAbstract, articleContent, postType]);

    const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

    // tag helpers
    const canAddTag = (raw) => {
        const t = toTag(raw);
        return t && !tags.includes(t) && tags.length < SCHEMA.maxTags;
    };
    const addTag = (raw) => {
        const t = toTag(raw);
        if (!canAddTag(t)) return false;
        setTags((prev) => [...prev, t]);
        return true;
    };
    const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));
    const popTag = () => setTags((prev) => prev.slice(0, -1));

    const reset = () => {
        setTitle("");
        setTags([]);
        setQuestionBody("");
        setArticleAbstract("");
        setArticleContent("");
        setTouched({});
    };

    // simple field-touch tracking
    const onBlur = (name) => setTouched((p) => ({ ...p, [name]: true }));

    return {
        // state
        postType, setPostType,
        title, setTitle,
        tags, addTag, removeTag, popTag,
        questionBody, setQuestionBody,
        articleAbstract, setArticleAbstract,
        articleContent, setArticleContent,
        // validation
        touched, onBlur, errors, isValid,
        // utils
        reset,
    };
}
