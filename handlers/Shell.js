const { sendToGroup } = require('../utils/sender');
const { cancelKeyboard, mainKeyboard } = require('../keyboards/main');

function initShell(bot, chatId, shellUsers) {
    shellUsers[chatId] = { step: 'AWAITING_SHELL_INPUT' };
    bot.sendMessage(chatId, "Please enter Garena Shell command (Example: Ashell 50 or Ashell 330 2):", cancelKeyboard);
}

function processShell(bot, chatId, text, shellUsers) {
    if (text === "❌ Cancel Order") {
        delete shellUsers[chatId];
        return bot.sendMessage(chatId, "❌ Cancelled", mainKeyboard);
    }

    if (text.startsWith("Ashell ")) {
        const parts = text.split(/\s+/);
        const qty = parseInt(parts[2]);
        if (qty && qty > 5) {
            return bot.sendMessage(chatId, "Maximum quantity is 5. Please try again:", cancelKeyboard);
        }
        sendToGroup(bot, text);
        delete shellUsers[chatId];
        return bot.sendMessage(chatId, "✅ Done", mainKeyboard);
    } else {
        const parts = text.split(/\s+/);
        const amount = parts[0];
        const qty = parseInt(parts[1]);
        if (qty && qty > 5) {
            return bot.sendMessage(chatId, "Maximum quantity is 5. Please try again:", cancelKeyboard);
        }
        let command = `Ashell ${amount}`;
        if (qty) command += ` ${qty}`;
        sendToGroup(bot, command);
        delete shellUsers[chatId];
        return bot.sendMessage(chatId, "✅ Done", mainKeyboard);
    }
}

module.exports = {
    initShell,
    processShell
};
                               
