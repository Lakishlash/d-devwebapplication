// src/components/home/HeroCarousel.jsx
// Minimal carousel (no extra lib). Auto-advances; next/prev controls; rounded+shadow.

import { useEffect, useRef, useState } from "react";
import { Icon, Button } from "semantic-ui-react";
import { UI } from "../../config/homeConfig";

const INTERVAL_MS = 6000;

export default function HeroCarousel({ images = [], height = 360 }) {
    const [idx, setIdx] = useState(0);
    const timer = useRef(null);

    useEffect(() => {
        if (!images.length) return;
        timer.current = setInterval(() => setIdx((i) => (i + 1) % images.length), INTERVAL_MS);
        return () => clearInterval(timer.current);
    }, [images.length]);

    const go = (delta) =>
        setIdx((i) => (images.length ? (i + delta + images.length) % images.length : 0));

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                boxShadow: "0 15px 40px rgba(0,0,0,.15)",
                background: UI.bg,
                height,
            }}
            aria-roledescription="carousel"
        >
            {images.map((src, i) => (
                <img
                    key={src + i}
                    src={src}
                    alt=""
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "opacity 500ms ease",
                        opacity: i === idx ? 1 : 0,
                    }}
                    aria-hidden={i === idx ? "false" : "true"}
                />
            ))}

            {/* Controls */}
            <Button
                icon
                circular
                onClick={() => go(-1)}
                aria-label="Previous"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: 12,
                    transform: "translateY(-50%)",
                    background: "#ffffffcc",
                }}
            >
                <Icon name="chevron left" />
            </Button>
            <Button
                icon
                circular
                onClick={() => go(1)}
                aria-label="Next"
                style={{
                    position: "absolute",
                    top: "50%",
                    right: 12,
                    transform: "translateY(-50%)",
                    background: "#ffffffcc",
                }}
            >
                <Icon name="chevron right" />
            </Button>

            {/* Dots */}
            <div
                style={{
                    position: "absolute",
                    bottom: 12,
                    left: 0,
                    right: 0,
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                }}
            >
                {images.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIdx(i)}
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 999,
                            background: i === idx ? UI.primary : "#ffffffaa",
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
