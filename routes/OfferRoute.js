const route = require('express').Router();

let offerController = require("../controllers/OfferController")
let auth = require("../middlewares/auth")
// Create CRUD endpoints for user
route.post('/create', auth.authenticate, offerController.create);
route.get('/getAllAvailable', offerController.getAllAvailable);
route.get('/getByUser', auth.authenticate, offerController.getByUser);

module.exports = route;