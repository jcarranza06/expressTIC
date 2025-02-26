const route = require('express').Router();

// Require the controllers
var userControllers = require('../controllers/UserController.js');
const catchErrors = require('../decorators/catchErrors.js');
let auth = require("../middlewares/auth")

// Create endpoints for user
route.post('/signup', catchErrors(userControllers.signup));
route.post('/login', catchErrors(userControllers.login));

route.get('/getUser', catchErrors(auth.authenticate), catchErrors(userControllers.getUser));

route.get("/authenticate", catchErrors(userControllers.authenticate));

module.exports = route;