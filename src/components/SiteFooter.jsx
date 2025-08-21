// src/components/SiteFooter.jsx
import { Container, Grid, List, Image } from 'semantic-ui-react';
import { THEME } from '../config.js';

const links = {
    explore: ['Home', 'Questions', 'Articles', 'Tutorials'],
    support: ['FAQs', 'Help', 'Contact Us'],
    legal: ['Privacy Policy', 'Terms', 'Code of Conduct'],
};

export default function SiteFooter() {
    return (
        <div style={{ background: THEME.colors.soft, padding: '3rem 0 1rem' }}>
            <Container>
                {/* top grid */}
                <Grid stackable columns={3}>
                    <Grid.Column>
                        <h4>Explore</h4>
                        <List link>
                            {links.explore.map(item => (
                                <List.Item as="a" key={item} style={{ color: THEME.colors.text }}>
                                    {item}
                                </List.Item>
                            ))}
                        </List>
                    </Grid.Column>
                    <Grid.Column>
                        <h4>Support</h4>
                        <List link>
                            {links.support.map(item => (
                                <List.Item as="a" key={item} style={{ color: THEME.colors.text }}>
                                    {item}
                                </List.Item>
                            ))}
                        </List>
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                        <h4>Stay connected</h4>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <a href="#" aria-label="Facebook">
                                <Image src={THEME.assets.social.facebook} size="mini" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <Image src={THEME.assets.social.instagram} size="mini" />
                            </a>
                            <a href="#" aria-label="Twitter">
                                <Image src={THEME.assets.social.twitter} size="mini" />
                            </a>
                        </div>
                    </Grid.Column>
                </Grid>

                {/* bottom line */}
                <div
                    style={{
                        borderTop: '1px solid rgba(0,0,0,.1)',
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                    }}
                >
                    <strong>{THEME.brandName}</strong> © 2025 &nbsp;·&nbsp;
                    {links.legal.map((l, i) => (
                        <span key={l}>
                            <a href="#" style={{ color: THEME.colors.text }}>
                                {l}
                            </a>
                            {i < links.legal.length - 1 && ' · '}
                        </span>
                    ))}
                </div>
            </Container>
        </div>
    );
}
