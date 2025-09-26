// src/components/home/FeaturedCard.jsx
// A large magazine-style card with image, pills, title, excerpt and "Read more →" link.

import { Link } from "react-router-dom";

export default function FeaturedCard({ item }) {
    const { id, image, title, description, href, tags = [] } = item;

    return (
        <article key={id} className="mag-card">
            {image ? (
                <div className="mag-media">
                    <img src={image} alt="" loading="lazy" />
                </div>
            ) : null}

            <div className="mag-body">
                {!!tags.length && (
                    <div className="mag-pills">
                        {tags.slice(0, 3).map((t) => (
                            <span key={t} className="mag-pill">{t}</span>
                        ))}
                    </div>
                )}

                <h3 className="mag-title">
                    <Link to={href}>{title}</Link>
                </h3>

                {description && <p className="mag-excerpt">{description}</p>}

                <div className="mag-more">
                    <Link to={href}>Read more →</Link>
                </div>
            </div>
        </article>
    );
}
