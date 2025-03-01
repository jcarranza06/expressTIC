// Import the models
const Reservation = require('../models/ReservationModel')
const Offer = require("../models/OfferModel")

// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

exports.makeReservation = async (req, res) => {
    const receiver = req.user._id;
    const { offerId, isPaid, quantity } = req.body;

    // Validar que se envíen los datos requeridos
    if (!receiver || !offerId || isPaid === undefined || !quantity) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Buscar la oferta
    const offer = await Offer.findById(offerId);
    if (!offer) {
        return res.status(404).json({ error: "Oferta no encontrada" });
    }

    // Verificar si hay unidades disponibles
    if (offer.available < quantity) {
        return res.status(400).json({ error: "No hay unidades disponibles para esta oferta" });
    }

    // Reducir la cantidad disponible de la oferta
    offer.available -= quantity;
    offer.reserved += quantity;
    await offer.save();

    // Crear la reserva
    const newReservation = new Reservation({
        receiver,
        offer: offerId,
        isPaid,
        quantity
    });

    await newReservation.save();
    res.status(201).json({ message: "Reserva creada exitosamente", reservation: newReservation });
};


// Get all reservations from a client
exports.getByUser = async (req, res) => {
    const userId = req.user._id;

    const reservations = await Reservation.find({ receiver: userId })
        .populate("offer", "name price description image location expiration")
        .populate("receiver", "username")
        .exec();

    res.status(200).json(reservations);
};

// Get all reservations from a business
exports.getByBusiness = async (req, res) => {
    const businessId = req.user._id;

    const offers = await Offer.find({ user: businessId }, "_id");

    const reservations = await Reservation.find({ offer: { $in: offers } })
        .populate("offer", "name price description image location expiration")
        .populate("receiver", "username")
        .exec();

    res.status(200).json(reservations);
};

// Delete a reservation (it needs to be done by the business that owns the offer)
exports.deleteReservation = async (req, res) => {
    const businessId = req.user._id;
    const { reservationId } = req.params;

    // Check if the reservation exists
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    // Get the offer that the reservation belongs to
    const offer = await Offer.findById(reservation.offer);
    if (!offer) return res.status(404).json({ error: "Offer not found" });

    // Check if the business owns the offer
    if (offer.user.toString() !== businessId.toString()) {
        return res.status(403).json({ error: "You are not allowed to delete this reservation" });
    }

    // Delete the reservation
    await reservation.deleteOne();

    // Decrease the reserved quantity in the offer
    offer.reserved -= reservation.quantity;
    await offer.save();

    res.status(200).json({ message: "Reservation deleted successfully" });
}
