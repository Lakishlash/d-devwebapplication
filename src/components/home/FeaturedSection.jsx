// src/components/home/FeaturedSection.jsx
// Updated section using FeaturedCardModern on the right grid.
// Left side keeps a simple hero with big heading + short tagline.

import FeaturedCardModern from "@/components/home/FeaturedCardModern.jsx";

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
                        <div style={{ width: "100%", height: 220, overflow: "hidden" }}>
                            <img
                                src={heroImage}
                                alt=""
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    ) : null}

                    <div style={{ padding: 16 }}>
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
                                fontWeight: 600,
                                color: "var(--ink, #313131)",
                                fontSize: 22,
                            }}
                        >
                            {title}
                        </h2>
                        <p style={{ marginTop: 6, color: "rgba(0,0,0,0.65)" }}>
                            Fresh picks curated for you.
                        </p>
                    </div>
                </div>

                {/* Right responsive grid (uses existing .feature-grid CSS) */}
                <div className="feature-grid">
                    {items.map((it) => (
                        <FeaturedCardModern key={it.id} item={it} />
                    ))}
                </div>
            </div>
        </section>
    );
}
