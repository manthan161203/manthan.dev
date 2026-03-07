import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function geminiDevProxy(apiKey) {
  return {
    name: 'gemini-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'GEMINI_API_KEY is missing. Add it to .env for server-side calls.',
            }),
          )
          return
        }

        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
        })

        req.on('end', async () => {
          try {
            const { model = 'gemini-2.5-flash-lite', contents } = JSON.parse(raw || '{}')

            if (!Array.isArray(contents) || contents.length === 0) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid request body: `contents` is required.' }))
              return
            }

            const apiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`,
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
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), geminiDevProxy(env.GEMINI_API_KEY)],
  }
})
