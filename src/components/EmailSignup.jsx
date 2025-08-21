// src/components/EmailSignup.jsx
import { useState } from 'react';
import { Container, Form, Button, Input, Message } from 'semantic-ui-react';
import { THEME } from '../config.js';

export default function EmailSignup() {
    const [email, setEmail] = useState('');
    const [done, setDone] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();
        // naive e-mail check
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setDone(ok);
    };

    return (
        <div
            style={{
                background: THEME.colors.soft,
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
                            alignItems: 'center',   // vertical centering
                            gap: '0.75rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',       // tidy on small screens
                        }}
                    >
                        <label
                            style={{
                                fontWeight: THEME.typography.titleWeight,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            SIGN UP FOR OUR DAILY INSIDER
                        </label>

                        <Input
                            placeholder="Enter your email"
                            value={email}
                            onChange={(_, d) => setEmail(d.value)}
                            style={{ maxWidth: 300 }}
                        />

                        <Button
                            type="submit"
                            style={{
                                background: THEME.colors.accent,
                                color: 'white',
                                borderRadius: 'var(--btn-radius)',
                                fontWeight: THEME.typography.navWeight,
                            }}
                            content="Subscribe"
                        />
                    </Form.Field>

                    {done && (
                        <Message
                            positive
                            size="tiny"
                            content="Thanks! You’re on the list."
                        />
                    )}
                </Form>
            </Container>
        </div>
    );
}
