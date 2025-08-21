import { Card, Image, Icon } from 'semantic-ui-react';

// item: { id, title, blurb, author, rating, imageUrl }
export default function ArticleCard({ item }) {
    return (
        <Card key={item.id} fluid>
            <Image
                src={item.imageUrl}
                alt={item.title}
                style={{ borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}
            />
            <Card.Content>
                <Card.Header style={{ fontWeight: 500 }}>{item.title}</Card.Header>
                <Card.Description>{item.blurb}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Icon name="star" color="yellow" aria-label="rating" />
                        {item.rating}
                    </div>
                    <div>{item.author}</div>
                </div>
            </Card.Content>
        </Card>
    );
}
