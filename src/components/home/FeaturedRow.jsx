// src/components/home/FeaturedRow.jsx
// Section header + responsive grid of <FeaturedCard/> (3 → 1 columns).

import FeaturedCard from "./FeaturedCard.jsx";

export default function FeaturedRow({ eyebrow, title, subtitle, items = [] }) {
    return (
        <section className="mag-row">
            <header className="mag-head">
                {eyebrow && <div className="mag-eyebrow">{eyebrow}</div>}
                <h2 className="mag-h2">{title}</h2>
                {subtitle && <p className="mag-sub">{subtitle}</p>}
            </header>

            <div className="mag-grid">
                {items.slice(0, 3).map((it) => (
                    <FeaturedCard key={it.id} item={it} />
                ))}
            </div>
        </section>
    );
}
