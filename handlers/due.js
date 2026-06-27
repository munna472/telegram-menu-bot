const { sendToGroup } = require("../utils/sender");

module.exports = async (bot, msg) => {

    const chatId = msg.chat.id;

    await sendToGroup(bot, "Aresetbaki");

    await bot.sendMessage(
        chatId,
        "✅ Due Clear command sent successfully."
    );

};
