const { sendToGroup } = require('../utils/sender');

function handleMyInfo(bot, msg) {
    sendToGroup(bot, "Amyinfo");
}

module.exports = handleMyInfo;
