const route = require('express').Router();
const catchErrors = require('../decorators/catchErrors.js');

let reservationController = require("../controllers/ReservationController");
let auth = require("../middlewares/auth")

// Create CRUD endpoints
route.post('/makeReservation', catchErrors(auth.authenticate), catchErrors(reservationController.makeReservation));
route.get('/getByUser', catchErrors(auth.authenticate), catchErrors(reservationController.getByUser));
route.get('/getByBusiness', catchErrors(auth.authenticate), catchErrors(reservationController.getByBusiness));

route.delete('/deleteReservation/:reservationId', catchErrors(auth.authenticate), catchErrors(reservationController.deleteReservation));

module.exports = route;