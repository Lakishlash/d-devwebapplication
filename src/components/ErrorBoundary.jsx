// src/components/ErrorBoundary.jsx
// Tiny error boundary so detail pages never blank out.

import React from "react";
import { Link } from "react-router-dom";
import { THEME } from "@/config";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { err: null };
    }
    static getDerivedStateFromError(err) {
        return { err };
    }
    componentDidCatch(err, info) {
        // optional: log to monitoring
        // console.error(err, info);
    }
    render() {
        if (this.state.err) {
            return (
                <div style={{ padding: "2rem", background: THEME.colors.pageBg || "#fff" }}>
                    <h3 style={{ color: THEME.colors.text, fontFamily: "Poppins, sans-serif" }}>
                        Something went wrong
                    </h3>
                    <p style={{ opacity: 0.8 }}>Please try again or go back home.</p>
                    <Link to="/" style={{ color: THEME.colors.accent }}>← Back to Home</Link>
                </div>
            );
        }
        return this.props.children;
    }
}
