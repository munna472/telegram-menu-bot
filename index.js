require("dotenv").config();
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// কনফিগারেশন
const BOT_TOKEN = process.env.BOT_TOKEN || "8908339374:AAGDZJtaRLQpF5lYgRkK2TKNtGztCEfU8AI";
const GROUP_ID = process.env.GROUP_ID || "-1004413191032"; 
const FINAL_PORT = process.env.PORT || 10000;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log("🚀 Raw Command Forwarder Bot Active...");

// Render পোর্ট ফিক্স এক্সপ্রেস সার্ভার
const app = express();
app.get("/", (req, res) => res.send("Bot is Active..."));
app.listen(FINAL_PORT, "0.0.0.0");

// ইউজারের সেশন ট্র্যাক অবজেক্ট (শুধুমাত্র Auto TopUp এবং Admin Text এর জন্য)
const userSessions = {};

// ==========================================
// ALL BUTTON MARKUPS (সবগুলো বাটন একসাথে)
// ==========================================
const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👤 Profile" }, { text: "💰 Balance" }, { text: "📉 Due Check" }],
            [{ text: "💳 Add Balance" }, { text: "✅ Verify TrxID" }],
            [{ text: "⚡ Auto TopUp" }, { text: "🎮 UC Purchase" }, { text: "🎯 Garena Shell" }],
            [{ text: "📦 Packs Rate" }, { text: "📊 General Rate" }, { text: "ℹ️ My Info" }],
            [{ text: "🔍 ID Check" }, { text: "🔄 Due Clear" }, { text: "📝 Admin Text" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// ক্যানসেল বাটন
const cancelKeyboard = {
    reply_markup: {
        keyboard: [[{ text: "❌ Cancel Order" }]],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// ==========================================
// MAIN MESSAGE HANDLER
// ==========================================
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text) return;

    const text = msg.text.trim();
    const parts = text.split(/\s+/);
    const command = parts[0];

    // গ্লোবাল ক্যানসেল চেক
    if (text === "❌ Cancel Order") {
        delete userSessions[chatId];
        return bot.sendMessage(chatId, "❌ বাতিল করা হয়েছে।", mainKeyboard);
    }

    // ------------------------------------------
    // কাস্টম এডমিন টেক্সট / যেকোনো টেক্সট ফরোয়ার্ড করার লজিক
    // ------------------------------------------
    if (userSessions[chatId] && userSessions[chatId].step === "AWAITING_ADMIN_TEXT") {
        // ইউজার যা লিখবে হুবহু সেই প্লেইন টেক্সট বা কমান্ড গ্রুপে যাবে
        bot.sendMessage(GROUP_ID, text);
        bot.sendMessage(chatId, "✅ আপনার কমান্ড/মেসেজটি গ্রুপে পাঠানো হয়েছে।", mainKeyboard);
        delete userSessions[chatId];
        return;
    }

    // ------------------------------------------
    // স্টেপ-বাই-স্টেপ অটো টপ-আপ লজিক
    // ------------------------------------------
    if (userSessions[chatId] && userSessions[chatId].step) {
        const session = userSessions[chatId];

        // ধাপ ১: UID গ্রহণ করা
        if (session.step === "AWAITING_UID") {
            if (!/^\d{5,15}$/.test(text)) {
                return bot.sendMessage(chatId, "⚠️ ভুল UID! দয়া করে সঠিক প্লেয়ার ইউআইডি (শুধু সংখ্যা) দিন:", cancelKeyboard);
            }
            session.uid = text;
            session.step = "AWAITING_PACKAGE";

            return bot.sendMessage(chatId, "🎁 এখন নিচের ক্যাটাগরি থেকে আপনার প্যাকেজটি সিলেক্ট করুন:", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "💎 Unipin Diamond", callback_data: "cat_unipin" }],
                        [{ text: "🪪 Memberships", callback_data: "cat_member" }],
                        [{ text: "🐚 Shell TopUp Packs", callback_data: "cat_shell" }],
                        [{ text: "🎮 Level Up Pass", callback_data: "cat_lvl" }],
                        [{ text: "🇮🇩 Indo Top Up", callback_data: "cat_indo" }]
                    ]
                }
            });
        }

        // ধাপ ৩: কোয়ান্টিটি বা সংখ্যা গ্রহণ করা
        if (session.step === "AWAITING_QTY") {
            let finalQty = "";
            if (text !== "⏭️ Skip (1x)") {
                const qty = parseInt(text);
                if (isNaN(qty) || qty < 1 || qty > 5) {
                    return bot.sendMessage(chatId, "⚠️ দয়া করে ১ থেকে ৫ এর মধ্যে সংখ্যা লিখুন বা Skip করুন:");
                }
                finalQty = ` ${qty}`;
            }

            const finalCommand = `Atp ${session.uid} ${session.package}${finalQty}`.trim();
            bot.sendMessage(GROUP_ID, finalCommand);
            bot.sendMessage(chatId, `✅ সফলভাবে পাঠানো হয়েছে:\n\`${finalCommand}\``, { parse_mode: "Markdown", ...mainKeyboard });

            delete userSessions[chatId];
            return;
        }
    }

    // ------------------------------------------
    // বাটন ক্লিকের বিপরীতে হুবহু আপনার দেওয়া প্লেইন কমান্ড গ্রুপে ফরোয়ার্ড
    // ------------------------------------------
    
    // ১. প্রোফাইল ও অ্যাকাউন্ট ক্যাটাগরি
    if (text === "👤 Profile" || command === "Aprofile") {
        return bot.sendMessage(GROUP_ID, "Aprofile");
    }
    if (text === "💰 Balance" || command === "Abalance") {
        return bot.sendMessage(GROUP_ID, "Abalance");
    }
    if (text === "📉 Due Check" || command === "Adue") {
        return bot.sendMessage(GROUP_ID, "Adue");
    }
    if (text === "ℹ️ My Info" || command === "Amyinfo") {
        return bot.sendMessage(GROUP_ID, "Amyinfo");
    }

    // ২. ব্যালেন্স অ্যাড ও ভেরিফাই ক্যাটাগরি
    if (text === "💳 Add Balance" || command === "Anumber") {
        return bot.sendMessage(GROUP_ID, "Anumber");
    }
    if (text === "✅ Verify TrxID" || command === "Averify") {
        const trxId = parts[1] || "";
        return bot.sendMessage(GROUP_ID, `Averify ${trxId}`.trim());
    }

    // ৩. রেট চেক
    if (text === "📊 General Rate" || command === "Arate") {
        return bot.sendMessage(GROUP_ID, "Arate");
    }
    if (text === "📦 Packs Rate" || command === "Apacks") {
        return bot.sendMessage(GROUP_ID, "Apacks");
    }
    if (command === "Adiamond") {
        return bot.sendMessage(GROUP_ID, "Adiamond");
    }
    if (command === "Alist") {
        return bot.sendMessage(GROUP_ID, "Alist");
    }

    // ৪. UC এবং Garena Shell পারচেজ
    if (text === "🎮 UC Purchase" || command === "Auc") {
        const uc = parts[1] || "";
        const qty = parts[2] || "";
        return bot.sendMessage(GROUP_ID, `Auc ${uc} ${qty}`.trim());
    }
    if (text === "🎯 Garena Shell" || command === "Ashell") {
        const amount = parts[1] || "";
        const qty = parts[2] || "";
        return bot.sendMessage(GROUP_ID, `Ashell ${amount} ${qty}`.trim());
    }

    // ৫. ডিউ ক্লিয়ার ও আইডি চেক
    if (text === "🔄 Due Clear" || command === "Aresetbaki") {
        return bot.sendMessage(GROUP_ID, "Aresetbaki");
    }
    if (text === "🔍 ID Check") {
        return bot.sendMessage(chatId, "🔍 আইডি ডিটেলস দেখতে সরাসরি শুধু প্লেয়ার UID (যেমন: `2232962333`) টাইপ করে সেন্ড করুন।", { parse_mode: "Markdown" });
    }

    // ৬. অটো টপ-আপ প্রসেস স্টার্ট
    if (text === "⚡ Auto TopUp" || command === "Atp") {
        // যদি ইউজার সরাসরি ফুল কমান্ড লেখে যেমন: Atp 2232962333 lite
        if (parts[1]) {
            return bot.sendMessage(GROUP_ID, text);
        }
        // বাটন ক্লিক করলে স্টেপ বাই স্টেপ ইনপুট নেবে
        userSessions[chatId] = { step: "AWAITING_UID", uid: "", package: "" };
        return bot.sendMessage(chatId, "🎮 আপনার *Auto Top-Up* প্রসেসটি শুরু হয়েছে।\n\n🎯 প্রথমে আপনার **Player UID** টি লিখুন:", { parse_mode: "Markdown", ...cancelKeyboard });
    }

    // ৭. নতুন কাস্টম এডমিন টেক্সট বাটন লজিক
    if (text === "📝 Admin Text") {
        userSessions[chatId] = { step: "AWAITING_ADMIN_TEXT" };
        return bot.sendMessage(chatId, "✍️ আপনি গ্রুপে যে কমান্ড বা কাস্টম মেসেজটি পাঠাতে চান, তা এখন এখানে লিখুন:", cancelKeyboard);
    }

    // ৮. সরাসরি ক্যালকুলেটর ইনপুট দিলে
    if (/^[0-9\+\-\*\/\(\)\.\s]+$/.test(text) && /[\+\-\*\/]/.test(text)) {
        try {
            const result = new Function(`return ${text}`)();
            return bot.sendMessage(GROUP_ID, `Calculator: ${text} = ${result}`);
        } catch (e) {}
    }

    // ৯. ইউজার সরাসরি শুধু UID (৮-১২ ডিজিট সংখ্যা) টাইপ করলে তা গ্রুপে যাবে
    if (/^\d{8,12}$/.test(text)) {
        return bot.sendMessage(GROUP_ID, text);
    }

    // ১০. স্টার্ট কমান্ড
    if (command === "/start") {
        return bot.sendMessage(chatId, `👋 *Welcome!*\n\nনিচের বাটনগুলো ব্যবহার করে সরাসরি গ্রুপে নিখুঁত র' (Raw) কমান্ড পাঠান।`, { parse_mode: "Markdown", ...mainKeyboard });
    }

    // ইউজার অন্য যেকোনো র্যান্ডম কমান্ড বা মেসেজ লিখলে সরাসরি গ্রুপে ফরোয়ার্ড হবে
    return bot.sendMessage(GROUP_ID, text);
});

// ==========================================
// INLINE BUTTON CALLBACK HANDLER (প্যাকেজ সিলেকশন)
// ==========================================
bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!userSessions[chatId] || userSessions[chatId].step !== "AWAITING_PACKAGE") {
        return bot.answerCallbackQuery(query.id, { text: "সেশনটি শেষ হয়ে গেছে।" });
    }

    // Unipin সাব-মেনু
    if (data === "cat_unipin") {
        return bot.editMessageText("💎 *Unipin Diamond* প্যাকেজটি বেছে নিন:", {
            chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "25 Dia (20)", callback_data: "pkg_20" }, { text: "25 Dia (25)", callback_data: "pkg_25" }],
                    [{ text: "50 Dia (36)", callback_data: "pkg_36" }, { text: "50 Dia (50)", callback_data: "pkg_50" }],
                    [{ text: "115 Dia (80)", callback_data: "pkg_80" }, { text: "115 Dia (115)", callback_data: "pkg_115" }],
                    [{ text: "240 Dia (160)", callback_data: "pkg_160" }, { text: "240 Dia (240)", callback_data: "pkg_240" }],
                    [{ text: "610 Dia (405)", callback_data: "pkg_405" }, { text: "610 Dia (610)", callback_data: "pkg_610" }],
                    [{ text: "1240 Dia (810)", callback_data: "pkg_810" }, { text: "1240 Dia (1240)", callback_data: "pkg_1240" }],
                    [{ text: "2530 Dia (1625)", callback_data: "pkg_1625" }, { text: "2530 Dia (2530)", callback_data: "pkg_2530" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_cat" }]
                ]
            }
        });
    }

    // Memberships সাব-মেনু
    if (data === "cat_member") {
        return bot.editMessageText("🪪 *Memberships* প্যাকেজ বেছে নিন:", {
            chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Weekly Membership (161)", callback_data: "pkg_161" }],
                    [{ text: "Monthly Membership (800)", callback_data: "pkg_800" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_cat" }]
                ]
            }
        });
    }

    // Shell Packs সাব-মেনু
    if (data === "cat_shell") {
        return bot.editMessageText("🐚 *Shell TopUp Packs* বেছে নিন:", {
            chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Weekly Lite (lite)", callback_data: "pkg_lite" }],
                    [{ text: "Evo 3 Days (evo3)", callback_data: "pkg_evo3" }],
                    [{ text: "Evo 7 Days (evo7)", callback_data: "pkg_evo7" }],
                    [{ text: "Evo 30 Days (evo30)", callback_data: "pkg_evo30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_cat" }]
                ]
            }
        });
    }

    // Level Up Pass সাব-মেনু
    if (data === "cat_lvl") {
        return bot.editMessageText("🎮 *Level Up Pass* বেছে নিন:", {
            chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Lvl 6", callback_data: "pkg_lvl6" }, { text: "Lvl 10", callback_data: "pkg_lvl10" }],
                    [{ text: "Lvl 15", callback_data: "pkg_lvl15" }, { text: "Lvl 20", callback_data: "pkg_lvl20" }],
                    [{ text: "Lvl 25", callback_data: "pkg_lvl25" }, { text: "Lvl 30", callback_data: "pkg_lvl30" }],
                    [{ text: "Full Level Up Pass (lvlall)", callback_data: "pkg_lvlall" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_cat" }]
                ]
            }
        });
    }

    // Indo Top Up সাব-মেনু
    if (data === "cat_indo") {
        return bot.editMessageText("🇮🇩 *Indo Top Up* বেছে নিন:", {
            chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Indo 5 Dia", callback_data: "pkg_indo5" }, { text: "Indo 50 Dia", callback_data: "pkg_indo50" }],
                    [{ text: "Indo 70 Dia", callback_data: "pkg_indo70" }, { text: "Indo 140 Dia", callback_data: "pkg_indo140" }],
                    [{ text: "Indo 355 Dia", callback_data: "pkg_indo355" }, { text: "Indo 720 Dia", callback_data: "pkg_indo720" }],
                    [{ text: "Indo 7290 Dia", callback_data: "pkg_indo7290" }],
                    [{ text: "Indo Weekly", callback_data: "pkg_indoweekly" }, { text: "Indo Monthly", callback_data: "pkg_indomonthly" }],
                    [{ text: "Indo BP Card", callback_data: "pkg_indobp" }],
                    [{ text: "Indo Lvl 6", callback_data: "pkg_indolvl6" }, { text: "Indo Lvl 30", callback_data: "pkg_indolvl30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_cat" }]
                ]
            }
        });
    }

    // ব্যাক বাটন ক্লিক
    if (data === "back_to_cat") {
        return bot.editMessageText("🎁 এখন নিচের ক্যাটাগরি থেকে আপনার প্যাকেজটি সিলেক্ট করুন:", {
            chat_id: chatId, message_id: query.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 Unipin Diamond", callback_data: "cat_unipin" }],
                    [{ text: "🪪 Memberships", callback_data: "cat_member" }],
                    [{ text: "🐚 Shell TopUp Packs", callback_data: "cat_shell" }],
                    [{ text: "🎮 Level Up Pass", callback_data: "cat_lvl" }],
                    [{ text: "🇮🇩 Indo Top Up", callback_data: "cat_indo" }]
                ]
            }
        });
    }

    // প্যাকেজ সিলেক্ট হয়ে গেলে কোয়ান্টিটি চাওয়া
    if (data.startsWith("pkg_")) {
        const selectedPackage = data.replace("pkg_", "");
        userSessions[chatId].package = selectedPackage;
        userSessions[chatId].step = "AWAITING_QTY";

        bot.answerCallbackQuery(query.id);
        bot.deleteMessage(chatId, query.message.message_id);

        return bot.sendMessage(chatId, `📦 আপনি সিলেক্ট করেছেন: *${selectedPackage}*\n\n🔢 এবার আপনি কতটি (Quantity) নিতে চান তা টেক্সট আকারে লিখে পাঠান।\n\n💡 ১টি নিতে চাইলে নিচের **⏭️ Skip (1x)** বাটনে চাপ দিতে পারেন।`, {
            parse_mode: "Markdown",
            reply_markup: {
                keyboard: [
                    [{ text: "⏭️ Skip (1x)" }],
                    [{ text: "❌ Cancel Order" }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});
              
