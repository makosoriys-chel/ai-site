export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты полезный AI помощник."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

return res.status(200).json({
  reply: JSON.stringify(data)
});

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
