const { cancelKeyboard, quantityKeyboard, mainKeyboard } = require('../keyboards/main');
const { sendToGroup } = require('../utils/sender');

function initTopUp(bot, chatId, topupUsers) {
    topupUsers[chatId] = { step: 'STEP_1_UID', uid: '', package: '' };
    bot.sendMessage(chatId, "🎯 Enter UID (6-15 digits, numbers only):", cancelKeyboard);
}

function processTopUpText(bot, chatId, text, topupUsers) {
    const session = topupUsers[chatId];
    if (!session) return;

    if (text === "❌ Cancel Order") {
        delete topupUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }

    // ধাপ ১: UID ভ্যালিডেশন
    if (session.step === 'STEP_1_UID') {
        if (!/^\d{6,15}$/.test(text)) {
            return bot.sendMessage(chatId, "⚠️ Invalid UID! Numbers only (6-15 digits). Try again:", cancelKeyboard);
        }
        session.uid = text;
        session.step = 'STEP_2_PACKAGE';

        const inlineOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 Unipin Diamond", callback_data: "sub_unipin" }],
                    [{ text: "🪪 Membership", callback_data: "sub_member" }],
                    [{ text: "🐚 Shell Packs", callback_data: "sub_shell" }],
                    [{ text: "🎮 Level Up Pass", callback_data: "sub_level" }],
                    [{ text: "🇮🇩 Indo Top Up", callback_data: "sub_indo" }]
                ]
            }
        };
        return bot.sendMessage(chatId, "🎁 Select Category:", inlineOptions);
    }

    // 🎯 ধাপ ৩: কোয়ান্টিটি এবং ফাইনাল কমান্ড পাঠানো
    if (session.step === 'STEP_3_QTY') {
        let qtyVal = text.trim();
        
        if (qtyVal === "⏭️ Skip (1x)" || qtyVal === "1") {
            qtyVal = ""; // ১টি নিলে বা স্কিপ করলে শেষে কোনো সংখ্যা বসবে না
        } else {
            const parsedQty = parseInt(qtyVal);
            if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 5) {
                return bot.sendMessage(chatId, "⚠️ Maximum quantity is 5! Please select or type (1-5):", quantityKeyboard);
            }
        }

        // হুবহু আপনার ফরমেট: Atp uid package qty
        let finalCommand = `Atp ${session.uid} ${session.package}`;
        if (qtyVal) {
            finalCommand += ` ${qtyVal}`;
        }

        sendToGroup(bot, finalCommand); // গ্রুপে একদম র' টেক্সট চলে যাবে
        delete topupUsers[chatId];
        return bot.sendMessage(chatId, "✅ Done", mainKeyboard);
    }
}

function handleTopUpCallback(bot, query, topupUsers) {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    const session = topupUsers[chatId];
    if (!session || session.step !== 'STEP_2_PACKAGE') {
        return bot.answerCallbackQuery(query.id);
    }

    // --- ক্যাটাগরি অনুযায়ী সাব-মেনু ---
    if (data === "sub_unipin") {
        return bot.editMessageText("💎 Unipin Diamond Packages:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "25 Dia (25)", callback_data: "p_25" }, { text: "25 Dia (20)", callback_data: "p_20" }],
                    [{ text: "50 Dia (50)", callback_data: "p_50" }, { text: "50 Dia (36)", callback_data: "p_36" }],
                    [{ text: "115 Dia (115)", callback_data: "p_115" }, { text: "115 Dia (80)", callback_data: "p_80" }],
                    [{ text: "240 Dia (240)", callback_data: "p_240" }, { text: "240 Dia (160)", callback_data: "p_160" }],
                    [{ text: "610 Dia (610)", callback_data: "p_610" }, { text: "610 Dia (405)", callback_data: "p_405" }],
                    [{ text: "1240 Dia (1240)", callback_data: "p_1240" }, { text: "1240 Dia (810)", callback_data: "p_810" }],
                    [{ text: "2530 Dia (2530)", callback_data: "p_2530" }, { text: "2530 Dia (1625)", callback_data: "p_1625" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_member") {
        return bot.editMessageText("🪪 Memberships:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Weekly (161)", callback_data: "p_161" }],
                    [{ text: "Monthly (800)", callback_data: "p_800" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_shell") {
        return bot.editMessageText("🐚 Shell Packs:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Weekly Lite (lite)", callback_data: "p_lite" }],
                    [{ text: "Evo 3 Days (evo3)", callback_data: "p_evo3" }],
                    [{ text: "Evo 7 Days (evo7)", callback_data: "p_evo7" }],
                    [{ text: "Evo 30 Days (evo30)", callback_data: "p_evo30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_level") {
        return bot.editMessageText("🎮 Level Up Pass:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Lvl 6 (lvl6)", callback_data: "p_lvl6" }, { text: "Lvl 10 (lvl10)", callback_data: "p_lvl10" }],
                    [{ text: "Lvl 15 (lvl15)", callback_data: "p_lvl15" }, { text: "Lvl 20 (lvl20)", callback_data: "p_lvl20" }],
                    [{ text: "Lvl 25 (lvl25)", callback_data: "p_lvl25" }, { text: "Lvl 30 (lvl30)", callback_data: "p_lvl30" }],
                    [{ text: "Full Pass (lvlall)", callback_data: "p_lvlall" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_indo") {
        return bot.editMessageText("🇮🇩 Indo Top Up Packages:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Indo 5 (indo5)", callback_data: "p_indo5" }, { text: "Indo 50 (indo50)", callback_data: "p_indo50" }],
                    [{ text: "Indo 70 (indo70)", callback_data: "p_indo70" }, { text: "Indo 140 (indo140)", callback_data: "p_indo140" }],
                    [{ text: "Indo 355 (indo355)", callback_data: "p_indo355" }, { text: "Indo 720 (indo720)", callback_data: "p_indo720" }],
                    [{ text: "Indo 7290 (indo7290)", callback_data: "p_indo7290" }],
                    [{ text: "Indo Weekly", callback_data: "p_indoweekly" }, { text: "Indo Monthly", callback_data: "p_indomonthly" }],
                    [{ text: "Indo BP Card", callback_data: "p_indobp" }],
                    [{ text: "Indo Lvl 6", callback_data: "p_indolvl6" }, { text: "Indo Lvl 10", callback_data: "p_indolvl10" }],
                    [{ text: "Indo Lvl 15", callback_data: "p_indolvl15" }, { text: "Indo Lvl 20", callback_data: "p_indolvl20" }],
                    [{ text: "Indo Lvl 25", callback_data: "p_indolvl25" }, { text: "Indo Lvl 30", callback_data: "p_indolvl30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "back_to_main_cat") {
        return bot.editMessageText("🎁 Select Category:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 Unipin Diamond", callback_data: "sub_unipin" }],
                    [{ text: "🪪 Membership", callback_data: "sub_member" }],
                    [{ text: "🐚 Shell Packs", callback_data: "sub_shell" }],
                    [{ text: "🎮 Level Up Pass", callback_data: "sub_level" }],
                    [{ text: "🇮🇩 Indo Top Up", callback_data: "sub_indo" }]
                ]
            }
        });
    }

    // প্যাকেজ সিলেকশন কনফার্মেশন ও কোয়ান্টিটি স্ক্রিন
    if (data.startsWith("p_")) {
        const pkgSelected = data.replace("p_", "");
        session.package = pkgSelected; // এখানে আসল প্যাকেজ ভ্যালু স্টোর হচ্ছে
        session.step = 'STEP_3_QTY';

        bot.answerCallbackQuery(query.id);
        bot.deleteMessage(chatId, messageId).catch(() => {});

        return bot.sendMessage(chatId, `🔢 Enter Quantity for **${pkgSelected}** (Max 5):\n\n💡 1টি নিতে চাইলে নিচের Skip বাটনে চাপ দিন।`, quantityKeyboard);
    }

    bot.answerCallbackQuery(query.id);
}

module.exports = {
    initTopUp,
    processTopUpText,
    handleTopUpCallback
};
    
