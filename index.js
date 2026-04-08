const { Telegraf } = require("telegraf");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// አስተማማኝ የሆነውን gemini-pro ሞዴል እንጠቀማለን
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

// የቦቱ መጀመሪያ
bot.start((ctx) => ctx.reply("እንኳን ደህና መጡ! ምን ላግዝዎት?"));

// በተኖች (Buttons)
bot.hears("📖 About DagneTech", (ctx) => {
  ctx.reply("DagneTech በቴክኖሎጂ ዙሪያ ትምህርታዊ ቪዲዮዎችን የሚያቀርብ የዩቲዩብ ቻናል ነው።");
});

// የ AI ማብራሪያ ክፍል
bot.on("text", async (ctx) => {
  const prompt = ctx.message.text;

  // ተጠቃሚው የተጫነው በተን ከሆነ AIው መልስ እንዲሰጥ አንፈልግም
  if (prompt === "📖 About DagneTech") return;

  // ቦቱ "Typing..." እያለ መሆኑን ያሳያል
  await ctx.sendChatAction("typing");

  try {
    // አዲሱና ቀላሉ የ AI አጠራር ዘዴ
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    await ctx.reply(text);
  } catch (error) {
    console.error("AI Error Details:", error);
    await ctx.reply("ይቅርታ፣ ምላሽ ለመስጠት ተቸግሬያለሁ። እባክህ ቆይተህ ድጋሚ ሞክር።");
  }
});

// ቦቱን ማስጀመር
bot.launch();

// Graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
