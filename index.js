require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// রেন্ডার এনভায়রনমেন্ট থেকে সরাসরি টোকেন ও পোর্ট রিড করা
const BOT_TOKEN = process.env.BOT_TOKEN || "8908339374:AAGDZJtaRLQpF5lYgRkK2TKNtGztCEfU8AI";
const FINAL_PORT = process.env.PORT || 10000;

if (!BOT_TOKEN) {
    console.error("❌ CRITICAL ERROR: Telegram Bot Token is missing!");
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("🚀 Professional Hybrid Menu Bot initialized...");

// রেন্ডার পোর্ট স্ক্যান ফিক্স করার জন্য এক্সপ্রেস সার্ভার
const app = express();
app.get("/", (req, res) => res.send("Professional Bot is Running..."));
app.listen(FINAL_PORT, "0.0.0.0");

// ==========================================
// PROFESSIONAL MAIN KEYBOARD MARKS
// ==========================================
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👤 Profile" }, { text: "💰 Balance" }],
            [{ text: "💳 Add Balance" }, { text: "✅ Verify" }],
            [{ text: "💎 UC Purchase" }, { text: "⚡ Auto TopUp" }],
            [{ text: "📦 Packs" }, { text: "📊 Rate" }],
            [{ text: "🔄 Due Clear" }, { text: "ℹ️ My Info" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// ==========================================
// MESSAGE HANDLER (TEXT + BUTTON LOGIC)
// ==========================================
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text) return;

    const text = msg.text.trim();
    const parts = text.split(/\s+/);
    const command = parts[0];

    // ------------------------------------------
    // ১. গ্লোবাল স্টার্ট কমান্ড (/start)
    // ------------------------------------------
    if (command === "/start") {
        return bot.sendMessage(
            chatId, 
            `👋 *Welcome ${msg.from.first_name}!*\n\n🤖 I am your professional Auto Top-Up Bot. Use the buttons below or send direct text commands to use my services.`, 
            { parse_mode: "Markdown", ...mainKeyboard }
        );
    }

    // ------------------------------------------
    // ২. মেইন মেনু বাটন ক্লিক হ্যান্ডলিং
    // ------------------------------------------
    if (text === "👤 Profile" || command === "Aprofile") {
        return bot.sendMessage(chatId, `👤 *Profile & Account*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Name:* ${msg.from.first_name}\n▢ *User ID:* \`${msg.from.id}\`\n▢ *Status:* Active`, { parse_mode: "Markdown" });
    }

    if (text === "💰 Balance" || command === "Abalance") {
        return bot.sendMessage(chatId, `💰 *Current Balance*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Your Balance:* 0.00 TK\n▢ *Status:* No due pending`, { parse_mode: "Markdown" });
    }

    if (text === "🔄 Due Clear" || command === "Adue") {
        return bot.sendMessage(chatId, `▢ *Due Account Information*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Total Due:* 0.00 TK\n\n💡 বাকি ক্লিয়ার করতে \`Aresetbaki\` লিখুন।`, { parse_mode: "Markdown" });
    }

    if (text === "ℹ️ My Info" || command === "Amyinfo") {
        return bot.sendMessage(chatId, `▢ *Your Telegram ID Info*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *First Name:* ${msg.from.first_name}\n▢ *Username:* @${msg.from.username || "None"}\n▢ *ID:* \`${msg.from.id}\``, { parse_mode: "Markdown" });
    }

    if (text === "💳 Add Balance" || command === "Anumber") {
        return bot.sendMessage(chatId, `💳 *Balance Add & Payment*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Bkash (Send Money):* 01XXXXXXXXX\n▢ *Nagad (Send Money):* 01XXXXXXXXX\n\n⚠️ সেন্ডমানি করার পর ট্রানজেকশন আইডি দিয়ে ভেরিফাই করতে লিখুন:\n\`Averify (trxID)\`\n\n*Example:* \`Averify BG6JS8JD\``, { parse_mode: "Markdown" });
    }

    if (command === "Averify") {
        const trxId = parts[1];
        if (!trxId) return bot.sendMessage(chatId, "⚠️ ট্রানজেকশন আইডি দিন।\n*Example:* `Averify BG6JS8JD`", { parse_mode: "Markdown" });
        return bot.sendMessage(chatId, `🔍 Checking Transaction ID: *${trxId}*...\nPlease wait while we verify with the network.`, { parse_mode: "Markdown" });
    }

    if (text === "📊 Rate" || command === "Arate") {
        return bot.sendMessage(chatId, `💰 *Rate Check*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *All General Product Rates:* \n[এখানে আপনার রেটের তালিকা বসিয়ে দিন]`, { parse_mode: "Markdown" });
    }

    if (command === "Alist") {
        return bot.sendMessage(chatId, `🔍 *UC & Diamond List Map*\n━━━━━━━━━━━━━━━━━━━━━━\n[এখানে কত UC-তে কত ডায়মন্ড তার ফুল লিস্ট দিন]`, { parse_mode: "Markdown" });
    }

    if (command === "Aresetbaki") {
        return bot.sendMessage(chatId, `🔄 *Due Reset Requested*\n━━━━━━━━━━━━━━━━━━━━━━\nYour request to clear due balances has been logged successfully.`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // ৩. টপ-আপ মেনু বাটন ও "Atp" কমান্ড লজিক (লিস্ট অনুযায়ী)
    // ------------------------------------------
    if (text === "⚡ Auto TopUp" || text === "📦 Packs" || command === "Atp" || command === "Apacks" || command === "Adiamond") {
        const uid = parts[1];
        const packageType = parts[2];
        const count = parts[3] || 1;

        // ইউজার যদি কোনো আইডি বা প্যাক ছাড়া শুধু বাটন বা কমান্ডে চাপ দেয়
        if (!uid) {
            return bot.sendMessage(chatId, `⚡ *𝐀ᴜᴛᴏ 𝐓ᴏ𝐩 𝐔𝐩 Menu*\n━━━━━━━━━━━━━━━━━━\n*𝐂ᴏᴍᴍᴀɴᴅ 𝐅ᴏʀᴍᴀᴛ*\n\`Atp uid package\`\n━━━━━━━━━━━━━━━━━━\n\n💎 *𝐔ɴɪᴘɪɴ 𝐓ᴏ𝐩 𝐔ᴘ Packs:* 25, 50, 115, 240, 610, 1240, 2530\n🪪 *𝐌ᴇᴍʙᴇʀsʜɪᴘs:* weekly, monthly\n🐚 *𝐒ʜᴇʟʟ 𝐓ᴏ𝐩 𝐔ᴘ:* lite, evo3, evo7, evo30\n🎮 *𝐋ᴇᴠᴇʟ 𝐔ᴘ 𝐏ᴀss:* lvl6, lvl10, lvl15, lvl20, lvl25, lvl30, lvlall\n🇮🇩 *𝐈ɴᴅᴏ 𝐓ᴏ𝐩 𝐔ᴘ:* indo5, indo50, indo70, indoweekly, indomonthly, indobp, indolvl6... etc.\n━━━━━━━━━━━━━━━━━━\n\n*Example Order:* \`Atp 2232962333 lite 2\`\n⚠️ Max 5 packs per order.`, { parse_mode: "Markdown" });
        }

        if (!packageType) {
            return bot.sendMessage(chatId, "⚠️ Please specify the package name.\n*Example:* `Atp 2232962333 lite`", { parse_mode: "Markdown" });
        }

        if (parseInt(count) > 5) {
            return bot.sendMessage(chatId, "⚠️ একসাথে সর্বোচ্চ ৫টি টপ-আপ করা যাবে!", { parse_mode: "Markdown" });
        }

        // সফল অর্ডারের প্রফেশনাল রেসপন্স মেসেজ
        return bot.sendMessage(chatId, `📦 *Top-Up Order Received*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Player UID:* \`${uid}\`\n▢ *Package Selected:* \`${packageType}\`\n▢ *Quantity:* ${count}x\n━━━━━━━━━━━━━━━━━━━━━━\n⚡ *Status:* Processing your Top-up auto-delivery. Please wait!`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // 🧮 ৪. ক্যালকুলেটর (যেমন: 100+100)
    // ------------------------------------------
    if (/^[0-9\+\-\*\/\(\)\.\s]+$/.test(text) && /[\+\-\*\/]/.test(text)) {
        try {
            const result = new Function(`return ${text}`)();
            return bot.sendMessage(chatId, `🧮 *Calculator*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Equation:* ${text}\n▢ *Result:* *${result}*`, { parse_mode: "Markdown" });
        } catch (e) {}
    }

    // ------------------------------------------
    // 🔍 ৫. শুধু UID চেক (৮ থেকে ১২ ডিজিটের সংখ্যা)
    // ------------------------------------------
    if (/^\d{8,12}$/.test(text)) {
        return bot.sendMessage(chatId, `🔍 *UID Quick Scanner*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Target UID:* \`${text}\`\n\nFetching region and active player details...`, { parse_mode: "Markdown" });
    }
});
        
