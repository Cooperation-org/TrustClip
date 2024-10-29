const express = require("express");
const bodyParser = require("body-parser");
const bookmarkletRoute = require("./routes/bookmarkletRoute.js");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
app.use("/bookmarklet", bookmarkletRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
