// src/pages/HomePage.jsx
// Replace old FeaturedSection blocks with two magazine rows (Articles + Tutorials).
// Shows the pricing block at the end ONLY when signed out (as before).

import { useEffect, useMemo, useState } from "react";
import { Container } from "semantic-ui-react";
import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import HeroCarousel from "@/components/home/HeroCarousel.jsx";
import HomeToggleBar from "@/components/home/HomeToggleBar.jsx";
import FeaturedRow from "@/components/home/FeaturedRow.jsx";
import PricingPlans from "@/components/PricingPlans.jsx";

import { THEME } from "@/config.js";
import { CAROUSEL_IMAGES } from "@/config/homeConfig";
import { watchArticles, watchTutorials } from "@/services/posts";

// small helper for consistent fallback images (not hardcoded content)
const fallbackImg = (seed, w = 960, h = 540) =>
    `https://picsum.photos/seed/${encodeURIComponent(String(seed || "dev"))}/${w}/${h}`;

// derive a pill/tag safely from doc shape
function deriveTags(doc, fallback = "News") {
    if (Array.isArray(doc?.tags) && doc.tags.length) return doc.tags;
    if (doc?.category) return [String(doc.category)];
    return [fallback];
}

export default function HomePage() {
    const [articles, setArticles] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [isAuthed, setIsAuthed] = useState(false);
    const [authReady, setAuthReady] = useState(false);

    // auth (to decide whether to append pricing)
    useEffect(() => {
        const unsub = onAuthStateChanged(getAuth(getApp()), (u) => {
            setIsAuthed(!!u);
            setAuthReady(true);
        });
        return () => unsub && unsub();
    }, []);

    // live data
    useEffect(() => {
        const ua = watchArticles((rows) => setArticles(rows || []));
        const ut = watchTutorials((rows) => setTutorials(rows || []));
        return () => {
            ua && ua();
            ut && ut();
        };
    }, []);

    // take newest 3
    const topArticles = useMemo(() => (articles || []).slice(0, 3), [articles]);
    const topTutorials = useMemo(() => (tutorials || []).slice(0, 3), [tutorials]);

    // shape for cards
    const articleItems = useMemo(
        () =>
            topArticles.map((a, i) => ({
                id: a.id,
                title: a.title || "Article",
                description: a.abstract || "",
                image: a.imageUrl || fallbackImg(a.id || a.title || i),
                href: `/articles/${a.id}`,
                tags: deriveTags(a, i % 2 ? "Tips & Tricks" : "News"),
            })),
        [topArticles]
    );

    const tutorialItems = useMemo(
        () =>
            topTutorials.map((t, i) => ({
                id: t.id,
                title: t.title || "Tutorial",
                description: t.description || "",
                image: t.imageUrl || fallbackImg(t.id || t.title || i),
                href: `/tutorials/${t.id}`,
                tags: deriveTags(t, i % 2 ? "Beginner" : "Guide"),
            })),
        [topTutorials]
    );

    return (
        <main style={{ background: THEME?.colors?.pageBg || "#f5f5f7" }}>
            <Container style={{ paddingTop: 20, paddingBottom: 28 }}>
                {/* hero + segmented control (kept) */}
                <HeroCarousel images={CAROUSEL_IMAGES} height={380} />
                <HomeToggleBar />

                {/* ARTICLES row */}
                <FeaturedRow
                    eyebrow="ARTICLES"
                    title="Articles of Dev"
                    subtitle="Latest writing from the DEV@Deakin community."
                    items={articleItems}
                />

                {/* TUTORIALS row */}
                <FeaturedRow
                    eyebrow="TUTORIALS"
                    title="Learn by Doing"
                    subtitle="Hands-on guides and walkthroughs for building modern apps."
                    items={tutorialItems}
                />

                {/* pricing for signed-out users only, no CTAs */}
                {authReady && !isAuthed && <PricingPlans showCtas={false} />}
            </Container>
        </main>
    );
}
