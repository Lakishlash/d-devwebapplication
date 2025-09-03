// src/components/newpost/NewPostModal.jsx
import { useState } from "react";
import { Form, Header, Modal, Message, Segment } from "semantic-ui-react";
import { POST_TYPES, SCHEMA } from "../../data/postSchema";
import { THEME } from "../../config.js";
import { usePostForm } from "../../state/usePostForm";
import PostTypeSwitch from "./PostTypeSwitch";
import QuestionForm from "./QuestionForm";
import ArticleForm from "./ArticleForm";
import SubmitBar from "./SubmitBar";

export default function NewPostModal({ open, onClose }) {
    const f = usePostForm(POST_TYPES.QUESTION);

    // NEW: control when to reveal field errors, and a simple success banner
    const [revealErrors, setRevealErrors] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = () => {
        if (!f.isValid) {
            setRevealErrors(true);        // first time they click Post, show errors
            setShowSuccess(false);
            return;
        }
        setShowSuccess(true);           // local-only success (per 5.1C)
        setRevealErrors(false);
        f.reset();
    };

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
            {/* Modern, soft header */}
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
                style={{
                    background: THEME.colors.pageBg || "#fff",
                    color: THEME.colors.text,
                }}
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

                {/* Top message area */}
                {revealErrors && !f.isValid && (
                    <Message
                        error
                        header="Please fix the highlighted fields"
                        content="Some required fields are missing or invalid."
                    />
                )}
                {showSuccess && (
                    <Message
                        success
                        header="Post Created"
                        content="Thank you!"
                    />
                )}

                <Form>
                    <PostTypeSwitch value={f.postType} onChange={(v) => {
                        // switching types should also hide previous errors until submit again
                        f.setPostType(v);
                        setRevealErrors(false);
                    }} />

                    {/* Show field errors ONLY after the user clicks Post */}
                    {f.postType === POST_TYPES.QUESTION ? (
                        <QuestionForm
                            title={f.title} setTitle={f.setTitle}
                            onBlur={f.onBlur}
                            errors={revealErrors ? f.errors : {}}
                            questionBody={f.questionBody} setQuestionBody={f.setQuestionBody}
                            tags={f.tags} addTag={f.addTag} removeTag={f.removeTag} popTag={f.popTag}
                        />
                    ) : (
                        <ArticleForm
                            title={f.title} setTitle={f.setTitle}
                            onBlur={f.onBlur}
                            errors={revealErrors ? f.errors : {}}
                            articleAbstract={f.articleAbstract} setArticleAbstract={f.setArticleAbstract}
                            articleContent={f.articleContent} setArticleContent={f.setArticleContent}
                            tags={f.tags} addTag={f.addTag} removeTag={f.removeTag} popTag={f.popTag}
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
                {/* IMPORTANT: Post is always enabled; we validate on click */}
                <SubmitBar onCancel={onClose} onSubmit={handleSubmit} />
            </Modal.Actions>
        </Modal>
    );
}
