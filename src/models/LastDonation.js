const { Schema, model } = require('mongoose');

const LasDonationSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, lowercase: true },
    userId: { type: String, required: true },
    gravatar: { type: String, required: true },
    link: { type: String, required: true },
    external_reference: { type: String, unique: true, required: true },
    status: { type: String, required: true, default: 'No Pagado' },
    statusLast: {type: Number, default: 0},
    lastDonation: { type: Number }
}, {
    timestamps: true
});

module.exports = model('LastDonation', LasDonationSchema);