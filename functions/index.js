// functions/index.js
// Purpose:
// 1) createPaymentIntent: securely creates a Stripe PaymentIntent for an allowed Price ID.
// 2) getPriceInfo: returns amount/currency for allowed Price IDs so the UI can display prices.
// Notes:
// - NO HARDCODING: amounts come from Stripe Price objects.
// - Secrets set via CLI: STRIPE_SECRET_KEY, ALLOWED_PRICE_IDS (comma-separated price_... list)

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const ALLOWED_PRICE_IDS = defineSecret('ALLOWED_PRICE_IDS');

logger.info('Functions cold start: index.js loaded');

// Parse allow-list from secret once per cold start
function parseAllowList() {
    return (ALLOWED_PRICE_IDS.value() || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

// ========== createPaymentIntent ==========
exports.createPaymentIntent = onCall(
    { region: 'australia-southeast1', secrets: [STRIPE_SECRET_KEY, ALLOWED_PRICE_IDS], cors: true },
    async (request) => {
        const uid = request.auth?.uid;
        if (!uid) throw new HttpsError('unauthenticated', 'Please sign in to start checkout.');

        const priceId = request.data?.priceId;
        if (!priceId) throw new HttpsError('invalid-argument', 'priceId is required.');

        const allowed = parseAllowList();
        if (!allowed.includes(priceId)) throw new HttpsError('permission-denied', 'Unsupported priceId.');

        const stripe = new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: '2024-06-20' });

        // Derive amount/currency from the Price (no hardcoded amounts)
        const price = await stripe.prices.retrieve(priceId);
        if (!price?.active || !price?.unit_amount || !price?.currency) {
            throw new HttpsError('failed-precondition', 'Invalid or inactive price configuration.');
        }

        const intent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            automatic_payment_methods: { enabled: true },
            metadata: { uid, priceId },
        });

        logger.info('PaymentIntent created', { uid, priceId, pi: intent.id });
        return { clientSecret: intent.client_secret };
    }
);

// ========== getPriceInfo ==========
exports.getPriceInfo = onCall(
    { region: 'australia-southeast1', secrets: [STRIPE_SECRET_KEY, ALLOWED_PRICE_IDS], cors: true },
    async (request) => {
        const ids = request.data?.priceIds;
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new HttpsError('invalid-argument', 'priceIds (array) is required.');
        }

        const allowed = parseAllowList();
        for (const id of ids) {
            if (!allowed.includes(id)) {
                throw new HttpsError('permission-denied', `Price not allowed: ${id}`);
            }
        }

        const stripe = new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: '2024-06-20' });

        const prices = [];
        for (const id of ids) {
            const p = await stripe.prices.retrieve(id);
            prices.push({
                id: p.id,
                currency: p.currency,          // e.g., "aud"
                unit_amount: p.unit_amount,    // integer cents
                type: p.type,                  // "one_time" or "recurring"
                interval: p.recurring?.interval || null,
                nickname: p.nickname || null,
            });
        }
        return { prices };
    }
);
