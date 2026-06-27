const { sendToGroup } = require("../utils/sender");

const ucUsers = {};

module.exports = {

    ucUsers,

    async start(bot, msg) {

        ucUsers[msg.chat.id] = {
            step: "uc"
        };

        await bot.sendMessage(
            msg.chat.id,
            "💎 Enter UC amount.\n\nExample:\n161"
        );

    },

    async receive(bot, msg) {

        const chatId = msg.chat.id;

        if (!ucUsers[chatId]) return false;

        const data = ucUsers[chatId];

        if (data.step === "uc") {

            data.uc = msg.text.trim();

            data.step = "qty";

            return bot.sendMessage(
                chatId,
                "📦 Enter Quantity.\n\nSend 1 or leave blank."
            );

        }

        if (data.step === "qty") {

            const qty = msg.text.trim();

            let command;

            if (!qty || qty === "1") {

                command = `Auc ${data.uc}`;

            } else {

                command = `Auc ${data.uc} ${qty}`;

            }

            await sendToGroup(bot, command);

            await bot.sendMessage(
                chatId,
                `✅ Sent:\n${command}`
            );

            delete ucUsers[chatId];

            return true;

        }

    }

};
