// Article form with image picker + Markdown editor (Write/Preview).
// Requires: npm i react-markdown remark-gfm

import { useEffect, useMemo, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { THEME } from "@/config";
import { SCHEMA } from "@/data/postSchema";
import TagsInput from "./TagsInput";

function MarkdownEditor({ label, value, onChange, error, minRows = 12, placeholder }) {
    const [tab, setTab] = useState("write"); // write | preview
    return (
        <Form.Field error={!!error}>
            <label style={{ fontWeight: 600, color: THEME.colors.text }}>{label}</label>

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <Button type="button" size="tiny" basic={tab !== "write"} primary={tab === "write"} onClick={() => setTab("write")}>
                    Write
                </Button>
                <Button type="button" size="tiny" basic={tab !== "preview"} primary={tab === "preview"} onClick={() => setTab("preview")}>
                    Preview
                </Button>
            </div>

            {tab === "write" ? (
                <Form.TextArea
                    placeholder={placeholder}
                    value={value || ""}
                    onChange={(e, { value }) => onChange?.(value)}
                    style={{ minHeight: minRows * 18, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                />
            ) : (
                <div className="md-prose" style={{ padding: 12, background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,.06)" }}>
                    <ReactMarkdown remarkPlugins={[gfm]}>{value || "_Nothing to preview yet…_"}</ReactMarkdown>
                </div>
            )}

            {error && <div style={{ color: "#9f3a38", marginTop: 6, fontSize: 12 }}>{error}</div>}
        </Form.Field>
    );
}

export default function ArticleForm({
    // shared
    title, setTitle, onBlur, errors,
    tags, addTag, removeTag, popTag,

    // article text
    articleAbstract, setArticleAbstract,
    articleContent, setArticleContent,

    // image like tutorial
    imageFile, setImageFile, imageUrl,
}) {
    const C = SCHEMA?.common || {};
    const A = SCHEMA?.article || {};

    // preview for chosen file (revoked on change)
    const previewUrl = useMemo(
        () => (imageFile ? URL.createObjectURL(imageFile) : imageUrl || null),
        [imageFile, imageUrl]
    );
    useEffect(() => () => { if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl); }, [previewUrl, imageFile]);

    return (
        <>
            {/* Image picker */}
            <Form.Field>
                <label style={{ fontWeight: 600, color: THEME.colors.text }}>
                    {A.image?.label ?? "Add an image"}
                </label>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setImageFile?.(f);
                        }}
                        aria-label="Choose article image"
                    />
                    <Button type="button" basic size="small" disabled={!imageFile && !previewUrl} onClick={() => setImageFile?.(null)} content="Remove" />
                </div>

                <div style={{ fontSize: 12, marginTop: 6, color: "#777" }}>
                    {A.image?.helper ?? "The image uploads when you click Post."}
                </div>

                {previewUrl && (
                    <div style={{ marginTop: 10, width: 320, height: 180, borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}>
                        <img src={previewUrl} alt="article image preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                )}
            </Form.Field>

            {/* Title */}
            <Form.Input
                label={C.title?.label ?? "Title"}
                placeholder={C.title?.placeholders?.article ?? "Enter a descriptive title"}
                value={title ?? ""}
                onChange={(e, { value }) => setTitle?.(value)}
                onBlur={onBlur}
                error={errors?.title ? { content: errors.title, pointing: "below" } : null}
            />

            {/* Abstract */}
            <Form.TextArea
                label={A.abstract?.label ?? "Abstract"}
                placeholder={A.abstract?.placeholder ?? "Enter a 1-paragraph abstract"}
                value={articleAbstract ?? ""}
                onChange={(e, { value }) => setArticleAbstract?.(value)}
                onBlur={onBlur}
                error={errors?.articleAbstract ? { content: errors.articleAbstract, pointing: "below" } : null}
                style={{ minHeight: 90 }}
            />

            {/* Markdown body */}
            <MarkdownEditor
                label={A.content?.label ?? "Article Content (Markdown supported)"}
                value={articleContent}
                onChange={setArticleContent}
                error={errors?.articleContent}
                minRows={14}
                placeholder={A.content?.placeholder ?? "Write your article in Markdown…"}
            />

            {/* Tags */}
            <Form.Field error={Boolean(errors?.tags)}>
                <label style={{ fontWeight: 600, color: THEME.colors.text }}>
                    {C.tags?.label ?? "Tags"}
                </label>
                <TagsInput
                    tags={Array.isArray(tags) ? tags : []}
                    addTag={addTag}
                    removeTag={removeTag}
                    popTag={popTag}
                    max={SCHEMA?.maxTags ?? 3}
                    placeholder={C.tags?.helper ?? "Add a tag and press Enter (max 3)"}
                />
                {errors?.tags && <div style={{ color: "#9f3a38", marginTop: 6, fontSize: 12 }}>{errors.tags}</div>}
            </Form.Field>
        </>
    );
}
