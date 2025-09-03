import { Form, Radio } from "semantic-ui-react";
import { POST_TYPES, SCHEMA } from "../../data/postSchema";

export default function PostTypeSwitch({ value, onChange }) {
    return (
        <Form.Field>
            <label>{SCHEMA.headings.postTypeLabel}</label>
            <div role="group" aria-label="post-type">
                <Radio
                    label="Question"
                    name="postType"
                    value={POST_TYPES.QUESTION}
                    checked={value === POST_TYPES.QUESTION}
                    onChange={(_, data) => onChange(data.value)}
                    style={{ marginRight: 16 }}
                />
                <Radio
                    label="Article"
                    name="postType"
                    value={POST_TYPES.ARTICLE}
                    checked={value === POST_TYPES.ARTICLE}
                    onChange={(_, data) => onChange(data.value)}
                />
            </div>
        </Form.Field>
    );
}
