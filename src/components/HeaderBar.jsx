// src/components/HeaderBar.jsx
import { useState, useEffect } from "react";
import {
    Menu,
    Container,
    Input,
    Button,
    Dropdown,
    Image,
    Loader,
} from "semantic-ui-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { THEME } from "../config.js";
import { TEXT } from "../config/text";
import { useAuth } from "../auth/AuthProvider";

import AuthModal from "./auth/AuthModal";
import ProfileModal from "./profile/ProfileModal";

export default function HeaderBar() {
    const navigate = useNavigate();
    const { search } = useLocation();

    const { user, profile, loading, logout, DEFAULT_AVATAR } = useAuth();

    const [authOpen, setAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState("login"); // 'login' | 'signup'
    const [profileOpen, setProfileOpen] = useState(false);

    const displayName =
        profile?.firstName && profile?.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : user?.displayName || THEME.user?.fallbackName || "User";
    const photoURL = profile?.photoURL || user?.photoURL || DEFAULT_AVATAR;

    // When URL contains ?auth=login|signup, auto-open the modal
    useEffect(() => {
        const sp = new URLSearchParams(search);
        const authQ = sp.get("auth");
        if (authQ === "login" || authQ === "signup") {
            setAuthTab(authQ);
            setAuthOpen(true);
        }
    }, [search]);

    // After user logs in and a ?next=... exists, navigate to it
    useEffect(() => {
        if (!user) return;
        const sp = new URLSearchParams(search);
        const next = sp.get("next");
        if (next) {
            navigate(decodeURIComponent(next), { replace: true });
        }
    }, [user, search, navigate]);

    return (
        <div style={{ background: THEME.colors.soft }}>
            <Container>
                <Menu secondary style={{ border: "none", padding: "var(--nav-vpad) 0" }}>
                    <Menu.Item header style={{ fontWeight: THEME.typography.navWeight }}>
                        {THEME.brandName}
                    </Menu.Item>

                    <Menu.Item style={{ flex: 1 }}>
                        <Input icon="search" placeholder="Search…" fluid style={{ fontFamily: "Poppins, sans-serif" }} />
                    </Menu.Item>

                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Button
                                as={Link}
                                to={ROUTES.NEW_POST}
                                basic
                                aria-label="Create a new post"
                                style={{
                                    borderRadius: "var(--btn-radius)",
                                    fontWeight: THEME.typography.navWeight,
                                    borderColor: THEME.colors.accent,
                                    color: THEME.colors.accent,
                                }}
                                content="Post"
                            />
                        </Menu.Item>

                        <Menu.Item>
                            {loading ? (
                                <Loader active inline size="small" />
                            ) : !user ? (
                                <>
                                    <Button
                                        style={{
                                            borderRadius: "var(--btn-radius)",
                                            background: THEME.colors.accent,
                                            color: "white",
                                            fontWeight: THEME.typography.navWeight,
                                        }}
                                        onClick={() => {
                                            setAuthTab("login");
                                            setAuthOpen(true);
                                        }}
                                        content={TEXT.login}
                                        aria-label={TEXT.login}
                                    />
                                    <AuthModal
                                        open={authOpen}
                                        initialTab={authTab}
                                        onClose={() => setAuthOpen(false)}
                                        onSwitchTab={(t) => setAuthTab(t)}
                                    />
                                </>
                            ) : (
                                <>
                                    <Dropdown
                                        pointing="top right"
                                        icon={null}
                                        trigger={
                                            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <Image src={photoURL} avatar alt="profile" />
                                                <span style={{ fontWeight: THEME.typography.navWeight }}>
                                                    {displayName}
                                                </span>
                                            </span>
                                        }
                                    >
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                text={TEXT.myProfile}
                                                onClick={() => setProfileOpen(true)}
                                            />
                                            <Dropdown.Item as={Link} to={ROUTES.PLANS} text={TEXT.plans} />
                                            <Dropdown.Divider />
                                            <Dropdown.Item text={TEXT.logout} onClick={logout} />
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
                                </>
                            )}
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Container>
        </div>
    );
}
