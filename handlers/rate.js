const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Arate");

    await bot.sendMessage(
        chatId,
        "✅ Rate command sent successfully."
    );

};
