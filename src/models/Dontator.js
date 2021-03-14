const { Schema, model } = require('mongoose');

const donatorSchema = new Schema({
    name: { type: String, unique: true, required: true, uppercase: true},
    email: { type: String, required: true, lowercase: true },
    gravatar: { type: String, required: true },
    totalDonation: { type: Number },
}, {
    timestamps: true
});

module.exports = model('Donator', donatorSchema);