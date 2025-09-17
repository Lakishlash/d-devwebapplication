// src/components/profile/DeleteAccountButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Message, Icon } from "semantic-ui-react";
import { useAuth } from "@/auth/AuthProvider";
import { deleteMyAccount, reauthenticateCurrentUser } from "@/services/account";

export default function DeleteAccountButton({ className }) {
    const { user } = useAuth();
    const nav = useNavigate();

    const isPasswordUser = (user?.providerData?.[0]?.providerId || "password") === "password";

    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const canDelete = confirmText.trim().toUpperCase() === "DELETE";

    async function handlePopupReauth() {
        try {
            setErr("");
            setBusy(true);
            await reauthenticateCurrentUser(); // popup for OAuth users
        } catch (e) {
            setErr(e?.message || "Re-authentication failed.");
        } finally {
            setBusy(false);
        }
    }

    async function handleDelete() {
        if (!canDelete) return;
        try {
            setErr("");
            setBusy(true);
            await deleteMyAccount({ password: isPasswordUser ? password : undefined });
            // Auth user is gone now
            nav("/", { replace: true });
            // Close modal just in case UI is still mounted
            setOpen(false);
        } catch (e) {
            setErr(e?.message || "Delete failed.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
            <Button
                negative
                basic
                icon
                labelPosition="left"
                className={className}
                onClick={() => setOpen(true)}
            >
                <Icon name="trash" />
                Delete my account
            </Button>

            <Modal open={open} onClose={() => setOpen(false)} size="small" className="profile-modal">
                <Modal.Header>Delete account</Modal.Header>
                <Modal.Content>
                    <p>
                        This permanently deletes your account, profile, and all posts. This action
                        cannot be undone.
                    </p>

                    {err && <Message error content={err} />}

                    {isPasswordUser ? (
                        <Form>
                            <Form.Input
                                type="password"
                                label="Confirm your password"
                                placeholder="Your password"
                                value={password}
                                onChange={(_, { value }) => setPassword(value)}
                            />
                        </Form>
                    ) : (
                        <Message
                            info
                            icon="shield"
                            header="Re-authentication required"
                            content="Click the button below to re-authenticate with your sign-in provider."
                        />
                    )}

                    {!isPasswordUser && (
                        <Button
                            type="button"
                            onClick={handlePopupReauth}
                            loading={busy}
                            disabled={busy}
                            style={{ marginBottom: 10 }}
                        >
                            Re-authenticate
                        </Button>
                    )}

                    <Form>
                        <Form.Input
                            label='Type DELETE to confirm'
                            placeholder="DELETE"
                            value={confirmText}
                            onChange={(_, { value }) => setConfirmText(value)}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={() => setOpen(false)} disabled={busy}>
                        Cancel
                    </Button>
                    <Button
                        negative
                        onClick={handleDelete}
                        loading={busy}
                        disabled={!canDelete || (isPasswordUser && !password) || busy}
                    >
                        Delete my account
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    );
}
