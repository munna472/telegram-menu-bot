const { sendToGroup } = require('../utils/sender');

function handlePacks(bot, msg) {
    sendToGroup(bot, "Apacks");
}

module.exports = handlePacks;
