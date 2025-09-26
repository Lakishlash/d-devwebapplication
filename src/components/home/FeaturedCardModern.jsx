// src/components/home/FeaturedCardModern.jsx
// A modern, fully clickable card with tag chips, soft blue glow on hover,
// and a gentle scale-up. No hardcoded content; all data comes via props.
//
// Props: item = { id, title, description, image, href, tags?: string[] }
//
// Colors & typography pull from your CSS variables:
//   --page (#f5f5f7)  --ink (#313131)  --brand (#0171e3)  --brand-soft (#e9f2f8)

import { useState } from "react";
import { Link } from "react-router-dom";

export default function FeaturedCardModern({ item }) {
    const [hovered, setHovered] = useState(false);
    const {
        title = "",
        description = "",
        image = null,
        href = "#",
        tags = [],
    } = item || {};

    return (
        <Link
            to={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "block",
                borderRadius: 18,
                overflow: "hidden",
                background: "#fff",
                textDecoration: "none",
                color: "var(--ink, #313131)",
                boxShadow: hovered
                    ? "0 18px 40px rgba(1,113,227,0.22)"
                    : "0 8px 24px rgba(0,0,0,0.06)",
                transform: hovered ? "translateY(-2px) scale(1.012)" : "none",
                transition: "transform 180ms ease, box-shadow 220ms ease",
                position: "relative",
                height: "100%",
            }}
        >
            {/* Media */}
            {image ? (
                <div style={{ width: "100%", height: 180, overflow: "hidden" }}>
                    <img
                        src={image}
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

            {/* Gradient overlay on hover */}
            <div
                aria-hidden
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 200ms ease",
                    background:
                        "radial-gradient(1200px 300px at 50% 0%, rgba(1,113,227,0.12), transparent 65%)",
                }}
            />

            {/* Body */}
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Tag chips (show only if provided) */}
                {Array.isArray(tags) && tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {tags.slice(0, 3).map((t) => (
                            <span
                                key={t}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 12,
                                    padding: "6px 10px",
                                    borderRadius: 9999,
                                    background: "var(--brand-soft, #e9f2f8)",
                                    color: "var(--ink, #313131)",
                                    border: "1px solid rgba(1,113,227,0.15)",
                                    fontWeight: 500,
                                    lineHeight: 1,
                                }}
                            >
                                {/* tiny dot */}
                                <span
                                    aria-hidden
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: "var(--brand, #0171e3)",
                                    }}
                                />
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3
                    style={{
                        margin: 0,
                        fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
                        fontWeight: 600,
                        fontSize: 18,
                        color: "var(--ink, #313131)",
                    }}
                >
                    {title}
                </h3>

                {/* Description */}
                {description ? (
                    <p
                        style={{
                            margin: 0,
                            color: "rgba(0,0,0,0.6)",
                            fontSize: 14,
                        }}
                    >
                        {description}
                    </p>
                ) : null}

                {/* Learn more */}
                <div
                    style={{
                        marginTop: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "var(--brand, #0171e3)",
                        fontWeight: 600,
                        opacity: hovered ? 1 : 0.9,
                        transform: hovered ? "translateY(-1px)" : "none",
                        transition: "opacity 160ms ease, transform 160ms ease",
                    }}
                >
                    <span>Learn more</span>
                    <span aria-hidden style={{ transform: hovered ? "translateX(2px)" : "none", transition: "transform 160ms ease" }}>
                        →
                    </span>
                </div>
            </div>
        </Link>
    );
}
