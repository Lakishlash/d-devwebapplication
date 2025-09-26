// src/components/markdown/MarkdownView.jsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownView({ markdown = "" }) {
    return (
        <div className="markdown-body" style={{ lineHeight: 1.6 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
            </ReactMarkdown>
        </div>
    );
}
