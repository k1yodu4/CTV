const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; 

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// API Lấy danh sách sản phẩm (Hỗ trợ Lọc và Tìm kiếm)
// API Lấy danh sách sản phẩm (Hỗ trợ Lọc và Tìm kiếm)
app.get('/api/products', async (req, res) => {
    try {
        // Lấy các tham số từ URL (VD: ?category=VGA&name=RTX&minPrice=20000000)
        const { category, name, minPrice, maxPrice } = req.query;
        
        // Tạo một object query rỗng, nếu có bộ lọc nào thì thêm vào
        let query = {};

        // 1. Lọc theo danh mục (chính xác)
        if (category) {
            query.category = category;
        }

        // 2. Tìm kiếm theo tên (Tìm tương đối, không phân biệt hoa/thường)
        if (name) {
            query.title = { $regex: name, $options: 'i' }; 
        }

        // 3. Lọc theo khoảng giá (Lớn hơn min, nhỏ hơn max)
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice); // $gte: Greater than or equal
            if (maxPrice) query.price.$lte = Number(maxPrice); // $lte: Less than or equal
        }

        // Bắt MongoDB tìm kiếm dựa trên bộ lọc đã tạo
        const products = await Product.find(query);
        res.json(products);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Inventory Service đang lắng nghe tại port ${PORT}`);
});

// Route để thêm sản phẩm mới (Dùng cho trang Admin sau này)
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body); // Lấy dữ liệu từ Form gửi lên
        await product.save();
        res.status(201).json({ message: "Thêm thành công!", data: product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});