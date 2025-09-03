import { Form } from "semantic-ui-react";
import { SCHEMA, POST_TYPES } from "../../data/postSchema";
import TagsInput from "./TagsInput";

export default function QuestionForm(props) {
    const {
        title, setTitle, onBlur, errors = {},
        questionBody, setQuestionBody,
        tags, addTag, removeTag, popTag,
    } = props;

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
            <Form.TextArea
                label={SCHEMA.question.body.label}
                placeholder={SCHEMA.question.body.placeholder}
                value={questionBody}
                onChange={(_, data) => setQuestionBody(String(data.value))}
                onBlur={() => onBlur("questionBody")}
                error={errors.questionBody ? { content: errors.questionBody } : null}
                rows={8}
            />
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
