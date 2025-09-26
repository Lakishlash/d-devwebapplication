// src/pages/HelpPage.jsx

import { Container, Header, Grid, Card, Icon, Segment, List } from "semantic-ui-react";
import { THEME } from "@/config";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

const CARDS = [
    {
        icon: "lightning",
        title: "Getting started",
        desc: "Create an account, set up your profile, and post your first question.",
        anchor: "#getting-started",
    },
    {
        icon: "question circle",
        title: "Ask great questions",
        desc: "Title patterns, minimal repro steps, and choosing the right tags.",
        anchor: "#posting",
    },
    {
        icon: "edit outline",
        title: "Editor & Markdown",
        desc: "Bold, lists, code blocks, tables, and switching editors.",
        anchor: "#editor",
    },
    {
        icon: "image",
        title: "Uploads & attachments",
        desc: "Insert images & PDFs with automatic previews and safe sizing.",
        anchor: "#uploads",
    },
    {
        icon: "user circle",
        title: "Account & profile",
        desc: "Update your name, photo, privacy controls and notifications.",
        anchor: "#account",
    },
    {
        icon: "credit card",
        title: "Plans & billing",
        desc: "Upgrade, manage subscriptions, and receipts via Stripe.",
        anchor: "#billing",
    },
];

export default function HelpPage() {
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
                        Help Center
                    </Header>
                    <p style={{ color: "#666", marginTop: 8 }}>
                        Short, focused guides for the most common tasks. For quick answers,
                        check the <Link to={ROUTES.FAQS} style={{ color: THEME.colors.accent }}>FAQs</Link>.
                    </p>
                </Container>
            </div>

            {/* Cards */}
            <Container style={{ padding: "28px 0 8px" }}>
                <Grid stackable columns={3}>
                    {CARDS.map((c) => (
                        <Grid.Column key={c.title}>
                            <Card
                                raised
                                style={{ borderRadius: 18, boxShadow: "0 10px 26px rgba(0,0,0,.08)" }}
                                as="a"
                                href={c.anchor}
                            >
                                <Card.Content>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <Icon name={c.icon} size="large" color="blue" />
                                        <Card.Header style={{ fontFamily: "Poppins, sans-serif" }}>{c.title}</Card.Header>
                                    </div>
                                    <Card.Description style={{ marginTop: 8, color: "#666" }}>
                                        {c.desc}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    Learn more <Icon name="arrow right" />
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                    ))}
                </Grid>
            </Container>

            {/* Guides */}
            <Container style={{ paddingBottom: 48 }}>
                <Segment id="getting-started" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Getting started</Header>
                    <List bulleted relaxed>
                        <List.Item>Click <strong>Post</strong> in the header to open the composer.</List.Item>
                        <List.Item>Select <strong>Question</strong>, <strong>Article</strong>, or <strong>Tutorial</strong>.</List.Item>
                        <List.Item>Write a clear title like “Why aren’t HttpOnly cookies saved with fetch()?”</List.Item>
                        <List.Item>Add details, steps to reproduce, and code or screenshots.</List.Item>
                        <List.Item>Tag with up to 3 topics (e.g., <code>react</code>, <code>express</code>).</List.Item>
                    </List>
                </Segment>

                <Segment id="posting" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Ask great questions</Header>
                    <List bulleted relaxed>
                        <List.Item>Focus the problem: what happens vs. what you expected.</List.Item>
                        <List.Item>Include the smallest possible code that reproduces the issue.</List.Item>
                        <List.Item>State versions (browser/OS, library versions) when relevant.</List.Item>
                        <List.Item>Use tags for technologies involved.</List.Item>
                    </List>
                </Segment>

                <Segment id="editor" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Editor & Markdown</Header>
                    <List bulleted relaxed>
                        <List.Item>Use the toolbar for **bold**, _italic_, lists and headings.</List.Item>
                        <List.Item>Code blocks: <code>```language … ```</code> for syntax highlighting.</List.Item>
                        <List.Item>Switch editors anytime via the toggle above the field.</List.Item>
                    </List>
                </Segment>

                <Segment id="uploads" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Uploads & attachments</Header>
                    <List bulleted relaxed>
                        <List.Item>Click <strong>Image</strong> or <strong>PDF</strong> to upload files.</List.Item>
                        <List.Item>We show a preview below the editor; large images are auto-sized.</List.Item>
                        <List.Item>Files are stored securely in Firebase Storage.</List.Item>
                    </List>
                </Segment>

                <Segment id="account" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Account & profile</Header>
                    <List bulleted relaxed>
                        <List.Item>Open the avatar menu → <strong>My profile</strong> to update details.</List.Item>
                        <List.Item>Upload an avatar (5MB limit). PNG/JPG recommended.</List.Item>
                    </List>
                </Segment>

                <Segment id="billing" raised style={{ borderRadius: 16 }}>
                    <Header as="h3">Plans & billing</Header>
                    <List bulleted relaxed>
                        <List.Item>See <Link to={ROUTES.PLANS}>Plans</Link> for feature comparison.</List.Item>
                        <List.Item>Payments are processed by Stripe. You can cancel anytime.</List.Item>
                        <List.Item>Need a receipt or invoice? Manage from your customer portal.</List.Item>
                    </List>
                </Segment>

                <Segment basic textAlign="center">
                    Can’t find what you need?{" "}
                    <Link to={ROUTES.SUPPORT} style={{ color: THEME.colors.accent }}>
                        Contact support →
                    </Link>
                </Segment>
            </Container>
        </main>
    );
}
