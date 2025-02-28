const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    creation: {
        type: Date,
        default: Date.now,
        required: true
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        required: true
    },
    paymentType: {
        type: String,
        enum: ["contraentrega", "virtual", "Donacion"],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

module.exports = mongoose.model("Reservation", reservationSchema);