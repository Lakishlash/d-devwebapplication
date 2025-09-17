// src/pages/TutorialDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    Container, Segment, Header, Image, Label, Message,
    Form, Button, Input
} from "semantic-ui-react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { THEME } from "@/config";
import { useAuth } from "@/auth/AuthProvider";
import {
    watchPost, deletePost,
    uploadTutorialImage, uploadTutorialVideo,
    updateTutorial
} from "@/services/posts";
import TagsInput from "@/components/newpost/TagsInput";

function fmt(ts) { return ts?.toDate ? ts.toDate().toLocaleString() : ""; }

export default function TutorialDetailPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);

    // new media to upload
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    const imgPreview = useMemo(
        () => (imageFile ? URL.createObjectURL(imageFile) : null),
        [imageFile]
    );
    useEffect(() => () => { if (imgPreview) URL.revokeObjectURL(imgPreview); }, [imgPreview]);

    const mine = !!(user?.uid && post?.author?.uid === user?.uid);

    useEffect(() => {
        const unsub = watchPost(
            id,
            (p) => {
                setPost(p);
                if (p && !editing) {
                    setTitle(p?.title || "");
                    setDescription(p?.description || "");
                    setTags(Array.isArray(p?.tags) ? p.tags : []);
                    setImageFile(null);
                    setVideoFile(null);
                }
            },
            (e) => setErr(e?.message || "Failed to load tutorial.")
        );
        return () => unsub && unsub();
    }, [id, editing]);

    // Tags input handlers
    const addTag = (t) =>
        setTags((xs) => (xs.length >= 3 ? xs : [...xs, (t || "").trim()].filter(Boolean)));
    const removeTag = (i) => setTags((xs) => xs.filter((_, idx) => idx !== i));
    const popTag = () => setTags((xs) => xs.slice(0, -1));

    async function save() {
        try {
            setBusy(true);
            setErr("");

            let imageUrl = post?.imageUrl ?? null;
            let videoUrl = post?.videoUrl ?? null;

            if (imageFile && user?.uid) {
                imageUrl = await uploadTutorialImage(user.uid, imageFile);
            }
            if (videoFile && user?.uid) {
                videoUrl = await uploadTutorialVideo(user.uid, videoFile);
            }

            await updateTutorial(id, {
                title: (title || "").trim(),
                description: (description || "").trim(),
                tags: Array.isArray(tags) ? tags.slice(0, 3) : [],
                imageUrl,
                videoUrl,
            });

            setEditing(false);
        } catch (e) {
            setErr(e?.message || "Failed to update tutorial.");
        } finally {
            setBusy(false);
        }
    }

    async function remove() {
        const ok = window.confirm("Delete this tutorial? This cannot be undone.");
        if (!ok) return;
        try {
            setBusy(true);
            await deletePost(id);
            nav("/tutorials");
        } catch (e) {
            setErr(e?.message || "Failed to delete tutorial.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <ErrorBoundary>
            <main style={{ background: "var(--page)" }}>
                <Container style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
                    <div style={{ marginBottom: 12 }}>
                        <Link to="/tutorials" style={{ color: THEME.colors.accent }}>← Back to Tutorials</Link>
                    </div>

                    {err && <Message error content={err} />}

                    <Segment raised style={{ borderRadius: 16 }}>
                        {!editing ? (
                            <>
                                <Header as="h2" style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif" }}>
                                    {post?.title || "Tutorial"}
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
                                {post?.videoUrl && (
                                    <video
                                        src={post.videoUrl}
                                        controls
                                        style={{ width: "100%", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,.08)", marginBottom: 16 }}
                                    />
                                )}

                                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post?.description}</p>

                                {mine && (
                                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
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
                                <Header as="h3" style={{ color: THEME.colors.text }}>Edit tutorial</Header>
                                <Form>
                                    <Form.Field>
                                        <label>Title</label>
                                        <Input value={title} onChange={(_, { value }) => setTitle(value)} />
                                    </Form.Field>

                                    <Form.TextArea
                                        label="Description"
                                        rows={6}
                                        value={description}
                                        onChange={(_, { value }) => setDescription(value)}
                                    />

                                    <Form.Field>
                                        <label>Thumbnail image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        />
                                        {imgPreview && (
                                            <div style={{ marginTop: 8 }}>
                                                <Image src={imgPreview} size="large" alt="preview" rounded />
                                            </div>
                                        )}
                                    </Form.Field>

                                    <Form.Field>
                                        <label>Video (optional)</label>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
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

                                    <Button
                                        primary
                                        onClick={save}
                                        loading={busy}
                                        disabled={!mine}
                                        style={{ background: THEME.colors.accent, color: "#fff" }}
                                    >
                                        Save
                                    </Button>
                                    <Button basic onClick={() => { setEditing(false); }}>
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
