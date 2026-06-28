const { sendToGroup } = require('../utils/sender');

function handleRate(bot, msg) {
    sendToGroup(bot, "Arate");
}

module.exports = handleRate;
