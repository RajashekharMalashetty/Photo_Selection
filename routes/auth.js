const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// ============================
// Login Page
// ============================

router.get("/admin/login", (req, res) => {
    res.render("auth/login", {
        error: null
    });
});


// ============================
// Login
// ============================

router.post("/admin/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await User.findOne({
            email: email.toLowerCase()
        });

        if (!admin) {
            return res.render("auth/login", {
                error: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.render("auth/login", {
                error: "Invalid email or password"
            });
        }

        req.session.adminId = admin._id;

        res.redirect("/admin");

    } catch (error) {

        console.log(error);

        res.render("auth/login", {
            error: "Something went wrong"
        });
    }
});


// ============================
// Logout
// ============================

router.get("/admin/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/admin/login");
    });

});


module.exports = router;