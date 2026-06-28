const config = require('../config/config');

function sendToGroup(bot, text) {
    return bot.sendMessage(config.GROUP_ID, text)
        .catch(err => {
            console.error("Error forwarding to group:", err.message);
        });
}

module.exports = {
    sendToGroup
};
