// src/components/newpost/PostTypeSwitch.jsx
// Toggle between Question / Article / Tutorial.

import { Button, ButtonGroup } from "semantic-ui-react";
import { POST_TYPES } from "@/data/postSchema";
import { THEME } from "@/config";

export default function PostTypeSwitch({ value, onChange }) {
    const items = [
        { key: POST_TYPES.QUESTION, text: "Question" },
        { key: POST_TYPES.ARTICLE, text: "Article" },
        { key: POST_TYPES.TUTORIAL, text: "Tutorial" },
    ];

    return (
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <ButtonGroup>
                {items.map((it) => (
                    <Button
                        key={it.key}
                        toggle
                        active={value === it.key}
                        onClick={() => onChange?.(it.key)}
                        style={{
                            borderRadius: 12,
                            background: value === it.key ? THEME.colors.accent : "#fff",
                            color: value === it.key ? "#fff" : THEME.colors.text,
                            fontWeight: 600,
                        }}
                        content={it.text}
                    />
                ))}
            </ButtonGroup>
        </div>
    );
}
