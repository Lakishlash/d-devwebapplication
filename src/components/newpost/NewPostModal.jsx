// src/components/newpost/NewPostModal.jsx
// Modal for creating a new post. Shows a success message briefly before closing.

import { useState } from "react";
import { Form, Header, Modal, Message, Segment } from "semantic-ui-react";

import { POST_TYPES, SCHEMA } from "@/data/postSchema";
import { THEME } from "@/config.js";
import { usePostForm } from "@/state/usePostForm";
import { useAuth } from "@/auth/AuthProvider";

// services
import {
    createPost,
    uploadArticleImage,
    uploadTutorialImage,
    uploadTutorialVideo,
} from "@/services/posts";

// sub-forms
import PostTypeSwitch from "./PostTypeSwitch";
import QuestionForm from "./QuestionForm";
import ArticleForm from "./ArticleForm";
import TutorialForm from "./TutorialForm";
import SubmitBar from "./SubmitBar";

export default function NewPostModal({ open, onClose }) {
    const f = usePostForm(POST_TYPES.QUESTION);
    const { user, profile } = useAuth();

    const [revealErrors, setRevealErrors] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    async function handleSubmit() {
        setSubmitError("");

        // UI validation first
        if (!f.isValid) {
            setRevealErrors(true);
            setShowSuccess(false);
            return;
        }

        // Auth guard (required by Firestore rules)
        if (!user?.uid) {
            setSubmitError("Please sign in to post.");
            return;
        }

        // Build author object the rules expect
        const author = {
            uid: user.uid,
            name:
                ((profile?.firstName ? profile.firstName + " " : "") +
                    (profile?.lastName || "")).trim() ||
                user.displayName ||
                "User",
            photoURL: profile?.photoURL || user.photoURL || null,
        };

        // Always pass an array for tags (≤ 3)
        const safeTags = Array.isArray(f.tags) ? f.tags.slice(0, 3) : [];

        try {
            // Resolve media URLs (only if files selected)
            let imageUrl = f.imageUrl || null;
            let videoUrl = f.videoUrl || null;

            if (f.postType === POST_TYPES.ARTICLE && f.imageFile) {
                imageUrl = await uploadArticleImage(user.uid, f.imageFile);
            }
            if (f.postType === POST_TYPES.TUTORIAL) {
                if (f.imageFile) imageUrl = await uploadTutorialImage(user.uid, f.imageFile);
                if (f.videoFile) videoUrl = await uploadTutorialVideo(user.uid, f.videoFile);
            }

            // Create the document by type
            if (f.postType === POST_TYPES.QUESTION) {
                await createPost({
                    type: "question",
                    title: f.title,
                    description: f.questionBody,
                    tags: safeTags,
                    author,
                    imageUrl: null,
                });
            } else if (f.postType === POST_TYPES.ARTICLE) {
                await createPost({
                    type: "article",
                    title: f.title,
                    abstract: f.articleAbstract,
                    body: f.articleContent,
                    tags: safeTags,
                    author,
                    imageUrl,
                });
            } else {
                // tutorial
                await createPost({
                    type: "tutorial",
                    title: f.title,
                    description: f.tutorialDescription,
                    tags: safeTags,
                    author,
                    imageUrl,
                    videoUrl,
                });
            }

            // ✅ Show success, clear form, then auto-close so the banner is visible
            setShowSuccess(true);
            setRevealErrors(false);
            f.reset();

            window.setTimeout(() => {
                setShowSuccess(false);
                onClose?.();
            }, 1200);
        } catch (err) {
            const msg = String(err?.message || "");
            if (msg.toLowerCase().includes("storage/unauthorized")) {
                setSubmitError(
                    "Storage permissions blocked the upload. Check your Storage rules for /articles and /tutorials."
                );
            } else {
                setSubmitError(msg || "Failed to create the post.");
            }
            setShowSuccess(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="large"
            closeIcon
            dimmer="blurring"
            className="newpost-modal"
            style={{
                borderRadius: "var(--btn-radius)",
                boxShadow: "var(--shadow-lg, 0 20px 50px rgba(0,0,0,.15))",
            }}
        >
            {/* Soft, modern header */}
            <Modal.Header
                style={{
                    background: THEME.colors.soft,
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    color: THEME.colors.text,
                    fontFamily: "Poppins, sans-serif",
                    borderTopLeftRadius: "var(--btn-radius)",
                    borderTopRightRadius: "var(--btn-radius)",
                }}
            >
                {SCHEMA.headings.page}
            </Modal.Header>

            <Modal.Content
                scrolling
                style={{ background: THEME.colors.pageBg || "#fff", color: THEME.colors.text }}
            >
                <Segment
                    style={{
                        background: "#fff",
                        borderRadius: "var(--btn-radius)",
                        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
                        marginBottom: 18,
                    }}
                >
                    <Header as="h4" style={{ margin: 0, color: THEME.colors.text }}>
                        {SCHEMA.headings.section}
                    </Header>
                </Segment>

                {/* Messages */}
                {revealErrors && !f.isValid && (
                    <Message
                        error
                        header="Please fix the highlighted fields"
                        content="Some required fields are missing or invalid."
                    />
                )}
                {!!submitError && <Message error header="Error" content={submitError} />}
                {showSuccess && <Message success header="Post Created" content="Thank you!" />}

                <Form>
                    {/* Post type switch */}
                    <PostTypeSwitch
                        value={f.postType}
                        onChange={(v) => {
                            f.setPostType(v);
                            setRevealErrors(false);
                            setSubmitError("");
                            setShowSuccess(false);
                        }}
                    />

                    {/* Per-type form */}
                    {f.postType === POST_TYPES.QUESTION ? (
                        <QuestionForm
                            title={f.title}
                            setTitle={f.setTitle}
                            onBlur={f.onBlur}
                            errors={revealErrors ? f.errors : {}}
                            questionBody={f.questionBody}
                            setQuestionBody={f.setQuestionBody}
                            tags={f.tags}
                            addTag={f.addTag}
                            removeTag={f.removeTag}
                            popTag={f.popTag}
                        />
                    ) : f.postType === POST_TYPES.ARTICLE ? (
                        <ArticleForm
                            title={f.title}
                            setTitle={f.setTitle}
                            onBlur={f.onBlur}
                            errors={revealErrors ? f.errors : {}}
                            articleAbstract={f.articleAbstract}
                            setArticleAbstract={f.setArticleAbstract}
                            articleContent={f.articleContent}
                            setArticleContent={f.setArticleContent}
                            tags={f.tags}
                            addTag={f.addTag}
                            removeTag={f.removeTag}
                            popTag={f.popTag}
                            /* NEW: make Article use the same media picker/preview as Tutorial */
                            imageFile={f.imageFile}
                            setImageFile={f.setImageFile}
                            imageUrl={f.imageUrl}
                        />
                    ) : (
                        <TutorialForm
                            title={f.title}
                            setTitle={f.setTitle}
                            onBlur={f.onBlur}
                            errors={revealErrors ? f.errors : {}}
                            tutorialDescription={f.tutorialDescription}
                            setTutorialDescription={f.setTutorialDescription}
                            imageFile={f.imageFile}
                            setImageFile={f.setImageFile}
                            imageUrl={f.imageUrl}
                            videoFile={f.videoFile}
                            setVideoFile={f.setVideoFile}
                            tags={f.tags}
                            addTag={f.addTag}
                            removeTag={f.removeTag}
                            popTag={f.popTag}
                        />
                    )}
                </Form>
            </Modal.Content>

            <Modal.Actions
                style={{
                    background: "#fff",
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    borderBottomLeftRadius: "var(--btn-radius)",
                    borderBottomRightRadius: "var(--btn-radius)",
                }}
            >
                <SubmitBar onCancel={onClose} onSubmit={handleSubmit} />
            </Modal.Actions>
        </Modal>
    );
}
