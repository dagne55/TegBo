const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
require("dotenv").config();

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// በጣም ፈጣኑን ሞዴል እንጠቀማለን
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

bot.start((ctx) => ctx.reply("እንኳን ደህና መጡ! ፈጣኑ DagneTech AI ዝግጁ ነው።"));

bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;

  // በተኖች ከሆኑ AIው እንዳይመልስ
  if (prompt.includes("About DagneTech")) return;

  await ctx.sendChatAction("typing");

  try {
    const result = await model.generateContent(prompt);
    await ctx.reply(result.response.text());
  } catch (error) {
    console.error("AI Error:", error);
    await ctx.reply("ይቅርታ፣ አሁን ላይ ምላሽ መስጠት አልቻልኩም።");
  }
});

bot.launch();

// Setup express server so Railway can bind to a port and keep the service alive
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Bot is running...');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
