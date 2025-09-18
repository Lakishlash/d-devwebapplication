// src/config/homeConfig.js
// Make section tiles robust (works with src/assets OR public/assets). No change if you already pasted this.

import { THEME } from "../config.js";
const assetUrls = import.meta.glob("../assets/*", { as: "url", eager: true });
const findAsset = (nameBase) => {
    const local = Object.entries(assetUrls).find(([p]) =>
        p.toLowerCase().includes(`/${nameBase.toLowerCase()}`)
    )?.[1];
    if (local) return local;
    return `/assets/${nameBase}.jpg`; // dev-friendly default
};

export const CAROUSEL_IMAGES = [
    "/assets/banner.jpg",
    "/assets/banner01.jpg",
    "/assets/banner02.jpg",
    "/assets/banner03.jpg",
];

export const SECTIONS = {
    articles: {
        title: "Featured Articles",
        heroImage: findAsset("articleshomeimage"),
        href: "/articles",
    },
    tutorials: {
        title: "Featured Tutorials",
        heroImage: findAsset("tutorialshomeimage"),
        href: "/tutorials",
    },
    questions: {
        title: "Featured Questions",
        heroImage: findAsset("questionshomeimage"),
        href: "/questions",
    },
};

export const UI = {
    bg: THEME.colors.pageBg || "#f5f5f7",
    text: THEME.colors.text || "#313131",
    soft: THEME.colors.soft || "#e9f2f8",
    primary: THEME.colors.primary || THEME.colors.accent || "#0171e3",
};
