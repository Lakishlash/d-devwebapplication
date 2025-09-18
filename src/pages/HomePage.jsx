// src/pages/HomePage.jsx
// Home page: Carousel → Toggle bar → 3 featured sections (live data).

import { useEffect, useMemo, useState } from "react";
import { Container } from "semantic-ui-react";

import HeroCarousel from "@/components/home/HeroCarousel.jsx";
import HomeToggleBar from "@/components/home/HomeToggleBar.jsx";
import FeaturedSection from "@/components/home/FeaturedSection.jsx";

import { THEME } from "@/config.js";
import { CAROUSEL_IMAGES, SECTIONS } from "@/config/homeConfig";
import {
    watchArticles,
    watchTutorials,
    watchQuestions,
} from "@/services/posts";

// Helper: simple, stable fallback so article/tutorial tiles never collapse
const fallbackImg = (seed, w = 800, h = 450) =>
    `https://picsum.photos/seed/${encodeURIComponent(String(seed || "seed"))}/${w}/${h}`;

export default function HomePage() {
    // live data
    const [articles, setArticles] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [questions, setQuestions] = useState([]);

    // subscribe once (unsub on unmount)
    useEffect(() => {
        const ua = watchArticles((rows) => setArticles(rows || []));
        const ut = watchTutorials((rows) => setTutorials(rows || []));
        const uq = watchQuestions((rows) => setQuestions(rows || []));
        return () => {
            ua && ua();
            ut && ut();
            uq && uq();
        };
    }, []);

    // newest 3 (watchers are already sorted desc by createdAt)
    const topArticles = useMemo(() => (articles || []).slice(0, 3), [articles]);
    const topTutorials = useMemo(() => (tutorials || []).slice(0, 3), [tutorials]);
    const topQuestions = useMemo(() => (questions || []).slice(0, 3), [questions]);

    // shape for FeaturedSection: { id, title, description, image|null, href }
    const articleItems = useMemo(
        () =>
            topArticles.map((a) => ({
                id: a.id,
                title: a.title || "Article",
                description: a.abstract || "",
                image: a.imageUrl || fallbackImg(a.id || a.title),
                href: `/articles/${a.id}`,
            })),
        [topArticles]
    );

    const tutorialItems = useMemo(
        () =>
            topTutorials.map((t) => ({
                id: t.id,
                title: t.title || "Tutorial",
                description: t.description || "",
                image: t.imageUrl || fallbackImg(t.id || t.title),
                href: `/tutorials/${t.id}`,
            })),
        [topTutorials]
    );

    // IMPORTANT: no images for questions (pass null) so those tiles render text-only
    const questionItems = useMemo(
        () =>
            topQuestions.map((q) => ({
                id: q.id,
                title: q.title || "Question",
                description: "Click to explore community Q&A.",
                image: null, // ← no image on question tiles
                href: `/questions/${q.id}`,
            })),
        [topQuestions]
    );

    return (
        <main style={{ background: THEME.colors.pageBg || "#f5f5f7" }}>
            <Container style={{ paddingTop: 20, paddingBottom: 28 }}>
                {/* 1) Hero carousel */}
                <HeroCarousel images={CAROUSEL_IMAGES} height={380} />

                {/* 2) segmented toggle + search */}
                <HomeToggleBar />

                {/* 3) Featured sections (live) */}
                <FeaturedSection
                    title={SECTIONS.articles.title}
                    heroImage={SECTIONS.articles.heroImage}
                    items={articleItems}
                />

                <FeaturedSection
                    title={SECTIONS.tutorials.title}
                    heroImage={SECTIONS.tutorials.heroImage}
                    items={tutorialItems}
                />

                <FeaturedSection
                    title={SECTIONS.questions.title}
                    heroImage={SECTIONS.questions.heroImage}
                    items={questionItems}
                />
            </Container>
        </main>
    );
}
