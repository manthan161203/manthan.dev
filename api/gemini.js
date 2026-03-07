export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    res.status(500).json({
      error: 'GEMINI_API_KEY is missing on the server.',
    });
    return;
  }

  try {
    const { model = 'gemini-2.5-flash-lite', contents } = req.body || {};

    if (!Array.isArray(contents) || contents.length === 0) {
      res.status(400).json({ error: 'Invalid body: `contents` is required.' });
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
