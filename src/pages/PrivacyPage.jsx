// src/pages/PrivacyPage.jsx

import { Container, Header, Segment } from 'semantic-ui-react';
import { THEME } from '@/config';

export default function PrivacyPage() {
    return (
        <main style={{ background: 'var(--page)' }}>
            <Container style={{ padding: '2rem 0' }}>
                <Header as="h1" style={{ color: THEME.colors.text }}>Privacy Policy</Header>
                <Segment raised style={{ borderRadius: 16 }}>
                    <p>We collect only what’s needed to run the site (account and content data). Media you upload is public-read by design. You can delete your own content anytime.</p>
                </Segment>
            </Container>
        </main>
    );
}
