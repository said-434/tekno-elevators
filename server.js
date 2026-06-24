const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

let sgMail = null;
if (process.env.SENDGRID_API_KEY) {
  try {
    sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid initialized');
  } catch (e) {
    console.warn('SendGrid module not available or failed to init:', e && e.message ? e.message : e);
    sgMail = null;
  }
} else {
  console.log('SENDGRID_API_KEY not set; using SMTP fallback');
}

const path = require('path');
const app = express();
app.use(express.json());

// Serve static files from project root so contact.html is available at /
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  // Prefer SendGrid API when configured
  if (sgMail) {
    const msg = {
      to: process.env.TO_EMAIL || 'tekno.elevators55@gmail.com',
      from: process.env.FROM_EMAIL || (process.env.TO_EMAIL || 'tekno.elevators55@gmail.com'),
      subject: 'رسالة جديدة من موقع TEKNO_ELEVATORS',
      text: `الاسم: ${name}\nالبريد: ${email}\n\n${message}`,
    };
    try {
      await sgMail.send(msg);
      console.log('SendGrid send OK to', msg.to);
      return res.json({ success: true });
    } catch (err) {
      console.error('SendGrid send error:', err && err.message ? err.message : err);
      // fall through to SMTP fallback if configured
    }
  }

  // Fallback to SMTP via nodemailer
  try {
    const info = await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.TO_EMAIL || 'tekno.elevators55@gmail.com',
      subject: 'رسالة جديدة من موقع TEKNO_ELEVATORS',
      text: `الاسم: ${name}\nالبريد: ${email}\n\n${message}`,
    });
    console.log('SMTP send OK', info);

    return res.json({ success: true });
  } catch (err) {
    console.error('sendMail error:', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, error: 'Failed to send' });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT} (serving files and /send)`));
