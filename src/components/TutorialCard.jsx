import { useMemo, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { THEME } from "@/config";

const FALLBACK = (seed) =>
    `https://picsum.photos/seed/t-${encodeURIComponent(seed)}/640/360`;

/* --- Tiny helpers to keep list cards compact --- */
function stripMarkdown(md = "") {
    return String(md)
        .replace(/```[\s\S]*?```/g, "")          // fenced code blocks
        .replace(/`[^`]*`/g, "")                 // inline code
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")    // images
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
        .replace(/^#+\s+/gm, "")                 // headings
        .replace(/^[>\-*+]\s+/gm, "")            // lists/quotes
        .replace(/[_*~]/g, "")                   // emphasis chars
        .replace(/\|/g, " ")                     // table pipes
        .replace(/\s+/g, " ")                    // collapse WS
        .trim();
}

function mkExcerpt(md = "", max = 200) {
    const txt = stripMarkdown(md);
    return txt.length <= max ? txt : txt.slice(0, max - 1) + "…";
}

export default function TutorialCard({ item }) {
    const initialSrc = useMemo(() => {
        const src = item?.imageUrl || item?.image;
        return typeof src === "string" && /^https?:\/\//i.test(src)
            ? src
            : FALLBACK(item?.id || item?.title || "tutorial");
    }, [item]);

    const [src, setSrc] = useState(initialSrc);

    const excerpt = useMemo(
        () => mkExcerpt(item?.description || "", 200),
        [item?.description]
    );

    return (
        <Card
            raised
            style={{
                margin: 0, // keep grid tidy
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 18,
                boxShadow: "0 8px 20px rgba(0,0,0,.06)",
                overflow: "hidden",
            }}
        >
            <div style={{ flex: "0 0 auto", width: "100%" }}>
                <img
                    src={src}
                    alt={item?.title || "Tutorial image"}
                    onError={() =>
                        setSrc(FALLBACK(item?.id || item?.title || "tutorial"))
                    }
                    style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            </div>

            <Card.Content style={{ flex: "1 1 auto" }}>
                <Card.Header
                    style={{ fontFamily: "Poppins, sans-serif", color: THEME.colors.text }}
                >
                    {item?.title}
                </Card.Header>

                {excerpt && (
                    <Card.Description
                        style={{
                            marginTop: 6,
                            color: "#6b7280",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,           // ⬅️ clamp to 3 lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {excerpt}
                    </Card.Description>
                )}
            </Card.Content>

            <Card.Content extra style={{ flex: "0 0 auto" }}>
                <Button
                    as={Link}
                    to={`/tutorials/${item?.id}`}
                    basic
                    style={{
                        borderRadius: 12,
                        borderColor: THEME.colors.accent,
                        color: THEME.colors.accent,
                    }}
                    content="Learn more"
                />
            </Card.Content>
        </Card>
    );
}
