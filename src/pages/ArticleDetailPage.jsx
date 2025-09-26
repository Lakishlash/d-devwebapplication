import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    Container, Segment, Header, Image, Label, Message,
    Form, Button, Input
} from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import ErrorBoundary from "@/components/ErrorBoundary";
import { THEME } from "@/config";
import { useAuth } from "@/auth/AuthProvider";
import {
    watchPost, updatePost, deletePost,
    uploadArticleImage
} from "@/services/posts";
import TagsInput from "@/components/newpost/TagsInput";

function fmt(ts) { return ts?.toDate ? ts.toDate().toLocaleString() : ""; }

export default function ArticleDetailPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [abstract, setAbstract] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);

    // image update
    const [imageFile, setImageFile] = useState(null);
    const previewUrl = useMemo(
        () => (imageFile ? URL.createObjectURL(imageFile) : null),
        [imageFile]
    );
    useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

    const mine = !!(user?.uid && post?.author?.uid === user.uid);

    useEffect(() => {
        const unsub = watchPost(
            id,
            (p) => {
                setPost(p);
                if (p && !editing) {
                    setTitle(p?.title || "");
                    setAbstract(p?.abstract || "");
                    setBody(p?.body || "");
                    setTags(Array.isArray(p?.tags) ? p.tags : []);
                    setImageFile(null);
                }
            },
            (e) => setErr(e?.message || "Failed to load article.")
        );
        return () => unsub && unsub();
    }, [id, editing]);

    // tag helpers for TagsInput
    const addTag = (t) => setTags((xs) => (xs.length >= 3 ? xs : [...xs, t].filter(Boolean)));
    const removeTag = (i) => setTags((xs) => xs.filter((_, idx) => idx !== i));
    const popTag = () => setTags((xs) => xs.slice(0, -1));

    async function save() {
        try {
            setBusy(true);
            let imageUrl = post?.imageUrl || null;
            if (imageFile && user?.uid) {
                imageUrl = await uploadArticleImage(user.uid, imageFile);
            }
            await updatePost(id, { title, abstract, body, tags, imageUrl });
            setEditing(false);
        } catch (e) {
            setErr(e?.message || "Failed to update article.");
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        const ok = window.confirm("Delete this article? This cannot be undone.");
        if (!ok) return;
        try {
            setBusy(true);
            await deletePost(id);
            nav("/articles");
        } catch (e) {
            setErr(e?.message || "Failed to delete article.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ErrorBoundary>
            <main style={{ background: "var(--page)" }}>
                <Container style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
                    <div style={{ marginBottom: 12 }}>
                        <Link to="/articles" style={{ color: THEME.colors.accent }}>← Back to Articles</Link>
                    </div>

                    {err && <Message error content={err} />}

                    <Segment raised style={{ borderRadius: 16 }}>
                        {!editing ? (
                            <>
                                <Header as="h2" style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif" }}>
                                    {post?.title || "Article"}
                                </Header>

                                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                                    <Label image>
                                        <img src={post?.author?.photoURL || "/assets/default-avatar.svg"} alt="" />
                                        {post?.author?.name || "User"}
                                    </Label>
                                    <span style={{ color: "#666", fontSize: 13 }}>{fmt(post?.createdAt)}</span>
                                </div>

                                {post?.imageUrl && (
                                    <Image
                                        src={post.imageUrl}
                                        alt=""
                                        style={{ borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.08)", marginBottom: 16 }}
                                    />
                                )}

                                {post?.abstract && (
                                    <p style={{ fontWeight: 600, marginBottom: 12 }}>{post.abstract}</p>
                                )}

                                {/* Markdown body */}
                                <div className="md">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                                    >
                                        {post?.body || ""}
                                    </ReactMarkdown>
                                </div>

                                {mine && (
                                    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                                        <Button size="small" onClick={() => setEditing(true)}>Edit</Button>
                                        <Button size="small" negative onClick={remove}>Delete</Button>
                                    </div>
                                )}

                                <div style={{ marginTop: 12 }}>
                                    {(post?.tags || []).map((t) => (
                                        <Label key={t} basic style={{ borderRadius: 12, marginBottom: 6 }}>
                                            #{t}
                                        </Label>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <Header as="h3" style={{ color: THEME.colors.text }}>Edit article</Header>
                                <Form>
                                    <Form.Field>
                                        <label>Title</label>
                                        <Input value={title} onChange={(_, { value }) => setTitle(value)} />
                                    </Form.Field>
                                    <Form.TextArea
                                        label="Abstract"
                                        rows={3}
                                        value={abstract}
                                        onChange={(_, { value }) => setAbstract(value)}
                                    />
                                    <Form.TextArea
                                        label="Body (Markdown supported)"
                                        rows={12}
                                        value={body}
                                        onChange={(_, { value }) => setBody(value)}
                                    />
                                    <Form.Field>
                                        <label>Featured image</label>
                                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                        {previewUrl && (
                                            <div style={{ marginTop: 8 }}>
                                                <Image src={previewUrl} size="large" alt="preview" rounded />
                                            </div>
                                        )}
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
                                    <Button primary onClick={save} loading={busy}
                                        style={{ background: THEME.colors.accent, color: "#fff" }}>
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
