// src/pages/PlansPage.jsx
// Purpose: Modern pricing plans page (Free / Professional / Advanced) matching your reference.
// Notes:
// - Uses your Apple-inspired tokens/colors and Poppins.
// - No hardcoded prices: we present features only.
// - "Go Premium" routes to /checkout via ROUTES.CHECKOUT (add the route in App.jsx).

import { Container, Header, Segment, Grid, List, Button, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

function ToggleBar() {
    // UI-only toggle; we are not switching prices to avoid hardcoding.
    return (
        <div
            style={{
                background: "var(--card, #fff)",
                borderRadius: "9999px",
                display: "inline-flex",
                padding: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                gap: 4,
            }}
            aria-label="Billing period"
        >
            <button
                type="button"
                style={{
                    border: "none",
                    borderRadius: "9999px",
                    padding: "8px 14px",
                    background: "var(--brand-soft, #e9f2f8)",
                    color: "var(--ink, #313131)",
                    fontWeight: 600,
                    cursor: "default",
                }}
            >
                Monthly
            </button>
            <button
                type="button"
                style={{
                    border: "none",
                    borderRadius: "9999px",
                    padding: "8px 14px",
                    background: "transparent",
                    color: "var(--ink-muted, #6b7280)",
                    fontWeight: 500,
                    cursor: "not-allowed",
                }}
                aria-disabled="true"
                title="Prices hidden to avoid hardcoding"
            >
                Annually
            </button>
        </div>
    );
}

function PlanCard({ title, features, cta, highlight = false, ribbon = "" }) {
    return (
        <Segment
            style={{
                borderRadius: "var(--radius, 14px)",
                padding: 24,
                background: "var(--card, #fff)",
                border:
                    highlight ? "2px solid var(--brand, #0171e3)" : "1px solid rgba(0,0,0,0.08)",
                boxShadow: highlight
                    ? "0 8px 24px rgba(1,113,227,0.15)"
                    : "0 4px 16px rgba(0,0,0,0.06)",
                position: "relative",
            }}
        >
            {ribbon ? (
                <Label
                    color="blue"
                    ribbon="right"
                    style={{
                        background: "var(--brand, #0171e3)",
                        color: "#fff",
                        fontWeight: 600,
                    }}
                    content={ribbon}
                />
            ) : null}

            <Header
                as="h3"
                style={{ color: "var(--ink, #313131)", fontWeight: "var(--weight-heading, 600)" }}
                content={title}
            />

            <List bulleted relaxed style={{ color: "var(--ink, #313131)" }}>
                {features.map((f) => (
                    <List.Item key={f}>{f}</List.Item>
                ))}
            </List>

            <div style={{ marginTop: 16 }}>{cta}</div>
        </Segment>
    );
}

export default function PlansPage() {
    return (
        <div style={{ background: "var(--page, #f5f5f7)", padding: "40px 0" }}>
            <Container text>
                <Header
                    as="h1"
                    textAlign="center"
                    style={{
                        color: "var(--ink, #313131)",
                        fontWeight: "var(--weight-heading, 600)",
                        marginBottom: 8,
                    }}
                    content="Take it to the next level with our plans!"
                />
                <p
                    style={{
                        textAlign: "center",
                        color: "var(--ink-muted, #4b5563)",
                        marginBottom: 24,
                    }}
                >
                    View your plan information or switch plans according to your needs.
                </p>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                    <ToggleBar />
                </div>

                <Grid stackable columns={3}>
                    {/* Free */}
                    <Grid.Column>
                        <PlanCard
                            title="Forever Free"
                            features={[
                                "Browse Questions, Articles & Tutorials",
                                "Participate in Q&A",
                                "Basic search & filtering",
                                "Community support",
                            ]}
                            cta={
                                <Button
                                    style={{
                                        background: "#fff",
                                        color: "var(--ink, #313131)",
                                        border: "1px solid rgba(0,0,0,0.12)",
                                    }}
                                    content="Start for Free"
                                />
                            }
                        />
                    </Grid.Column>

                    {/* Professional (Most Popular) */}
                    <Grid.Column>
                        <PlanCard
                            title="Professional"
                            ribbon="Most Popular"
                            highlight
                            features={[
                                "Everything in Free",
                                "Custom messages & banners",
                                "Themes & content controls",
                                "Priority support",
                                "Admin analytics dashboard",
                            ]}
                            cta={
                                <Button
                                    as={Link}
                                    to={ROUTES.CHECKOUT}
                                    style={{
                                        background: "var(--brand, #0171e3)",
                                        color: "#fff",
                                        fontWeight: 600,
                                    }}
                                    content="Go Premium"
                                />
                            }
                        />
                    </Grid.Column>

                    {/* Advanced */}
                    <Grid.Column>
                        <PlanCard
                            title="Advanced"
                            features={[
                                "Everything in Professional",
                                "Team seats & collaboration",
                                "Extended moderation tools",
                                "Advanced reporting & insights",
                                "Early access to new features",
                            ]}
                            cta={
                                <Button
                                    style={{
                                        background: "#fff",
                                        color: "var(--ink, #313131)",
                                        border: "1px solid rgba(0,0,0,0.12)",
                                    }}
                                    content="Talk to Sales"
                                />
                            }
                        />
                    </Grid.Column>
                </Grid>

                {/* Footer spacing */}
                <div style={{ height: 24 }} />
            </Container>
        </div>
    );
}
