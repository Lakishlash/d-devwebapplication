import { Header, Container } from 'semantic-ui-react';
import { THEME } from '../config.js';

// Simple centered section heading
export default function SectionTitle({ children }) {
    return (
        <Container textAlign="center" style={{ marginTop: '2.5rem' }}>
            <Header
                as="h2"
                style={{ fontWeight: THEME.typography.titleWeight, color: THEME.colors.text }}
            >
                {children}
            </Header>
        </Container>
    );
}
