// src/components/HeroBanner.jsx
import { Image } from 'semantic-ui-react';
import { THEME } from '../config.js';

export default function HeroBanner() {
    return (
        <div className="hero-bleed">{}
            <Image src={THEME.assets.banner} alt={THEME.assets.bannerAlt} />
        </div>
    );
}
