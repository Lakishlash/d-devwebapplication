/// src/components/footer/NewsletterSignup.jsx

import { useEffect, useMemo, useState } from "react";
import { Input, Button, Message } from "semantic-ui-react";
import { THEME } from "@/config";

function getApiBase() {
    const raw = import.meta.env.VITE_API_BASE_URL || "";
    // remove trailing slash if present
    return raw.replace(/\/+$/, "");
}

export default function NewsletterSignup() {
    const API = useMemo(getApiBase, []);
    const [email, setEmail] = useState("");
    const [checking, setChecking] = useState(true);
    const [healthy, setHealthy] = useState(false);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [okMsg, setOkMsg] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function check() {
            setChecking(true);
            setErr("");
            try {
                // IMPORTANT: always hit the Express server, not Vite
                const r = await fetch(`${API}/api/subscribe/health`, {
                    method: "GET",
                    mode: "cors",
                    headers: { "Accept": "application/json" },
                });
                const j = await r.json().catch(() => ({}));
                if (!cancelled) {
                    setHealthy(Boolean(j?.ok));
                    if (!j?.ok) {
                        setErr(j?.message || "Server not ready");
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    setHealthy(false);
                    setErr("Server not reachable");
                }
            } finally {
                if (!cancelled) setChecking(false);
            }
        }
        check();
        return () => { cancelled = true; };
    }, [API]);

    async function onSubscribe(e) {
        e.preventDefault();
        setErr("");
        setOkMsg("");
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setErr("Please enter a valid email.");
            return;
        }
        try {
            setBusy(true);
            const r = await fetch(`${API}/api/subscribe`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const j = await r.json().catch(() => ({}));
            if (r.ok && j?.ok !== false) {
                setOkMsg("Subscribed! Please check your inbox.");
                setEmail("");
            } else {
                setErr(j?.message || "Subscribe failed");
            }
        } catch (e) {
            setErr("Network error while subscribing");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 8px 22px rgba(0,0,0,.06)",
                padding: "1.25rem",
                border: "1px solid rgba(0,0,0,.06)",
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 10, color: THEME.colors.text }}>
                SIGN UP FOR OUR DAILY INSIDER
            </div>

            <form onSubmit={onSubscribe} style={{ display: "flex", gap: 10 }}>
                <Input
                    value={email}
                    onChange={(_, { value }) => setEmail(value)}
                    placeholder="your@email.com"
                    disabled={busy || checking || !healthy}
                    style={{ flex: 1 }}
                />
                <Button
                    primary
                    type="submit"
                    loading={busy}
                    disabled={busy || checking || !healthy}
                    style={{ background: THEME.colors.accent, color: "#fff" }}
                >
                    Subscribe
                </Button>
            </form>

            {/* Status area */}
            <div style={{ marginTop: 10 }}>
                {checking && (
                    <Message info size="tiny" content={`Checking newsletter service @ ${API}…`} />
                )}
                {!checking && !healthy && (
                    <Message
                        error
                        size="tiny"
                        content={err || "Newsletter service unavailable"}
                    />
                )}
                {!checking && healthy && okMsg && (
                    <Message positive size="tiny" content={okMsg} />
                )}
            </div>
        </div>
    );
}
