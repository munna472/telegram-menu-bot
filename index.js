const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/config');
const { mainKeyboard } = require('./keyboards/main');
const { sendToGroup } = require('./utils/sender');

// হ্যান্ডলারস ইমপোর্ট
const handleProfile = require('./handlers/profile');
const handleBalance = require('./handlers/balance');
const handleDue = require('./handlers/due');
const handleMyInfo = require('./handlers/myinfo');
const handleRate = require('./handlers/rate');
const handlePacks = require('./handlers/packs');
const handleDiamond = require('./handlers/diamond');
const { initVerify, processVerify } = require('./handlers/verify');
const { initAdminText, processAdminText } = require('./handlers/admintext');
const { initUC, processUC } = require('./handlers/uc');
const { initShell, processShell } = require('./handlers/shell');
const { initTopUp, processTopUpText, handleTopUpCallback } = require('./handlers/topup');

// এক্সপ্রেস সার্ভার ইনিশিয়ালিজেশন
const app = express();
app.get('/', (req, res) => res.send('Bot Status: Active'));
app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${config.PORT}`);
});

// টেলিগ্রাম বট অবজেক্ট
const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });
console.log("Telegram Bot initialization active (Polling)...");

// ইন-মেমোরি সেশন অবজেক্টসমূহ
const topupUsers = {};
const verifyUsers = {};
const adminUsers = {};
const shellUsers = {};
const ucUsers = {};

// মেইন মেসেজ রিসিভার
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text) return;

    const text = msg.text.trim();

    // ১. একটিভ কনভারসেশন স্টেট চেক
    if (topupUsers[chatId]) {
        return processTopUpText(bot, chatId, text, topupUsers);
    }
    if (verifyUsers[chatId]) {
        return processVerify(bot, chatId, text, verifyUsers);
    }
    if (adminUsers[chatId]) {
        return processAdminText(bot, chatId, text, adminUsers);
    }
    if (shellUsers[chatId]) {
        return processShell(bot, chatId, text, shellUsers);
    }
    if (ucUsers[chatId]) {
        return processUC(bot, chatId, text, ucUsers);
    }

    // ২. মেইন মেনু বাটন ক্লিক ম্যাপিং
    if (text === "👤 Profile") return handleProfile(bot, msg);
    if (text === "💰 Balance") return handleBalance(bot, msg);
    if (text === "📉 Due Check") return handleDue(bot, msg);
    if (text === "💳 Add Balance") return sendToGroup(bot, "Anumber");
    if (text === "📊 General Rate") return handleRate(bot, msg);
    if (text === "📦 Packs Rate") return handlePacks(bot, msg);
    if (text === "💎 Adiamond") return handleDiamond(bot, msg);
    if (text === "ℹ️ My Info") return handleMyInfo(bot, msg);
    if (text === "🔄 Due Clear") return sendToGroup(bot, "Aresetbaki");

    // ৩. স্পেশাল ডায়নামিক ইনপুট ট্রিগার বাটন
    if (text === "✅ Verify TrxID") {
        return initVerify(bot, chatId, verifyUsers);
    }
    if (text === "📝 Admin Text") {
        return initAdminText(bot, chatId, adminUsers);
    }
    if (text === "🎮 UC Purchase") {
        return initUC(bot, chatId, ucUsers);
    }
    if (text === "🎯 Garena Shell") {
        return initShell(bot, chatId, shellUsers);
    }
    if (text === "⚡ Auto TopUp") {
        return initTopUp(bot, chatId, topupUsers);
    }

    // ৪. গ্লোবাল র' (Raw) কমান্ড চেক
    const rawCommands = [
        "Aprofile", "Abalance", "Adue", "Amyinfo", "Anumber", 
        "Arate", "Apacks", "Adiamond", "Aresetbaki", "Alist"
    ];
    if (rawCommands.includes(text)) {
        return sendToGroup(bot, text);
    }

    // টেক্সট ভিত্তিক র' কমান্ড পার্সিং (Prefix matching)
    if (text.startsWith("Averify ") || text.startsWith("Auc ") || text.startsWith("Ashell ") || text.startsWith("Atp ")) {
        return sendToGroup(bot, text);
    }

    // ৫. স্ট্যান্ডঅ্যালোন প্লেয়ার UID চেক (৮-১২ ডিজিট সংখ্যা)
    if (/^\d{8,12}$/.test(text)) {
        return sendToGroup(bot, text);
    }

    // ৬. ক্যালকুলেটর রুলস ভেরিফিকেশন
    if (/^[0-9\+\-\*\/\(\)\.\s]+$/.test(text) && /[\+\-\*\/]/.test(text)) {
        return sendToGroup(bot, text);
    }

    // ৭. স্টার্ট কমান্ড হ্যান্ডলিং
    if (text === "/start") {
        return bot.sendMessage(chatId, "Welcome! Main Keyboard Active.", mainKeyboard);
    }

    // ৮. ফলব্যাক লজিক (যা কিছুর সাথে মিলবে না, হুবহু গ্রুপে যাবে)
    sendToGroup(bot, text);
});

// ইনলাইন বাটন বা কলব্যাক কুয়েরি রিসিভার
bot.on('callback_query', (query) => {
    handleTopUpCallback(bot, query, topupUsers);
});
                          
