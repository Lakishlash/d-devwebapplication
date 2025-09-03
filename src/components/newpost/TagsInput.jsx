import { useRef, useState } from "react";
import { Form, Input, Label } from "semantic-ui-react";
import { SCHEMA } from "../../data/postSchema";

export default function TagsInput({ tags, addTag, removeTag, popTag, error, onBlur }) {
    const [draft, setDraft] = useState("");
    const inputRef = useRef(null);

    const tryAdd = () => {
        if (!draft) return;
        const added = addTag(draft);
        if (added) setDraft("");
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            tryAdd();
        } else if (e.key === "Backspace" && draft.length === 0 && tags.length > 0) {
            e.preventDefault();
            popTag();
        }
    };

    return (
        <Form.Field error={!!error}>
            <label>{SCHEMA.common.tags.label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {tags.map((t) => (
                    <Label key={t} as="a" onClick={() => removeTag(t)} basic>
                        {t} ×
                    </Label>
                ))}
                <Input
                    ref={inputRef}
                    placeholder={SCHEMA.common.tags.helper}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={() => onBlur("tags")}
                    style={{ minWidth: 240, flex: 1 }}
                />
            </div>
            {error && <div className="ui pointing red basic label">{error}</div>}
        </Form.Field>
    );
}
