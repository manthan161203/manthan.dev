# Manthan Portfolio

Production-ready personal portfolio built with React + Vite, with two server-side API routes:
- `/api/gemini`: Gemini proxy to keep API keys off the client
- `/api/contact`: SMTP-powered contact form with validation, honeypot, and rate limiting

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS
- Framer Motion
- Nodemailer
- Vercel Serverless Functions

## Features

- Data-driven profile content from `src/portfolio.json`
- Animated single-page portfolio sections
- AI assistant section powered by Gemini
- Contact form that sends:
  - notification email to you
  - auto-reply email to the visitor
- Basic abuse protections:
  - per-IP rate limit (5 requests per 15 minutes for contact route)
  - honeypot field (`website`)
  - payload length and model allowlist checks for Gemini route

## Project Structure

```text
.
├── api/
│   ├── gemini.js
│   └── contact.js
├── public/
├── src/
│   ├── components/
│   ├── portfolio.json
│   ├── data.js
│   └── App.jsx
├── .env.example
├── PORTFOLIO_DATA_GUIDE.md
├── QUICK_UPDATE_REFERENCE.js
├── vite.config.js
└── vercel.json
```

## Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Fill required variables in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
# Alternatives also supported by backend:
# GOOGLE_API_KEY=your_gemini_api_key_here
# GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

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

If you change `.env`, restart the dev server.

## Scripts

```bash
npm run dev      # start local dev server
npm run build    # create production build
npm run preview  # preview production build
npm run lint     # run ESLint
```

## API Contracts

### `POST /api/gemini`

Proxy for Gemini `generateContent`.

Request body:

```json
{
  "model": "gemini-2.5-flash-lite",
  "contents": [{ "role": "user", "parts": [{ "text": "Hello" }] }]
}
```

Valid models:
- `gemini-2.5-flash-lite`
- `gemini-2.0-flash`

Validation rules:
- `contents` is required
- max 6000 chars per `parts[].text`
- max 30000 chars total across request text

### `POST /api/contact`

Sends contact email + auto-reply.

Request body:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Project discussion",
  "message": "Hi, I would like to connect...",
  "website": ""
}
```

Validation rules:
- `name`: 2-80 chars
- `email`: valid email format
- `subject`: max 140 chars (optional)
- `message`: 10-4000 chars
- `website`: must be empty (honeypot)

Rate limit:
- 5 requests per IP per 15 minutes

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Framework preset: `Vite`.
4. Add all environment variables from `.env`.
5. Deploy.

After deployment, verify:
- `https://<your-domain>/api/gemini`
- `https://<your-domain>/api/contact`

## Content Editing

- Update portfolio content: `src/portfolio.json`
- UI components: `src/components/*`
- Data guide: `PORTFOLIO_DATA_GUIDE.md`
- Quick edits helper: `QUICK_UPDATE_REFERENCE.js`

## Security Notes

- Do not put secrets in client-exposed `VITE_*` vars.
- Use app passwords for SMTP providers (for Gmail: App Password, not account password).
- Keep `.env` private and out of version control.

## Troubleshooting

- `MISSING_GEMINI_KEY`
  - Set `GEMINI_API_KEY` (or one alternative env key) and restart/redeploy.
- `SMTP configuration is missing`
  - Ensure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` are present.
- Contact API returns `429`
  - Rate limit triggered. Retry after the 15-minute window.
