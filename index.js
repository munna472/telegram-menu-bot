require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
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

const app = express();
app.use(express.json());

// টেলিগ্রাম বট ইনস্ট্যান্স (ওয়েবহুকের জন্য পোলিং ফলস রাখা হয়েছে)
const bot = new TelegramBot(config.botToken, { polling: true });

// রেন্ডার এনভায়রনমেন্টে ওয়েবহুক সেটআপ
if (config.renderUrl) {
    const webhookUrl = `${config.renderUrl}/bot${config.botToken}`;
    bot.setWebHook(webhookUrl)
        .then(() => console.log(`🚀 Webhook successfully set to: ${webhookUrl}`))
        .catch((err) => console.error("❌ Error setting webhook:", err.message));
} else {
    console.log("⚠️ RENDER_EXTERNAL_URL not found. Webhook not configured.");
}

// টেলিগ্রাম থেকে আসা সব আপডেট এক্সপ্রেসের এই রুটে রিসিভ হবে
app.post(`/bot${config.botToken}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// হোম রুট (সার্ভার চেক করার জন্য)
app.get("/", (req, res) => {
    res.send("Telegram Menu Bot Running via Webhook...");
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
            // Add Balance সরাসরি Anumber গ্রুপে পাঠায় (অন্য ফাইল বা সরাসরি হ্যান্ডেল করা)
            const { sendToGroup } = require("./utils/sender");
            await sendToGroup(bot, "Anumber");
            await bot.sendMessage(chatId, "✅ Add Balance command sent.");
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

// সার্ভার লিসেন করা
app.listen(config.port, () => {
    console.log(`Server Started on port ${config.port}`);
});
        
