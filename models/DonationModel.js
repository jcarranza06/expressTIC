const mongoose = require("mongoose");

const donationSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0.01 // Evita valores negativos o cero
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Relaciona la donación con un usuario
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Guarda la fecha y hora automáticamente
    }
});

module.exports = mongoose.model("Donation", donationSchema);
