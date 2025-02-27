const mongoose = require('mongoose');

const CommonDonationFundSchema = new mongoose.Schema({
    _id: { type: String, default: "common_fund" }, // Fixed ID to prevent duplicates
    amount: { type: Number, required: true }
});

const CommonDonationFund = mongoose.model('CommonDonationFund', CommonDonationFundSchema);

module.exports = CommonDonationFund;
