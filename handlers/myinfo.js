const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Amyinfo");

    await bot.sendMessage(
        chatId,
        "✅ My Info command sent successfully."
    );

};
