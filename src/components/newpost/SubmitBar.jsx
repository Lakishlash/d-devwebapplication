// src/components/newpost/SubmitBar.jsx
import { Button } from "semantic-ui-react";

export default function SubmitBar({ onCancel, onSubmit }) {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button basic onClick={onCancel}>Cancel</Button>
            <Button primary onClick={onSubmit}>Post</Button>
        </div>
    );
}
