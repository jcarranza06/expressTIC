const route = require('express').Router();
const catchErrors = require('../decorators/catchErrors.js');

let offerController = require("../controllers/OfferController");
let auth = require("../middlewares/auth")

// Create endpoints
route.post('/create', catchErrors(auth.authenticate), catchErrors(offerController.create));
route.get('/getByUser', catchErrors(auth.authenticate), catchErrors(offerController.getByUser));
route.delete('/delete/:id', catchErrors(auth.authenticate), catchErrors(offerController.delete));
route.patch('/changeAvailableAmount/:id', catchErrors(auth.authenticate), catchErrors(offerController.changeAvailableAmount));

route.get('/getAllAvailable', catchErrors(offerController.getAllAvailable));

module.exports = route;