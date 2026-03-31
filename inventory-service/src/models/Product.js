const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    rating: {
        rate: Number,
        count: Number
    },
    // THÊM TRƯỜNG NÀY: Chứa thông số kỹ thuật động
    specs: {
        type: Object, 
        default: {}
    }
});

module.exports = mongoose.model('Product', productSchema);