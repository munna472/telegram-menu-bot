const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Apacks");

    await bot.sendMessage(
        chatId,
        "✅ Packs command sent successfully."
    );

};
