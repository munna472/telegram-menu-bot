const { GROUP_ID } = require("../config/config");

async function sendToGroup(bot, command) {
    try {
        await bot.sendMessage(GROUP_ID, command);

        return {
            success: true
        };

    } catch (err) {

        console.log(err);

        return {
            success: false
        };

    }
}

module.exports = {
    sendToGroup
};
