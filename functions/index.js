// functions/index.js
// Purpose: Callable Cloud Function to securely create a Stripe PaymentIntent.
// Notes:
// - NO HARDCODING: Stripe secret key and allowed Price IDs come from Functions Secrets.
// - Reads the Stripe Price to derive amount/currency (no amounts in code).
// - Requires the caller to be authenticated (uses request.auth).

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const Stripe = require('stripe');

// --- Secrets (set via: firebase functions:secrets:set <NAME>) ---
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY'); // e.g. sk_test_...
const ALLOWED_PRICE_IDS = defineSecret('ALLOWED_PRICE_IDS'); // e.g. price_abc,price_def

// Optional: cap logs / add context
logger.info('Functions cold start: index.js loaded');

// Callable: create a PaymentIntent for a given allowed Price ID
exports.createPaymentIntent = onCall(
    {
        region: 'australia-southeast1',
        secrets: [STRIPE_SECRET_KEY, ALLOWED_PRICE_IDS],
        cors: true,
    },
    async (request) => {
        try {
            // --- Auth required ---
            const uid = request.auth?.uid;
            if (!uid) {
                throw new HttpsError('unauthenticated', 'Please sign in to start checkout.');
            }

            // --- Validate input ---
            const priceId = request.data?.priceId;
            if (!priceId) {
                throw new HttpsError('invalid-argument', 'priceId is required.');
            }

            // --- Check against an allowlist of Price IDs (defense-in-depth) ---
            const allowed = (ALLOWED_PRICE_IDS.value() || '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);

            if (!allowed.includes(priceId)) {
                throw new HttpsError('permission-denied', 'Unsupported priceId.');
            }

            // --- Initialize Stripe with secret from Functions Secret ---
            const stripe = new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: '2024-06-20' });

            // --- Read the Price (derive amount/currency; NO hardcoded amounts) ---
            const price = await stripe.prices.retrieve(priceId);
            if (!price?.active || !price?.unit_amount || !price?.currency) {
                throw new HttpsError('failed-precondition', 'Invalid or inactive price configuration.');
            }

            // --- Create PaymentIntent (automatic methods to simplify) ---
            const intent = await stripe.paymentIntents.create({
                amount: price.unit_amount,
                currency: price.currency,
                automatic_payment_methods: { enabled: true },
                metadata: { uid, priceId },
            });

            logger.info('PaymentIntent created', { uid, priceId, pi: intent.id });

            return { clientSecret: intent.client_secret };
        } catch (err) {
            // Normalize errors for the client
            const isHttps = err instanceof HttpsError;
            const code = isHttps ? err.code : 'internal';
            const message = isHttps ? err.message : 'Failed to create payment intent.';
            logger.error('createPaymentIntent error', { code, message, raw: String(err) });
            throw new HttpsError(code, message);
        }
    }
);
