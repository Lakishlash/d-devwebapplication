// src/components/markdown/MarkdownRenderer.jsx
// Safe Markdown renderer using react-markdown + GFM and rehype-sanitize.
// No raw HTML allowed (prevents XSS). Works for posts and tutorials.

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownRenderer({ markdown = "" }) {
    return (
        <ReactMarkdown
            // GitHub-flavored markdown (tables, task-lists, strikethrough)
            remarkPlugins={[remarkGfm]}
            // Sanitize HTML to keep it safe (blocks script/style etc.)
            rehypePlugins={[rehypeSanitize]}
            components={{
                a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                img: (props) => <img {...props} style={{ maxWidth: "100%", borderRadius: 8 }} />,
                code: ({ inline, children, ...props }) =>
                    inline ? (
                        <code {...props} style={{ background: "var(--soft,#e9f2f8)", padding: "2px 6px", borderRadius: 6 }} >
                            {children}
                        </code>
                    ) : (
                        <pre
                            style={{
                                background: "var(--soft,#e9f2f8)",
                                borderRadius: 10,
                                padding: 12,
                                overflow: "auto",
                            }}
                        >
                            <code {...props}>{children}</code>
                        </pre>
                    ),
            }}
            className="md-content"
        >
            {markdown}
        </ReactMarkdown>
    );
}
