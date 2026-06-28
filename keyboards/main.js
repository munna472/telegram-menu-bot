const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👤 Profile" }, { text: "💰 Balance" }, { text: "📉 Due Check" }],
            [{ text: "💳 Add Balance" }, { text: "✅ Verify TrxID" }],
            [{ text: "⚡ Auto TopUp" }, { text: "🎮 UC Purchase" }, { text: "🎯 Garena Shell" }],
            [{ text: "📦 Packs Rate" }, { text: "📊 General Rate" }, { text: "💎 Adiamond" }],
            [{ text: "ℹ️ My Info" }, { text: "🔄 Due Clear" }, { text: "📝 Admin Text" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

const quantityKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "1" }, { text: "2" }, { text: "3" }],
            [{ text: "4" }, { text: "5" }],
            [{ text: "⏭️ Skip (1x)" }],
            [{ text: "❌ Cancel Order" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

const cancelKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "❌ Cancel Order" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

module.exports = {
    mainKeyboard,
    quantityKeyboard,
    cancelKeyboard
};
