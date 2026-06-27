const { sendToGroup } = require("../utils/sender");

const verifyUsers = {};

module.exports = {

    verifyUsers,

    async start(bot, msg) {

        verifyUsers[msg.chat.id] = true;

        await bot.sendMessage(
            msg.chat.id,
            "📥 Send your Transaction ID (TRX ID).\n\nExample:\nBG6JS8JD"
        );

    },

    async receive(bot, msg) {

        const chatId = msg.chat.id;

        if (!verifyUsers[chatId]) return false;

        const trx = msg.text.trim();

        await sendToGroup(bot, `Averify ${trx}`);

        await bot.sendMessage(
            chatId,
            "✅ Verification request sent successfully."
        );

        delete verifyUsers[chatId];

        return true;

    }

};
