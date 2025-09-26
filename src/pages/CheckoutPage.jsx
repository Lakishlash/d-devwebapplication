// src/pages/CheckoutPage.jsx
// Stripe Elements checkout. "Pay now" styled like your blue buttons even when disabled.

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { THEME } from "@/config.js";

const PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const PRICE_ID_PREMIUM = import.meta.env.VITE_STRIPE_PRICE_PREMIUM;

const stripePromise = loadStripe(PUBLISHABLE_KEY);

async function markUserPremium(db, uid) {
    await setDoc(doc(db, "users", uid), { premium: true }, { merge: true });
}

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!stripe || !elements) return;

        try {
            setSubmitting(true);
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: "if_required",
            });

            if (error) {
                setErrorMessage(error.message || "Payment failed. Please try again.");
                setSubmitting(false);
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                const app = getApp();
                const auth = getAuth(app);
                const db = getFirestore(app);
                if (auth.currentUser?.uid) await markUserPremium(db, auth.currentUser.uid);
                setSuccess(true);
            } else {
                setErrorMessage("Payment was not completed.");
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="ui segment" style={{ background: THEME?.colors?.soft }}>
                <h2 className="ui header" style={{ color: THEME?.colors?.text }}>Payment successful 🎉</h2>
                <p style={{ color: THEME?.colors?.text }}>
                    Your account has been upgraded to <strong>Premium</strong>.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="ui segment" style={{ background: THEME?.colors?.soft }}>
            <div className="field">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="ui negative message" style={{ marginTop: "1rem" }}>
                    {errorMessage}
                </div>
            )}

            {/* Primary blue even when disabled */}
            <button
                type="submit"
                disabled={!stripe || submitting}
                style={{
                    background: "var(--brand, #0171e3)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    fontWeight: 600,
                    marginTop: "1rem",
                    opacity: !stripe || submitting ? 0.6 : 1,
                    cursor: !stripe || submitting ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 16px rgba(1,113,227,0.25)",
                }}
            >
                {submitting ? "Processing…" : "Pay now"}
            </button>
        </form>
    );
}

export default function CheckoutPage() {
    const [clientSecret, setClientSecret] = useState("");
    const [initError, setInitError] = useState("");

    useEffect(() => {
        const run = async () => {
            try {
                const app = getApp();
                const auth = getAuth(app);
                if (!auth.currentUser) {
                    setInitError("Please sign in to continue.");
                    return;
                }
                const functions = getFunctions(app, "australia-southeast1");
                const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
                const res = await createPaymentIntent({ priceId: PRICE_ID_PREMIUM });
                const secret = res?.data?.clientSecret;
                if (!secret) throw new Error("No client secret returned.");
                setClientSecret(secret);
            } catch {
                setInitError("Could not start checkout. Please try again.");
            }
        };
        run();
    }, []);

    const options = useMemo(() => ({ clientSecret, appearance: { theme: "stripe" } }), [clientSecret]);

    return (
        <div className="ui container" style={{ background: THEME?.colors?.soft, minHeight: "60vh", padding: "2rem 0" }}>
            <h1 className="ui header" style={{ color: THEME?.colors?.text }}>Checkout</h1>

            {initError && <div className="ui negative message">{initError}</div>}

            {!clientSecret ? (
                !initError && <div className="ui active inline loader" />
            ) : (
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}
