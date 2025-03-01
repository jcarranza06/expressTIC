const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        max: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        max: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    available: {
        type: Number,
        required: true,
        min: 0
    },
    reserved: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    creation: {
        type: Date,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model("Offer", offerSchema);
