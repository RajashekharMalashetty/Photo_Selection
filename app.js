const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const clientRoutes = require("./routes/client");

dotenv.config();

const app = express();


// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Session

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);


// Static files

app.use(express.static(path.join(__dirname, "public")));


// EJS

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// MongoDB

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });


// Routes

app.get("/", (req, res) => {
    res.render("home");
});

app.use(authRoutes);
app.use(adminRoutes);
app.use(clientRoutes);

// Server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});