// src/components/questions/QuestionCard.jsx
import { useState } from "react";
import { Segment, Header, Label, Button, Icon, Dropdown } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { THEME } from "@/config";
import { useAuth } from "@/auth/AuthProvider";
import { deletePost } from "@/services/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

export default function QuestionCard({ item, isHidden = false, onHide, onUnhide }) {
    const nav = useNavigate();
    const { user } = useAuth();
    const mine = !!(user?.uid && item?.author?.uid === user.uid);

    const [open, setOpen] = useState(false);
    const created = item?.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : "";

    async function onDelete() {
        const ok = window.confirm("Delete this question? This cannot be undone.");
        if (!ok) return;
        try { await deletePost(item.id); } catch (e) { alert(e?.message || "Failed to delete question."); }
    }

    const trigger = (
        <Button icon basic size="small" style={{ borderRadius: 12 }}>
            <Icon name="ellipsis vertical" />
        </Button>
    );

    return (
        <Segment style={{ background: "#fff", borderRadius: 18, boxShadow: "0 8px 20px rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
                <div>
                    <Header as="h4" style={{ margin: 0, color: THEME.colors.text }}>{item?.title}</Header>
                    <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{created}</div>
                    <div style={{ marginTop: 6 }}>
                        {(item?.tags || []).map((t) => (
                            <Label key={t} basic style={{ borderRadius: 12, marginRight: 6, marginBottom: 6 }}>#{t}</Label>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isHidden ? (
                        <Button basic onClick={onUnhide} style={{ borderRadius: 12 }}><Icon name="eye" /> Unhide</Button>
                    ) : (
                        <Button basic onClick={onHide} style={{ borderRadius: 12 }}><Icon name="eye slash" /> Hide</Button>
                    )}

                    {mine && (
                        <Dropdown pointing="top right" icon={null} trigger={trigger}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/questions/${item.id}`} text="View" />
                                <Dropdown.Item onClick={() => nav(`/questions/${item.id}?edit=1`)} text="Edit" />
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={onDelete} text="Delete" />
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                    <Button primary as={Link} to={`/questions/${item.id}`}
                        style={{ background: THEME.colors.accent, color: "#fff", borderRadius: 12 }}>
                        Details
                    </Button>
                </div>
            </div>

            <div style={{ marginTop: 10 }}>
                <Button basic size="small" onClick={() => setOpen((s) => !s)} style={{ borderRadius: 12 }}>
                    {open ? "Hide details" : "Show details"}
                </Button>
            </div>

            {open && (
                <div style={{ marginTop: 12 }} className="md md--card">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                    >
                        {item?.description || ""}
                    </ReactMarkdown>
                </div>
            )}
        </Segment>
    );
}
