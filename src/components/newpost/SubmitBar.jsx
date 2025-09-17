// src/components/newpost/SubmitBar.jsx
// Footer with Cancel + Post. Shows a progress bar while uploading and disables Post.

import { Button, Progress } from "semantic-ui-react";
import { THEME } from "@/config";

export default function SubmitBar({
    onCancel,
    onSubmit,
    disabled = false,
    uploading = false,
    progress = 0,
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: uploading ? "1fr auto auto" : "auto auto",
                gap: 12,
                alignItems: "center",
                width: "100%",
            }}
        >
            {uploading && (
                <div style={{ paddingRight: 12 }}>
                    <Progress
                        percent={Math.max(0, Math.min(100, progress || 0))}
                        indicating
                        progress
                        size="small"
                        style={{ margin: 0 }}
                    />
                </div>
            )}

            <Button basic onClick={onCancel} style={{ borderRadius: 12 }}>
                Cancel
            </Button>

            <Button
                onClick={onSubmit}
                disabled={disabled}
                loading={disabled}
                style={{
                    background: THEME.colors.accent,
                    color: "white",
                    borderRadius: 12,
                    fontWeight: THEME.typography.navWeight,
                }}
            >
                Post
            </Button>
        </div>
    );
}
