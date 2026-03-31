const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,             // ID gốc từ API
    title: String,          // Tên sản phẩm
    price: Number,          // Giá
    description: String,    // Mô tả chi tiết
    category: String,       // Danh mục (điện tử, quần áo...)
    image: String,          // Link ảnh sản phẩm
    rating: {
        rate: Number,
        count: Number
    }
});

module.exports = mongoose.model('Product', productSchema);