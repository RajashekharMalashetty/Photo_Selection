const express = require("express");
const crypto = require("crypto");

const auth = require("../middleware/auth");

const Client = require("../models/Client");
const Gallery = require("../models/Gallery");
const Photo = require("../models/Photo");

const upload = require("../middleware/upload");

const router = express.Router();


// ========================================
// ADMIN DASHBOARD
// ========================================

router.get("/admin", auth, async (req, res) => {

    try {

        const clients = await Client.find()
            .sort({ createdAt: -1 });

        res.render("admin/dashboard", {
            clients
        });

    } catch (error) {

        console.log(error);

        res.status(500).send(
            "Server Error"
        );

    }

});


// ========================================
// CREATE CLIENT PAGE
// ========================================

router.get(
    "/admin/clients/new",
    auth,
    (req, res) => {

        res.render("admin/clients/new");

    }
);


// ========================================
// CREATE CLIENT
// ========================================

router.post(
    "/admin/clients",
    auth,
    async (req, res) => {

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

            res.status(500).send(
                "Unable to create client"
            );

        }

    }
);


// ========================================
// CREATE GALLERY PAGE
// ========================================

router.get(
    "/admin/clients/:clientId/gallery/new",
    auth,
    async (req, res) => {

        try {

            const client = await Client.findById(
                req.params.clientId
            );


            if (!client) {
                return res.status(404).send(
                    "Client not found"
                );
            }


            res.render(
                "admin/gallery/new",
                {
                    client
                }
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                "Server Error"
            );

        }

    }
);


// ========================================
// CREATE GALLERY
// ========================================

router.post(
    "/admin/clients/:clientId/gallery",
    auth,
    async (req, res) => {

        try {

            const client = await Client.findById(
                req.params.clientId
            );


            if (!client) {
                return res.status(404).send(
                    "Client not found"
                );
            }


            const accessToken =
                crypto.randomBytes(24)
                    .toString("hex");


            const gallery = new Gallery({

                client: client._id,

                title: req.body.title,

                description:
                    req.body.description,

                accessToken

            });


            await gallery.save();


            res.redirect(
                `/admin/galleries/${gallery._id}`
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                "Unable to create gallery"
            );

        }

    }
);


// ========================================
// GALLERY MANAGEMENT PAGE
// ========================================

router.get(
    "/admin/galleries/:galleryId",
    auth,
    async (req, res) => {

        try {

            const gallery =
                await Gallery.findById(
                    req.params.galleryId
                ).populate("client");


            if (!gallery) {
                return res.status(404).send(
                    "Gallery not found"
                );
            }


            const photos =
                await Photo.find({
                    gallery: gallery._id
                }).sort({
                    createdAt: -1
                });


            res.render(
                "admin/gallery/show",
                {
                    gallery,
                    photos
                }
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                "Server Error"
            );

        }

    }
);


// ========================================
// UPLOAD MULTIPLE PHOTOS
// ========================================

router.post(
    "/admin/galleries/:galleryId/photos",
    auth,
    upload.array("photos", 100),

    async (req, res) => {

        try {

            const gallery =
                await Gallery.findById(
                    req.params.galleryId
                );


            if (!gallery) {
                return res.status(404).send(
                    "Gallery not found"
                );
            }


            const photos = req.files.map(file => ({

                gallery: gallery._id,

                imageUrl: file.path,

                publicId: file.filename,

                filename: file.originalname

            }));


            await Photo.insertMany(photos);


            res.redirect(
                `/admin/galleries/${gallery._id}`
            );

        } catch (error) {

            console.log(error);

            res.status(500).send(
                "Photo upload failed"
            );

        }

    }
);


module.exports = router;