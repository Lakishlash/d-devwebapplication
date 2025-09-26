// src/pages/SupportPage.jsx

import { useState } from "react";
import {
    Container,
    Header,
    Segment,
    Form,
    Button,
    Message,
    Icon,
    Grid,
    List,
} from "semantic-ui-react";
import { Link } from "react-router-dom";            //  add this
import { ROUTES } from "@/config/routes";           // use route constants
import { THEME } from "@/config";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function SupportPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [ok, setOk] = useState("");
    const [err, setErr] = useState("");

    async function submit() {
        setOk(""); setErr("");
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
            setErr("Please fill in all fields.");
            return;
        }
        try {
            setBusy(true);
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, subject, message }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok || !j?.ok) throw new Error(j?.error || `Submit failed (${res.status})`);
            setOk("Thanks! Your message has been sent. We usually reply within 1–2 business days.");
            setName(""); setEmail(""); setSubject(""); setMessage("");
        } catch (e) {
            setErr(e?.message || "Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

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
                        Contact Support
                    </Header>
                    <p style={{ color: "#666", marginTop: 8 }}>
                        We usually reply within 1–2 business days. Include steps to reproduce if you’re reporting a bug.
                    </p>
                </Container>
            </div>

            <Container style={{ padding: "28px 0 48px" }}>
                <Grid stackable columns={2}>
                    <Grid.Column>
                        <Segment raised style={{ borderRadius: 16 }}>
                            <Header as="h3" style={{ marginTop: 0 }}>
                                Send us a message
                            </Header>

                            <Form>
                                <Form.Input
                                    label="Name"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(_, { value }) => setName(value)}
                                />
                                <Form.Input
                                    label="Email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(_, { value }) => setEmail(value)}
                                    type="email"
                                />
                                <Form.Input
                                    label="Subject"
                                    placeholder="How can we help?"
                                    value={subject}
                                    onChange={(_, { value }) => setSubject(value)}
                                />
                                <Form.TextArea
                                    label="Message"
                                    placeholder="Write your message here…"
                                    rows={8}
                                    value={message}
                                    onChange={(_, { value }) => setMessage(String(value))}
                                />

                                <Button
                                    primary
                                    onClick={submit}
                                    loading={busy}
                                    style={{ background: THEME.colors.accent, color: "#fff" }}
                                >
                                    Send
                                </Button>
                            </Form>

                            {ok && <Message positive style={{ marginTop: 16 }} content={ok} />}
                            {err && <Message negative style={{ marginTop: 16 }} content={err} />}
                        </Segment>
                    </Grid.Column>

                    <Grid.Column>
                        <Segment raised style={{ borderRadius: 16 }}>
                            <Header as="h3" style={{ marginTop: 0 }}>
                                Other ways to reach us
                            </Header>
                            <List relaxed size="large">
                                <List.Item>
                                    <Icon name="mail outline" color="blue" />
                                    <List.Content>
                                        <List.Header as="a" href="mailto:support@example.com">
                                            Email
                                        </List.Header>
                                        <List.Description>support@example.com</List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon name="help circle" color="blue" />
                                    <List.Content>
                                        <List.Header as={Link} to={ROUTES.FAQS}>
                                            Read FAQs
                                        </List.Header>
                                        <List.Description>
                                            Answers to the most common questions.
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <Icon name="book" color="blue" />
                                    <List.Content>
                                        <List.Header as={Link} to={ROUTES.HELP}>
                                            Help Center
                                        </List.Header>
                                        <List.Description>
                                            Short guides and how-tos for everyday tasks.
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Segment>

                        <Segment raised style={{ borderRadius: 16 }}>
                            <Header as="h3" style={{ marginTop: 0 }}>
                                Tips for faster resolutions
                            </Header>
                            <List bulleted relaxed>
                                <List.Item>Share your browser/OS and library versions.</List.Item>
                                <List.Item>Include steps to reproduce and expected vs. actual behavior.</List.Item>
                                <List.Item>Attach screenshots or a small code sample if possible.</List.Item>
                            </List>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Container>
        </main>
    );
}
