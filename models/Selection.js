const mongoose = require("mongoose");

const selectionSchema = new mongoose.Schema(
    {
        gallery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gallery",
            required: true
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        selectedPhotos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Photo"
            }
        ],

        submitted: {
            type: Boolean,
            default: false
        },

        submittedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Selection", selectionSchema);
