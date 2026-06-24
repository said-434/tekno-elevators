SendGrid setup and running instructions

1) Copy `.env.example` to `.env` and set values.

2) Preferred: use SendGrid API key — set `SENDGRID_API_KEY=your_sendgrid_api_key`.
   - Sign up at https://sendgrid.com, create an API Key with Mail Send permission.
   - Set `FROM_EMAIL` to a verified sender in SendGrid (or same as TO_EMAIL).

3) If you prefer SMTP, leave `SENDGRID_API_KEY` empty and fill SMTP_* values.

4) Install and run:
```
npm install
npm start
```

5) Open the site and test:
- Visit: http://localhost:3000/contact.html
- Fill the form and submit — you'll see success only when the server confirms the mail was sent.

Security note: Do not commit `.env` or API keys to public repos.
