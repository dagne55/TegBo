const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ፈጣኑን gemini-1.5-flash ሞዴል በትክክለኛው አጠራር
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ምላሹ ፈጣን እንዲሆን የሚረዱ ቅንብሮች
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

bot.start((ctx) =>
  ctx.reply("እንኳን ደህና መጡ! ፈጣኑ DagneTech AI ቦት ዝግጁ ነው። ምን ላግዝዎት?"),
);

bot.hears("📖 About DagneTech", (ctx) => {
  ctx.reply("DagneTech በቴክኖሎጂ ዙሪያ ትምህርታዊ ቪዲዮዎችን የሚያቀርብ የዩቲዩብ ቻናል ነው።");
});

bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;
  if (prompt === "📖 About DagneTech") return;

  await ctx.sendChatAction("typing");

  try {
    // ፈጣን አጠራር ዘዴ
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();
    await ctx.reply(text);
  } catch (error) {
    console.error("Detailed Error:", error);
    await ctx.reply("ይቅርታ፣ አሁን ላይ ምላሽ መስጠት አልቻልኩም። እባክህ ቆይተህ ድጋሚ ሞክር።");
  }
});

bot.launch();
