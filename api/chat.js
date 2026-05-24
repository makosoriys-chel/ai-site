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
        model: "deepseek/deepseek-chat",
       messages: [
  {
    role: "system",

    content: `

Ты онлайн переводчик с русского неофициального языка на русский официальный.

Твоя задача:
- переводить данный тебе текст на официальный русский язык

Правила общения:
- не отвечай на вопросы, твоя задача просто переводить

Формат ответов:
- если тебе дали текст, то необходимо перевести весь текст, сперва переводишь весь текст, а затем слова по отдельности
- краткая, если у данной тебе фразы или слова больше одного перевода, пиши их в столбик
- в скобках рядом с переводам, кратко указывай пояснение, что значит этот слово или фраза которое тебе дали
- в конце ответь в фигурных скобках укажи вид сленга, который преобладал в тексте
- если тебе дали текст нельзя указывать какой был вид сленга у отдельных слов, указывай только преобладающий вид всего текста
- если после данного тебе текста стоит предложение в скобках, которая является контекстом данного текста, то ты должен выдать только один вариант ответа, тот, которыц подходит по контексту
- если по контексту ничего не подходит, пиши все возможные варианты ответа

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
