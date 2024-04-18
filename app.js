const { App } = require("@slack/bolt");
const llog = require("learninglab-log");
const path = require("path");
const poetBot = require("./src/bots/poet-bot");

global.ROOT_DIR = path.resolve(__dirname);

require("dotenv").config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.message("magic word", async ({ client, message, say }) => {
  let slackResult = await client.chat.postMessage({
    channel: message.channel,
    text: `you said the magic word, <@${message.user}>!`,
  });
});

app.message("poem", poetBot);

app.message(/.*/, async ({ client, message, say }) => {
  llog.magenta(
    `parsing all messages, including this one from ${message.channel}`,
  );
  if (message.channel_type == "im") {
    let slackResult = await client.chat.postMessage({
      channel: message.channel,
      text: `I'm a bot, and I'm responding to your message: ${message.text}`,
    });
  } else if (message.channel == process.env.SLACK_LOGS_CHANNEL) {
    llog.cyan(
      `handling message because ${message.channel} is the logs channel`,
    );
    let slackResult = await client.chat.postMessage({
      channel: message.channel,
      text: `just logging that I got a message: ${message.text}`,
    });
  } else {
    llog.magenta(`some other message we aren't handling now`);
    llog.yellow(message);
  }
});

// app.event("reaction_added", handleEvents.reactionAdded);
// app.event("reaction_removed", handleEvents.reactionRemoved);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  llog.yellow("⚡️ Bolt app is running!");
  let slackResult = await app.client.chat.postMessage({
    channel: process.env.SLACK_LOGS_CHANNEL,
    text: "starting up the 101 bots",
  });
})();
