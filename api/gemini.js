const ALLOWED_MODELS = new Set(['gemini-2.5-flash-lite', 'gemini-2.0-flash']);
const MAX_PART_CHARS = 6000;
const MAX_TOTAL_CHARS = 30000;

function isPlaceholderKey(value) {
  return !value || /your[_\s-]?gemini[_\s-]?api[_\s-]?key/i.test(value);
}

function resolveGeminiApiKey(env) {
  const candidates = [
    env.GEMINI_API_KEY,
    env.GOOGLE_API_KEY,
    env.GOOGLE_GENERATIVE_AI_API_KEY,
  ];
  const key = candidates.find((item) => typeof item === 'string' && item.trim() && !isPlaceholderKey(item));
  return key?.trim() || '';
}

function validateContents(contents) {
  if (!Array.isArray(contents) || contents.length === 0) {
    return 'Invalid body: `contents` is required.';
  }

  let totalChars = 0;
  for (const item of contents) {
    const parts = Array.isArray(item?.parts) ? item.parts : [];
    for (const part of parts) {
      const text = typeof part?.text === 'string' ? part.text : '';
      totalChars += text.length;
      if (text.length > MAX_PART_CHARS) {
        return `Each message part must be <= ${MAX_PART_CHARS} characters.`;
      }
      if (totalChars > MAX_TOTAL_CHARS) {
        return `Total request text must be <= ${MAX_TOTAL_CHARS} characters.`;
      }
    }
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = resolveGeminiApiKey(process.env);
  if (!apiKey) {
    res.status(500).json({
      code: 'MISSING_GEMINI_KEY',
      error:
        'Gemini API key is missing on the server. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in environment variables.',
    });
    return;
  }

  try {
    const { model = 'gemini-2.5-flash-lite', contents } = req.body || {};

    if (!ALLOWED_MODELS.has(model)) {
      res.status(400).json({ error: 'Unsupported model requested.' });
      return;
    }

    const validationError = validateContents(contents);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent?key=${apiKey}`,
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
    );

    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
}
