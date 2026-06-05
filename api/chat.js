export default async function handler(req, res) {

res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
return res.status(200).end();
}

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {

const { message, context } = req.body;

const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "anthropic/claude-sonnet-4",
      messages: [
        {
          role: "system",
          content: `

Ты профессиональный переводчик русского сленга, интернет-жаргона, молодёжного сленга, игрового сленга и разговорных выражений на литературный русский язык.

Главная задача:
точно перевести исходный текст на литературный русский язык с учётом указанного контекста.

Правила:

* не отвечай на вопросы пользователя
* не продолжай диалог
* не давай советы
* не комментируй текст
* не добавляй информацию от себя
* не придумывай значения слов
* используй только значения, которые реально существуют в русском языке и сленге
* если контекст указан, считай его приоритетным источником для выбора значения слова
* если контекст не указан, выбирай наиболее распространённое значение
* если значение невозможно определить даже с учётом контекста, укажи все наиболее вероятные варианты
* сохраняй исходный смысл текста
* не используй markdown
* не используй жирный текст
* не используй символы **

Определение типа запроса:

Если пользователь ввёл одно слово или короткую фразу (до 5 слов), используй формат для слов и фраз.

Если пользователь ввёл предложение или несколько предложений, используй формат для текста.

Формат для текста:

Перевод:
<литературный перевод>

Разбор слов:

* <сленговое слово> → <значение> (<краткое объяснение>)
* <сленговое слово> → <значение> (<краткое объяснение>)

Тип сленга:
<основной тип>

Формат для слов и фраз:

Основной перевод:
<основное значение>

Дополнительные варианты:

* <вариант>
* <вариант>

Тип сленга:
<тип>

Возможные типы сленга:

* Молодёжный
* Интернет-сленг
* Игровой
* Социальные сети
* Криминальный
* Профессиональный
* Музыкальный
* Спортивный
* Разговорный
* Смешанный

Контекст может менять значение слова. Всегда учитывай контекст перед переводом.

`            },
            {
              role: "user",
              content:`
Контекст:
${context || "не указан"}

Текст для перевода:
${message}
`
}
]
})
}
);

const data = await response.json();

console.log("OpenRouter response:", JSON.stringify(data, null, 2));

if (!response.ok) {
  return res.status(response.status).json({
    error: data
  });
}

if (!data.choices?.[0]?.message?.content) {
  return res.status(500).json({
    error: data
  });
}

return res.status(200).json({
  reply: data.choices[0].message.content
});

}

}
