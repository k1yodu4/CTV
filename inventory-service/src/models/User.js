const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    // BỔ SUNG THÊM CÁC TRƯỜNG:
    phone: { type: String, default: '' },
    gender: { type: String, enum: ['Nam', 'Nữ'], default: 'Nam' },
    birthday: {
        day: { type: String, default: '' },
        month: { type: String, default: '' },
        year: { type: String, default: '' }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);