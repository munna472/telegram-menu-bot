require("dotenv").config();

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    GROUP_ID: process.env.GROUP_ID,
    PORT: process.env.PORT || 10000
};
