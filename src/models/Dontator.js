const { Schema, model } = require('mongoose');

const donatorSchema = new Schema({
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    gravatar: { type: String, unique: true, required: true },
    totalDonation: { type: Number },
}, {
    timestamps: true
});

module.exports = model('Donator', donatorSchema);