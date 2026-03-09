# Manthan Portfolio (React + Vite + Serverless APIs)

Modern AI/ML portfolio with:
- React + Tailwind + Framer Motion frontend
- Data-driven content from `src/portfolio.json`
- Gemini portfolio assistant via server-side API (`/api/gemini`)
- Contact form email delivery via Nodemailer (`/api/contact`)

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Framer Motion
- Backend (serverless): Node.js API handlers in `api/`
- AI: Google Gemini (`@google/generative-ai`)
- Email: Nodemailer (SMTP)
- Deploy: Vercel (free Hobby plan compatible)

## Project Structure

```text
.
├── api/
│   ├── gemini.js          # Gemini proxy (server-side key)
│   └── contact.js         # Contact email handler
├── public/                # static assets
├── src/
│   ├── components/        # UI sections/components
│   ├── portfolio.json     # portfolio content
│   └── data.js            # derived data/context
├── .env.example           # environment template
├── vercel.json            # Vercel framework config
└── vite.config.js         # Vite + dev API middleware
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Fill `.env` (server-side values):

```env
GEMINI_API_KEY=your_real_key_here
# or GOOGLE_API_KEY=your_real_key_here
# or GOOGLE_GENERATIVE_AI_API_KEY=your_real_key_here

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

4. Run development server:

```bash
npm run dev
```

If `.env` changes, restart `npm run dev`.

## Scripts

```bash
npm run dev      # start local dev server
npm run lint     # run eslint
npm run build    # production build
npm run preview  # preview production build locally
```

## API Endpoints

### `POST /api/gemini`

Purpose: server-side Gemini request proxy (keeps API key private).

Body shape (simplified):

```json
{
  "model": "gemini-2.5-flash-lite",
  "contents": [{ "role": "user", "parts": [{ "text": "..." }] }]
}
```

### `POST /api/contact`

Purpose: send inquiry email + auto-reply.

Body:

```json
{
  "name": "Visitor Name",
  "email": "visitor@email.com",
  "subject": "Hello",
  "message": "Your message",
  "website": ""
}
```

Notes:
- `website` is a hidden honeypot field (must stay empty).
- Basic per-IP rate limiting is enabled.

## Free Deployment (Vercel)

1. Push this repo to GitHub.
2. Import repo in Vercel.
3. Keep defaults:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables from `.env` in Vercel project settings.
5. Deploy.

After deploy, verify:
- `https://<your-domain>/api/gemini`
- `https://<your-domain>/api/contact`

If env vars are changed later, redeploy once.

## Content Updates

Most portfolio text can be updated in:
- `src/portfolio.json`

Main UI changes:
- `src/components/*`

## Security Notes

- Never expose Gemini or SMTP credentials in client-side `VITE_*` variables.
- `.env` is already ignored by git.
- Use Gmail App Password for SMTP (not your main Gmail password).
- Gmail/SMTP providers may enforce sender identity rules; visitor email is reliably available via `replyTo`.

## Troubleshooting

- `MISSING_GEMINI_KEY`:
  Set `GEMINI_API_KEY` (or supported alternatives) and redeploy/restart.
- `SMTP configuration is missing`:
  Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.
- Contact form `429`:
  Too many submissions in a short window; wait and retry.
