// Import the models
const Reservation = require('../models/ReservationModel')
const Offer = require("../models/OfferModel")

// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

exports.makeReservation = async (req, res) => {

    const { receiver, offerId, collection, paymentType } = req.body;

    // Validar que se envíen los datos requeridos
    if (!receiver || !offerId || !collection || !paymentType) {
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

    // Reducir la cantidad disponible de la oferta
    offer.available -= 1;
    await offer.save();

    // Crear la reserva
    const newReservation = new Reservation({
        receiver,
        collection,
        offer: offerId,
        paymentType
    });

    await newReservation.save();
    res.status(201).json({ message: "Reserva creada exitosamente", reservation: newReservation });
};

exports.getByUser = async (req, res) => {

    const userId = req.user._id;

    const reservations = await Reservation.find({ receiver: userId })
        .populate("receiver", "username email") // Obtiene detalles del usuario
        .populate("offer", "name price available") // Obtiene detalles de la oferta
        .exec();

    if (reservations.length === 0) {
        return res.status(404).json({ message: "No reservations found for this user" });
    }

    res.status(200).json(reservations);
};