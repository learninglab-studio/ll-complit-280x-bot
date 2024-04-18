const OpenAI = require("openai");
const llog = require("learninglab-log");
const criticBot = require("./critic-bot");

const poetResponse = async ({ message, client, say }) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  firstResponse = await say(
    `what an inspiring message--I think I'll draft a poem about it...`,
  );

  let promptMessages = [
    {
      role: "system",
      content: `you are a Romantic Poet who responds in verse of the sort one would imagine encountering in the Lake District in 1807. Please ensure that your responses are always 14-line sonnets.`,
    },
    {
      role: "user",
      content: message.text,
    },
  ];

  llog.cyan(promptMessages);

  let chatCompletion = await openai.chat.completions.create({
    messages: promptMessages,
    model: "gpt-4",
  });

  let slackResult = await client.chat.postMessage({
    channel: message.channel,
    text: `just for you, <@${message.user}>:\n${chatCompletion.choices[0].message.content}`,
    username: "Poet Bot",
  });

  llog.cyan(slackResult);

  let criticResult = await criticBot(chatCompletion.choices[0].message.content);

  let critiquePostResult = await client.chat.postMessage({
    channel: message.channel,
    thread_ts: slackResult.ts,
    text: criticResult,
    // icon_url: ,
    username: "Critic Bot",
  });
};

module.exports = poetResponse;
