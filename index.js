require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// ቦቱ ሲጀመር የሚመጣ ሰላምታ እና ምርጫዎች
bot.start((ctx) => {
  ctx.reply(
    `እንኳን ወደ DagneTech Support በሰላም መጡ! 
ስለ የትኛው መረጃ ይፈልጋሉ?`,
    Markup.keyboard([
      ["🌐 Web Development", "💻 Tech Trends"],
      ["📖 About DagneTech"],
    ]).resize(),
  );
});

// ስለ Web Development ማብራሪያ
bot.hears("🌐 Web Development", (ctx) => {
  ctx.reply(`🌐 **Web Development**
    
Web Development ድረ-ገጾችን የመገንባት ጥበብ ሲሆን በሁለት ዋና ክፍሎች ይከፈላል፦
1. **Frontend:** ተጠቃሚዎች የሚያዩት ክፍል (HTML, CSS, JS, React)።
2. **Backend:** ከበስተጀርባ ዳታ የሚቀመጥበት ክፍል (Node.js, Express, Databases)።

አሁን ላይ Full-stack መሆን ለስራ በጣም ተፈላጊ ነው!`);
});

// ስለ Tech Trends ማብራሪያ
bot.hears("💻 Tech Trends", (ctx) => {
  ctx.reply(`💻 **ወቅታዊ የቴክኖሎጂ መረጃዎች**

በአሁኑ ሰዓት አለምን እያነጋገሩ ያሉ ቴክኖሎጂዎች፦
• **Agentic AI:** ራሳቸውን ችለው ስራዎችን የሚሰሩ የ AI ረዳቶች።
• **Neuromorphic Computing:** እንደ ሰው አእምሮ የሚያስቡ ኮምፒውተሮች።
• **Cloud Computing:** መረጃዎችን በኢንተርኔት ላይ ማከማቸት።`);
});

// ስለ ቻናሉ መረጃ
bot.hears("📖 About DagneTech", (ctx) => {
  ctx.reply(
    "DagneTech በቴክኖሎጂ ዙሪያ ትምህርታዊ ቪዲዮዎችን እና መረጃዎችን የሚያቀርብ የዩቲዩብ ቻናል ነው።",
  );
});

bot.launch();
console.log("የቴክኖሎጂ ቦቱ ስራ ጀምሯል...");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("DagneTech Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
