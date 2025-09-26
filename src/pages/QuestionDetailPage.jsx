// src/pages/QuestionDetailPage.jsx

// QuestionDetailPage.jsx (full)
// Shows Markdown for question body; owner can edit with RichMarkdownEditor.

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { Container, Segment, Header, Label, Message, Form, Button, Input } from "semantic-ui-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { THEME } from "@/config";
import { useAuth } from "@/auth/AuthProvider";
import { watchPost, updatePost, deletePost, uploadQAImage, uploadQAPdf } from "@/services/posts";
import TagsInput from "@/components/newpost/TagsInput";
import AnswerThread from "@/components/questions/AnswerThread";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import RichMarkdownEditor from "@/components/editor/RichMarkdownEditor";

function tsToLocal(ts) { return ts?.toDate ? ts.toDate().toLocaleString() : ""; }

export default function QuestionDetailPage() {
    const { id } = useParams();
    const { search } = useLocation();
    const nav = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tags, setTags] = useState([]);

    const mine = !!(user?.uid && post?.author?.uid === user.uid);

    useEffect(() => {
        const sp = new URLSearchParams(search);
        if (sp.get("edit") === "1") setEditing(true);
    }, [search]);

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
    }, [id, editing]);

    const addTag = (t) => setTags((xs) => (xs.length >= 3 ? xs : [...xs, (t || "").trim()].filter(Boolean)));
    const removeTag = (i) => setTags((xs) => xs.filter((_, idx) => idx !== i));
    const popTag = () => setTags((xs) => xs.slice(0, -1));

    async function save() {
        try {
            setBusy(true);
            setErr("");
            await updatePost(id, { title, description: desc, tags });
            setEditing(false);
        } catch (e) {
            setErr(e?.message || "Failed to update question.");
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        const ok = window.confirm("Delete this question? This cannot be undone.");
        if (!ok) return;
        try {
            setBusy(true);
            await deletePost(id);
            nav("/questions");
        } catch (e) {
            setErr(e?.message || "Failed to delete question.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ErrorBoundary>
            <main style={{ background: "var(--page)" }}>
                <Container style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
                    <div style={{ marginBottom: 12 }}>
                        <Link to="/questions" style={{ color: THEME.colors.accent }}>← Back to Questions</Link>
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

                                {/* Markdown body with safe styling + auto-fit images */}
                                <div className="md-body" style={{ lineHeight: 1.6 }}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
                                        {post?.description || ""}
                                    </ReactMarkdown>
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    {(post?.tags || []).map((t) => (
                                        <Label key={t} basic style={{ borderRadius: 12, marginBottom: 6 }}>
                                            #{t}
                                        </Label>
                                    ))}
                                </div>

                                {mine && (
                                    <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                                        <Button size="small" onClick={() => setEditing(true)}>Edit</Button>
                                        <Button size="small" negative onClick={remove}>Delete</Button>
                                    </div>
                                )}

                                {/* Answers */}
                                <div style={{ marginTop: 26 }}>
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

                                    <Form.Field>
                                        <label>Problem description</label>
                                        <RichMarkdownEditor
                                            value={desc}
                                            onChange={setDesc}
                                            onUploadImage={(f) => uploadQAImage(user?.uid, f)}
                                            onUploadPdf={(f) => uploadQAPdf(user?.uid, f)}
                                        />
                                    </Form.Field>

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

                                    <Button primary onClick={save} loading={busy} style={{ background: THEME.colors.accent, color: "#fff" }}>
                                        Save
                                    </Button>
                                    <Button basic onClick={() => setEditing(false)}>Cancel</Button>
                                </Form>
                            </>
                        )}
                    </Segment>
                </Container>
            </main>
        </ErrorBoundary>
    );
}
