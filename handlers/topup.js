const { cancelKeyboard, quantityKeyboard, mainKeyboard } = require('../keyboards/main');
const { sendToGroup } = require('../utils/sender');

function initTopUp(bot, chatId, topupUsers) {
    topupUsers[chatId] = { step: 'STEP_1_UID', uid: '', package: '', qty: '' };
    bot.sendMessage(chatId, "Enter UID (6-15 digits, numbers only):", cancelKeyboard);
}

function processTopUpText(bot, chatId, text, topupUsers) {
    const session = topupUsers[chatId];
    if (!session) return;

    if (text === "❌ Cancel Order") {
        delete topupUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }

    if (session.step === 'STEP_1_UID') {
        if (!/^\d{6,15}$/.test(text)) {
            return bot.sendMessage(chatId, "Invalid UID. Must be numbers only and length 6-15. Try again:", cancelKeyboard);
        }
        session.uid = text;
        session.step = 'STEP_2_PACKAGE';

        const inlineOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 Unipin Diamond", callback_data: "sub_unipin" }],
                    [{ text: "🪪 Membership", callback_data: "sub_member" }],
                    [{ text: "🐚 Shell Packs", callback_data: "sub_shell" }],
                    [{ text: "🎮 Level Up", callback_data: "sub_level" }],
                    [{ text: "🇮🇩 Indo", callback_data: "sub_indo" }]
                ]
            }
        };
        return bot.sendMessage(chatId, "Select Category:", inlineOptions);
    }

    if (session.step === 'STEP_3_QTY') {
        let qtyVal = text;
        if (qtyVal === "⏭️ Skip (1x)" || qtyVal === "1") {
            qtyVal = "";
        } else {
            const parsedQty = parseInt(qtyVal);
            if (isNaN(parsedQty) || parsedQty < 1 || parsedQty > 5) {
                return bot.sendMessage(chatId, "Maximum quantity is 5. Please select or type 1-5:", quantityKeyboard);
            }
        }

        let finalCommand = `Atp ${session.uid} ${session.package}`;
        if (qtyVal) {
            finalCommand += ` ${qtyVal}`;
        }

        sendToGroup(bot, finalCommand);
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

    if (data === "sub_unipin") {
        return bot.editMessageText("Select Unipin Diamond Package:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "20", callback_data: "p_20" }, { text: "25", callback_data: "p_25" }],
                    [{ text: "36", callback_data: "p_36" }, { text: "50", callback_data: "p_50" }],
                    [{ text: "80", callback_data: "p_80" }, { text: "115", callback_data: "p_115" }],
                    [{ text: "160", callback_data: "p_160" }, { text: "240", callback_data: "p_240" }],
                    [{ text: "405", callback_data: "p_405" }, { text: "610", callback_data: "p_610" }],
                    [{ text: "810", callback_data: "p_810" }, { text: "1240", callback_data: "p_1240" }],
                    [{ text: "1625", callback_data: "p_1625" }, { text: "2530", callback_data: "p_2530" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_member") {
        return bot.editMessageText("Select Membership Package:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "161", callback_data: "p_161" }, { text: "800", callback_data: "p_800" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_shell") {
        return bot.editMessageText("Select Shell Packs:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "lite", callback_data: "p_lite" }, { text: "evo3", callback_data: "p_evo3" }],
                    [{ text: "evo7", callback_data: "p_evo7" }, { text: "evo30", callback_data: "p_evo30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_level") {
        return bot.editMessageText("Select Level Up Package:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "lvl6", callback_data: "p_lvl6" }, { text: "lvl10", callback_data: "p_lvl10" }],
                    [{ text: "lvl15", callback_data: "p_lvl15" }, { text: "lvl20", callback_data: "p_lvl20" }],
                    [{ text: "lvl25", callback_data: "p_lvl25" }, { text: "lvl30", callback_data: "p_lvl30" }],
                    [{ text: "lvlall", callback_data: "p_lvlall" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "sub_indo") {
        return bot.editMessageText("Select Indo Package:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "indo5", callback_data: "p_indo5" }, { text: "indo50", callback_data: "p_indo50" }],
                    [{ text: "indo70", callback_data: "p_indo70" }, { text: "indo140", callback_data: "p_indo140" }],
                    [{ text: "indo355", callback_data: "p_indo355" }, { text: "indo720", callback_data: "p_indo720" }],
                    [{ text: "indo7290", callback_data: "p_indo7290" }, { text: "indoweekly", callback_data: "p_indoweekly" }],
                    [{ text: "indomonthly", callback_data: "p_indomonthly" }, { text: "indobp", callback_data: "p_indobp" }],
                    [{ text: "indolvl6", callback_data: "p_indolvl6" }, { text: "indolvl10", callback_data: "p_indolvl10" }],
                    [{ text: "indolvl15", callback_data: "p_indolvl15" }, { text: "indolvl20", callback_data: "p_indolvl20" }],
                    [{ text: "indolvl25", callback_data: "p_indolvl25" }, { text: "indolvl30", callback_data: "p_indolvl30" }],
                    [{ text: "⬅️ Back", callback_data: "back_to_main_cat" }]
                ]
            }
        });
    }

    if (data === "back_to_main_cat") {
        return bot.editMessageText("Select Category:", {
            chat_id: chatId, message_id: messageId,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "💎 Unipin Diamond", callback_data: "sub_unipin" }],
                    [{ text: "🪪 Membership", callback_data: "sub_member" }],
                    [{ text: "🐚 Shell Packs", callback_data: "sub_shell" }],
                    [{ text: "🎮 Level Up", callback_data: "sub_level" }],
                    [{ text: "🇮🇩 Indo", callback_data: "sub_indo" }]
                ]
            }
        });
    }

    if (data.startsWith("p_")) {
        const pkgSelected = data.replace("p_", "");
        session.package = pkgSelected;
        session.step = 'STEP_3_QTY';

        bot.answerCallbackQuery(query.id);
        bot.deleteMessage(chatId, messageId).catch(() => {});

        return bot.sendMessage(chatId, `Select or Type Quantity for ${pkgSelected} (Max 5):`, quantityKeyboard);
    }

    bot.answerCallbackQuery(query.id);
}

module.exports = {
    initTopUp,
    processTopUpText,
    handleTopUpCallback
};
