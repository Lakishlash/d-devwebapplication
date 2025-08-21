import { useMemo } from 'react';
import { Button, Container } from 'semantic-ui-react';
import HeaderBar from '../components/HeaderBar.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import CardGrid from '../components/CardGrid.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import TutorialCard from '../components/TutorialCard.jsx';
import { generateArticles } from '../data/generateArticles.js';
import { generateTutorials } from '../data/generateTutorials.js';
import EmailSignup from '../components/EmailSignup.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import { THEME } from '../config.js';

export default function HomePage() {
    // Generate mock data once per load (deterministic via THEME.content.seed)
    const articles = useMemo(
        () => generateArticles(THEME.content.articleCount, THEME.content.seed),
        []
    );
    const tutorials = useMemo(
        () => generateTutorials(THEME.content.tutorialCount, THEME.content.seed + 1),
        []
    );

    return (
        <>
            <HeaderBar />
            <HeroBanner />

            {/* Featured Articles */}
            <SectionTitle>Featured Articles</SectionTitle>
            <CardGrid>
                {articles.map(item => (
                    <ArticleCard key={item.id} item={item} />
                ))}
            </CardGrid>
            <Container textAlign="center" style={{ marginBottom: '2.5rem' }}>
                <Button
                    style={{
                        background: THEME.colors.accent,
                        color: 'white',
                        borderRadius: 'var(--btn-radius)',
                        fontWeight: THEME.typography.navWeight,
                    }}
                    content="See all articles"
                />
            </Container>

            {/* Featured Tutorials */}
            <SectionTitle>Featured Tutorials</SectionTitle>
            <CardGrid>
                {tutorials.map(item => (
                    <TutorialCard key={item.id} item={item} />
                ))}
            </CardGrid>
            <Container textAlign="center" style={{ marginBottom: '3rem' }}>
                <Button
                    style={{
                        background: THEME.colors.accent,
                        color: 'white',
                        borderRadius: 'var(--btn-radius)',
                        fontWeight: THEME.typography.navWeight,
                    }}
                    content="See all tutorials"
                />
            </Container>
            <EmailSignup />
            <SiteFooter />
        </>
    );
}
