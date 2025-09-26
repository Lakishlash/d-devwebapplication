// src/components/questions/AnswerThread.jsx
import { useEffect, useState } from "react";
import { Comment, Button, Message, Dropdown } from "semantic-ui-react";
import { useAuth } from "@/auth/AuthProvider";
import { watchAnswers, addAnswer, updateAnswer, deleteAnswer, uploadQAImage, uploadQAPdf } from "@/services/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import RichMarkdownEditor from "@/components/editor/RichMarkdownEditor";

export default function AnswerThread({ postId }) {
    const { user, profile } = useAuth();
    const [answers, setAnswers] = useState([]);
    const [err, setErr] = useState("");
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [order, setOrder] = useState("asc"); // "asc" | "desc"

    useEffect(() => {
        const unsub = watchAnswers(
            postId,
            setAnswers,
            (e) => setErr(e?.message || "Failed to load answers."),
            order
        );
        return () => unsub && unsub();
    }, [postId, order]);

    async function submitNew() {
        if (!text.trim()) return;
        try {
            setBusy(true);
            const author = {
                uid: user?.uid || "",
                name:
                    (profile?.firstName && profile?.lastName
                        ? `${profile.firstName} ${profile.lastName}`
                        : user?.displayName) || "User",
                photoURL: profile?.photoURL || user?.photoURL || "/assets/default-avatar.svg",
            };
            await addAnswer(postId, { body: text.trim(), author });
            setText("");
        } catch (e) {
            setErr(e?.message || "Failed to add answer.");
        } finally {
            setBusy(false);
        }
    }

    async function saveEdit(id) {
        if (!editingText.trim()) return;
        try {
            setBusy(true);
            await updateAnswer(postId, id, editingText.trim());
            setEditingId(null);
            setEditingText("");
        } catch (e) {
            setErr(e?.message || "Failed to update answer.");
        } finally {
            setBusy(false);
        }
    }

    async function remove(id) {
        try {
            setBusy(true);
            await deleteAnswer(postId, id);
        } catch (e) {
            setErr(e?.message || "Failed to delete answer.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div style={{ marginTop: 12 }}>
            {err && <Message error content={err} />}

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <Dropdown
                    selection
                    options={[
                        { key: "asc", value: "asc", text: "Old → New" },
                        { key: "desc", value: "desc", text: "New → Old" },
                    ]}
                    value={order}
                    onChange={(_, { value }) => setOrder(value)}
                    compact
                />
            </div>

            <Comment.Group>
                {answers.map((a) => {
                    const mine = user?.uid && a?.author?.uid === user.uid;
                    const ts = a?.createdAt?.toDate ? a.createdAt.toDate().toLocaleString() : "";
                    return (
                        <Comment key={a.id}>
                            <Comment.Avatar src={a?.author?.photoURL || "/assets/default-avatar.svg"} />
                            <Comment.Content>
                                <Comment.Author as="span">{a?.author?.name || "User"}</Comment.Author>
                                <Comment.Metadata>{ts}</Comment.Metadata>

                                {editingId === a.id ? (
                                    <>
                                        <div style={{ marginTop: 8 }}>
                                            <RichMarkdownEditor
                                                value={editingText}
                                                onChange={setEditingText}
                                                onUploadImage={(f) => uploadQAImage(user?.uid, f)}
                                                onUploadPdf={(f) => uploadQAPdf(user?.uid, f)}
                                                placeholder="Edit your answer…"
                                            />
                                        </div>
                                        <div style={{ marginTop: 8 }}>
                                            <Button size="tiny" primary onClick={() => saveEdit(a.id)} loading={busy}>
                                                Save
                                            </Button>
                                            <Button
                                                size="tiny"
                                                basic
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditingText("");
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Comment.Text>
                                        <div className="md-body">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                                            >
                                                {a?.body || ""}
                                            </ReactMarkdown>
                                        </div>
                                    </Comment.Text>
                                )}

                                {mine && editingId !== a.id && (
                                    <Comment.Actions>
                                        <Comment.Action
                                            onClick={() => {
                                                setEditingId(a.id);
                                                setEditingText(a?.body || "");
                                            }}
                                        >
                                            Edit
                                        </Comment.Action>
                                        <Comment.Action onClick={() => remove(a.id)}>Delete</Comment.Action>
                                    </Comment.Actions>
                                )}
                            </Comment.Content>
                        </Comment>
                    );
                })}
            </Comment.Group>

            {user ? (
                <div style={{ marginTop: 12 }}>
                    <RichMarkdownEditor
                        value={text}
                        onChange={setText}
                        onUploadImage={(f) => uploadQAImage(user?.uid, f)}
                        onUploadPdf={(f) => uploadQAPdf(user?.uid, f)}
                        placeholder="Write your answer…"
                    />
                    <div style={{ marginTop: 10 }}>
                        <Button
                            content="Post answer"
                            labelPosition="left"
                            icon="edit"
                            primary
                            onClick={submitNew}
                            loading={busy}
                            disabled={!text.trim()}
                        />
                    </div>
                </div>
            ) : (
                <Message info content="Sign in to post an answer." />
            )}
        </div>
    );
}
