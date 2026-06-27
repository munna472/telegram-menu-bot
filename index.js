require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

const TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = process.env.GROUP_ID;
const PORT = process.env.PORT || 10000;

const bot = new TelegramBot(TOKEN, {
    polling: true
});

// =========================
// USER STATE
// =========================

const users = {};

// =========================
// MAIN KEYBOARD
// =========================

const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [
                { text: "👤 Profile" },
                { text: "💰 Balance" }
            ],
            [
                { text: "💳 Add Balance" },
                { text: "✅ Verify" }
            ],
            [
                { text: "💎 UC Purchase" },
                { text: "⚡ Auto TopUp" }
            ],
            [
                { text: "📦 Packs" },
                { text: "📊 Rate" }
            ],
            [
                { text: "🔄 Due Clear" },
                { text: "ℹ️ My Info" }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// =========================
// START COMMAND
// =========================

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `👋 Welcome ${msg.from.first_name}\n\nChoose any option below.`,
        mainKeyboard
    );
});

// =========================
// SIMPLE COMMANDS (MESSAGE HANDLER)
// =========================

bot.on("message", async (msg) => {

    const chatId = msg.chat.id;

    if (!msg.text) return;

    // Ignore commands like /start
    if (msg.text.startsWith("/")) return;

    switch (msg.text) {

        case "👤 Profile":
            await bot.sendMessage(GROUP_ID, "Aprofile");
            return bot.sendMessage(
                chatId,
                "✅ Profile request sent."
            );

        case "💰 Balance":
            await bot.sendMessage(GROUP_ID, "Abalance");
            return bot.sendMessage(
                chatId,
                "✅ Balance request sent."
            );

        case "💳 Add Balance":
            await bot.sendMessage(GROUP_ID, "Anumber");
            return bot.sendMessage(
                chatId,
                "✅ Add Balance command sent."
            );

        case "📊 Rate":
            await bot.sendMessage(GROUP_ID, "Arate");
            return bot.sendMessage(
                chatId,
                "✅ Rate command sent."
            );

        case "🔄 Due Clear":
            await bot.sendMessage(GROUP_ID, "Aresetbaki");
            return bot.sendMessage(
                chatId,
                "✅ Due Clear command sent."
            );

        case "ℹ️ My Info":
            await bot.sendMessage(GROUP_ID, "Amyinfo");
            return bot.sendMessage(
                chatId,
                "✅ My Info command sent."
            );
    }
});

// =========================
// EXPRESS SERVER
// =========================

app.get("/", (req, res) => {
    res.send("Telegram Menu Bot Running...");
});

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});
                  
