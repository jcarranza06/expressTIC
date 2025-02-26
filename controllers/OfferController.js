// Imports

// Import the models
const Offer = require('../models/OfferModel');
// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

// Register a new offer
exports.create = async (req, res) => {

    const { name, description, price, available, expiration, image, user } = req.body;

    const newOffer = new Offer({
        name,
        description,
        price,
        available,
        creation: new Date(),
        expiration,
        image,
        user
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer created successfully", offer: newOffer });
};

exports.getAllAvailable = async (req, res) => {

    const offers = await Offer.find({ available: { $gt: 0 } });

    if (offers.length === 0) {
        return res.status(404).json({ message: "No available offers found" });
    }

    res.json(offers);
};

exports.getByUser = async (req, res) => {

    const userId = req.user._id;
    const offers = await Offer.find({ user: userId });

    if (offers.length === 0) {
        return res.status(404).json({ message: "No offers found for this user" });
    }

    res.json(offers);
};




