const { Schema, model } = require('mongoose');

const donatorSchema = new Schema({
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    gravatar: { type: String, unique: true, required: true },
    external_reference: { type: String, unique: true, required: true },
    statusTop: { type: Number, default: 0 },
    statusLast: {type: Number, default: 0},
    totalDonation: { type: Number },
    lastDonation: { type: Number }
}, {
    timestamps: true
});

module.exports = model('Donator', donatorSchema);