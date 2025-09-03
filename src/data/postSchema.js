// Single source of truth for labels, placeholders, and limits
export const POST_TYPES = Object.freeze({
    QUESTION: "question",
    ARTICLE: "article",
});

export const SCHEMA = Object.freeze({
    maxTags: 3,
    minTitleLen: 10,
    headings: {
        page: "New Post",
        section: "What do you want to ask or share",
        postTypeLabel: "Select Post Type:",
        
    },
    common: {
        title: {
            label: "Title",
            placeholders: {
                [POST_TYPES.QUESTION]: "Start your question with how, what, why, etc.",
                [POST_TYPES.ARTICLE]: "Enter a descriptive title",
            },
        },
        tags: {
            label: "Tags",
            helper:
                "Please add up to 3 tags to describe the topic (e.g., Java)",
        },
    },
    question: {
        body: {
            label: "Describe your problem",
            placeholder: "",
        },
    },
    article: {
        abstract: {
            label: "Abstract",
            placeholder: "Enter a 1-paragraph abstract",
        },
        content: {
            label: "Article Text",
            placeholder: "Write your article...",
        },
    },
});
