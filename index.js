require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { mainKeyboard } = require("./keyboards/main");

// হ্যান্ডলারসমূহ ইমপোর্ট করা (আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী)
const profileHandler = require("./handlers/profile");
const balanceHandler = require("./handlers/balance");
const verifyHandler = require("./handlers/verify");
const topupHandler = require("./handlers/topup");
const ucHandler = require("./handlers/uc");
const rateHandler = require("./handlers/rate");
const packsHandler = require("./handlers/packs");
const dueHandler = require("./handlers/due");
const myinfoHandler = require("./handlers/myinfo");

// রেন্ডার এনভায়রনমেন্ট বা .env ফাইল থেকে সরাসরি টোকেন ও পোর্ট রিড করা
const BOT_TOKEN = process.env.BOT_TOKEN || "8908339374:AAGDZJtaRLQpF5lYgRkK2TKNtGztCEfU8AI";
const FINAL_PORT = process.env.PORT || 10000;

if (!BOT_TOKEN) {
    console.error("❌ CRITICAL ERROR: Telegram Bot Token is missing in environment variables!");
    process.exit(1);
}

// পোলিং অন করে বটের ইনস্ট্যান্স তৈরি (ওয়েবহুক ছাড়া)
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("🚀 Bot instance successfully initialized with Polling: true");

// রেন্ডারের পোর্ট স্ক্যান ফিক্স করার জন্য একটি মিনিমাম এক্সপ্রেস সার্ভার
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Telegram Menu Bot is running beautifully via Polling...");
});

app.listen(FINAL_PORT, "0.0.0.0", () => {
    console.log(`✅ Dummy server listening on port ${FINAL_PORT} to keep Render happy.`);
});

// ==========================================
// START COMMAND HANDLER
// ==========================================
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `👋 Welcome ${msg.from.first_name}\n\nChoose any option below.`,
        mainKeyboard
    );
});

// ==========================================
// MAIN MESSAGE HANDLER
// ==========================================
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) return;

    // /start কমান্ড মেইন মেসেজ হ্যান্ডলারে ইগনোর করা হবে
    if (msg.text.startsWith("/")) return;

    const text = msg.text.trim();

    // ------------------------------------------
    // ১. ক্যানসেল বাটন চেক (গ্লোবাল ক্যানসেল)
    // ------------------------------------------
    if (text.toLowerCase() === "cancel" || text === "/cancel") {
        if (topupHandler.topupUsers) delete topupHandler.topupUsers[chatId];
        if (verifyHandler.verifyUsers) delete verifyHandler.verifyUsers[chatId];
        if (ucHandler.ucUsers) delete ucHandler.ucUsers[chatId];

        return bot.sendMessage(chatId, "❌ Operation Cancelled.", mainKeyboard);
    }

    // ------------------------------------------
    // ২. স্টেট চেক (ইউজার কোনো কনভারসেশনের ভেতরে আছে কি না)
    // ------------------------------------------
    if (topupHandler.topupUsers && topupHandler.topupUsers[chatId]) {
        const handled = await topupHandler.receive(bot, msg);
        if (handled) return;
    }

    if (verifyHandler.verifyUsers && verifyHandler.verifyUsers[chatId]) {
        const handled = await verifyHandler.receive(bot, msg);
        if (handled) return;
    }

    if (ucHandler.ucUsers && ucHandler.ucUsers[chatId]) {
        const handled = await ucHandler.receive(bot, msg);
        if (handled) return;
    }

    // ------------------------------------------
    // ৩. মেইন মেনু বাটন ক্লিক হ্যান্ডলিং
    // ------------------------------------------
    switch (text) {
        case "👤 Profile":
            await (typeof profileHandler === "function" ? profileHandler(bot, msg) : profileHandler.start(bot, msg));
            break;

        case "💰 Balance":
            await (typeof balanceHandler === "function" ? balanceHandler(bot, msg) : balanceHandler.start(bot, msg));
            break;

        case "💳 Add Balance":
            try {
                const { sendToGroup } = require("./utils/sender");
                await sendToGroup(bot, "Anumber");
                await bot.sendMessage(chatId, "✅ Add Balance command sent.");
            } catch (err) {
                console.error("Add Balance Error:", err.message);
            }
            break;

        case "✅ Verify":
            if (verifyHandler.start) await verifyHandler.start(bot, msg);
            break;

        case "💎 UC Purchase":
            if (ucHandler.start) await ucHandler.start(bot, msg);
            break;

        case "⚡ Auto TopUp":
            if (topupHandler.start) await topupHandler.start(bot, msg);
            break;

        case "📦 Packs":
            await (typeof packsHandler === "function" ? packsHandler(bot, msg) : packsHandler.start(bot, msg));
            break;

        case "📊 Rate":
            await (typeof rateHandler === "function" ? rateHandler(bot, msg) : rateHandler.start(bot, msg));
            break;

        case "🔄 Due Clear":
            await (typeof dueHandler === "function" ? dueHandler(bot, msg) : dueHandler.start(bot, msg));
            break;

        case "ℹ️ My Info":
            await (typeof myinfoHandler === "function" ? myinfoHandler(bot, msg) : myinfoHandler.start(bot, msg));
            break;

        default:
            // মেনুর বাইরের কোনো টেক্সট হলে কিছু করবে না
            break;
    }
});
            
