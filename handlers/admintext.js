const { sendToGroup } = require('../utils/sender');
const { cancelKeyboard, mainKeyboard } = require('../keyboards/main');

function initAdminText(bot, chatId, adminUsers) {
    adminUsers[chatId] = { step: 'AWAITING_TEXT' };
    bot.sendMessage(chatId, "Type your command.", cancelKeyboard);
}

function processAdminText(bot, chatId, text, adminUsers) {
    if (text === "❌ Cancel Order") {
        delete adminUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }

    sendToGroup(bot, text);
    delete adminUsers[chatId];
    bot.sendMessage(chatId, "✅ Done", mainKeyboard);
}

module.exports = {
    initAdminText,
    processAdminText
};
