// Tutorial form with image/video pickers + Markdown editor for Description.
// Requires: npm i react-markdown remark-gfm

import { useMemo, useEffect, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { THEME } from "@/config";
import { SCHEMA } from "@/data/postSchema";
import TagsInput from "./TagsInput";

function MarkdownEditor({ label, value, onChange, error, minRows = 10, placeholder }) {
    const [tab, setTab] = useState("write");
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

export default function TutorialForm({
    // shared
    title, setTitle, onBlur, errors,
    tags, addTag, removeTag, popTag,
    // tutorial
    tutorialDescription, setTutorialDescription,
    imageFile, setImageFile, imageUrl,
    videoFile, setVideoFile,
}) {
    const ST = SCHEMA?.tutorial || {};
    const C = SCHEMA?.common || {};

    // Preview URL for chosen image file (clean up on change)
    const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : imageUrl || null), [imageFile, imageUrl]);
    useEffect(() => () => { if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl); }, [previewUrl, imageFile]);

    return (
        <>
            {/* Thumbnail image */}
            <Form.Field>
                <label style={{ fontWeight: 600, color: THEME.colors.text }}>
                    {ST.thumbnail?.label ?? "Thumbnail image"}
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setImageFile?.(f);
                        }}
                        aria-label="Choose thumbnail image"
                    />
                    <Button type="button" basic size="small" disabled={!imageFile && !previewUrl} onClick={() => setImageFile?.(null)} content="Remove" />
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: "#777" }}>
                    {ST.thumbnail?.helper ?? "The image uploads when you click Post."}
                </div>
                {previewUrl && (
                    <div style={{ marginTop: 10, width: 320, height: 180, borderRadius: 12, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,.12)" }}>
                        <img src={previewUrl} alt="thumbnail preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                )}
            </Form.Field>

            {/* Optional video */}
            <Form.Field>
                <label style={{ fontWeight: 600, color: THEME.colors.text }}>
                    {ST.video?.label ?? "Video"} <span style={{ color: "#888" }}>(optional)</span>
                </label>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFile?.(e.target.files?.[0] || null)} aria-label="Choose tutorial video" />
                    <Button type="button" basic size="small" disabled={!videoFile} onClick={() => setVideoFile?.(null)} content="Remove" />
                </div>
                <div style={{ fontSize: 12, marginTop: 6, color: "#777" }}>
                    {ST.video?.helper ?? "Common formats: mp4, mov, webm."}
                </div>
            </Form.Field>

            {/* Title */}
            <Form.Input
                label={C.title?.label ?? "Title"}
                placeholder={C.title?.placeholders?.[SCHEMA?.POST_TYPES?.TUTORIAL] ?? "Enter a descriptive title"}
                value={title ?? ""}
                onChange={(e, { value }) => setTitle?.(value)}
                onBlur={onBlur}
                error={errors?.title ? { content: errors.title, pointing: "below" } : null}
            />

            {/* Markdown Description */}
            <MarkdownEditor
                label={ST.description?.label ?? "Description (Markdown supported)"}
                value={tutorialDescription}
                onChange={setTutorialDescription}
                error={errors?.tutorialDescription}
                minRows={12}
                placeholder={ST.description?.placeholder ?? "Describe what this tutorial covers…"}
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
