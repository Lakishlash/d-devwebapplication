// src/components/HeaderBar.jsx
import { Menu, Container, Input, Button } from 'semantic-ui-react';
import { THEME } from '../config.js';

export default function HeaderBar() {
    return (
        <div style={{ background: THEME.colors.soft }}>
            <Container>
                <Menu secondary style={{ border: 'none', padding: 'var(--nav-vpad) 0' }}>
                    <Menu.Item header style={{ fontWeight: THEME.typography.navWeight }}>
                        {THEME.brandName}
                    </Menu.Item>

                    <Menu.Item style={{ flex: 1 }}>
                        {/* simple search box */}
                        <Input
                            icon="search"
                            placeholder="Search…"
                            fluid
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        />
                    </Menu.Item>

                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Button
                                basic
                                style={{
                                    borderRadius: 'var(--btn-radius)',
                                    fontWeight: THEME.typography.navWeight,
                                    borderColor: THEME.colors.accent,
                                    color: THEME.colors.accent,
                                }}
                                content="Post"
                            />
                        </Menu.Item>
                        <Menu.Item>
                            <Button
                                style={{
                                    borderRadius: 'var(--btn-radius)',
                                    background: THEME.colors.accent,
                                    color: 'white',
                                    fontWeight: THEME.typography.navWeight,
                                }}
                                content="Login"
                            />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Container>
        </div>
    );
}
