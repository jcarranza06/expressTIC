const route = require('express').Router();

// Require the controllers
var userControllers = require('../controllers/UserController.js');

// Create CRUD endpoints for user
route.post('/signup', userControllers.signup);
route.get('/getUser', userControllers.getUser);

// Create login endpoint
route.post('/login', userControllers.login);

// Endpoint for checking the access token
route.post("/authenticate", userControllers.authenticate);

module.exports = route;