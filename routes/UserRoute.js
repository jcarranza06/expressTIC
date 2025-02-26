const route = require('express').Router();

// Require the controllers
var userControllers = require('../controllers/UserController.js');
let auth = require("../middlewares/auth")

// Create endpoints for user
route.post('/signup', userControllers.signup);
route.post('/login', userControllers.login);

route.get('/getUser',  auth.authenticate, userControllers.getUser);

route.get("/authenticate", userControllers.authenticate);

module.exports = route;