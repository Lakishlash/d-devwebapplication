// src/components/questions/AnswerThread.jsx
import { useEffect, useState } from "react";
import { Comment, Form, Button, Message } from "semantic-ui-react";
import { useAuth } from "@/auth/AuthProvider";
import { watchAnswers, addAnswer, updateAnswer, deleteAnswer } from "@/services/posts";

export default function AnswerThread({ postId }) {
    const { user, profile } = useAuth();
    const [answers, setAnswers] = useState([]);
    const [err, setErr] = useState("");
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const unsub = watchAnswers(
            postId,
            setAnswers,
            (e) => setErr(e?.message || "Failed to load answers.")
        );
        return () => unsub && unsub();
    }, [postId]);

    async function submitNew() {
        if (!text.trim()) return;
        try {
            setBusy(true);

            // Build the author shape expected by Firestore docs
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
                                        <Form.TextArea
                                            value={editingText}
                                            onChange={(_, { value }) => setEditingText(value)}
                                            rows={3}
                                        />
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
                                    </>
                                ) : (
                                    <Comment.Text style={{ whiteSpace: "pre-wrap" }}>{a?.body}</Comment.Text>
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
                <Form reply>
                    <Form.TextArea
                        placeholder="Write your answer…"
                        value={text}
                        onChange={(_, { value }) => setText(value)}
                        rows={3}
                    />
                    <Button
                        content="Post answer"
                        labelPosition="left"
                        icon="edit"
                        primary
                        onClick={submitNew}
                        loading={busy}
                        disabled={!text.trim()}
                    />
                </Form>
            ) : (
                <Message info content="Sign in to post an answer." />
            )}
        </div>
    );
}
