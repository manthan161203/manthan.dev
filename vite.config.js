import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import nodemailer from 'nodemailer'

const ALLOWED_MODELS = new Set(['gemini-2.5-flash-lite', 'gemini-2.0-flash'])
const MAX_PART_CHARS = 6000
const MAX_TOTAL_CHARS = 30000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const contactRateLimitStore = new Map()

function isPlaceholderKey(value) {
  return !value || /your[_\s-]?gemini[_\s-]?api[_\s-]?key/i.test(value)
}

function resolveGeminiApiKey(env) {
  const candidates = [
    env.GEMINI_API_KEY,
    env.GOOGLE_API_KEY,
    env.GOOGLE_GENERATIVE_AI_API_KEY,
  ]
  const key = candidates.find(
    (item) => typeof item === 'string' && item.trim() && !isPlaceholderKey(item),
  )
  return key?.trim() || ''
}

function validateContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'Invalid request body: `contents` is required.'
  }

  let totalChars = 0
  for (const item of contents) {
    const parts = Array.isArray(item?.parts) ? item.parts : []
    for (const part of parts) {
      const text = typeof part?.text === 'string' ? part.text : ''
      totalChars += text.length
      if (text.length > MAX_PART_CHARS) {
        return `Each message part must be <= ${MAX_PART_CHARS} characters.`
      }
      if (totalChars > MAX_TOTAL_CHARS) {
        return `Total request text must be <= ${MAX_TOTAL_CHARS} characters.`
      }
    }
  }

  return null
}

function validateFormPayload(body) {
  const name = (body?.name || '').trim()
  const email = (body?.email || '').trim()
  const subject = (body?.subject || '').trim()
  const message = (body?.message || '').trim()
  const website = (body?.website || '').trim()

  if (website) {
    return { error: 'Unable to process this request.' }
  }

  if (!name || name.length < 2 || name.length > 80) {
    return { error: 'Name must be between 2 and 80 characters.' }
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'A valid email address is required.' }
  }
  if (subject.length > 140) {
    return { error: 'Subject must be 140 characters or less.' }
  }
  if (!message || message.length < 10 || message.length > 4000) {
    return { error: 'Message must be between 10 and 4000 characters.' }
  }

  return { name, email, subject, message }
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0] || '').split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  for (const [key, value] of contactRateLimitStore.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
      contactRateLimitStore.delete(key)
    }
  }

  const current = contactRateLimitStore.get(ip)
  if (!current || now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    contactRateLimitStore.set(ip, { windowStart: now, count: 1 })
    return false
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true
  }

  current.count += 1
  contactRateLimitStore.set(ip, current)
  return false
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function sanitizeHeaderText(value) {
  return (value || '').replace(/[\r\n]+/g, ' ').trim()
}

function getTransportConfig(env) {
  const host = env.SMTP_HOST
  const port = Number(env.SMTP_PORT || 465)
  const secure = String(env.SMTP_SECURE || 'true') === 'true'
  const user = env.SMTP_USER
  const pass = env.SMTP_PASS

  if (!host || !user || !pass || !Number.isFinite(port)) {
    return null
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  }
}

async function parseJsonBody(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
  }
  return JSON.parse(raw || '{}')
}

function apiDevProxy(env) {
  return {
    name: 'portfolio-api-dev-proxy',
    configureServer(server) {
      const getRuntimeEnv = () => ({
        ...env,
        ...loadEnv(server.config.mode, process.cwd(), ''),
        ...process.env,
      })

      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const runtimeEnv = getRuntimeEnv()
        const geminiApiKey = resolveGeminiApiKey(runtimeEnv)
        if (!geminiApiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              code: 'MISSING_GEMINI_KEY',
              error:
                'Gemini API key is missing. Add GEMINI_API_KEY (or GOOGLE_API_KEY) to .env.',
            }),
          )
          return
        }

        try {
          const { model = 'gemini-2.5-flash-lite', contents } = await parseJsonBody(req)

          if (!ALLOWED_MODELS.has(model)) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Unsupported model requested.' }))
            return
          }

          const validationError = validateContents(contents)
          if (validationError) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: validationError }))
            return
          }

          const apiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${geminiApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 1024,
                },
              }),
            },
          )

          const data = await apiRes.json()
          res.statusCode = apiRes.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Unexpected server error',
            }),
          )
        }
      })

      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const clientIp = getClientIp(req)
        if (isRateLimited(clientIp)) {
          res.statusCode = 429
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'Too many requests. Please try again in a few minutes.',
            }),
          )
          return
        }

        try {
          const runtimeEnv = getRuntimeEnv()
          const form = validateFormPayload(await parseJsonBody(req))
          if ('error' in form) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: form.error }))
            return
          }

          const transportConfig = getTransportConfig(runtimeEnv)
          if (!transportConfig) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error:
                  'SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS.',
              }),
            )
            return
          }

          const to = runtimeEnv.CONTACT_TO || runtimeEnv.SMTP_USER
          const from = runtimeEnv.CONTACT_FROM || runtimeEnv.SMTP_USER
          const autoReplySubject =
            runtimeEnv.CONTACT_AUTO_REPLY_SUBJECT ||
            'Thanks for contacting Manthan Patel'
          const autoReplyName =
            runtimeEnv.CONTACT_AUTO_REPLY_NAME || 'Manthan Patel'
          const transporter = nodemailer.createTransport(transportConfig)

          const safeName = escapeHtml(form.name)
          const safeEmail = escapeHtml(form.email)
          const safeSubject = escapeHtml(form.subject || 'New inquiry')
          const safeMessage = escapeHtml(form.message)
          const headerName = sanitizeHeaderText(form.name) || 'Portfolio Visitor'
          const headerSubject = sanitizeHeaderText(form.subject) || 'New inquiry'
          const receivedAt = new Date().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata',
          })
          const safeReceivedAt = escapeHtml(receivedAt)
          const autoReplySignature = escapeHtml(autoReplyName)

          await transporter.sendMail({
            from: `"${headerName}" <${form.email}>`,
            sender: from,
            to,
            replyTo: form.email,
            subject: `[Portfolio Contact] [From ${form.email}] ${headerSubject}`,
            text: [
              `Received At: ${receivedAt} (IST)`,
              `Name: ${form.name}`,
              `Email: ${form.email}`,
              `Subject: ${form.subject || 'New inquiry'}`,
              '',
              'Message:',
              form.message,
            ].join('\n'),
            html: `
              <div style="font-family: Manrope, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#050813; padding:24px;">
                <div style="max-width:640px; margin:0 auto; background:#0b1120; border:1px solid #64f5d233; border-radius:14px; overflow:hidden;">
                  <div style="padding:16px 22px; background:linear-gradient(120deg,#0b1120 0%,#101a30 100%); border-bottom:1px solid #64f5d233;">
                    <div style="height:3px; width:100%; background:linear-gradient(90deg,#64f5d2 0%,#f7d47c 100%); border-radius:999px; margin-bottom:12px;"></div>
                    <h2 style="margin:0; font-size:20px; color:#f8f6f1;">New Portfolio Inquiry</h2>
                    <p style="margin:6px 0 0; font-size:13px; color:#aeb9cf;">Received ${safeReceivedAt} (IST)</p>
                  </div>
                  <div style="padding:20px 22px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse; font-size:14px;">
                      <tr>
                        <td style="padding:8px 0; color:#aeb9cf; width:110px;">From</td>
                        <td style="padding:8px 0; color:#f8f6f1; font-weight:600;">${safeName} &lt;${safeEmail}&gt;</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#aeb9cf;">Subject</td>
                        <td style="padding:8px 0; color:#f8f6f1; font-weight:600;">${safeSubject}</td>
                      </tr>
                    </table>
                    <div style="margin-top:16px; padding:14px; border:1px solid #64f5d24d; background:#081022; border-radius:10px;">
                      <p style="margin:0 0 8px; font-weight:700; color:#64f5d2;">Message</p>
                      <p style="margin:0; color:#f8f6f1; white-space:pre-wrap;">${safeMessage}</p>
                    </div>
                    <div style="margin-top:14px; padding:10px 12px; border-radius:8px; background:#f7d47c1a; border:1px solid #f7d47c66; color:#f7d47c; font-size:12px;">
                      Reply directly to this email to contact ${safeName}.
                    </div>
                  </div>
                </div>
              </div>
            `,
          })

          let autoReplySent = false
          try {
            await transporter.sendMail({
              from,
              to: form.email,
              subject: autoReplySubject,
              text: [
                `Hi ${form.name},`,
                '',
                'Thank you for reaching out through my portfolio website.',
                `I have received your message about "${form.subject || 'your inquiry'}".`,
                'I will get back to you soon at this email.',
                '',
                `Regards,`,
                autoReplyName,
              ].join('\n'),
              html: `
                <div style="font-family: Manrope, -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:#050813; padding:24px;">
                  <div style="max-width:620px; margin:0 auto; background:#0b1120; border:1px solid #64f5d233; border-radius:14px; overflow:hidden;">
                    <div style="padding:16px 22px; background:linear-gradient(120deg,#0b1120 0%,#101a30 100%); border-bottom:1px solid #64f5d233;">
                      <div style="height:3px; width:100%; background:linear-gradient(90deg,#64f5d2 0%,#f7d47c 100%); border-radius:999px; margin-bottom:12px;"></div>
                      <h2 style="margin:0; font-size:20px; color:#f8f6f1;">Thanks for your message</h2>
                      <p style="margin:6px 0 0; font-size:13px; color:#aeb9cf;">Manthan Patel Portfolio</p>
                    </div>
                    <div style="padding:20px 22px; color:#f8f6f1; line-height:1.65;">
                      <p style="margin:0 0 12px;">Hi ${safeName},</p>
                      <p style="margin:0 0 12px;">Thank you for reaching out through my portfolio website.</p>
                      <p style="margin:0 0 16px;">I have received your message about "<strong>${safeSubject}</strong>". I will get back to you soon.</p>
                      <div style="padding:12px 14px; border:1px solid #64f5d24d; border-radius:10px; background:#081022;">
                        <p style="margin:0 0 6px; font-size:13px; color:#64f5d2;">Your submitted message</p>
                        <p style="margin:0; white-space:pre-wrap;">${safeMessage}</p>
                      </div>
                      <p style="margin:18px 0 0; color:#f8f6f1;">Regards,<br/><span style="color:#f7d47c;">${autoReplySignature}</span></p>
                      <p style="margin:14px 0 0; font-size:12px; color:#aeb9cf;">This is an automated confirmation. Please do not reply to this email.</p>
                    </div>
                  </div>
                </div>
              `,
            })
            autoReplySent = true
          } catch {
            autoReplySent = false
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              ok: true,
              message: 'Message sent successfully.',
              autoReplySent,
            }),
          )
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Unexpected server error',
            }),
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiDevProxy(env)],
  }
})
