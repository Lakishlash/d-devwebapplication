// server/routes/contact.js
import express from 'express';
import sgMail from '@sendgrid/mail';

const router = express.Router();

const SG_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM || process.env.SENDGRID_FROM_EMAIL || '';

function ensureConfigured(res) {
    if (!SG_KEY) {
        return res.status(500).json({ ok: false, error: 'SENDGRID_API_KEY not set' });
    }
    if (!FROM_EMAIL) {
        return res.status(500).json({ ok: false, error: 'SENDGRID_FROM or SENDGRID_FROM_EMAIL not set' });
    }
    return null;
}

router.post('/', async (req, res) => {
    try {
        const err = ensureConfigured(res);
        if (err) return;

        const { name = 'Anonymous', email, message = '' } = req.body || {};
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ ok: false, error: 'Valid email is required' });
        }
        if (!message.trim()) {
            return res.status(400).json({ ok: false, error: 'Message is required' });
        }

        sgMail.setApiKey(SG_KEY);

        await sgMail.send({
            to: FROM_EMAIL,       // send to yourself/team inbox
            from: FROM_EMAIL,     // verified sender
            replyTo: { email, name },
            subject: `Contact form – ${name}`,
            text: message,
            html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`
        });

        return res.json({ ok: true });
    } catch (e) {
        console.error('[contact] error:', e?.response?.body || e);
        return res.status(500).json({ ok: false, error: 'SendGrid error' });
    }
});

export default router;
