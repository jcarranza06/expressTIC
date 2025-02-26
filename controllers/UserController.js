// Import JWT and Bcrypt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Import the models
const User = require('../models/UserModel');

// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

// Register a new user
exports.signup = async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        }
    );

    // Check if the username and email are unique
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (user) {
        if (user.username === req.body.username) {
            return res.status(400).json({error: "Username already exists."});
        } else if (user.email === req.body.email) {
            return res.status(400).json({error: "Email already exists."});
        }
    }
    
    await newUser.save();
    return res.status(201).json({message: "User has been created. Email sent."});     
};

// Login
exports.login = async(req, res) => {
    // Try to find the user
    const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] });
    if (!user) {
        return res.status(404).json({error:"User not found."});
    }
    // Compare passwords
    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
        return res.status(400).json({error: "Wrong password."});
    }else{
        // Create and assign an access token (it lasts an hour)
        var accessToken = jwt.sign({
            email: user.email,
            username: user.username,
            _id: user._id
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Send the response
        return res.status(200).json({ accessToken: accessToken });
    }
};

// Check token' validity, get a new access token using the refresh token if neccesary.
exports.authenticate = (req, res) => {
    // Get the access token from the headers
    const access = req.headers.authorization;

    if (!access) {
        return res.status(401).json({ message: "Access token required" });
    }

    // Try to authenticate the user using the access token
    if(access){
        jwt.verify(access, process.env.JWT_SECRET_KEY, (err, decoded) => {
            // If the access token is still valid, return it again
            if (!err || decoded) {
                return res.status(200).json({ accessToken: access,message: 'Access token still valid'});
            // If the token is invalid, return error
            }else {
                return res.status(401).json({ message: 'Access token expired.' });
            } 
        });
    }
};
  
// Get user info
exports.getUser = (req, res) => {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY, async(err, decoded) => {
        if (err || !decoded) {
            return res.status(401).json({ message: 'Invalid/expired token' });
        } else {
            const user = await User.findById(decoded._id);
            user.password = undefined;
            return res.status(200).json(user);
        }
    });
};