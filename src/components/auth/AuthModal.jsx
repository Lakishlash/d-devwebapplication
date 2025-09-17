import { useEffect, useMemo, useState } from "react";
import { Button, Form, Icon, Input, Message, Modal } from "semantic-ui-react";
import { useAuth } from "@/auth/AuthProvider";
import { TEXT } from "@/config/text";
import { isEmail, minLen } from "@/utils/validation";
import { mapAuthError } from "@/utils/firebaseErrors";
import "@/styles/auth.css";

// Artwork (can be overridden via .env)
const LOGIN_ART = import.meta.env.VITE_LOGIN_ART_URL || "/assets/banner.jpg";
const SIGNUP_ART = import.meta.env.VITE_SIGNUP_ART_URL || "/assets/banner.jpg";

export default function AuthModal({ open, onClose, initialTab = "login", onSwitchTab }) {
    const { login, register, resetPassword, DEFAULT_AVATAR } = useAuth();

    const [tab, setTab] = useState(initialTab); // 'login' | 'signup'
    const [flow, setFlow] = useState("form");   // 'form' | 'reset'
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");
    const [toast, setToast] = useState("");

    // Login state
    const [lemail, setLEmail] = useState("");
    const [lpw, setLPw] = useState("");
    const [showLPw, setShowLPw] = useState(false);

    // Signup state
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [semail, setSEmail] = useState("");
    const [spw, setSPw] = useState("");
    const [spw2, setSPw2] = useState("");
    const [file, setFile] = useState(null);
    const [sPreview, setSPreview] = useState("");
    const [showSPw, setShowSPw] = useState(false);

    // Reset state
    const [remail, setREmail] = useState("");

    // field errors
    const [fe, setFe] = useState({});

    useEffect(() => {
        setTab(initialTab);
        setFlow("form");
        setErr(""); setOk(""); setFe({});
        setToast("");
    }, [initialTab, open]);

    // preview selected avatar
    useEffect(() => {
        if (!file) { setSPreview(""); return; }
        const reader = new FileReader();
        reader.onload = () => setSPreview(reader.result?.toString() || "");
        reader.readAsDataURL(file);
    }, [file]);

    const switchTab = (t) => {
        setErr(""); setOk(""); setFe({}); setFlow("form"); setTab(t); onSwitchTab?.(t);
    };

    // --------- validation ----------
    function vLogin() {
        const e = {};
        if (!lemail) e.lemail = TEXT.errors.required;
        else if (!isEmail(lemail)) e.lemail = TEXT.errors.email;
        if (!lpw) e.lpw = TEXT.errors.required;
        else if (!minLen(lpw)) e.lpw = TEXT.errors.pwWeak;
        setFe(e);
        return Object.keys(e).length === 0;
    }

    function vSignup() {
        const e = {};
        if (!first) e.first = TEXT.errors.required;
        if (!last) e.last = TEXT.errors.required;
        if (!semail) e.semail = TEXT.errors.required;
        else if (!isEmail(semail)) e.semail = TEXT.errors.email;
        if (!spw) e.spw = TEXT.errors.required;
        else if (!minLen(spw)) e.spw = TEXT.errors.pwWeak;
        if (!spw2) e.spw2 = TEXT.errors.required;
        else if (spw !== spw2) e.spw2 = TEXT.errors.pwMatch;
        setFe(e);
        return Object.keys(e).length === 0;
    }

    function vReset() {
        const e = {};
        if (!remail) e.remail = TEXT.errors.required;
        else if (!isEmail(remail)) e.remail = TEXT.errors.email;
        setFe(e);
        return Object.keys(e).length === 0;
    }

    // --------- submit handlers ----------
    const submitLogin = async (e) => {
        e.preventDefault(); setErr(""); setOk("");
        if (!vLogin()) return;
        setBusy(true);
        try {
            await login(lemail.trim(), lpw);
            onClose();
        } catch (ex) {
            setErr(mapAuthError(ex));
        } finally { setBusy(false); }
    };

    const submitSignup = async (e) => {
        e.preventDefault(); setErr(""); setOk("");
        if (!vSignup()) return;
        setBusy(true);
        try {
            await register({
                firstName: first.trim(),
                lastName: last.trim(),
                email: semail.trim(),
                password: spw,
                file,
            });
            // You are now signed in. Show a tiny toast then close.
            setToast("Account created — welcome!");
            setTimeout(() => { setToast(""); onClose(); }, 900);
        } catch (ex) {
            setErr(mapAuthError(ex));
        } finally { setBusy(false); }
    };

    const submitReset = async (e) => {
        e.preventDefault(); setErr(""); setOk("");
        if (!vReset()) return;
        setBusy(true);
        try {
            await resetPassword(remail.trim());
            setOk(TEXT.auth.resetSent);
        } catch (ex) {
            setErr(mapAuthError(ex));
        } finally { setBusy(false); }
    };

    const art = tab === "login" ? LOGIN_ART : SIGNUP_ART;
    const signupAvatar = sPreview || DEFAULT_AVATAR;

    // a11y ids for errors
    const ids = useMemo(() => ({
        lemail: "login-email-err",
        lpw: "login-password-err",
        semail: "signup-email-err",
        spw: "signup-password-err",
        spw2: "signup-confirm-err",
        first: "signup-first-err",
        last: "signup-last-err",
        remail: "reset-email-err",
    }), []);

    return (
        <Modal
            open={open}
            onClose={onClose}
            size="large"
            closeIcon
            className="auth-modal"
            style={{ borderRadius: "var(--radius)", maxWidth: 980 }}
        >
            <Modal.Content>
                <div className="auth-split">
                    {/* Artwork panel */}
                    <aside
                        className="auth-art"
                        aria-hidden="true"
                        style={{ backgroundImage: `url('${art}')` }}
                    >
                        <div className="auth-art-caption">
                            {tab === "login" ? "Welcome back" : "Create your account"}
                        </div>
                    </aside>

                    {/* Form panel */}
                    <section className="auth-form">
                        <h2 className="auth-title">
                            {flow === "reset"
                                ? TEXT.auth.resetTitle
                                : tab === "login"
                                    ? TEXT.auth.loginTitle
                                    : TEXT.auth.signupTitle}
                        </h2>
                        <p className="auth-subtitle">
                            {flow === "reset"
                                ? TEXT.auth.resetSubtitle
                                : tab === "login"
                                    ? TEXT.auth.loginSubtitle
                                    : TEXT.auth.signupSubtitle}
                        </p>

                        {err && <Message negative content={err} />}
                        {ok && <Message positive content={ok} />}

                        {/* --- LOGIN --- */}
                        {flow === "form" && tab === "login" && (
                            <Form onSubmit={submitLogin}>
                                <Form.Field required error={!!fe.lemail}>
                                    <label htmlFor="login-email">Email</label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        value={lemail}
                                        aria-invalid={!!fe.lemail}
                                        aria-describedby={fe.lemail ? ids.lemail : undefined}
                                        onChange={(e) => setLEmail(e.target.value)}
                                    />
                                    {fe.lemail && <div id={ids.lemail} className="hint" style={{ color: 'crimson' }}>{fe.lemail}</div>}
                                </Form.Field>

                                <Form.Field required error={!!fe.lpw}>
                                    <label htmlFor="login-pw">Password</label>
                                    <Input
                                        id="login-pw"
                                        type={showLPw ? "text" : "password"}
                                        icon={<Icon name={showLPw ? "eye slash" : "eye"} link onClick={() => setShowLPw(v => !v)} aria-label="Toggle password visibility" />}
                                        value={lpw}
                                        aria-invalid={!!fe.lpw}
                                        aria-describedby={fe.lpw ? ids.lpw : undefined}
                                        onChange={(e) => setLPw(e.target.value)}
                                    />
                                    {fe.lpw && <div id={ids.lpw} className="hint" style={{ color: 'crimson' }}>{fe.lpw}</div>}
                                </Form.Field>

                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <Button className="btn-primary" loading={busy} disabled={busy} type="submit">
                                        {TEXT.login}
                                    </Button>
                                    <Button type="button" className="btn-secondary" onClick={() => switchTab("signup")}>
                                        {TEXT.signup}
                                    </Button>
                                    <Button
                                        type="button"
                                        className="btn-secondary"
                                        style={{ marginLeft: "auto" }}
                                        onClick={() => { setFlow("reset"); setErr(""); setOk(""); setFe({}); setREmail(lemail); }}
                                    >
                                        {TEXT.auth.forgot}
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {/* --- SIGNUP --- */}
                        {flow === "form" && tab === "signup" && (
                            <Form onSubmit={submitSignup}>
                                <Form.Group widths="equal">
                                    <Form.Field required error={!!fe.first}>
                                        <label htmlFor="su-first">First name</label>
                                        <Input id="su-first" value={first} aria-invalid={!!fe.first} aria-describedby={fe.first ? ids.first : undefined} onChange={(e) => setFirst(e.target.value)} />
                                        {fe.first && <div id={ids.first} className="hint" style={{ color: 'crimson' }}>{fe.first}</div>}
                                    </Form.Field>
                                    <Form.Field required error={!!fe.last}>
                                        <label htmlFor="su-last">Last name</label>
                                        <Input id="su-last" value={last} aria-invalid={!!fe.last} aria-describedby={fe.last ? ids.last : undefined} onChange={(e) => setLast(e.target.value)} />
                                        {fe.last && <div id={ids.last} className="hint" style={{ color: 'crimson' }}>{fe.last}</div>}
                                    </Form.Field>
                                </Form.Group>

                                <Form.Field required error={!!fe.semail}>
                                    <label htmlFor="su-email">Email</label>
                                    <Input id="su-email" type="email" value={semail} aria-invalid={!!fe.semail} aria-describedby={fe.semail ? ids.semail : undefined} onChange={(e) => setSEmail(e.target.value)} />
                                    {fe.semail && <div id={ids.semail} className="hint" style={{ color: 'crimson' }}>{fe.semail}</div>}
                                </Form.Field>

                                <Form.Group widths="equal">
                                    <Form.Field required error={!!fe.spw}>
                                        <label htmlFor="su-pw">Password</label>
                                        <Input
                                            id="su-pw"
                                            type={showSPw ? "text" : "password"}
                                            icon={<Icon name={showSPw ? "eye slash" : "eye"} link onClick={() => setShowSPw(v => !v)} aria-label="Toggle password visibility" />}
                                            value={spw}
                                            aria-invalid={!!fe.spw}
                                            aria-describedby={fe.spw ? ids.spw : undefined}
                                            onChange={(e) => setSPw(e.target.value)}
                                        />
                                        {fe.spw && <div id={ids.spw} className="hint" style={{ color: 'crimson' }}>{fe.spw}</div>}
                                    </Form.Field>

                                    <Form.Field required error={!!fe.spw2}>
                                        <label htmlFor="su-pw2">Confirm password</label>
                                        <Input
                                            id="su-pw2"
                                            type={showSPw ? "text" : "password"}
                                            value={spw2}
                                            aria-invalid={!!fe.spw2}
                                            aria-describedby={fe.spw2 ? ids.spw2 : undefined}
                                            onChange={(e) => setSPw2(e.target.value)}
                                        />
                                        {fe.spw2 && <div id={ids.spw2} className="hint" style={{ color: 'crimson' }}>{fe.spw2}</div>}
                                    </Form.Field>
                                </Form.Group>

                                {/* round avatar preview */}
                                <div className="signup-avatar">
                                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                    <img className="avatar" src={signupAvatar} />
                                    <Input
                                        id="su-file"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button className="btn-primary" loading={busy} disabled={busy} type="submit">
                                        Create account
                                    </Button>
                                    <Button type="button" className="btn-secondary" onClick={() => switchTab("login")}>
                                        {TEXT.login}
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {/* --- RESET PASSWORD --- */}
                        {flow === "reset" && (
                            <Form onSubmit={submitReset}>
                                <Form.Field required error={!!fe.remail}>
                                    <label htmlFor="rs-email">Email</label>
                                    <Input
                                        id="rs-email"
                                        type="email"
                                        value={remail}
                                        aria-invalid={!!fe.remail}
                                        aria-describedby={fe.remail ? ids.remail : undefined}
                                        onChange={(e) => setREmail(e.target.value)}
                                    />
                                    {fe.remail && <div id={ids.remail} className="hint" style={{ color: 'crimson' }}>{fe.remail}</div>}
                                </Form.Field>

                                <div style={{ display: "flex", gap: 8 }}>
                                    <Button className="btn-primary" loading={busy} disabled={busy} type="submit">
                                        {TEXT.auth.resetCTA}
                                    </Button>
                                    <Button type="button" className="btn-secondary" onClick={() => { setFlow("form"); setErr(""); setOk(""); setFe({}); }}>
                                        {TEXT.auth.backToLogin}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </section>
                </div>
            </Modal.Content>

            {/* tiny success toast */}
            {toast && <div className="auth-toast" role="status" aria-live="polite">{toast}</div>}
        </Modal>
    );
}
