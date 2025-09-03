import { Form } from "semantic-ui-react";
import { SCHEMA, POST_TYPES } from "../../data/postSchema";
import TagsInput from "./TagsInput";

export default function ArticleForm(props) {
    const {
        title, setTitle, onBlur, errors = {},
        articleAbstract, setArticleAbstract,
        articleContent, setArticleContent,
        tags, addTag, removeTag, popTag,
    } = props;

    return (
        <>
            <Form.Input
                label={SCHEMA.common.title.label}
                placeholder={SCHEMA.common.title.placeholders[POST_TYPES.ARTICLE]}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => onBlur("title")}
                error={errors.title ? { content: errors.title } : null}
            />
            <Form.TextArea
                label={SCHEMA.article.abstract.label}
                placeholder={SCHEMA.article.abstract.placeholder}
                value={articleAbstract}
                onChange={(_, data) => setArticleAbstract(String(data.value))}
                onBlur={() => onBlur("articleAbstract")}
                error={errors.articleAbstract ? { content: errors.articleAbstract } : null}
                rows={4}
            />
            <Form.TextArea
                label={SCHEMA.article.content.label}
                placeholder={SCHEMA.article.content.placeholder}
                value={articleContent}
                onChange={(_, data) => setArticleContent(String(data.value))}
                onBlur={() => onBlur("articleContent")}
                error={errors.articleContent ? { content: errors.articleContent } : null}
                rows={10}
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
