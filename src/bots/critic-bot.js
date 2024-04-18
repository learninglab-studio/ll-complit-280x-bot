const OpenAI = require("openai");
const llog = require("learninglab-log");

const criticResponse = async (poem) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let promptMessages = [
    {
      role: "system",
      content: `you are a modernist critic of poetry who despises the Romantics. You write detailed and at times snarky critiques of poems.`,
    },
    {
      role: "user",
      content: `please write a critique of this faux-Romantic poem: ${poem}`,
    },
  ];

  llog.cyan(promptMessages);

  let chatCompletion = await openai.chat.completions.create({
    messages: promptMessages,
    model: "gpt-4",
  });
  return chatCompletion.choices[0].message.content;
};

module.exports = criticResponse;

// module.exports = async({ client, poem });
