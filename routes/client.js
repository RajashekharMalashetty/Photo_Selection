const express = require("express");

const Gallery = require("../models/Gallery");
const Photo = require("../models/Photo");

const router = express.Router();


// ========================================
// PRIVATE CLIENT GALLERY
// ========================================

router.get("/gallery/:accessToken", async (req, res) => {

    try {

        const gallery = await Gallery.findOne({
            accessToken: req.params.accessToken,
            isActive: true
        }).populate("client");


        if (!gallery) {

            return res.status(404).render(
                "client/not-found"
            );

        }


        const photos = await Photo.find({
            gallery: gallery._id
        }).sort({
            createdAt: 1
        });


        res.render("client/gallery", {
            gallery,
            photos
        });


    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Unable to load gallery"
        );

    }

});


module.exports = router;