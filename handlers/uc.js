const { sendToGroup } = require('../utils/sender');
const { cancelKeyboard, mainKeyboard } = require('../keyboards/main');

function initUC(bot, chatId, ucUsers) {
    ucUsers[chatId] = { step: 'AWAITING_UC_INPUT' };
    bot.sendMessage(chatId, "Please enter UC command (Example: Auc 161 or Auc 161 4):", cancelKeyboard);
}

function processUC(bot, chatId, text, ucUsers) {
    if (text === "❌ Cancel Order") {
        delete ucUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }

    if (text.startsWith("Auc ")) {
        const parts = text.split(/\s+/);
        const qty = parseInt(parts[2]);
        if (qty && qty > 5) {
            return bot.sendMessage(chatId, "Maximum quantity is 5. Please try again:", cancelKeyboard);
        }
        sendToGroup(bot, text);
        delete ucUsers[chatId];
        return bot.sendMessage(chatId, "✅ Done", mainKeyboard);
    } else {
        const parts = text.split(/\s+/);
        const uc = parts[0];
        const qty = parseInt(parts[1]);
        if (qty && qty > 5) {
            return bot.sendMessage(chatId, "Maximum quantity is 5. Please try again:", cancelKeyboard);
        }
        let command = `Auc ${uc}`;
        if (qty) command += ` ${qty}`;
        sendToGroup(bot, command);
        delete ucUsers[chatId];
        return bot.sendMessage(chatId, "✅ Done", mainKeyboard);
    }
}

module.exports = {
    initUC,
    processUC
};
    
