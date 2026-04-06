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

// Đánh chỉ mục Text cho cột title (và cả description nếu muốn)
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);