const { sendToGroup } = require('../utils/sender');

function handleDue(bot, msg) {
    sendToGroup(bot, "Adue");
}

module.exports = handleDue;
