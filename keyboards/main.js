const mainKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "👤 Profile" }, { text: "💰 Balance" }],
            [{ text: "💳 Add Balance" }, { text: "✅ Verify" }],
            [{ text: "💎 UC Purchase" }, { text: "⚡ Auto TopUp" }],
            [{ text: "📦 Packs" }, { text: "📊 Rate" }],
            [{ text: "🔄 Due Clear" }, { text: "ℹ️ My Info" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    }
};

// এখানে ছোট হাতের অক্ষরে এবং অবজেক্ট আকারে এক্সপোর্ট করা হলো
module.exports = { mainKeyboard };
