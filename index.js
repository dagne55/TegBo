const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ],
});

// ለ Buttons ምላሽ የሚሰጡ ኮዶች (ቀድሞ የነበሩት)
bot.start((ctx) => ctx.reply("እንኳን ደህና መጡ! ምን ላግዝዎት?"));

bot.hears("📖 About DagneTech", (ctx) => {
  ctx.reply("DagneTech በቴክኖሎጂ ዙሪያ ትምህርታዊ ቪዲዮዎችን የሚያቀርብ የዩቲዩብ ቻናል ነው።");
});

// ተጠቃሚው ለሚጠይቀው ማንኛውም ጥያቄ በ AI ሰፊ ማብራሪያ እንዲሰጥ
bot.on("text", async (ctx) => {
  // ተጠቃሚው የላከው ጽሁፍ Button ካልሆነ ብቻ በ AI ይመልሳል
  const prompt = ctx.message.text;

  // ቦቱ ማሰብ እንደጀመረ ለተጠቃሚው ምልክት እንዲያሳይ
  await ctx.sendChatAction("typing");

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    await ctx.reply(text);
  } catch (error) {
    console.error(error);
    await ctx.reply("ይቅርታ፣ ምላሽ ለመስጠት ተቸግሬያለሁ። እባክህ ቆይተህ ድጋሚ ሞክር።");
  }
});

bot.launch();
