const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    type: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model("User", userSchema);