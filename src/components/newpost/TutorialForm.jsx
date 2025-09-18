// src/components/newpost/TutorialForm.jsx
// Tutorial-specific form: thumbnail (image), optional video, title, description, tags.
// IMPORTANT: Uses the SAME TagsInput prop names as other forms:
//   tags, addTag, removeTag, popTag  ← so Enter-to-add works.

import { useMemo, useEffect } from "react";
import { Form, Button } from "semantic-ui-react";
import { THEME } from "@/config";
import { SCHEMA } from "@/data/postSchema";
import TagsInput from "./TagsInput";

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
                    <Button
                        type="button"
                        basic
                        size="small"
                        disabled={!imageFile && !previewUrl}
                        onClick={() => setImageFile?.(null)}
                        content="Remove"
                    />
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
                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setVideoFile?.(f);
                        }}
                        aria-label="Choose tutorial video"
                    />
                    <Button
                        type="button"
                        basic
                        size="small"
                        disabled={!videoFile}
                        onClick={() => setVideoFile?.(null)}
                        content="Remove"
                    />
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

            {/* Description */}
            <Form.TextArea
                label={ST.description?.label ?? "Description"}
                placeholder={ST.description?.placeholder ?? "Describe what this tutorial covers…"}
                value={tutorialDescription ?? ""}
                onChange={(e, { value }) => setTutorialDescription?.(value)}
                onBlur={onBlur}
                error={errors?.tutorialDescription ? { content: errors.tutorialDescription, pointing: "below" } : null}
                style={{ minHeight: 120 }}
            />

            {/* Tags — SAME prop names your other forms use */}
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
                {errors?.tags && (
                    <div style={{ color: "#9f3a38", marginTop: 6, fontSize: 12 }}>{errors.tags}</div>
                )}
            </Form.Field>
        </>
    );
}
