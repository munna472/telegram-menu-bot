const { sendToGroup } = require('../utils/sender');
const { cancelKeyboard, mainKeyboard } = require('../keyboards/main');

function initVerify(bot, chatId, verifyUsers) {
    verifyUsers[chatId] = { step: 'AWAITING_TRX' };
    bot.sendMessage(chatId, "Please type your TRX ID:", cancelKeyboard);
}

function processVerify(bot, chatId, text, verifyUsers) {
    if (text === "❌ Cancel Order") {
        delete verifyUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }
    
    let trx = text;
    if (text.startsWith("Averify ")) {
        trx = text.replace("Averify ", "").trim();
    }
    
    sendToGroup(bot, `Averify ${trx}`);
    delete verifyUsers[chatId];
    bot.sendMessage(chatId, "✅ Done", mainKeyboard);
}

module.exports = {
    initVerify,
    processVerify
};
