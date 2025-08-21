import { faker } from '@faker-js/faker';
import { THEME } from '../config.js';

export function generateArticles(
    count = THEME.content.articleCount,
    seed = THEME.content.seed
) {
    faker.seed(seed);
    const { cardWidth, cardHeight } = THEME.images;

    return Array.from({ length: count }, (_, i) => {
        const tech = faker.helpers.arrayElement(THEME.content.topics);
        const verbs = ['Mastering', 'A Guide to', 'Understanding', '10 Tips for', 'Deep Dive into'];
        const title = `${faker.helpers.arrayElement(verbs)} ${tech}`;

        const blurb = faker.hacker.phrase();
        const author = faker.person.fullName();
        const rating = faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }).toFixed(1);
        const id = `art-${i}-${faker.string.alphanumeric(6)}`;
        const imageUrl = `https://picsum.photos/seed/${id}/${cardWidth}/${cardHeight}`;

        return { id, title, blurb, author, rating, imageUrl };
    });
}
