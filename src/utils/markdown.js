// Minimal helpers for list cards (keep full markdown for detail page)
export function stripMarkdown(md = "") {
    return String(md)
        // remove fenced code blocks
        .replace(/```[\s\S]*?```/g, "")
        // inline code
        .replace(/`[^`]*`/g, "")
        // images ![alt](url)
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        // links [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        // headings, lists, blockquotes, emphasis, tables, extra pipes
        .replace(/^#+\s+/gm, "")
        .replace(/^[>\-*+]\s+/gm, "")
        .replace(/[_*~]/g, "")
        .replace(/\|/g, " ")
        // collapse whitespace
        .replace(/\s+/g, " ")
        .trim();
}

export function mkExcerpt(md = "", max = 160) {
    const txt = stripMarkdown(md);
    if (txt.length <= max) return txt;
    return txt.slice(0, max - 1) + "…";
}
