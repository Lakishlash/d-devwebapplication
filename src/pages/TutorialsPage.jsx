// Same centered grid + filters. Reads ?q= from URL and keeps it in sync.

import { useEffect, useMemo, useState } from "react";
import { Container, Header, Segment, Message } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import { THEME } from "@/config";
import { watchTutorials, uniqueTags } from "@/services/posts";
import QuestionsFilterBar from "@/components/questions/QuestionsFilterBar";
import TutorialCard from "@/components/TutorialCard";

export default function TutorialsPage() {
    const nav = useNavigate();
    const loc = useLocation();
    const qParam = new URLSearchParams(loc.search).get("q") || "";

    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [indexTip, setIndexTip] = useState(false);

    const [titleQ, setTitleQ] = useState(qParam);
    const [tagSel, setTagSel] = useState([]);
    const [datePreset, setDatePreset] = useState("all");

    useEffect(() => { setTitleQ(qParam); }, [qParam]);

    useEffect(() => {
        const sp = new URLSearchParams(loc.search);
        const cur = sp.get("q") || "";
        if ((titleQ || "") === cur) return;
        if (titleQ) sp.set("q", titleQ); else sp.delete("q");
        nav({ pathname: loc.pathname, search: sp.toString() ? `?${sp.toString()}` : "" }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleQ]);

    useEffect(() => {
        const unsub = watchTutorials(
            (rows) => {
                setAll(rows);
                setLoading(false);
                setError("");
            },
            (err) => {
                const needsIndex = err?.code === "failed-precondition" && /requires.*index/i.test(err?.message || "");
                if (needsIndex) {
                    setIndexTip(true);
                    setLoading(false);
                } else if (err) {
                    setError("Failed to fetch tutorials.");
                    setLoading(false);
                }
            }
        );
        return () => unsub();
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
        return all.filter((p) => {
            if (titleQ && !p.title?.toLowerCase().includes(titleQ.toLowerCase())) return false;
            if (tagSel.length > 0) {
                const hasAny = (p.tags || []).some((t) => tagSel.includes((t || "").trim()));
                if (!hasAny) return false;
            }
            if (maxAgeMs) {
                const ts = p.createdAt?.toMillis ? p.createdAt.toMillis() : p.createdAt?.seconds * 1000;
                if (!ts || now - ts > maxAgeMs) return false;
            }
            return true;
        });
    }, [all, titleQ, tagSel, maxAgeMs, now]);

    return (
        <main style={{ background: THEME.colors.pageBg || "#f5f5f7", minHeight: "100vh" }}>
            <Container style={{ paddingTop: 20, paddingBottom: 28 }}>
                <Header
                    as="h1"
                    content="Tutorials"
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

                {indexTip && (
                    <Message
                        info
                        style={{ borderRadius: 12 }}
                        content={<div><strong>Tip:</strong> Create a composite index for <code>posts</code>: <em>type ASC</em>, <em>createdAt DESC</em>.</div>}
                    />
                )}
                {loading && <Message info content="Loading tutorials…" />}
                {error && <Message error content={error} />}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: 24,
                        alignItems: "start",
                    }}
                >
                    {filtered.map((t) => (
                        <TutorialCard
                            key={t.id}
                            item={{
                                ...t,
                                imageUrl: t.imageUrl || t.image || null,
                                image: t.imageUrl || t.image || null,
                                description: t.abstract || t.description || "",
                            }}
                        />
                    ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <Message info header="No tutorials yet" content="Try creating one from the Post dialog." />
                )}
            </Container>
        </main>
    );
}
