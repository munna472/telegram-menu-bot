const { sendToGroup } = require('../utils/sender');

function handleProfile(bot, msg) {
    sendToGroup(bot, "Aprofile");
}

module.exports = handleProfile;
