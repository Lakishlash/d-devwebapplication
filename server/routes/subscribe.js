import express from 'express';
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

const router = express.Router();

const isValidEmail = (e) =>
    typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

router.post('/', async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!isValidEmail(email)) {
            return res.status(400).json({ ok: false, error: 'Invalid email' });
        }

        // Read env at request-time (ensures dotenv has already run)
        const {
            SENDGRID_API_KEY,
            SENDGRID_FROM_EMAIL,
            SENDGRID_TEMPLATE_ID,
            SENDGRID_LIST_ID
        } = process.env;

        if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
            return res.status(500).json({ ok: false, error: 'Server email config missing' });
        }

        // Configure clients now (not at module load)
        sgMail.setApiKey(SENDGRID_API_KEY);
        sgClient.setApiKey(SENDGRID_API_KEY);

        // Optional: store contact in Marketing list
        if (SENDGRID_LIST_ID) {
            await sgClient.request({
                method: 'PUT',
                url: '/v3/marketing/contacts',
                body: {
                    list_ids: [SENDGRID_LIST_ID],
                    contacts: [{ email }]
                }
            });
        }

        // Prefer a dynamic template; fallback to simple content
        const msg = SENDGRID_TEMPLATE_ID
            ? {
                to: email,
                from: SENDGRID_FROM_EMAIL,
                templateId: SENDGRID_TEMPLATE_ID,
                dynamicTemplateData: {}
            }
            : {
                to: email,
                from: SENDGRID_FROM_EMAIL,
                subject: 'Welcome to Daily Insider',
                text: 'Thanks for subscribing to Daily Insider.',
                html: '<p>Thanks for subscribing to <strong>Daily Insider</strong>.</p>'
            };

        await sgMail.send(msg);
        return res.json({ ok: true, message: 'Subscribed' });
    } catch (err) {
        console.error(err?.response?.body || err);
        return res.status(500).json({ ok: false, error: 'Subscription failed' });
    }
});

export default router;
