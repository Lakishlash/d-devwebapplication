// src/components/HeaderBar.jsx
// Hide BackButton on HOME only.

import { useState, useEffect } from "react";
import {
    Menu,
    Container,
    Button,
    Dropdown,
    Image,
    Loader,
} from "semantic-ui-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import THEME from "../config.js";
import { TEXT } from "../config/text";
import { useAuth } from "../auth/AuthProvider";
import BackButton from "./common/BackButton";
import AuthModal from "./auth/AuthModal";
import ProfileModal from "./profile/ProfileModal";

const navOr = (maybe, fallback) => (maybe ? maybe : fallback);

export default function HeaderBar() {
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
    const { user, profile, loading, logout, DEFAULT_AVATAR } = useAuth();

    const [authOpen, setAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState("login");
    const [profileOpen, setProfileOpen] = useState(false);

    const displayName =
        profile?.firstName && profile?.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : user?.displayName || THEME.user?.fallbackName || "User";
    const photoURL = profile?.photoURL || user?.photoURL || DEFAULT_AVATAR;

    useEffect(() => {
        const sp = new URLSearchParams(search);
        const authQ = sp.get("auth");
        if (authQ === "login" || authQ === "signup") {
            setAuthTab(authQ);
            setAuthOpen(true);
        }
    }, [search]);

    useEffect(() => {
        if (!user) return;
        const sp = new URLSearchParams(search);
        const next = sp.get("next");
        if (next) navigate(decodeURIComponent(next), { replace: true });
    }, [user, search, navigate]);

    const postPath = ROUTES?.NEW_POST || "/post/new";
    const handlePost = () => {
        if (user) navigate(postPath);
        else {
            setAuthTab("login");
            setAuthOpen(true);
            navigate({
                pathname: "/",
                search: `?auth=login&next=${encodeURIComponent(postPath)}`,
            });
        }
    };

    return (
        <div style={{ background: THEME.colors.soft }}>
            <Container>
                <Menu secondary style={{ border: "none", padding: "var(--nav-vpad) 0" }}>
                    {/* Back only when not on Home */}
                    {pathname !== ROUTES.HOME && (
                        <Menu.Item>
                            <BackButton />
                        </Menu.Item>
                    )}

                    {/* Brand → Home */}
                    <Menu.Item
                        header
                        as={Link}
                        to={ROUTES.HOME}
                        style={{ fontWeight: THEME.typography.navWeight }}
                    >
                        {THEME.brandName}
                    </Menu.Item>

                    <Menu.Item style={{ flex: 1 }} />

                    <Menu.Menu position="right">
                        <Menu.Item as={Link} to={navOr(ROUTES?.FAQS, "#")}>
                            FAQs
                        </Menu.Item>
                        <Menu.Item as={Link} to={navOr(ROUTES?.HELP, "#")}>
                            Help
                        </Menu.Item>
                        <Menu.Item as={Link} to={navOr(ROUTES?.SUPPORT, "#")}>
                            Support
                        </Menu.Item>

                        {/* Filled blue Post button */}
                        <Menu.Item>
                            <Button
                                onClick={handlePost}
                                aria-label="Create a new post"
                                style={{
                                    borderRadius: "var(--btn-radius)",
                                    fontWeight: THEME.typography.navWeight,
                                    background: THEME.colors.accent,
                                    color: "#fff",
                                    border: `1px solid ${THEME.colors.accent}`,
                                    boxShadow: "0 6px 18px rgba(1,113,227,.22)",
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
                                            <span
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                            >
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
                                            <Dropdown.Item
                                                as={Link}
                                                to={ROUTES.PLANS}
                                                text={TEXT.plans}
                                            />
                                            <Dropdown.Divider />
                                            <Dropdown.Item text={TEXT.logout} onClick={logout} />
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <ProfileModal
                                        open={profileOpen}
                                        onClose={() => setProfileOpen(false)}
                                    />
                                </>
                            )}
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Container>
        </div>
    );
}
