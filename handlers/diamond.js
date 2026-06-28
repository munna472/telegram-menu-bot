const { sendToGroup } = require('../utils/sender');

function handleDiamond(bot, msg) {
    sendToGroup(bot, "Adiamond");
}

module.exports = handleDiamond;
