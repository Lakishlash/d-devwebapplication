// Real-time Questions with filters + hide/unhide. Reads ?q= from URL and keeps it in sync.

import { useEffect, useMemo, useState } from "react";
import { Container, Header, Segment, Message, Button, Icon } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { watchQuestions, uniqueTags } from "@/services/posts";
import QuestionsFilterBar from "@/components/questions/QuestionsFilterBar";
import QuestionCard from "@/components/questions/QuestionCard";
import { THEME } from "@/config";

const keyFor = (uid) => `hidden-questions:${uid || "guest"}`;
const loadHidden = (uid) => {
    try { return new Set(JSON.parse(localStorage.getItem(keyFor(uid)) || "[]")); }
    catch { return new Set(); }
};
const saveHidden = (uid, set) =>
    localStorage.setItem(keyFor(uid), JSON.stringify(Array.from(set)));

export default function QuestionsPage() {
    const { user } = useAuth();
    const nav = useNavigate();
    const loc = useLocation();
    const qParam = new URLSearchParams(loc.search).get("q") || "";

    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [titleQ, setTitleQ] = useState(qParam);
    const [tagSel, setTagSel] = useState([]);
    const [datePreset, setDatePreset] = useState("all");

    const [hidden, setHidden] = useState(loadHidden(user?.uid));
    useEffect(() => setHidden(loadHidden(user?.uid)), [user?.uid]);

    const [showHidden, setShowHidden] = useState(false);

    // hydrate from URL
    useEffect(() => { setTitleQ(qParam); }, [qParam]);

    // keep URL in sync with input
    useEffect(() => {
        const sp = new URLSearchParams(loc.search);
        const cur = sp.get("q") || "";
        if ((titleQ || "") === cur) return;
        if (titleQ) sp.set("q", titleQ); else sp.delete("q");
        nav({ pathname: loc.pathname, search: sp.toString() ? `?${sp.toString()}` : "" }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleQ]);

    useEffect(() => {
        const unsub = watchQuestions(
            (rows) => {
                setAll(rows);
                setLoading(false);
                setError("");
            },
            () => {
                setError("Failed to fetch questions.");
                setLoading(false);
            }
        );
        return () => unsub && unsub();
    }, []);

    const tagOptions = useMemo(
        () => uniqueTags(all).map((t) => ({ key: t, value: t, text: t })),
        [all]
    );

    const now = Date.now();
    const maxAgeMs =
        datePreset === "7d" ? 7 * 24 * 3600 * 1000 :
            datePreset === "30d" ? 30 * 24 * 3600 * 1000 : null;

    const filtered = useMemo(() => {
        return all.filter((q) => {
            if (titleQ && !q.title?.toLowerCase().includes(titleQ.toLowerCase())) return false;
            if (tagSel.length > 0) {
                const hasAny = (q.tags || []).some((t) => tagSel.includes((t || "").trim()));
                if (!hasAny) return false;
            }
            if (maxAgeMs) {
                const ts = q.createdAt?.toMillis ? q.createdAt.toMillis()
                    : q.createdAt?.seconds ? q.createdAt.seconds * 1000 : null;
                if (!ts || now - ts > maxAgeMs) return false;
            }
            return true;
        });
    }, [all, titleQ, tagSel, maxAgeMs, now]);

    const visible = filtered.filter((q) => !hidden.has(q.id));
    const hiddenList = filtered.filter((q) => hidden.has(q.id));

    const hideOne = (id) => {
        const next = new Set(hidden);
        next.add(id);
        setHidden(next);
        saveHidden(user?.uid, next);
    };
    const unhideOne = (id) => {
        const next = new Set(hidden);
        next.delete(id);
        setHidden(next);
        saveHidden(user?.uid, next);
    };
    const clearHidden = () => {
        const next = new Set();
        setHidden(next);
        saveHidden(user?.uid, next);
    };

    return (
        <main style={{ background: THEME.colors.pageBg || "#f5f5f7", minHeight: "100vh" }}>
            <Container style={{ paddingTop: 20, paddingBottom: 28 }}>
                <Header
                    as="h1"
                    content="Find Question"
                    style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                />

                <Segment style={{ background: "#fff", borderRadius: 18, boxShadow: "0 8px 20px rgba(0,0,0,.06)" }}>
                    <QuestionsFilterBar
                        titleQ={titleQ}
                        onTitleQ={setTitleQ}
                        tagOptions={tagOptions}
                        selectedTags={tagSel}
                        onTags={setTagSel}
                        datePreset={datePreset}
                        onDatePreset={setDatePreset}
                        onReset={() => { setTitleQ(""); setTagSel([]); setDatePreset("all"); }}
                    />
                </Segment>

                {loading && <Message info content="Loading questions…" />}
                {error && <Message error content={error} />}

                <div style={{ display: "grid", gap: 12 }}>
                    {visible.map((q) => (
                        <QuestionCard key={q.id} item={q} onHide={() => hideOne(q.id)} />
                    ))}
                    {!loading && visible.length === 0 && (
                        <Message
                            info
                            header="No questions found"
                            content="Try clearing filters or adjusting the date range."
                        />
                    )}
                </div>

                <div style={{ marginTop: 18 }}>
                    <Button
                        basic
                        onClick={() => setShowHidden((s) => !s)}
                        disabled={hiddenList.length === 0}
                        style={{ borderRadius: 12 }}
                    >
                        <Icon name={showHidden ? "eye" : "eye slash"} />
                        {showHidden ? "Hide hidden" : `Show hidden (${hiddenList.length})`}
                    </Button>

                    {showHidden && hiddenList.length > 0 && (
                        <Segment
                            style={{ marginTop: 12, background: "#fff", borderRadius: 18, boxShadow: "0 8px 20px rgba(0,0,0,.06)" }}
                        >
                            <Header as="h4" content="Hidden questions" />
                            <div style={{ display: "grid", gap: 12 }}>
                                {hiddenList.map((q) => (
                                    <QuestionCard
                                        key={`h-${q.id}`}
                                        item={q}
                                        isHidden
                                        onUnhide={() => unhideOne(q.id)}
                                    />
                                ))}
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <Button negative basic onClick={clearHidden} style={{ borderRadius: 12 }}>
                                    Clear all hidden
                                </Button>
                            </div>
                        </Segment>
                    )}
                </div>
            </Container>
        </main>
    );
}
