// src/pages/CodeOfConductPage.jsx

import { Container, Header, Segment, List } from 'semantic-ui-react';
import { THEME } from '@/config';

export default function CodeOfConductPage() {
    return (
        <main style={{ background: 'var(--page)' }}>
            <Container style={{ padding: '2rem 0' }}>
                <Header as="h1" style={{ color: THEME.colors.text }}>Code of Conduct</Header>
                <Segment raised style={{ borderRadius: 16 }}>
                    <List bulleted>
                        <List.Item>Be kind and constructive.</List.Item>
                        <List.Item>No harassment, hate speech, or spam.</List.Item>
                        <List.Item>Credit sources and use code blocks for code.</List.Item>
                        <List.Item>Report issues via the Support page.</List.Item>
                    </List>
                </Segment>
            </Container>
        </main>
    );
}

