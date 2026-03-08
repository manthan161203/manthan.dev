# Manthan Portfolio (React + Vite)

AI/ML + Python backend portfolio with:
- React + Tailwind + Framer Motion UI
- Data-driven sections from `src/portfolio.json`
- Gemini recruiter copilot using a **server-side proxy route** (`/api/gemini`)
- Contact form email delivery via **Nodemailer** (`/api/contact`)

## Run Locally

1. Install dependencies:
```bash
npm install
```

2. Create env file:
```bash
cp .env.example .env
```

3. Add server-side keys to `.env`:
```env
GEMINI_API_KEY=your_real_key_here
# or GOOGLE_API_KEY=your_real_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
CONTACT_TO=your_email@gmail.com
CONTACT_FROM=your_email@gmail.com
CONTACT_AUTO_REPLY_SUBJECT=Thanks for contacting Manthan Patel
CONTACT_AUTO_REPLY_NAME=Manthan Patel
```

4. Start dev server:
```bash
npm run dev
```

If you update `.env` while dev server is running, restart `npm run dev` so API routes pick up new values.

## Build

```bash
npm run build
npm run preview
```

## Key Security

- Do **not** put Gemini keys in client env vars like `VITE_*`.
- The frontend now calls `/api/gemini`; key stays server-side.
- Server accepts `GEMINI_API_KEY`, `GOOGLE_API_KEY`, or `GOOGLE_GENERATIVE_AI_API_KEY`.
- The contact form calls `/api/contact`; SMTP credentials stay server-side.
- Contact API includes honeypot + basic per-IP rate limiting.
- `.env` is ignored by git. Keep `.env.example` safe as template only.

## Nodemailer Notes

- For Gmail, use an **App Password** (not your main account password).
- `CONTACT_TO` controls where inquiries are delivered.
- `CONTACT_FROM` is the sender shown to recipient mailbox (must match allowed sender on many SMTP providers).
- Visitors also receive an automatic confirmation email.
- `CONTACT_AUTO_REPLY_SUBJECT` and `CONTACT_AUTO_REPLY_NAME` customize that confirmation mail.

## Update Portfolio Content

Edit:
- `src/portfolio.json` for personal info, experience, projects, skills
- `src/components/*` if you want layout/content structure changes

## Notes for Deployment

- A production API handler is included at `api/gemini.js` (works for serverless platforms that support this pattern).
- A production API handler is also included at `api/contact.js`.
- Ensure `GEMINI_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`, `CONTACT_AUTO_REPLY_SUBJECT`, `CONTACT_AUTO_REPLY_NAME` are configured in your hosting environment.

## Free Deploy (Vercel)

1. Push this project to GitHub.
2. Go to Vercel and import your GitHub repository.
3. Keep defaults (Framework: `Vite`, Build Command: `npm run build`, Output: `dist`).
4. Add the same environment variables from `.env` in:
   - Vercel Project Settings -> Environment Variables
5. Deploy.

After deploy, test:
- `https://<your-domain>/api/gemini`
- `https://<your-domain>/api/contact`

If you update environment variables later, redeploy once.
