// src/components/editor/MarkdownEditor.jsx
// A compact Markdown editor with "Write / Preview" toggle using CodeMirror 6.


import { useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";

export default function MarkdownEditor({
  value = "",
  onChange = () => {},
  placeholder = "Write your content in Markdown…",
  minHeight = 220,
}) {
  const [mode, setMode] = useState("write"); // "write" | "preview"
  const extensions = useMemo(() => [markdown()], []);

  return (
    <div style={{ width: "100%" }}>
      {/* Toggle */}
      <div
        style={{
          display: "flex",
          gap: 8,
          background: "var(--soft, #e9f2f8)",
          borderRadius: 9999,
          padding: 4,
          width: "fit-content",
          marginBottom: 10,
        }}
        role="tablist"
        aria-label="Editor mode"
      >
        <button
          type="button"
          onClick={() => setMode("write")}
          aria-selected={mode === "write"}
          role="tab"
          style={{
            border: "none",
            background: mode === "write" ? "var(--accent, #0171e3)" : "transparent",
            color: mode === "write" ? "#fff" : "var(--text, #313131)",
            borderRadius: 9999,
            padding: "8px 14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setMode("preview")}
          aria-selected={mode === "preview"}
          role="tab"
          style={{
            border: "none",
            background: mode === "preview" ? "var(--accent, #0171e3)" : "transparent",
            color: mode === "preview" ? "#fff" : "var(--text, #313131)",
            borderRadius: 9999,
            padding: "8px 14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Preview
        </button>
      </div>

      {mode === "write" ? (
        <div
          style={{
            border: "1px solid rgba(0,0,0,.12)",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <CodeMirror
            value={value}
            height={`${Math.max(minHeight, 220)}px`}
            extensions={extensions}
            onChange={(v) => onChange(v)}
            placeholder={placeholder}
            basicSetup={{ lineNumbers: false, autocompletion: false, foldGutter: false }}
            style={{
              fontFamily:
                "'SFMono-Regular', ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: 14,
            }}
          />
        </div>
      ) : (
        <div
          className="md-content"
          style={{
            border: "1px solid rgba(0,0,0,.12)",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
            minHeight,
          }}
        >
          <MarkdownRenderer markdown={value || "_Nothing to preview yet._"} />
        </div>
      )}
    </div>
  );
}
