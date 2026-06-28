require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// টোকেন ও গ্রুপ আইডি কনফিগারেশন
const BOT_TOKEN = process.env.BOT_TOKEN || "8908339374:AAGDZJtaRLQpF5lYgRkK2TKNtGztCEfU8AI";
const GROUP_ID = process.env.GROUP_ID || "-1004413191032"; 
const FINAL_PORT = process.env.PORT || 10000;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("🚀 Admin-Group Connected Text & Button Bot Initialized...");

// Render পোর্ট স্ক্যান ফিক্স করার জন্য এক্সপ্রেস সার্ভার
const app = express();
app.get("/", (req, res) => res.send("Auto Top-Up Bot is Running Successfully..."));
app.listen(FINAL_PORT, "0.0.0.0");

// ==========================================
// NEW PROFESSIONAL KEYBOARD MENUS
// ==========================================
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👤 Profile" }, { text: "💰 Balance" }, { text: "📉 Due Check" }],
            [{ text: "💳 Add Balance" }, { text: "✅ Verify TrxID" }],
            [{ text: "⚡ Auto TopUp" }, { text: "🎮 UC Purchase" }, { text: "🎯 Garena Shell" }],
            [{ text: "📦 Packs Rate" }, { text: "📊 General Rate" }, { text: "ℹ️ My Info" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// ==========================================
// MESSAGE HANDLER LOGIC
// ==========================================
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text) return;

    const text = msg.text.trim();
    const parts = text.split(/\s+/);
    const command = parts[0];
    
    const userTag = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    // ------------------------------------------
    // ১. স্টার্ট কমান্ড (/start)
    // ------------------------------------------
    if (command === "/start") {
        return bot.sendMessage(
            chatId, 
            `👋 *Welcome ${msg.from.first_name}!*\n\n🤖 I am your professional *Auto Top-Up Bot*.\n\n💡 Use the buttons below or send direct text commands to place your orders.`, 
            { parse_mode: "Markdown", ...mainKeyboard }
        );
    }

    // ------------------------------------------
    // ২. প্রোফাইল ও অ্যাকাউন্ট সেকশন
    // ------------------------------------------
    if (text === "👤 Profile" || command === "Aprofile") {
        return bot.sendMessage(chatId, `👤 *Profile & Account*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Name:* ${msg.from.first_name}\n▢ *User ID:* \`${msg.from.id}\`\n▢ *Status:* Active`, { parse_mode: "Markdown" });
    }

    if (text === "💰 Balance" || command === "Abalance") {
        return bot.sendMessage(chatId, `💰 *Current Balance*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Your Balance:* 0.00 TK`, { parse_mode: "Markdown" });
    }

    if (text === "📉 Due Check" || command === "Adue") {
        return bot.sendMessage(chatId, `▢ *Due Account Information*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Total Due:* 0.00 TK\n\n💡 বাকি ক্লিয়ার করতে \`Aresetbaki\` লিখুন।`, { parse_mode: "Markdown" });
    }

    if (text === "ℹ️ My Info" || command === "Amyinfo") {
        return bot.sendMessage(chatId, `▢ *Your Telegram ID Info*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *First Name:* ${msg.from.first_name}\n▢ *Username:* @${msg.from.username || "None"}\n▢ *ID:* \`${msg.from.id}\``, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // ৩. ব্যালেন্স অ্যাড ও ভেরিফাই (গ্রুপে যাবে)
    // ------------------------------------------
    if (text === "💳 Add Balance" || command === "Anumber") {
        return bot.sendMessage(chatId, `💳 *Balance Add & Payment*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Bkash (Send Money):* 01XXXXXXXXX\n▢ *Nagad (Send Money):* 01XXXXXXXXX\n\n⚠️ সেন্ডমানি করার পর ভেরিফাই করতে লিখুন:\n\`Averify (trxID)\`\n\n*Example:* \`Averify BG6JS8JD\``, { parse_mode: "Markdown" });
    }

    if (command === "Averify") {
        const trxId = parts[1];
        if (!trxId) return bot.sendMessage(chatId, "⚠️ ট্রানজেকশন আইডি দিন।\n*Example:* `Averify BG6JS8JD`", { parse_mode: "Markdown" });
        
        // ইউজারকে মেসেজ
        bot.sendMessage(chatId, `📥 *Verification Submitted!*\nYour TrxID: \`${trxId}\` is sent to admins for manual review.`, { parse_mode: "Markdown" });
        
        // গ্রুপে ফরোয়ার্ড
        return bot.sendMessage(GROUP_ID, `🔔 *[NEW TRX VERIFY REQUEST]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag} (\`${msg.from.id}\`)\n▢ *TrxID:* \`${trxId}\`\n━━━━━━━━━━━━━━━━━━━━━━\n⚠️ Please check wallet and update balance.`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // ৪. রেট চেক
    // ------------------------------------------
    if (text === "📊 General Rate" || command === "Arate") {
        return bot.sendMessage(chatId, `📊 *General Rates*\n━━━━━━━━━━━━━━━━━━━━━━\n[এখানে আপনার পণ্যের রেটের তালিকা বসিয়ে দিন]`, { parse_mode: "Markdown" });
    }

    if (command === "Alist") {
        return bot.sendMessage(chatId, `🔍 *UC vs Diamond Mapping List*\n━━━━━━━━━━━━━━━━━━━━━━\n[এখানে কত UC-তে কত ডায়মন্ড তার ফুল লিস্ট দিন]`, { parse_mode: "Markdown" });
    }

    if (command === "Aresetbaki") {
        bot.sendMessage(chatId, `🔄 *Due Reset Requested!* Admins have been notified.`, { parse_mode: "Markdown" });
        return bot.sendMessage(GROUP_ID, `🔄 *[DUE RESET REQUEST]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag} (\`${msg.from.id}\`)\n▢ *Request:* Clear due/baki data.`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // ৫. UC Purchase (গ্রুপে যাবে)
    // ------------------------------------------
    if (text === "🎮 UC Purchase" || command === "Auc") {
        const ucQty = parts[1];
        const packCount = parts[2] || 1;

        if (!ucQty) {
            return bot.sendMessage(chatId, `🎮 *𝐔𝐂 𝐏ᴜʀᴄʜᴀsᴇ (Unipin)*\n━━━━━━━━━━━━━━━━━━━━━━\n*Command Format:* \`Auc (UC_amount) (qty)\`\n\n*Examples:*\n\`Auc 161\`\n\`Auc 161 4\`\n━━━━━━━━━━━━━━━━━━━━━━\n💡 Type command with your desired UC amount!`, { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, `✅ *UC Order Placed!*\nAmount: ${ucQty} UC (${packCount}x)\nProcessing...`, { parse_mode: "Markdown" });
        
        // গ্রুপে পাঠানো
        return bot.sendMessage(GROUP_ID, `🎮 *[NEW UC ORDER]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag} (\`${msg.from.id}\`)\n▢ *UC Amount:* \`${ucQty} UC\`\n▢ *Quantity:* ${packCount}x\n━━━━━━━━━━━━━━━━━━━━━━\n⚡ Status: Pending Delivery`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // 💾 ৬. Garena Shell (গ্রুপে যাবে)
    // ------------------------------------------
    if (text === "🎯 Garena Shell" || command === "Ashell") {
        const shellAmount = parts[1];
        const shellQty = parts[2] || 1;

        if (!shellAmount) {
            return bot.sendMessage(chatId, `🎯 *𝐆ᴀʀᴇɴᴀ 𝐒ʜᴇʟʟ 𝐏ᴜʀᴄʜᴀsᴇ*\n━━━━━━━━━━━━━━━━━━━━━━\n*Command Format:* \`Ashell (amount) (qty)\`\n\n*Examples:*\n\`Ashell 50\`\n\`Ashell 330 2\`\n━━━━━━━━━━━━━━━━━━━━━━\n💡 Type command with your desired shell package!`, { parse_mode: "Markdown" });
        }

        bot.sendMessage(chatId, `✅ *Shell Order Placed!*\nPackage: ${shellAmount} Shell (${shellQty}x)\nProcessing...`, { parse_mode: "Markdown" });

        // গ্রুপে পাঠানো
        return bot.sendMessage(GROUP_ID, `🎯 *[NEW GARENA SHELL ORDER]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag} (\`${msg.from.id}\`)\n▢ *Shell Package:* \`${shellAmount} Shell\`\n▢ *Quantity:* ${shellQty}x\n━━━━━━━━━━━━━━━━━━━━━━\n⚡ Status: Pending Delivery`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // ⚡ ৭. Auto Top-Up লজিক (লিস্ট অনুযায়ী - গ্রুপে যাবে)
    // ------------------------------------------
    if (text === "⚡ Auto TopUp" || text === "📦 Packs Rate" || command === "Atp" || command === "Apacks" || command === "Adiamond") {
        const uid = parts[1];
        const packageType = parts[2];
        const count = parts[3] || 1;

        if (!uid) {
            return bot.sendMessage(chatId, `⚡ *𝐀ᴜᴛᴏ 𝐓ᴏ𝐩 𝐔𝐩 Menu & Rates*\n━━━━━━━━━━━━━━━━━━━━━━━━\n*𝐂ᴏᴍᴍᴀɴᴅ 𝐅ᴏʀᴍᴀᴛ:* \`Atp uid package\`\n━━━━━━━━━━━━━━━━━━━━━━━━\n💎 *Unipin Diamond:* 25, 20, 50, 36, 115, 80, 240, 160, 610, 405, 1240, 810, 2530, 1625\n🪪 *Memberships:* weekly (161), monthly (800)\n🐚 *Shell Packs:* lite, evo3, evo7, evo30\n🎮 *Level Up Pass:* lvl6, lvl10, lvl15, lvl20, lvl25, lvl30, lvlall\n🇮🇩 *Indo TopUp:* indo5, indo50, indo70, indoweekly, indomonthly, indobp, indolvl6 etc.\n━━━━━━━━━━━━━━━━━━━━━━━━\n*Example Order:* \`Atp 2232962333 lite 2\`\n⚠️ Max 5 packs per order.`, { parse_mode: "Markdown" });
        }

        if (!packageType) {
            return bot.sendMessage(chatId, "⚠️ Please specify the package name.\n*Example:* `Atp 2232962333 lite`", { parse_mode: "Markdown" });
        }

        if (parseInt(count) > 5) {
            return bot.sendMessage(chatId, "⚠️ একসাথে সর্বোচ্চ ৫টি টপ-আপ করা যাবে!", { parse_mode: "Markdown" });
        }

        // ইউজারকে মেসেজ
        bot.sendMessage(chatId, `📦 *Top-Up Order Received!*\nUID: \`${uid}\`\nPack: \`${packageType}\` [${count}x]\n━━━━━━━━━━━━━━━━━━━━━━\n⚡ Sent to processing queue.`, { parse_mode: "Markdown" });
        
        // অ্যাডমিন গ্রুপে সাকসেস নোটিফিকেশন ফরোয়ার্ড
        return bot.sendMessage(GROUP_ID, `⚡ *[NEW AUTO TOP-UP ORDER]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag} (\`${msg.from.id}\`)\n▢ *Player UID:* \`${uid}\`\n▢ *Package:* \`${packageType}\`\n▢ *Quantity:* ${count}x\n━━━━━━━━━━━━━━━━━━━━━━\n🛠️ Please fill up the order.`, { parse_mode: "Markdown" });
    }

    // ------------------------------------------
    // 🧮 ৮. ক্যালকুলেটর (যেমন: 100+100)
    // ------------------------------------------
    if (/^[0-9\+\-\*\/\(\)\.\s]+$/.test(text) && /[\+\-\*\/]/.test(text)) {
        try {
            const result = new Function(`return ${text}`)();
            return bot.sendMessage(chatId, `🧮 *Calculator*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Equation:* ${text}\n▢ *Result:* *${result}*`, { parse_mode: "Markdown" });
        } catch (e) {}
    }

    // ------------------------------------------
    // 🔍 ৯. শুধু UID কুইক স্ক্যান (৮ থেকে ১২ ডিজিট)
    // ------------------------------------------
    if (/^\d{8,12}$/.test(text)) {
        bot.sendMessage(chatId, `🔍 *UID Quick Scanner*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *Target UID:* \`${text}\`\n\nFetching player info...`, { parse_mode: "Markdown" });
        
        // গ্রুপে ফরোয়ার্ড 
        return bot.sendMessage(GROUP_ID, `🔍 *[UID CHECK LOG]*\n━━━━━━━━━━━━━━━━━━━━━━\n▢ *User:* ${userTag}\n▢ *Checked UID:* \`${text}\``, { parse_mode: "Markdown" });
    }
});
            
