export const THEME = {
    brandName: "DEV@Deakin",
    colors: {
        bg: "#f5f5f7",
        text: "#313131",
        accent: "#0171e3",
        soft: "#e9f2f8", // navbar/footer/special backgrounds
    },
    images: { cardWidth: 600, cardHeight: 400, borderRadius: 12 },
    typography: { navWeight: 600, titleWeight: 500, bodyWeight: 400 }, // Poppins weights
    content: {
        articleCount: 3,
        tutorialCount: 3,
        seed: 313,
        topics: ["React", "Node.js", "Vue", "Express", "React Hooks", "React Router", "ES6"],
    },
    assets: {
        banner: "/assets/banner.jpg",
        social: {
            facebook: "/assets/facebook.png",
            instagram: "/assets/instagram.png",
            twitter: "/assets/twitter.png",
        },
        bannerAlt: "DEV@Deakin homepage banner",
    },
};

// Provide a default export too.
export default THEME;
