// src/components/EmailSignup.jsx
import { useState } from 'react';
import { Container, Form, Button, Input, Message } from 'semantic-ui-react';
import { THEME } from '../config.js';

// Optional base URL (leave VITE_API_BASE_URL empty to use Vite proxy + relative /api)
const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || '').trim());

export default function EmailSignup() {
    const [email, setEmail] = useState('');
    const [state, setState] = useState({ loading: false, ok: null, msg: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = (email || '').trim();

        // simple client-side check
        if (!isValidEmail(value)) {
            setState({ loading: false, ok: false, msg: 'Please enter a valid email.' });
            return;
        }

        setState({ loading: true, ok: null, msg: '' });

        try {
            const resp = await fetch(`${apiBase}/api/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: value }),
            });

            const data = await resp.json().catch(() => ({}));
            if (!resp.ok || !data.ok) throw new Error(data.error || 'Subscription failed');

            setState({ loading: false, ok: true, msg: 'Thanks! Please check your inbox for a welcome email.' });
            setEmail('');
        } catch (err) {
            setState({ loading: false, ok: false, msg: err.message || 'Something went wrong. Please try again.' });
        }
    };

    return (
        <div
            style={{
                background: THEME.colors.soft,   // your #e9f2f8-like soft section
                padding: '2rem 0',
                marginTop: '3rem',
            }}
        >
            <Container textAlign="center">
                <Form onSubmit={handleSubmit}>
                    <Form.Field
                        inline
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <label
                            htmlFor="newsletter-email"
                            style={{
                                fontWeight: THEME.typography.titleWeight,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            SIGN UP FOR OUR DAILY INSIDER
                        </label>

                        <Input
                            id="newsletter-email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(_, d) => setEmail(d.value)}
                            required
                            style={{ maxWidth: 300 }}
                            aria-invalid={state.ok === false ? 'true' : 'false'}
                        />

                        <Button
                            type="submit"
                            disabled={state.loading}
                            style={{
                                background: THEME.colors.accent, // your #0171e3
                                color: 'white',
                                borderRadius: 'var(--btn-radius)',
                                fontWeight: THEME.typography.navWeight,
                            }}
                            content={state.loading ? 'Subscribing…' : 'Subscribe'}
                        />
                    </Form.Field>

                    {state.msg && (
                        <Message
                            role="status"
                            positive={state.ok === true}
                            negative={state.ok === false}
                            size="tiny"
                            content={state.msg}
                            style={{ marginTop: '0.75rem' }}
                        />
                    )}
                </Form>
            </Container>
        </div>
    );
}
