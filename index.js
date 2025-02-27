// Require express and create an instance of it
const express = require("express");
const app = express();

// Use the CORS middleware  
const cors = require("cors");
app.use(cors());

// JSON Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Use the dotenv to load the .env file
const dotenv = require("dotenv");
dotenv.config();

// Define the MongoDB connection mode
let mongoUri = process.env.LOCAL_MONGO_URI;

// Create connection to MongoDB
const mongoose = require("mongoose");
mongoose.connect(mongoUri, {}).then(() => { console.log('Connected to MongoDB') })
	.catch((err) => { console.log('Error connecting to MongoDB', err.message) })

// Use the routes
const UserRoutes = require("./routes/UserRoute");
const OfferRoutes = require("./routes/OfferRoute");
const ReservationRoutes = require("./routes/ReservationRoute")
const DonationRoutes = require("./routes/DonationRoute")

app.use("/user", UserRoutes);
app.use("/offer", OfferRoutes);
app.use("/reservation", ReservationRoutes);
app.use("/donation", DonationRoutes)

// Start the server
app.listen(3000, () => {
	console.log(`Server running in http://localhost:3000`);
});

module.exports = app;
