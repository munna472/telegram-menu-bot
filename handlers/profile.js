const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Aprofile");

    await bot.sendMessage(
        chatId,
        "✅ Profile command sent successfully."
    );

};
