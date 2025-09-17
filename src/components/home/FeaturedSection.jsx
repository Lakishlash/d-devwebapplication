// src/components/home/FeaturedSection.jsx
// Microsoft-like section: left hero + responsive grid on the right.
// Cards are equal-height and top-aligned.

import { Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UI } from "../../config/homeConfig";

export default function FeaturedSection({ title, heroImage, items = [] }) {
    return (
        <section style={{ marginTop: 28 }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(280px, 1.2fr) 2fr",
                    gap: 18,
                    alignItems: "stretch",
                }}
            >
                {/* Left hero card */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 24,
                        boxShadow: "0 12px 28px rgba(0,0,0,.08)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {heroImage ? (
                        <div
                            style={{
                                width: "100%",
                                height: 220,
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={heroImage}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </div>
                    ) : null}

                    <div style={{ padding: 16 }}>
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                                color: UI.text,
                            }}
                        >
                            {title}
                        </h2>
                        <p style={{ marginTop: 6, color: "#666" }}>
                            Fresh picks curated for you.
                        </p>
                    </div>
                </div>

                {/* Right responsive grid */}
                <div className="feature-grid">
                    {items.map((it) => (
                        <Card
                            key={it.id}
                            raised
                            style={{
                                margin: 0,                 // kill default SUI margin
                                borderRadius: 18,
                                overflow: "hidden",
                                height: "100%",            // equal height
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Fixed-height media wrapper ensures aligned rows */}
                            {it.image ? (
                                <div style={{ width: "100%", height: 180, overflow: "hidden" }}>
                                    <img
                                        src={it.image}
                                        alt=""
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </div>
                            ) : null}

                            <Card.Content style={{ flex: "1 1 auto" }}>
                                <Card.Header
                                    style={{ color: UI.text, fontFamily: "Poppins, sans-serif" }}
                                >
                                    {it.title}
                                </Card.Header>
                                {it.description && (
                                    <Card.Description style={{ color: "#666" }}>
                                        {it.description}
                                    </Card.Description>
                                )}
                            </Card.Content>

                            {it.href && (
                                <Card.Content extra style={{ flex: "0 0 auto" }}>
                                    <Link to={it.href} style={{ color: UI.primary, fontWeight: 500 }}>
                                        Learn more
                                    </Link>
                                </Card.Content>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
