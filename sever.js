const express = require("express");
const app = express();
app.use(express.json());

let keys = {};

// 👉 tạo key
app.get("/create", (req, res) => {
    const key = Math.random().toString(36).substring(2, 10);

    keys[key] = {
        used: false,
        startTime: null
    };

    res.json({ key });
});

// 👉 check key
app.post("/check", (req, res) => {
    const { key } = req.body;

    if (!keys[key]) {
        return res.json({ status: "invalid" });
    }

    const now = Date.now();
    const data = keys[key];

    // 👉 lần đầu dùng
    if (!data.used) {
        data.used = true;
        data.startTime = now;
        return res.json({ status: "ok" });
    }

    const diff = now - data.startTime;

    if (diff > 24 * 60 * 60 * 1000) {
        delete keys[key];
        return res.json({ status: "expired" });
    }

    res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Server chạy port 3000"));