// src/components/home/HomeToggleBar.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "semantic-ui-react";
import { UI } from "../../config/homeConfig";
import { ROUTES } from "@/config/routes";

const TABS = [
    { key: "home", label: "Home", path: ROUTES.HOME },
    { key: "articles", label: "Articles", path: ROUTES.ARTICLES },
    { key: "questions", label: "Questions", path: ROUTES.QUESTIONS },
    { key: "tutorials", label: "Tutorials", path: ROUTES.TUTORIALS },
];

export default function HomeToggleBar() {
    const nav = useNavigate();
    const loc = useLocation();
    const [q, setQ] = useState("");

    const active = useMemo(() => {
        const hit = TABS.find((t) =>
            t.path === ROUTES.HOME
                ? loc.pathname === ROUTES.HOME
                : loc.pathname.startsWith(t.path)
        );
        return hit?.key || "home";
    }, [loc.pathname]);

    function go(path) {
        nav(path);
    }

    function submitSearch() {
        const query = q.trim();
        nav({
            pathname: ROUTES.SEARCH,
            search: query ? `?q=${encodeURIComponent(query)}` : "",
        });
    }

    return (
        <div
            style={{
                marginTop: 16,
                background: "#fff",
                borderRadius: 999,
                boxShadow: "0 8px 24px rgba(0,0,0,.08)",
                padding: 8,
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 12,
                alignItems: "center",
            }}
        >
            <div
                role="tablist"
                aria-label="Primary navigation"
                style={{ display: "flex", gap: 6, background: UI.bg, borderRadius: 999, padding: 6 }}
            >
                {TABS.map((t) => {
                    const isActive = t.key === active;
                    return (
                        <button
                            key={t.key}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => go(t.path)}
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                color: isActive ? "#fff" : UI.text,
                                background: isActive ? UI.text : "#fff",
                                border: `1px solid ${isActive ? UI.text : "#e5e5e7"}`,
                                padding: "10px 18px",
                                borderRadius: 999,
                                boxShadow: isActive ? "inset 0 -2px 0 rgba(255,255,255,.25)" : "none",
                            }}
                        >
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Rounded search wrapper to clip corners */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                    style={{
                        width: "100%",
                        maxWidth: 520,
                        borderRadius: 999,
                        overflow: "hidden",
                        boxShadow: "inset 0 0 0 1px #e5e5e7",
                    }}
                >
                    <Input
                        icon="search"
                        placeholder="Search across articles, tutorials, and questions…"
                        value={q}
                        onChange={(_, d) => setQ(d.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
}
