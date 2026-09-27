const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/candle-click", (req, res) => {
    const { date, time } = req.body;

    console.log("\n========================================");
    console.log("🎂 BLOW THE CANDLE CLICKED!");
    console.log("📅 Date:", date);
    console.log("🕐 Time:", time);
    console.log("========================================\n");

    res.json({
        success: true,
        message: "Click received"
    });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log("Waiting for Blow the Candle click...\n");
});