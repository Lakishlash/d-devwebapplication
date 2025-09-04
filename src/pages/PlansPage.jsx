// src/pages/PlansPage.jsx
import { Container, Header, Segment } from "semantic-ui-react";
import { TEXT } from "@/config/text";

export default function PlansPage() {
    return (
        <div style={{ background: "var(--page)", padding: "32px 0" }}>
            <Container>
                <Header as="h2" style={{ color: "var(--ink)", fontWeight: "var(--weight-heading)" }}>
                    {TEXT.plans}
                </Header>
                <Segment style={{ borderRadius: "var(--radius)" }}>
                    <p>Plans page placeholder. You can add Free / Pro tiers here later.</p>
                </Segment>
            </Container>
        </div>
    );
}
