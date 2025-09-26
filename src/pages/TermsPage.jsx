// src/pages/TermsPage.jsx

import { Container, Header, Segment } from 'semantic-ui-react';
import { THEME } from '@/config';

export default function TermsPage() {
    return (
        <main style={{ background: 'var(--page)' }}>
            <Container style={{ padding: '2rem 0' }}>
                <Header as="h1" style={{ color: THEME.colors.text }}>Terms of Service</Header>
                <Segment raised style={{ borderRadius: 16 }}>
                    <p>Be respectful. Don’t post illegal or harmful content. You own your content and license us to display it here. We may moderate for quality and safety.</p>
                </Segment>
            </Container>
        </main>
    );
}

