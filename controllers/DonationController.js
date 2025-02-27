// Import the models
const Donation = require('../models/DonationModel')
const CommonDonationFund = require('../models/CommonDonationFundSchema')
const Offer = require('../models/OfferModel')
const Reservation = require('../models/ReservationModel')
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');
// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

// Register a new offer
exports.donate = async (req, res) => {
    const { amount } = req.body;

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "The amount must be a positive number" });
    }

    const fund = await CommonDonationFund.findById("common_fund");

    let newAmount = amount;
    if (fund) {
        newAmount += fund.amount; // Add to the existing amount
    }

    const updatedFund = await CommonDonationFund.findOneAndUpdate(
        { _id: "common_fund" },
        { amount: newAmount },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Amount added successfully", data: updatedFund });
};

exports.requestDonation = async (req, res) => {
    const receiver = req.user._id;
    const { offerId, collection } = req.body;

    // Validar que se envíen los datos requeridos
    if (!receiver || !offerId || !collection) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Buscar la oferta
    const offer = await Offer.findById(offerId);
    if (!offer) {
        return res.status(404).json({ error: "Oferta no encontrada" });
    }

    // Verificar si hay unidades disponibles
    if (offer.available <= 0) {
        return res.status(400).json({ error: "No hay unidades disponibles para esta oferta" });
    }

    // Calcular la fecha de hace 7 días
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Obtener la suma de todas las donaciones recibidas por el usuario en la última semana
    const totalReceived = await Donation.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(receiver), date: { $gte: new Date(lastWeek) } } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Si ha recibido más de 50,000 en la última semana, se rechaza la donación
    if (totalReceived.length > 0 && totalReceived[0].total >= 50000) {
        return res.status(400).json({ error: "El usuario ha recibido más de 50,000 en donaciones esta semana." });
    }

    // Buscar el fondo común
    const commonDonationFund = await CommonDonationFund.findOne();
    if (!commonDonationFund) {
        return res.status(500).json({ error: "Fondo común no encontrado" });
    }

    // Verificar si el fondo tiene suficiente dinero
    if (commonDonationFund.amount < offer.price) {
        return res.status(400).json({ error: "El fondo común no tiene suficiente dinero" });
    }

    // Descontar el dinero del fondo
    commonDonationFund.amount -= offer.price;
    await commonDonationFund.save();

    // Restar en `available` y sumar en `reserved`
    offer.available -= 1;
    offer.reserved += 1;
    await offer.save();

    // Crear la reserva
    const newReservation = new Reservation({
        receiver,
        collection,
        offer: offerId,
        paymentType: "Donacion",
        quantity: 1
    });

    await newReservation.save();

    const newDonation = new Donation({
        amount: offer.price,
        user: receiver
    });
    await newDonation.save();

    res.status(201).json({ message: "Reserva creada exitosamente con fondos de donación", reservation: newReservation });
};

