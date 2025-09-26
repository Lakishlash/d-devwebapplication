// src/pages/FaqsPage.jsx

import { useMemo, useState } from "react";
import {
    Container,
    Header,
    Segment,
    Input,
    Icon,
    Accordion,
    Label,
    Divider,
} from "semantic-ui-react";
import { THEME } from "@/config";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

const CATEGORIES = [
    {
        key: "posting",
        title: "Posting & Questions",
        items: [
            {
                q: "What makes a great question?",
                a: "Use a clear title, describe the problem, list steps to reproduce, and show a minimal code sample. Tags help the right people find it."
            },
            {
                q: "Can I edit my question later?",
                a: "Yes. Open your question and click **Edit**. Changes are versioned; readers always see the latest revision."
            },
            {
                q: "How do tags work?",
                a: "Add up to **3** tags that best describe your topic (e.g., `react`, `express`, `cookies`). Tags power filtering and search."
            },
            {
                q: "What formats are supported?",
                a: "Markdown (with tables, code blocks), images (PNG/JPG/GIF) and PDFs. Large images are auto-sized on display."
            },
        ],
    },
    {
        key: "answers",
        title: "Answers & Markdown",
        items: [
            {
                q: "How do I format code?",
                a: "Wrap code with triple backticks:\n\n```js\nfetch('/api/login', {credentials: 'include'})\n```\n\nSyntax highlighting is automatic."
            },
            {
                q: "Why do images show as previews (not raw URLs)?",
                a: "When you upload an image or PDF, we insert a friendly preview below the editor, while keeping the markdown reference so your content stays portable."
            },
            {
                q: "Can I switch between Rich and Markdown editors?",
                a: "Yep. Use the **Switch to Markdown** / **Switch to Rich Editor** toggle above the editor. Your content is preserved."
            },
        ],
    },
    {
        key: "account",
        title: "Account & Profile",
        items: [
            {
                q: "How do I update my profile?",
                a: "Open the avatar menu (top right) → **My profile**. You can change your name, photo, and bio."
            },
            {
                q: "Do I need an account to post?",
                a: "Reading is open to everyone; posting questions and answers requires a free account."
            },
        ],
    },
    {
        key: "billing",
        title: "Billing & Plans",
        items: [
            {
                q: "What do paid plans include?",
                a: "Premium unlocks advanced search, saved threads, and priority support. See **Plans** for details."
            },
            {
                q: "How do I cancel?",
                a: "Visit **Plans** → **Manage**. Billing is handled securely via Stripe. You can cancel anytime."
            },
        ],
    },
];

const POPULAR = [
    "How do I format code?",
    "Can I edit my question later?",
    "What makes a great question?",
    "Why do images show as previews (not URLs)?",
];

export default function FaqsPage() {
    const [query, setQuery] = useState("");
    const [active, setActive] = useState({}); // { 'posting-0': true }

    const flat = useMemo(() => {
        const rows = [];
        CATEGORIES.forEach((cat) =>
            cat.items.forEach((it, idx) =>
                rows.push({
                    cat: cat.title,
                    key: `${cat.key}-${idx}`,
                    ...it,
                })
            )
        );
        return rows;
    }, []);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return flat.filter(
            (r) =>
                r.q.toLowerCase().includes(q) ||
                r.a.toLowerCase().includes(q) ||
                r.cat.toLowerCase().includes(q)
        );
    }, [flat, query]);

    const toggle = (k) =>
        setActive((m) => ({
            ...m,
            [k]: !m[k],
        }));

    return (
        <main style={{ background: "var(--page)" }}>
            {/* Hero */}
            <div
                style={{
                    background:
                        "linear-gradient(135deg, rgba(1,113,227,.08), rgba(1,113,227,.02))",
                    borderBottom: "1px solid rgba(0,0,0,.06)",
                }}
            >
                <Container style={{ padding: "48px 0 32px" }}>
                    <Header
                        as="h1"
                        style={{
                            margin: 0,
                            color: THEME.colors.text,
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        Frequently Asked Questions
                    </Header>
                    <p style={{ color: "#666", marginTop: 8 }}>
                        Quick answers to common questions. Still stuck?{" "}
                        <Link to={ROUTES.SUPPORT} style={{ color: THEME.colors.accent }}>
                            Contact support
                        </Link>
                        .
                    </p>

                    <Input
                        icon={<Icon name="search" />}
                        value={query}
                        onChange={(_, { value }) => setQuery(value)}
                        placeholder="Search FAQs, e.g. image upload, markdown, tags…"
                        style={{ width: "100%", maxWidth: 720, marginTop: 14 }}
                    />

                    {/* Popular pills */}
                    <div style={{ marginTop: 12 }}>
                        {POPULAR.map((p) => (
                            <Label
                                as="button"
                                key={p}
                                basic
                                style={{
                                    borderRadius: 999,
                                    marginRight: 8,
                                    marginBottom: 8,
                                    cursor: "pointer",
                                }}
                                onClick={() => setQuery(p)}
                            >
                                <Icon name="fire" color="orange" />
                                {p}
                            </Label>
                        ))}
                    </div>
                </Container>
            </div>

            <Container style={{ padding: "28px 0 48px" }}>
                {/* Search results */}
                {query && (
                    <Segment raised style={{ borderRadius: 16, marginBottom: 24 }}>
                        <Header as="h3" style={{ marginTop: 0 }}>
                            Results for “{query}”
                        </Header>
                        <Accordion fluid styled>
                            {results.length === 0 && (
                                <p style={{ color: "#888" }}>
                                    No matches. Try another keyword or browse below.
                                </p>
                            )}
                            {results.map((r) => (
                                <div key={`res-${r.key}`}>
                                    <Accordion.Title
                                        active={!!active[`res-${r.key}`]}
                                        onClick={() => toggle(`res-${r.key}`)}
                                        style={{ fontWeight: 600 }}
                                    >
                                        <Icon name="dropdown" />
                                        {r.q}
                                        <span style={{ color: "#888", marginLeft: 8, fontWeight: 400 }}>
                                            • {r.cat}
                                        </span>
                                    </Accordion.Title>
                                    <Accordion.Content active={!!active[`res-${r.key}`]}>
                                        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                            {r.a}
                                        </div>
                                    </Accordion.Content>
                                </div>
                            ))}
                        </Accordion>
                    </Segment>
                )}

                {/* Categories */}
                {CATEGORIES.map((cat) => (
                    <Segment key={cat.key} raised style={{ borderRadius: 16, marginBottom: 18 }}>
                        <Header as="h3" style={{ marginTop: 0 }}>
                            {cat.title}
                        </Header>
                        <Accordion fluid styled>
                            {cat.items.map((it, idx) => {
                                const k = `${cat.key}-${idx}`;
                                return (
                                    <div key={k}>
                                        <Accordion.Title
                                            active={!!active[k]}
                                            onClick={() => toggle(k)}
                                            style={{ fontWeight: 600 }}
                                        >
                                            <Icon name="dropdown" />
                                            {it.q}
                                        </Accordion.Title>
                                        <Accordion.Content active={!!active[k]}>
                                            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                                {it.a}
                                            </div>
                                        </Accordion.Content>
                                    </div>
                                );
                            })}
                        </Accordion>
                    </Segment>
                ))}

                <Divider hidden />
                <Segment basic textAlign="center" style={{ paddingTop: 8 }}>
                    Still need help?{" "}
                    <Link to={ROUTES.SUPPORT} style={{ color: THEME.colors.accent }}>
                        Talk to our support team →
                    </Link>
                </Segment>
            </Container>
        </main>
    );
}
