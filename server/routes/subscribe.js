// server/routes/subscribe.js
import express from 'express';
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

const router = express.Router();

function getEnv() {
    return {
        SG_KEY: process.env.SENDGRID_API_KEY || '',
        FROM_EMAIL: process.env.SENDGRID_FROM || process.env.SENDGRID_FROM_EMAIL || '',
        TEMPLATE_ID: process.env.SENDGRID_TEMPLATE_ID || '',
        LIST_ID: process.env.SENDGRID_LIST_ID || '',
    };
}

router.post('/', async (req, res) => {
    try {
        const { SG_KEY, FROM_EMAIL, TEMPLATE_ID, LIST_ID } = getEnv();
        if (!SG_KEY) return res.status(500).json({ ok: false, error: 'SENDGRID_API_KEY not set' });
        if (!FROM_EMAIL) return res.status(500).json({ ok: false, error: 'SENDGRID_FROM or SENDGRID_FROM_EMAIL not set' });

        const { email } = req.body || {};
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ ok: false, error: 'Valid email is required' });
        }

        sgMail.setApiKey(SG_KEY);
        sgClient.setApiKey(SG_KEY);

        const msg = TEMPLATE_ID
            ? {
                to: email,
                from: FROM_EMAIL,
                templateId: TEMPLATE_ID,
                dynamic_template_data: { email },
            }
            : {
                to: email,
                from: FROM_EMAIL,
                subject: 'Thanks for subscribing!',
                text: 'You are now subscribed to Dev@Deakin updates.',
                html: `<p>You are now subscribed to <strong>Dev@Deakin</strong> updates.</p>`,
            };

        await sgMail.send(msg);

        if (LIST_ID) {
            await sgClient.request({
                method: 'PUT',
                url: '/v3/marketing/contacts',
                body: { list_ids: [LIST_ID], contacts: [{ email }] },
            });
        }

        return res.json({ ok: true });
    } catch (e) {
        console.error('[subscribe] error:', e?.response?.body || e);
        return res.status(500).json({ ok: false, error: 'SendGrid error' });
    }
});

export default router;
