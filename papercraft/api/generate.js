export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = "AIzaSyA38kjmjnC9kle_3CMk56F1EVzA6rmKVAA";

  try {
    const { messages, max_tokens } = req.body;

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: Array.isArray(m.content)
        ? m.content.map(c => {
            if (c.type === 'text') return { text: c.text };
            if (c.type === 'image') return { inlineData: { mimeType: c.source.media_type, data: c.source.data } };
            return { text: '' };
          })
        : [{ text: m.content }]
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 2000 }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: data.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ content: [{ type: 'text', text }] });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
