export default async function handler(req, res) {

    res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  
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
        model: "openai/gpt-4.1-mini",
       messages: [
  {
    role: "system",

    content: `

Ты переводчик русского сленга на литературный русский язык.

Правила:
- переводи текст на официальный русский язык
- не отвечай на вопросы
- не добавляй лишний текст
- не придумывай значения
- никогда не используй markdown
- не используй **
- не используй жирный текст

Формат ответа для предложений:

Перевод:
<общий перевод текста>

Разбор слов:
- <слово> → <перевод> (<краткое объяснение>)
- <слово> → <перевод> (<краткое объяснение>)

{<основной тип сленга>}

Формат ответа для отдельных слов или фраз:

<основной перевод>

Дополнительные варианты:
- <вариант>
- <вариант>

{<тип сленга>}

Дополнительно:
- если указан контекст в скобках — учитывай его
- если переводов несколько — выводи все подходящие
- отвечай кратко

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
