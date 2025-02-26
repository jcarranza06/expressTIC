const route = require('express').Router();

let offerController = require("../controllers/OfferController")
let auth = require("../middlewares/auth")

// Create endpoints
route.post('/create', auth.authenticate, offerController.create);
route.get('/getByUser', auth.authenticate, offerController.getByUser);
route.delete('/delete/:id', auth.authenticate, offerController.delete);
route.patch('/changeAvailableAmount/:id', auth.authenticate, offerController.changeAvailableAmount);

route.get('/getAllAvailable', offerController.getAllAvailable);

module.exports = route;