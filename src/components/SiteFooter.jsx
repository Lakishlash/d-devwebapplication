// src/components/SiteFooter.jsx
import { useState } from 'react';
import { Container, Grid, List, Image, Input, Button, Message } from 'semantic-ui-react';
import { THEME } from '../config.js';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const links = {
    explore: [
        { label: 'Home', to: ROUTES.HOME },
        { label: 'Questions', to: ROUTES.QUESTIONS },
        { label: 'Articles', to: ROUTES.ARTICLES },
        { label: 'Tutorials', to: ROUTES.TUTORIALS },
    ],
    support: [
        { label: 'FAQs', to: ROUTES.FAQS },
        { label: 'Help', to: ROUTES.HELP },
        { label: 'Contact Us', to: ROUTES.SUPPORT },
    ],
    legal: [
        { label: 'Privacy Policy', to: ROUTES.PRIVACY },
        { label: 'Terms', to: ROUTES.TERMS },
        { label: 'Code of Conduct', to: ROUTES.CODE_OF_CONDUCT },
    ],
};

function buildSubscribeEndpoint() {
    const explicit = import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim();
    if (explicit) return explicit;
    const base = import.meta.env.VITE_API_BASE_URL?.trim();
    if (base) return `${base.replace(/\/+$/, '')}/api/subscribe`;
    return '/api/subscribe'; // dev: requires vite proxy OR same origin in prod
}

function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const [ok, setOk] = useState('');
    const [err, setErr] = useState('');
    const ENDPOINT = buildSubscribeEndpoint();

    const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    async function submit() {
        setOk(''); setErr('');
        if (!valid(email)) { setErr('Please enter a valid email.'); return; }
        try {
            setBusy(true);
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const j = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(j?.error || `Subscribe failed (${res.status})`);
            setOk('Subscribed! Please check your inbox.');
            setEmail('');
        } catch (e) {
            setErr(e?.message || 'Subscription failed.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 10px 26px rgba(0,0,0,.08)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
            }}
        >
            <div style={{ fontWeight: 600, color: THEME.colors.text, minWidth: 210 }}>
                SIGN UP FOR OUR DAILY INSIDER
            </div>

            <Input
                type="email"
                value={email}
                onChange={(_, { value }) => setEmail(value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={busy}
                style={{ flex: 1, minWidth: 260 }}
            />

            <Button
                primary
                onClick={submit}
                loading={busy}
                disabled={busy}
                style={{ background: THEME.colors.accent, color: '#fff' }}
            >
                Subscribe
            </Button>

            <div style={{ flexBasis: '100%' }} />

            {ok && <Message positive content={ok} style={{ margin: 0 }} />}
            {err && <Message negative content={err} style={{ margin: 0 }} />}
        </div>
    );
}

export default function SiteFooter() {
    return (
        <div style={{ background: THEME.colors.soft, padding: '3rem 0 1rem' }}>
            <Container>
                <div style={{ marginBottom: 24 }}>
                    <NewsletterSignup />
                </div>

                <Grid stackable columns={3}>
                    <Grid.Column>
                        <h4>Explore</h4>
                        <List link>
                            {links.explore.map((item) => (
                                <List.Item as={Link} to={item.to} key={item.label} style={{ color: THEME.colors.text }}>
                                    {item.label}
                                </List.Item>
                            ))}
                        </List>
                    </Grid.Column>

                    <Grid.Column>
                        <h4>Support</h4>
                        <List link>
                            {links.support.map((item) => (
                                <List.Item as={Link} to={item.to} key={item.label} style={{ color: THEME.colors.text }}>
                                    {item.label}
                                </List.Item>
                            ))}
                        </List>
                    </Grid.Column>

                    <Grid.Column textAlign="center">
                        <h4>Stay connected</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <a href="#" aria-label="Facebook">
                                <Image src={THEME.assets?.social?.facebook} size="mini" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <Image src={THEME.assets?.social?.instagram} size="mini" />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Image src={THEME.assets?.social?.twitter} size="mini" />
                            </a>
                        </div>
                    </Grid.Column>
                </Grid>

                <div
                    style={{
                        borderTop: '1px solid rgba(0,0,0,.1)',
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                    }}
                >
                    <strong>{THEME.brandName}</strong> © {new Date().getFullYear()} &nbsp;·&nbsp;
                    {links.legal.map((l, i) => (
                        <span key={l.label}>
                            <Link to={l.to} style={{ color: THEME.colors.text }}>
                                {l.label}
                            </Link>
                            {i < links.legal.length - 1 && ' · '}
                        </span>
                    ))}
                </div>
            </Container>
        </div>
    );
}
