require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const CategorySpec = require('./models/CategorySpec');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; 

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.send("Server đang chạy và nhận diện được Route này!");
});

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB!'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// --- 1. API CẤU HÌNH (SPECS) ---
app.get('/api/specs-config', async (req, res) => {
    try {
        const configs = await CategorySpec.find();
        const formatted = {};
        configs.forEach(c => formatted[c.category] = c.specsConfig);
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy cấu hình từ DB" });
    }
});

app.post('/api/specs-config/update', async (req, res) => {
    try {
        const { category, specsConfig } = req.body;
        const result = await CategorySpec.findOneAndUpdate(
            { category }, { specsConfig }, { upsert: true, new: true }
        );
        res.json({ message: "Cập nhật cấu hình thành công!", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. API SẢN PHẨM ---
app.get('/api/products', async (req, res) => {
    try {
        let query = {};
        if (req.query.name) query.title = { $regex: req.query.name, $options: 'i' };
        if (req.query.category) query.category = req.query.category;

        const excludedParams = ['name', 'category', 'sort']; 
        for (const key in req.query) {
            if (!excludedParams.includes(key)) {
                query[`specs.${key}`] = req.query[key]; 
            }
        }

        let sortObj = {};
        if (req.query.sort === 'asc') sortObj.price = 1;
        if (req.query.sort === 'desc') sortObj.price = -1;

        const products = await Product.find(query).sort(sortObj);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

// API Lấy chi tiết 1 sản phẩm theo ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Thêm thành công!", data: product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// API Cập nhật (Sửa) sản phẩm - ĐÃ FIX LỖI :_id thành :id
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json({ message: "Cập nhật thành công!", data: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        if (mongoose.Types.ObjectId.isValid(productId)) {
            await Product.findByIdAndDelete(productId);
        } else {
            await Product.findOneAndDelete({ id: productId });
        }
        res.json({ message: "Xóa sản phẩm thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy cực mượt tại: http://localhost:${PORT}`);
});