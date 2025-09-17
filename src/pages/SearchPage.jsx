// src/pages/SearchPage.jsx
// Global search: shows Articles, Tutorials, and Questions together.

import { useEffect, useMemo, useState } from "react";
import { Container, Header, Segment, Message, Input, Label } from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import { THEME } from "@/config";
import {
    fetchLatestArticles,
    fetchLatestTutorials,
    fetchLatestQuestions,
} from "@/services/posts";
import ArticleCard from "@/components/ArticleCard";
import TutorialCard from "@/components/TutorialCard";
import QuestionCard from "@/components/questions/QuestionCard";

function useQueryParam(name) {
    const { search } = useLocation();
    return new URLSearchParams(search).get(name) || "";
}

function matches(q, item) {
    if (!q) return true;
    const needle = q.toLowerCase();
    const hay = [
        item.title,
        item.description,
        item.abstract,
        item.body,
        (item.tags || []).join(" "),
        item?.author?.name,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return hay.includes(needle);
}

export default function SearchPage() {
    const nav = useNavigate();
    const qParam = useQueryParam("q");

    const [q, setQ] = useState(qParam);
    useEffect(() => setQ(qParam), [qParam]);

    // raw data
    const [articles, setArticles] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let ok = true;
        setLoading(true);
        setErr("");
        Promise.all([
            fetchLatestArticles(100),
            fetchLatestTutorials(100),
            fetchLatestQuestions(100),
        ])
            .then(([a, t, q]) => {
                if (!ok) return;
                setArticles(a);
                setTutorials(t);
                setQuestions(q);
            })
            .catch((e) => ok && setErr(e?.message || "Failed to load search index."))
            .finally(() => ok && setLoading(false));
        return () => {
            ok = false;
        };
    }, []);

    // filtered
    const fArticles = useMemo(() => (articles || []).filter((x) => matches(q, x)), [articles, q]);
    const fTutorials = useMemo(() => (tutorials || []).filter((x) => matches(q, x)), [tutorials, q]);
    const fQuestions = useMemo(() => (questions || []).filter((x) => matches(q, x)), [questions, q]);

    const total = fArticles.length + fTutorials.length + fQuestions.length;

    function onSubmit(e) {
        e?.preventDefault?.();
        const query = q.trim();
        nav({ pathname: "/search", search: query ? `?q=${encodeURIComponent(query)}` : "" }, { replace: true });
    }

    return (
        <main style={{ background: THEME.colors.pageBg || "#f5f5f7", minHeight: "100vh" }}>
            <Container style={{ paddingTop: 20, paddingBottom: 28 }}>
                <Header
                    as="h1"
                    content="Search"
                    style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                />

                {/* search box on the page (keeps URL in sync) */}
                <form onSubmit={onSubmit}>
                    <Segment style={{ background: "#fff", borderRadius: 18, boxShadow: "0 8px 20px rgba(0,0,0,.06)" }}>
                        <Input
                            fluid
                            icon="search"
                            placeholder="Search across articles, tutorials, and questions…"
                            value={q}
                            onChange={(_, d) => setQ(d.value)}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Label basic>
                                Results: <strong style={{ marginLeft: 6 }}>{loading ? "…" : total}</strong>
                            </Label>
                        </div>
                    </Segment>
                </form>

                {err && <Message error content={err} />}
                {loading && <Message info content="Loading…" />}

                {/* ARTICLES */}
                <Header as="h3" style={{ marginTop: 8 }}>Articles ({fArticles.length})</Header>
                {fArticles.length === 0 ? (
                    <Message info content="No articles match your query." />
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 360px))",
                            gap: 24,
                            justifyContent: "center",
                            alignItems: "start",
                        }}
                    >
                        {fArticles.map((a) => (
                            <ArticleCard
                                key={a.id}
                                item={{
                                    ...a,
                                    imageUrl: a.imageUrl || a.image || null,
                                    image: a.imageUrl || a.image || null,
                                    description: a.abstract || a.description || "",
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* TUTORIALS */}
                <Header as="h3" style={{ marginTop: 22 }}>Tutorials ({fTutorials.length})</Header>
                {fTutorials.length === 0 ? (
                    <Message info content="No tutorials match your query." />
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 360px))",
                            gap: 24,
                            justifyContent: "center",
                            alignItems: "start",
                        }}
                    >
                        {fTutorials.map((t) => (
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
                )}

                {/* QUESTIONS */}
                <Header as="h3" style={{ marginTop: 22 }}>Questions ({fQuestions.length})</Header>
                {fQuestions.length === 0 ? (
                    <Message info content="No questions match your query." />
                ) : (
                    <div style={{ display: "grid", gap: 12 }}>
                        {fQuestions.map((q) => (
                            <QuestionCard key={q.id} item={q} />
                        ))}
                    </div>
                )}

                {!loading && total === 0 && (
                    <Message info header="No results" content="Try a different keyword or check your spelling." />
                )}
            </Container>
        </main>
    );
}
