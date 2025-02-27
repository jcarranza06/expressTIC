const route = require('express').Router();
const catchErrors = require('../decorators/catchErrors.js');

let donationController = require('../controllers/DonationController.js')
let auth = require("../middlewares/auth")

// Create endpoints
route.post('/donate', catchErrors(auth.authenticate), catchErrors(donationController.donate));
route.post('/requestDonation', catchErrors(auth.authenticate), catchErrors(donationController.requestDonation));

module.exports = route;