const express = require("express");
const auth = require("../middleware/auth");
const Client = require("../models/Client");

const router = express.Router();


// ============================
// Admin Dashboard
// ============================

router.get("/admin", auth, async (req, res) => {

    try {

        const clients = await Client.find()
            .sort({ createdAt: -1 });

        res.render("admin/dashboard", {
            clients
        });

    } catch (error) {

        console.log(error);
        res.status(500).send("Server Error");

    }

});


// ============================
// Show Create Client Page
// ============================

router.get("/admin/clients/new", auth, (req, res) => {

    res.render("admin/clients/new");

});


// ============================
// Create Client
// ============================

router.post("/admin/clients", auth, async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            projectName
        } = req.body;


        const client = new Client({
            name,
            email,
            phone,
            projectName
        });


        await client.save();


        res.redirect("/admin");

    } catch (error) {

        console.log(error);

        res.status(500).send("Unable to create client");

    }

});


module.exports = router;