const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    // process the claim, save to a database for further processing
    console.log(`Received claim: ${text}`);

    res.json({ message: "Claim received successfully" });
});

module.exports = router;
