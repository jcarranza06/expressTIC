const route = require('express').Router();

let reservationController = require("../controllers/ReservationController")
let auth = require("../middlewares/auth")
// Create CRUD endpoints for user
route.post('/makeReservation', auth.authenticate, reservationController.makeReservation);
route.get('/getByUser', auth.authenticate, reservationController.getByUser);

module.exports = route;