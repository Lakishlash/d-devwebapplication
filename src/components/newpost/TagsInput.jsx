// src/components/newpost/TagsInput.jsx
import { useState } from "react";
import { Input, Label } from "semantic-ui-react";
import { THEME } from "@/config";

export default function TagsInput({ tags = [], addTag, removeTag, popTag, max = 3 }) {
    const [text, setText] = useState("");

    const commit = () => {
        const v = (text || "").trim();
        if (!v) return;
        if (tags.includes(v)) { setText(""); return; }
        if (tags.length >= max) { setText(""); return; }
        addTag(v);
        setText(""); // clear so it doesn't repeat in the next tag
    };

    return (
        <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                {tags.map((t) => (
                    <Label key={t} basic style={{ borderRadius: 12, color: THEME.colors.text }}>
                        {t}
                        <Label.Detail
                            as="button"
                            onClick={() => removeTag(t)}
                            style={{ border: "none", background: "transparent", marginLeft: 6, cursor: "pointer" }}
                            aria-label={`Remove ${t}`}
                        >
                            ×
                        </Label.Detail>
                    </Label>
                ))}
            </div>

            <Input
                icon="tag"
                fluid
                placeholder="Please add up to 3 tags to describe the topic (e.g., Java)"
                value={text}
                onChange={(e, { value }) => setText(value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); commit(); }
                    else if (e.key === "Backspace" && !text) { popTag?.(); }
                }}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: "rgba(0,0,0,.45)" }}>
                {tags.length}/{max} tags
            </div>
        </div>
    );
}
