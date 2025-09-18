import { faker } from '@faker-js/faker';
import { THEME } from '../config.js';

export function generateTutorials(
    count = THEME.content.tutorialCount,
    seed = THEME.content.seed + 1
) {
    faker.seed(seed);
    const { cardWidth, cardHeight } = THEME.images;

    return Array.from({ length: count }, (_, i) => {
        const tech = faker.helpers.arrayElement(THEME.content.topics);
        const formats = ['Hands-on', 'Crash Course', 'Quickstart', 'Step-by-Step', 'Beginner'];
        const title = `${faker.helpers.arrayElement(formats)} ${tech} Tutorial`;

        const blurb = faker.company.catchPhrase();
        const username = faker.internet.userName().toLowerCase();
        const rating = faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }).toFixed(1);
        const id = `tut-${i}-${faker.string.alphanumeric(6)}`;
        const imageUrl = `https://picsum.photos/seed/${id}/${cardWidth}/${cardHeight}`;

        return { id, title, blurb, username, rating, imageUrl };
    });
}
