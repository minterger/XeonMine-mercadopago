const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: { type: String , unique: true, lowercase: true, required: true },
    gravatar: { type: String, required: true},
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

userSchema.methods.comparePassword = async function(password) {
    const res = await bcrypt.compare(password, this.password);
    return res;
}

module.exports = model('User', userSchema);

