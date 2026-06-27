const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Abalance");

    await bot.sendMessage(
        chatId,
        "✅ Balance command sent successfully."
    );

};
