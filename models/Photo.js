const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
    {
        gallery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gallery",
            required: true
        },

        imageUrl: {
            type: String,
            required: true
        },

        publicId: {
            type: String
        },

        filename: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Photo", photoSchema);
