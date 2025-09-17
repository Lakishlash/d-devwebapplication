import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Message, Modal, Divider, Icon } from "semantic-ui-react";
import { useAuth } from "@/auth/AuthProvider";
import { TEXT } from "@/config/text";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import "@/styles/profile.css";

export default function ProfileModal({ open, onClose }) {
    const { user, profile, DEFAULT_AVATAR, updateNamesAndAvatar, updatePassword } = useAuth();

    // name + avatar state
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    // password state
    const [pw1, setPw1] = useState("");
    const [pw2, setPw2] = useState("");

    // ui state
    const [saving, setSaving] = useState(false);
    const [psaving, setPSaving] = useState(false);
    const [ok, setOk] = useState("");
    const [pok, setPOk] = useState("");
    const [err, setErr] = useState("");
    const [perr, setPErr] = useState("");

    // hydrate fields when modal opens or profile changes
    useEffect(() => {
        if (!open) return;
        setErr(""); setOk(""); setPErr(""); setPOk("");
        setFirst(profile?.firstName || user?.displayName?.split(" ")?.[0] || "");
        setLast(profile?.lastName || user?.displayName?.split(" ")?.slice(1).join(" ") || "");
        setFile(null);
        setPreview("");
        setPw1(""); setPw2("");
    }, [open, profile, user]);

    // preview data url for selected avatar
    useEffect(() => {
        if (!file) { setPreview(""); return; }
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result?.toString() || "");
        reader.readAsDataURL(file);
    }, [file]);

    const photoURL = useMemo(
        () => preview || profile?.photoURL || user?.photoURL || DEFAULT_AVATAR,
        [preview, profile, user, DEFAULT_AVATAR]
    );

    async function onSaveProfile(e) {
        e.preventDefault();
        setSaving(true); setErr(""); setOk("");
        try {
            if (!first || !last) throw new Error(TEXT.errors.required);
            await updateNamesAndAvatar({ firstName: first.trim(), lastName: last.trim(), file });
            setOk(TEXT.profile.saved);
            setFile(null); setPreview("");
        } catch {
            setErr(TEXT.errors.generic);
        } finally {
            setSaving(false);
        }
    }

    async function onSavePassword(e) {
        e.preventDefault();
        setPSaving(true); setPErr(""); setPOk("");
        try {
            if (!pw1 || !pw2) throw new Error(TEXT.errors.required);
            if (pw1.length < 6) throw new Error(TEXT.errors.pwWeak);
            if (pw1 !== pw2) throw new Error(TEXT.errors.pwMatch);
            await updatePassword(pw1);
            setPw1(""); setPw2("");
            setPOk(TEXT.profile.pwSaved);
        } catch (e) {
            setPErr(
                e?.code === "auth/requires-recent-login"
                    ? "Please log out and log in again before changing password."
                    : TEXT.errors.generic
            );
        } finally {
            setPSaving(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="small"
            closeIcon
            className="profile-modal"
            style={{ borderRadius: "var(--radius)" }}
        >
            <Modal.Header style={{ fontWeight: "var(--weight-heading)" }}>
                {TEXT.profile.title}
                <div className="hint">{TEXT.profile.subtitle}</div>
            </Modal.Header>

            <Modal.Content>
                {/* Profile section */}
                {err && <Message negative content={err} />}
                {ok && <Message positive content={ok} />}

                <div className="avatar-wrap">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <img className="avatar" src={photoURL} />
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>

                <Form onSubmit={onSaveProfile}>
                    <Form.Group widths="equal">
                        <Form.Input
                            required
                            label="First name"
                            value={first}
                            onChange={(e) => setFirst(e.target.value)}
                        />
                        <Form.Input
                            required
                            label="Last name"
                            value={last}
                            onChange={(e) => setLast(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        className="btn-primary"
                        loading={saving}
                        disabled={saving}
                        type="submit"
                    >
                        Update
                    </Button>
                    <Button type="button" className="btn-secondary" onClick={onClose} style={{ marginLeft: 8 }}>
                        Cancel
                    </Button>
                </Form>

                <div style={{ height: 24 }} />

                {/* Password section */}
                <h4 style={{ fontWeight: "var(--weight-heading)", marginBottom: 8 }}>
                    {TEXT.profile.pwTitle}
                </h4>
                {perr && <Message negative content={perr} />}
                {pok && <Message positive content={pok} />}

                <Form onSubmit={onSavePassword}>
                    <Form.Group widths="equal">
                        <Form.Input
                            required
                            label="New password"
                            type="password"
                            value={pw1}
                            onChange={(e) => setPw1(e.target.value)}
                        />
                        <Form.Input
                            required
                            label="Confirm password"
                            type="password"
                            value={pw2}
                            onChange={(e) => setPw2(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        className="btn-primary"
                        loading={psaving}
                        disabled={psaving}
                        type="submit"
                    >
                        Save password
                    </Button>
                </Form>

                {/* Danger zone */}
                <Divider style={{ margin: "28px 0" }} />
                <div
                    style={{
                        border: "1px solid #f3d0d3",
                        background: "#fff6f6",
                        borderRadius: 12,
                        padding: 14,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Icon name="warning circle" color="red" />
                        <strong style={{ color: "#b00020" }}>Danger zone</strong>
                    </div>
                    <p className="hint" style={{ marginTop: 0 }}>
                        Permanently delete your account, profile, and all posts. This cannot be undone.
                    </p>

                    {/* Self-serve delete flow (with confirm + re-auth) */}
                    <DeleteAccountButton />
                </div>
            </Modal.Content>
        </Modal>
    );
}
