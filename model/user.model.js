const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'] },
    password: { type: String, required: true },
    avatar: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// });

const UserModel = mongoose.model('User', userSchema);
module.exports = {
    UserModel
};
