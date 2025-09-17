// src/components/newpost/ArticleForm.jsx
// Article form with thumbnail picker + live preview (no immediate upload).
// Mirrors the TutorialForm UX.

import { useEffect, useMemo } from "react";
import { Form, Button } from "semantic-ui-react";
import { THEME } from "@/config";
import { SCHEMA } from "@/data/postSchema";
import TagsInput from "./TagsInput";

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

    // Preview for chosen file (revoked on change)
    const previewUrl = useMemo(
        () => (imageFile ? URL.createObjectURL(imageFile) : imageUrl || null),
        [imageFile, imageUrl]
    );
    useEffect(() => {
        return () => {
            if (previewUrl && imageFile) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl, imageFile]);

    return (
        <>
            {/* Image picker (same UX as Tutorial) */}
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
                    {A.image?.helper ?? "The image uploads when you click Post."}
                </div>

                {previewUrl && (
                    <div
                        style={{
                            marginTop: 10,
                            width: 320,
                            height: 180,
                            borderRadius: 12,
                            overflow: "hidden",
                            boxShadow: "0 6px 18px rgba(0,0,0,.12)",
                        }}
                    >
                        <img
                            src={previewUrl}
                            alt="article image preview"
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
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

            {/* Body */}
            <Form.TextArea
                label={A.content?.label ?? "Article Text"}
                placeholder={A.content?.placeholder ?? "Write your article..."}
                value={articleContent ?? ""}
                onChange={(e, { value }) => setArticleContent?.(value)}
                onBlur={onBlur}
                error={errors?.articleContent ? { content: errors.articleContent, pointing: "below" } : null}
                style={{ minHeight: 180 }}
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
                {errors?.tags && (
                    <div style={{ color: "#9f3a38", marginTop: 6, fontSize: 12 }}>
                        {errors.tags}
                    </div>
                )}
            </Form.Field>
        </>
    );
}
