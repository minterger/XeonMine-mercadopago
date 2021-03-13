const { Schema, model } = require('mongoose');

const LasDonationSchema = new Schema({
    name: { type: String, required: true, uppercase: true },
    email: { type: String, required: true, lowercase: true },
    gravatar: { type: String, required: true },
    external_reference: { type: String, unique: true, required: true },
    statusLast: {type: Number, default: 0},
    lastDonation: { type: Number }
}, {
    timestamps: true
});

module.exports = model('LastDonation', LasDonationSchema);