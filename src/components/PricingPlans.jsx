// src/components/PricingPlans.jsx

import { useEffect, useMemo, useState } from "react";
import { Container, Header, Segment, Grid, List, Button, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ROUTES } from "@/config/routes";

// Price IDs from env (IDs only)
const PRICE_PRO_MONTHLY = import.meta.env.VITE_PRICE_PRO_MONTHLY;
const PRICE_PRO_ANNUAL = import.meta.env.VITE_PRICE_PRO_ANNUAL;
const PRICE_ADV_MONTHLY = import.meta.env.VITE_PRICE_ADV_MONTHLY;
const PRICE_ADV_ANNUAL = import.meta.env.VITE_PRICE_ADV_ANNUAL;

// Format cents to currency (AUD by default)
function fmtCurrency(amount, currency) {
    const ccy = (currency || "aud").toUpperCase();
    return new Intl.NumberFormat("en-AU", { style: "currency", currency: ccy }).format((amount || 0) / 100);
}

function ToggleBar({ period, setPeriod }) {
    return (
        <div
            role="tablist"
            aria-label="Billing period"
            style={{
                background: "var(--card, #fff)",
                borderRadius: 9999,
                display: "inline-flex",
                padding: 4,
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                gap: 4,
            }}
        >
            <button
                type="button"
                role="tab"
                aria-selected={period === "monthly"}
                onClick={() => setPeriod("monthly")}
                style={{
                    border: "none",
                    borderRadius: 9999,
                    padding: "8px 14px",
                    background: period === "monthly" ? "var(--brand-soft, #e9f2f8)" : "transparent",
                    color: "var(--ink, #313131)",
                    fontWeight: period === "monthly" ? 700 : 500,
                    cursor: "pointer",
                }}
            >
                Monthly
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={period === "annually"}
                onClick={() => setPeriod("annually")}
                style={{
                    border: "none",
                    borderRadius: 9999,
                    padding: "8px 14px",
                    background: period === "annually" ? "var(--brand-soft, #e9f2f8)" : "transparent",
                    color: "var(--ink, #313131)",
                    fontWeight: period === "annually" ? 700 : 500,
                    cursor: "pointer",
                }}
            >
                Annually
            </button>
        </div>
    );
}

function PlanCard({ title, priceText, features, cta, highlight = false, ribbon = "" }) {
    return (
        <Segment
            style={{
                borderRadius: "var(--radius, 14px)",
                padding: 24,
                background: "var(--card, #fff)",
                border: highlight ? "2px solid var(--brand, #0171e3)" : "1px solid rgba(0,0,0,0.08)",
                boxShadow: highlight ? "0 8px 24px rgba(1,113,227,0.15)" : "0 4px 16px rgba(0,0,0,0.06)",
                position: "relative",
            }}
        >
            {ribbon ? (
                <Label
                    ribbon="right"
                    style={{ background: "var(--brand, #0171e3)", color: "#fff", fontWeight: 600 }}
                    content={ribbon}
                />
            ) : null}

            <Header as="h3" style={{ color: "var(--ink, #313131)", fontWeight: 700 }}>
                {title}
            </Header>

            {priceText && (
                <div style={{ marginBottom: 10, fontWeight: 600, color: "var(--ink, #313131)" }}>
                    {priceText}
                </div>
            )}

            <List bulleted relaxed style={{ color: "var(--ink, #313131)" }}>
                {features.map((f) => (
                    <List.Item key={f}>{f}</List.Item>
                ))}
            </List>

            {cta ? <div style={{ marginTop: 16 }}>{cta}</div> : null}
        </Segment>
    );
}

export default function PricingPlans({ showCtas = true, className = "" }) {
    const [period, setPeriod] = useState("monthly");
    const [prices, setPrices] = useState({
        pro: { monthly: null, annually: null },
        adv: { monthly: null, annually: null },
    });
    const [loading, setLoading] = useState(true);

    // Fetch allowed prices from callable (no amounts in code)
    useEffect(() => {
        const run = async () => {
            try {
                const ids = [PRICE_PRO_MONTHLY, PRICE_PRO_ANNUAL, PRICE_ADV_MONTHLY, PRICE_ADV_ANNUAL].filter(Boolean);
                if (!ids.length) return setLoading(false);

                const functions = getFunctions(getApp(), "australia-southeast1");
                const getPriceInfo = httpsCallable(functions, "getPriceInfo");
                const res = await getPriceInfo({ priceIds: ids });

                const map = {};
                for (const p of res.data?.prices || []) map[p.id] = p;

                setPrices({
                    pro: { monthly: map[PRICE_PRO_MONTHLY] || null, annually: map[PRICE_PRO_ANNUAL] || null },
                    adv: { monthly: map[PRICE_ADV_MONTHLY] || null, annually: map[PRICE_ADV_ANNUAL] || null },
                });
            } finally {
                setLoading(false);
            }
        };
        run();
    }, []);

    const proPriceText = useMemo(() => {
        const p = prices.pro[period === "monthly" ? "monthly" : "annually"];
        if (!p) return "";
        const formatted = fmtCurrency(p.unit_amount, p.currency);
        return period === "monthly" ? `${formatted} / month` : `${formatted} / year`;
    }, [prices, period]);

    const advPriceText = useMemo(() => {
        const p = prices.adv[period === "monthly" ? "monthly" : "annually"];
        if (!p) return "";
        const formatted = fmtCurrency(p.unit_amount, p.currency);
        return period === "monthly" ? `${formatted} / month` : `${formatted} / year`;
    }, [prices, period]);

    return (
        <div className={className} style={{ background: "var(--page, #f5f5f7)", padding: "40px 0" }}>
            <Container text>
                <Header as="h1" textAlign="center" style={{ color: "var(--ink, #313131)", fontWeight: 700, marginBottom: 8 }}>
                    Take it to the next level with our plans!
                </Header>
                <p style={{ textAlign: "center", color: "var(--ink-muted, #4b5563)", marginBottom: 24 }}>
                    View your plan information or switch plans according to your needs.
                </p>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                    <ToggleBar period={period} setPeriod={setPeriod} />
                </div>

                <Grid stackable columns={3}>
                    {/* Free */}
                    <Grid.Column>
                        <PlanCard
                            title="Forever Free"
                            priceText=""
                            features={[
                                "Browse Questions, Articles & Tutorials",
                                "Participate in Q&A",
                                "Basic search & filtering",
                                "Community support",
                            ]}
                            cta={
                                showCtas ? (
                                    <Button
                                        style={{
                                            background: "#fff",
                                            color: "var(--ink, #313131)",
                                            border: "1px solid rgba(0,0,0,0.12)",
                                        }}
                                        content="Start for Free"
                                    />
                                ) : null
                            }
                        />
                    </Grid.Column>

                    {/* Professional (Most Popular) */}
                    <Grid.Column>
                        <PlanCard
                            title="Professional"
                            ribbon="Most Popular"
                            priceText={!loading ? proPriceText : ""}
                            highlight
                            features={[
                                "Everything in Free",
                                "Custom messages & banners",
                                "Themes & content controls",
                                "Priority support",
                                "Admin analytics dashboard",
                            ]}
                            cta={
                                showCtas ? (
                                    <Button
                                        as={Link}
                                        to={ROUTES.CHECKOUT}
                                        style={{ background: "var(--brand, #0171e3)", color: "#fff", fontWeight: 600 }}
                                        content="Go Premium"
                                    />
                                ) : null
                            }
                        />
                    </Grid.Column>

                    {/* Advanced */}
                    <Grid.Column>
                        <PlanCard
                            title="Advanced"
                            priceText={!loading ? advPriceText : ""}
                            features={[
                                "Everything in Professional",
                                "Team seats & collaboration",
                                "Extended moderation tools",
                                "Advanced reporting & insights",
                                "Early access to new features",
                            ]}
                            cta={
                                showCtas ? (
                                    <Button
                                        as={Link}
                                        to={ROUTES.SUPPORT} // Talk to Sales → Support/Contact route
                                        style={{
                                            background: "#fff",
                                            color: "var(--ink, #313131)",
                                            border: "1px solid rgba(0,0,0,0.12)",
                                        }}
                                        content="Talk to Sales"
                                    />
                                ) : null
                            }
                        />
                    </Grid.Column>
                </Grid>
            </Container>
        </div>
    );
}
