import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

/**
 * Back button that hides on certain routes (default: Home).
 */
export default function BackButton({ hideOn = ["/"], className, style }) {
    const nav = useNavigate();
    const { pathname } = useLocation();
    if (hideOn.includes(pathname)) return null;

    return (
        <Button
            icon
            basic
            aria-label="Go back"
            onClick={() => nav(-1)}
            className={className}
            style={{ borderRadius: 12, ...style }}
        >
            <Icon name="arrow left" />
        </Button>
    );
}
