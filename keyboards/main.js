module.exports = {
    reply_markup: {
        keyboard: [
            [
                { text: "👤 Profile" },
                { text: "💰 Balance" }
            ],
            [
                { text: "💳 Add Balance" },
                { text: "✅ Verify" }
            ],
            [
                { text: "💎 UC Purchase" },
                { text: "⚡ Auto TopUp" }
            ],
            [
                { text: "📦 Packs" },
                { text: "📊 Rate" }
            ],
            [
                { text: "🔄 Due Clear" },
                { text: "ℹ️ My Info" }
            ]
        ],
        resize_keyboard: true,
        persistent: true
    }
};
