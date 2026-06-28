const { sendToGroup } = require('../utils/sender');
const { cancelKeyboard, mainKeyboard } = require('../keyboards/main');

function initVerify(bot, chatId, verifyUsers) {
    verifyUsers[chatId] = { step: 'AWAITING_TRX' };
    bot.sendMessage(chatId, "💳 Send Money করার পর ট্রানজেকশন আইডি (TrxID) দিন বা Averify [trxID] লিখুন:", cancelKeyboard);
}

function processVerify(bot, chatId, text, verifyUsers) {
    if (text === "❌ Cancel Order") {
        delete verifyUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }
    
    let finalCommand = text;
    if (!text.startsWith("Averify ")) {
        finalCommand = `Averify ${text}`;
    }
    
    sendToGroup(bot, finalCommand);
    delete verifyUsers[chatId];
    bot.sendMessage(chatId, "✅ Done", mainKeyboard);
}

module.exports = {
    initVerify,
    processVerify
};
