const { sendToGroup } = require('../utils/sender');

function handleBalance(bot, msg) {
    sendToGroup(bot, "Abalance");
}

module.exports = handleBalance;
