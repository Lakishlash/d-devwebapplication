// src/components/questions/QuestionsFilterBar.jsx
import { Button, Dropdown, Form, Input } from "semantic-ui-react";
import { THEME } from "@/config";

export default function QuestionsFilterBar({
    titleQ,
    onTitleQ,
    tagOptions,
    selectedTags,
    onTags,
    datePreset,
    onDatePreset,
    onReset,
}) {
    const titleId = "filter-title";
    const tagsId = "filter-tags";

    return (
        <Form>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(260px,1fr) minmax(260px,1fr) auto",
                    gridTemplateRows: "auto auto",
                    gap: 12,
                    alignItems: "center",
                }}
            >
                {/* Row 1: labels (aligned perfectly across) */}
                <div>
                    <label htmlFor={titleId} style={{ fontWeight: 600, color: THEME.colors.text }}>
                        Title
                    </label>
                </div>
                <div>
                    <label htmlFor={tagsId} style={{ fontWeight: 600, color: THEME.colors.text }}>
                        Tags
                    </label>
                </div>
                <div>
                    <label style={{ fontWeight: 600, color: THEME.colors.text }}>Date</label>
                </div>

                {/* Row 2: controls */}
                <div>
                    <div
                        style={{
                            borderRadius: 999,
                            overflow: "hidden",
                            boxShadow: "inset 0 0 0 1px #e5e5e7",
                        }}
                    >
                        <Input
                            id={titleId}
                            icon="search"
                            placeholder="Search by title…"
                            value={titleQ}
                            onChange={(_, d) => onTitleQ(d.value)}
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>

                <div>
                    <Dropdown
                        id={tagsId}
                        placeholder="Filter by tag(s)"
                        fluid
                        multiple
                        selection
                        options={tagOptions}
                        value={selectedTags}
                        onChange={(_, d) => onTags(d.value)}
                        style={{ borderRadius: 999 }}
                    />
                </div>

                <div>
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            whiteSpace: "nowrap",
                            flexWrap: "nowrap",
                        }}
                    >
                        <Button
                            type="button"
                            basic={datePreset !== "all"}
                            primary={datePreset === "all"}
                            onClick={() => onDatePreset("all")}
                            style={{ borderRadius: 999 }}
                        >
                            All
                        </Button>

                        <Button
                            type="button"
                            basic={datePreset !== "7d"}
                            primary={datePreset === "7d"}
                            onClick={() => onDatePreset("7d")}
                            style={{ borderRadius: 999 }}
                        >
                            Last 7 days
                        </Button>

                        <Button
                            type="button"
                            basic={datePreset !== "30d"}
                            primary={datePreset === "30d"}
                            onClick={() => onDatePreset("30d")}
                            style={{ borderRadius: 999 }}
                        >
                            Last 30 days
                        </Button>

                        <Button
                            type="button"
                            basic
                            onClick={onReset}
                            style={{ borderRadius: 999, padding: "10px 16px" }}
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    );
}
