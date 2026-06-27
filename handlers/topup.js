const { sendToGroup } = require("../utils/sender");

const topupUsers = {};

const packages = [
  "25",
  "50",
  "115",
  "240",
  "610",
  "1240",
  "2530",

  "weekly",
  "monthly",
  "lite",

  "evo3",
  "evo7",
  "evo30",

  "lvl6",
  "lvl10",
  "lvl15",
  "lvl20",
  "lvl25",
  "lvl30",
  "lvlall",

  "indo5",
  "indo50",
  "indo70",
  "indo140",
  "indo355",
  "indo720",
  "indo7290",

  "indoweekly",
  "indomonthly",
  "indobp",

  "indolvl6",
  "indolvl10",
  "indolvl15",
  "indolvl20",
  "indolvl25",
  "indolvl30"
];

module.exports = {

  topupUsers,

  async start(bot, msg) {

    const chatId = msg.chat.id;

    topupUsers[chatId] = {
      step: "uid",
      uid: "",
      package: "",
      qty: 1
    };

    await bot.sendMessage(
      chatId,
      "🎮 Send Player UID"
    );

  },

  async receive(bot, msg) {

    const chatId = msg.chat.id;

    if (!topupUsers[chatId]) return false;

    const data = topupUsers[chatId];

    const text = msg.text.trim().toLowerCase();

    // =====================
    // CANCEL CHECK
    // =====================
    if (text === "/cancel" || text === "cancel") {

      delete topupUsers[chatId];

      await bot.sendMessage(
        chatId,
        "❌ Top-Up Cancelled."
      );

      return true;

    }

    // =====================
    // STEP 1 : UID
    // =====================

    if (data.step === "uid") {

      if (!/^[0-9]{6,15}$/.test(text)) {

        return bot.sendMessage(
          chatId,
          "❌ Invalid UID.\n\nPlease send a valid Player UID."
        );

      }

      data.uid = text;

      data.step = "package";

      return bot.sendMessage(
        chatId,
`📦 Send Package

Examples

25
50
115
240
610
1240
2530

weekly
monthly
lite

evo3
evo7
evo30

lvl6
lvl10
lvl15
lvl20
lvl25
lvl30
lvlall

indo5
indo50
indo70
indo140
indo355
indo720
indo7290

indoweekly
indomonthly
indobp

Type package exactly as above.`
      );

    }

    // =====================
    // STEP 2 : PACKAGE
    // =====================

    if (data.step === "package") {

      if (!packages.includes(text)) {

        return bot.sendMessage(
          chatId,
          `❌ Invalid Package.

Please send a valid package.

Example:

610
weekly
monthly
lite
evo3
lvl10
indo140`
        );

      }

      data.package = text;

      data.step = "qty";

      return bot.sendMessage(
        chatId,
`📦 Quantity

Send a number between 1 and 5.

Examples

1
2
3
4
5

Or type

skip

If you want only one top-up.`
      );

    }

    // =====================
    // STEP 3 : QUANTITY
    // =====================

    if (data.step === "qty") {

      // Skip = 1 TopUp
      if (text === "skip") {

        data.qty = 1;

        data.step = "finish";

      } else {

        if (!/^[0-9]+$/.test(text)) {

          return bot.sendMessage(
            chatId,
            "❌ Invalid Quantity.\n\nSend 1 to 5 or type skip."
          );

        }

        const qty = parseInt(text);

        if (qty < 1 || qty > 5) {

          return bot.sendMessage(
            chatId,
            "❌ Quantity must be between 1 and 5."
          );

        }

        data.qty = qty;

        data.step = "finish";

      }

    }

    // =====================
    // STEP 4 : FINISH
    // =====================

    if (data.step === "finish") {

      let command;

      if (data.qty === 1) {

        command = `Atp ${data.uid} ${data.package}`;

      } else {

        command = `Atp ${data.uid} ${data.package} ${data.qty}`;

      }

      const result = await sendToGroup(bot, command);

      if (!result.success) {

        await bot.sendMessage(
          chatId,
          "❌ Failed to send request.\nPlease try again."
        );

        delete topupUsers[chatId];

        return true;

      }

      await bot.sendMessage(
        chatId,
`✅ Top-Up Request Sent Successfully!

━━━━━━━━━━━━━━

🎮 UID : ${data.uid}

📦 Package : ${data.package}

🔢 Quantity : ${data.qty}

━━━━━━━━━━━━━━

📨 Command

${command}`
      );

      delete topupUsers[chatId];

      return true;

    }

    return false;

  }

};
  
