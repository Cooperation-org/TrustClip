const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const { text, currentPageUrl } = req.body;
    console.log("Page URL", currentPageUrl);
    if (!text) {
        return res.status(400).json({ error: "No text provided" });
    }

    console.log(`Received claim: ${text}`);

    res.status(200).send({ message: "Claim received successfully" });
});

module.exports = router;
