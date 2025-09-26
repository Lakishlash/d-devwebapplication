// src/components/newpost/QuestionForm.jsx
// Question form with Rich Markdown editor + image/PDF uploads.

import { Form } from "semantic-ui-react";
import { SCHEMA, POST_TYPES } from "@/data/postSchema";
import TagsInput from "./TagsInput";
import RichMarkdownEditor from "@/components/editor/RichMarkdownEditor";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { uploadQAImage, uploadQAPdf } from "@/services/posts";

export default function QuestionForm({
    title, setTitle, onBlur, errors = {},
    questionBody, setQuestionBody,
    tags, addTag, removeTag, popTag,
}) {
    const uid = getAuth(getApp()).currentUser?.uid || null;

    const upImage = uid ? (f) => uploadQAImage(uid, f) : undefined;
    const upPdf = uid ? (f) => uploadQAPdf(uid, f) : undefined;

    return (
        <>
            <Form.Input
                label={SCHEMA.common.title.label}
                placeholder={SCHEMA.common.title.placeholders[POST_TYPES.QUESTION]}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => onBlur("title")}
                error={errors.title ? { content: errors.title } : null}
            />

            <Form.Field error={Boolean(errors.questionBody)}>
                <label>{SCHEMA.question.body.label}</label>
                <RichMarkdownEditor
                    value={questionBody}
                    onChange={(v) => setQuestionBody(String(v))}
                    defaultMode="rich"
                    defaultPreview={false}
                    onUploadImage={upImage}
                    onUploadPdf={upPdf}
                />
                {errors.questionBody && <div style={{ color: "#9f3a38", marginTop: 6 }}>{errors.questionBody}</div>}
            </Form.Field>

            <TagsInput
                tags={tags}
                addTag={addTag}
                removeTag={removeTag}
                popTag={popTag}
                error={errors.tags}
                onBlur={onBlur}
            />
        </>
    );
}
