const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// ===============================
// Middleware
// ===============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ===============================
// Static Files
// ===============================

app.use(express.static(path.join(__dirname, "public")));


// ===============================
// EJS Setup
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ===============================
// MongoDB Connection
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });


// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.render("home");
});


// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
