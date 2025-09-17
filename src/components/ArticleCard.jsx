// Equal-height card with robust <img> + onError fallback.
import { useMemo, useState } from "react";
import { Card, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { THEME } from "@/config";

const FALLBACK = (seed) => `https://picsum.photos/seed/a-${encodeURIComponent(seed)}/640/360`;

export default function ArticleCard({ item }) {
    const initialSrc = useMemo(() => {
        const src = item?.imageUrl || item?.image;
        return typeof src === "string" && /^https?:\/\//i.test(src)
            ? src
            : FALLBACK(item?.id || item?.title || "article");
    }, [item]);

    const [src, setSrc] = useState(initialSrc);

    return (
        <Card
            raised
            style={{
                margin: 0,                       // ⬅️ avoid staggered rows
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
                    alt={item?.title || "Article image"}
                    onError={() => setSrc(FALLBACK(item?.id || item?.title || "article"))}
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                />
            </div>
            <Card.Content style={{ flex: "1 1 auto" }}>
                <Card.Header style={{ fontFamily: "Poppins, sans-serif", color: THEME.colors.text }}>
                    {item?.title}
                </Card.Header>
                {item?.description && (
                    <Card.Description style={{ marginTop: 6 }}>{item.description}</Card.Description>
                )}
            </Card.Content>
            <Card.Content extra style={{ flex: "0 0 auto" }}>
                <Button
                    as={Link}
                    to={`/articles/${item?.id}`}
                    basic
                    style={{ borderRadius: 12, borderColor: THEME.colors.accent, color: THEME.colors.accent }}
                    content="Learn more"
                />
            </Card.Content>
        </Card>
    );
}
