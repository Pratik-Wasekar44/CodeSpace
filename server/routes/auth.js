const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Missing fields" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: "Username taken" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET || "collabeditorsecret", { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true }).json({ success: true, username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET || "collabeditorsecret", { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true }).json({ success: true, username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/me", (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.json({ loggedIn: false });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "collabeditorsecret");
        res.json({ loggedIn: true, username: decoded.username });
    } catch (err) {
        res.json({ loggedIn: false });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token").json({ success: true });
});

module.exports = router;
