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
        model: "deepseek/deepseek-chat",
       messages: [
  {
    role: "system",

    content: `

Ты онлайн переводчик с русского неофицциалоного языка на русский официальный.

Твоя задача:
- переводить данный тебе текст на оффициальный русский язык

Правила общения:
- не отвечай на вопросы, твоя задача просто переводить

Формат ответов:
- краткая, если у данной тебе фразы или слова больше одного перевода, пиши их в столбик
- в скобках указывай пояснение, что значит этот словои или фраза которое тебе дали

Никогда:
- не груби
- не придумывай факты

    `
  },

  {
    role: "user",
    content: message
  }
]
      })
    });

    const data = await response.json();

if (data.error) {
  return res.status(200).json({
    reply: data.error.message
  });
}

return res.status(200).json({
  reply: data.choices[0].message.content
});

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
