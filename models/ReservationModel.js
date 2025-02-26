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
    collection: {
        type: Date,
        required: true
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        required: true
    },
    paymentType: {
        type: String,
        enum: ["contraentrega", "virtual"],
        required: true
    }
});

module.exports = mongoose.model("Reservation", reservationSchema);