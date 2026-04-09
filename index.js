const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
require("dotenv").config();

const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// በጣም ፈጣኑን ሞዴል እንጠቀማለን
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

bot.start((ctx) => ctx.reply("እንኳን ደህና መጡ! ፈጣኑ DagneTech AI ዝግጁ ነው።"));

bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;

  // በተኖች ከሆኑ AIው እንዳይመልስ
  if (prompt.includes("About DagneTech")) return;

  await ctx.sendChatAction("typing");

  try {
    const result = await model.generateContent(prompt);
    
    // Check if the response exists and handle potential text resolution errors
    const response = result.response;
    if (!response) {
      throw new Error("No response received from the model");
    }
    
    // Attempt to extract text, which could fail if content was blocked 
    const text = response.text();
    await ctx.reply(text);
  } catch (error) {
    console.error("AI Generation Error:", error.message || error);
    await ctx.reply("ይቅርታ፣ በአሁን ሰዓት ጥያቄዎን መመለስ አልቻልኩም። እባክዎ እንደገና ይሞክሩ።"); // Added an improved error message
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
