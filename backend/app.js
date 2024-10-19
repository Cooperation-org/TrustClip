const express = require("express");
const bodyParser = require("body-parser");
const claimRoute = require("./routes/claimRoute.js");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/claimRoute", claimRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
