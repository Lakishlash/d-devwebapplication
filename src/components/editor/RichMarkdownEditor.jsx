import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { Button } from "semantic-ui-react";

// --- CodeMirror (v5) ---
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/theme/neo.css";

// Local styles that also clamp images in rendered markdown
const styles = {
    frame: {
        border: "1px solid #e6e6ef",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
    },
    toolbar: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "10px 12px",
        background: "linear-gradient(#fafbff,#f4f6fb)",
        borderBottom: "1px solid #ececf5",
    },
    btn: {
        borderRadius: 10,
        padding: "5px 10px",
        background: "#fff",
        border: "1px solid #e1e4f0",
        fontSize: 12,
    },
    editorWrap: { padding: 12 },
    preview: {
        padding: 12,
        borderTop: "1px dashed #eee",
        background: "#fcfcff",
    },
    tip: {
        fontSize: 12,
        color: "#869",
        padding: "6px 12px",
        borderTop: "1px solid #f0f0f7",
        background: "#fafbff",
    },
};

// Small global CSS the component relies on
const injectOnce = (() => {
    let done = false;
    return () => {
        if (done) return;
        done = true;
        const css = `
/* CodeMirror sizing */
.rme .CodeMirror { height: auto !important; min-height: 220px; font-size: 14px; }
.rme .CodeMirror-scroll { max-height: none; }

/* Rendered markdown */
.rme .md-body img { max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 10px 0; }
.rme .md-body pre { background: #0b1220; color: #dfe7ff; padding: 12px 14px; border-radius: 10px; overflow: auto; }
.rme .md-body code:not(pre code) { background: #eef1ff; padding: 1px 6px; border-radius: 6px; }
.rme .md-body h2, .rme .md-body h3 { margin: 16px 0 8px; }

/* Make sure Grammarly doesn't hijack our editor */
.rme [data-gramm], .rme [data-gramm_editor] { pointer-events: auto; }
`;
        const el = document.createElement("style");
        el.textContent = css;
        document.head.appendChild(el);
    };
})();

function icon(label) {
    return <span style={{ fontWeight: 600 }}>{label}</span>;
}

export default function RichMarkdownEditor({
    value,
    onChange,
    onUploadImage,
    onUploadPdf,
    placeholder = "Start typing...",
    defaultMode = "rich", // "rich" | "md"
}) {
    injectOnce();
    const [mode, setMode] = useState(defaultMode === "md" ? "md" : "rich");
    const [local, setLocal] = useState(value || "");
    const cmRef = useRef(null);

    // Keep internal state in sync if parent replaces the value
    useEffect(() => {
        setLocal(value || "");
    }, [value]);

    // Call parent on every change
    useEffect(() => {
        onChange?.(local);
    }, [local]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- helpers ------------------------------------------------
    const appendAtEnd = (snippet) => {
        setLocal((prev) => {
            const newline = prev && !prev.endsWith("\n") ? "\n" : "";
            const next = `${prev}${newline}${snippet}\n`;
            return next;
        });

        // put caret at end & scroll in CM if mounted
        setTimeout(() => {
            if (cmRef.current) {
                const cm = cmRef.current.editor;
                const doc = cm.getDoc();
                const lastLine = doc.lastLine();
                const endPos = { line: lastLine, ch: doc.getLine(lastLine).length };
                cm.focus();
                cm.setCursor(endPos);
                cm.scrollIntoView(endPos, 50);
            }
        }, 0);
    };

    const insertMd = (kind) => {
        if (kind === "bold") setLocal((s) => s + (s ? "\n" : "") + `**bold**`);
        if (kind === "italic") setLocal((s) => s + (s ? "\n" : "") + `*italic*`);
        if (kind === "h2") setLocal((s) => s + (s ? "\n" : "") + `## Heading`);
        if (kind === "ul") setLocal((s) => s + (s ? "\n" : "") + `- Item\n- Item`);
        if (kind === "ol") setLocal((s) => s + (s ? "\n" : "") + `1. First\n2. Second`);
    };

    const onPick = async (accept, handler) => {
        if (!handler) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                const url = await handler(file);
                if (!url) return;

                // Markdown token (we append, never at the caret)
                const isImg = accept.startsWith("image/");
                const token = isImg ? `![image](${url})` : `[${file.name || "PDF"}](${url})`;
                appendAtEnd(token);
            } catch (e) {
                console.warn("Upload failed:", e?.message || e);
            }
        };
        input.click();
    };

    // --- render -------------------------------------------------
    const toolbar = (
        <div style={styles.toolbar}>
            <button type="button" style={styles.btn} onClick={() => insertMd("bold")}>{icon("B")}</button>
            <button type="button" style={styles.btn} onClick={() => insertMd("italic")}>{icon("i")}</button>
            <button type="button" style={styles.btn} onClick={() => insertMd("h2")}>{icon("H2")}</button>
            <button type="button" style={styles.btn} onClick={() => insertMd("ul")}>{icon("• List")}</button>
            <button type="button" style={styles.btn} onClick={() => insertMd("ol")}>{icon("1. List")}</button>
            <button
                type="button"
                style={styles.btn}
                onClick={() => onPick("image/*", onUploadImage)}
            >
                {icon("Image")}
            </button>
            <button
                type="button"
                style={styles.btn}
                onClick={() => onPick("application/pdf", onUploadPdf)}
            >
                {icon("PDF")}
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <Button size="mini" basic onClick={() => setMode((m) => (m === "md" ? "rich" : "md"))}>
                    {mode === "md" ? "Switch to Rich Editor" : "Switch to Markdown"}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="rme" style={styles.frame} data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false">
            {toolbar}

            {/* Editor */}
            <div style={styles.editorWrap}>
                {mode === "md" ? (
                    <CodeMirror
                        ref={cmRef}
                        value={local}
                        options={{
                            mode: "markdown",
                            theme: "neo",
                            lineNumbers: false,
                            lineWrapping: true,
                            viewportMargin: Infinity, // auto height
                            placeholder,
                        }}
                        onBeforeChange={(_editor, _data, val) => setLocal(val)}
                        onChange={() => { }}
                        autoFocus
                    />
                ) : (
                    <textarea
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        placeholder={placeholder}
                        rows={10}
                        style={{
                            width: "100%",
                            minHeight: 220,
                            resize: "vertical",
                            border: "1px solid #eef",
                            borderRadius: 10,
                            padding: 12,
                            fontSize: 14,
                            lineHeight: 1.5,
                        }}
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                    />
                )}
            </div>

            {/* Live preview (toggleable if you want; left visible keeps parity with Reddit) */}
            <div style={styles.preview} className="md-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
                    {local || "*Nothing to preview yet.*"}
                </ReactMarkdown>
            </div>

            <div style={styles.tip}>
                Tip: uploads are appended at the end and we keep your caret in place. Image/PDF links won’t jump into the middle of your text.
            </div>
        </div>
    );
}
