// Import the models
const Offer = require('../models/OfferModel');

// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

// Register a new offer
exports.create = async (req, res) => {
    const user = req.user._id;
    const { name, description, price, available, expiration, image, location } = req.body;

    const newOffer = new Offer({
        name,
        description,
        price,
        available,
        creation: new Date(),
        expiration,
        image,
        location,
        user,
        businessName: req.user.username
    });

    await newOffer.save();
    res.status(201).json({ message: "Offer created successfully", offer: newOffer });
};

exports.getAllAvailable = async (req, res) => {
    const offers = await Offer.find({ available: { $gt: 0 } });
    res.json(offers);
};

exports.getByUser = async (req, res) => {
    const userId = req.user._id;
    const offers = await Offer.find({ user: userId });
    res.json(offers);
};


exports.delete = async (req, res) => {
    const offerId = req.params.id;
    const userId = req.user._id;

    const offer = await Offer.findOne({ _id: offerId, user: userId });
    if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
    }

    await Offer.findByIdAndDelete(offerId);
    res.json({ message: "Offer deleted successfully" });
}

exports.changeAvailableAmount = async(req,res)=>{
    const offerId = req.params.id;
    const userId = req.user._id;

    const { change } = req.body;

    const offer = await Offer.findOne({ _id: offerId, user: userId });
    if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
    }

    offer.available += change;

    await offer.save();
    res.json({ message: "Offer availability updated successfully", offer });
}


