import { Card, Container } from 'semantic-ui-react';

// Generic 3-column responsive grid; children are <Card>s
export default function CardGrid({ children, columns = 3 }) {
    return (
        <Container style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <Card.Group itemsPerRow={columns} stackable doubling>
                {children}
            </Card.Group>
        </Container>
    );
}
