// src/pages/QuestionDetailPage.jsx
// Question detail + owner edit/delete, plus answers thread.
// - Owner: Edit title, description, tags; Delete question
// - Others: Read-only
// - Uses updatePost/deletePost from services; rules enforce ownership.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { Container, Segment, Header, Label, Message, Form, Button, Input } from "semantic-ui-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { THEME } from "@/config";
import { useAuth } from "@/auth/AuthProvider";
import { watchPost, updatePost, deletePost } from "@/services/posts";
import TagsInput from "@/components/newpost/TagsInput";
import AnswerThread from "@/components/questions/AnswerThread";

function tsToLocal(ts) {
    return ts?.toDate ? ts.toDate().toLocaleString() : "";
}

export default function QuestionDetailPage() {
    const { id } = useParams();
    const { search } = useLocation();
    const nav = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    // editing state
    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState([]);

    const mine = !!(user?.uid && post?.author?.uid === user.uid);

    // preload edit mode if ?edit=1
    useEffect(() => {
        const sp = new URLSearchParams(search);
        if (sp.get("edit") === "1") setEditing(true);
    }, [search]);

    // watch this question
    useEffect(() => {
        const unsub = watchPost(
            id,
            (p) => {
                setPost(p);
                if (p && !editing) {
                    setTitle(p?.title || "");
                    setDesc(p?.description || "");
                    setTags(Array.isArray(p?.tags) ? p.tags : []);
                }
            },
            (e) => setErr(e?.message || "Failed to load question.")
        );
        return () => unsub && unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, editing]);

    // TagsInput handlers
    const addTag = (t) =>
        setTags((xs) => (xs.length >= 3 ? xs : [...xs, (t || "").trim()].filter(Boolean)));
    const removeTag = (i) => setTags((xs) => xs.filter((_, idx) => idx !== i));
    const popTag = () => setTags((xs) => xs.slice(0, -1));

    async function save() {
        try {
            setBusy(true);
            setErr("");
            await updatePost(id, { title, description: desc, tags });
            setEditing(false);
        } catch (e) {
            const msg = e?.code ? `${e.code}: ${e.message}` : (e?.message || "Failed to update question.");
            setErr(msg);
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        const ok = window.confirm("Delete this question? This cannot be undone.");
        if (!ok) return;
        try {
            setBusy(true);
            await deletePost(id); // simple, reliable; see posts.js for optional cascade helper
            nav("/questions");
        } catch (e) {
            const msg = e?.code ? `${e.code}: ${e.message}` : (e?.message || "Failed to delete question.");
            setErr(msg);
        } finally {
            setBusy(false);
        }
    }

    return (
        <ErrorBoundary>
            <main style={{ background: "var(--page)" }}>
                <Container style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
                    <div style={{ marginBottom: 12 }}>
                        <Link to="/questions" style={{ color: THEME.colors.accent }}>
                            ← Back to Questions
                        </Link>
                    </div>

                    {err && <Message error content={err} />}

                    <Segment raised style={{ borderRadius: 16 }}>
                        {!editing ? (
                            <>
                                <Header as="h2" style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif" }}>
                                    {post?.title || "Question"}
                                </Header>

                                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                                    <Label image>
                                        <img src={post?.author?.photoURL || "/assets/default-avatar.svg"} alt="" />
                                        {post?.author?.name || "User"}
                                    </Label>
                                    <span style={{ color: "#666", fontSize: 13 }}>{tsToLocal(post?.createdAt)}</span>
                                </div>

                                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post?.description}</p>

                                <div style={{ marginTop: 12 }}>
                                    {(post?.tags || []).map((t) => (
                                        <Label key={t} basic style={{ borderRadius: 12, marginBottom: 6 }}>
                                            #{t}
                                        </Label>
                                    ))}
                                </div>

                                {mine && (
                                    <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                                        <Button size="small" onClick={() => setEditing(true)}>
                                            Edit
                                        </Button>
                                        <Button size="small" negative onClick={remove}>
                                            Delete
                                        </Button>
                                    </div>
                                )}

                                {/* Answers */}
                                <div style={{ marginTop: 20 }}>
                                    <Header as="h3" style={{ color: THEME.colors.text }}>Answers</Header>
                                    <AnswerThread postId={id} />
                                </div>
                            </>
                        ) : (
                            <>
                                <Header as="h3" style={{ color: THEME.colors.text }}>Edit question</Header>
                                <Form>
                                    <Form.Field>
                                        <label>Title</label>
                                        <Input value={title} onChange={(_, { value }) => setTitle(value)} />
                                    </Form.Field>

                                    <Form.TextArea
                                        label="Problem description"
                                        rows={6}
                                        value={desc}
                                        onChange={(_, { value }) => setDesc(value)}
                                    />

                                    <Form.Field>
                                        <label>Tags</label>
                                        <TagsInput
                                            tags={tags}
                                            addTag={addTag}
                                            removeTag={removeTag}
                                            popTag={popTag}
                                            max={3}
                                            placeholder="Add a tag and press Enter (max 3)"
                                        />
                                    </Form.Field>

                                    <Button
                                        primary
                                        onClick={save}
                                        loading={busy}
                                        style={{ background: THEME.colors.accent, color: "#fff" }}
                                    >
                                        Save
                                    </Button>
                                    <Button basic onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                </Form>
                            </>
                        )}
                    </Segment>
                </Container>
            </main>
        </ErrorBoundary>
    );
}
