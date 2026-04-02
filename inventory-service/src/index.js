require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; 

const CategorySpec = require('./models/CategorySpec');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

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

const JWT_SECRET = process.env.JWT_SECRET || "BaoKietPC_Secret_Key_123";

// API ĐĂNG KÝ
app.post('/api/register', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        
        // Kiểm tra trùng email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email đã được sử dụng!" });

        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu DB
        const newUser = new User({ fullname, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

// API ĐĂNG NHẬP
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Kiểm tra User có tồn tại?
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Email không tồn tại!" });

        // So sánh mật khẩu băm
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Mật khẩu không đúng!" });

        // Tạo vé (Token)
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: "Đăng nhập thành công!", token, role: user.role, fullname: user.fullname });
    } catch (err) {
        res.status(500).json({ error: "Lỗi Server" });
    }
});

// --- API LẤY THÔNG TIN CHI TIẾT USER ---
app.get('/api/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Chưa đăng nhập!" });

        // Giải mã token để lấy ID
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Tìm user trong DB, dùng .select('-password') để không trả mật khẩu về cho khách
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) return res.status(404).json({ error: "Người dùng không tồn tại" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy thông tin người dùng" });
    }
});

// --- API LƯU CẬP NHẬT THÔNG TIN USER ---
app.put('/api/user/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Chưa đăng nhập!" });

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Nhận dữ liệu mới từ Frontend
        const { fullname, phone, gender, birthday } = req.body;

        // Cập nhật vào Database
        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            { fullname, phone, gender, birthday },
            { new: true } // Trả về data mới sau khi update
        ).select('-password');

        res.json({ message: "Cập nhật thành công!", user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi cập nhật thông tin" });
    }
});

// --- API TẠO ĐƠN HÀNG ---
app.post('/api/orders', async (req, res) => {
    try {
        const { customerInfo, items, paymentMethod } = req.body;

        // 1. Lấy userId từ JWT Token (nếu có)
        let userId = null;
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Token hết hạn hoặc không hợp lệ, vẫn cho tạo đơn hàng (khách vãng lai)
            }
        }

        // 2. Tính toán lại tổng tiền từ Server (Để chống hacker sửa giá ở Frontend)
        let totalAmount = 0;
        items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        // 3. Tạo mã đơn hàng duy nhất (Ví dụ: KVB-845219)
        const orderCode = 'KVB-' + Math.floor(100000 + Math.random() * 900000);

        // 4. Tạo và lưu đơn hàng vào MongoDB
        const newOrder = new Order({
            orderCode,
            customerInfo,
            items,
            totalAmount,
            paymentMethod,
            userId: userId || null
        });

        await newOrder.save();

        // 5. Trả kết quả về cho Frontend
        res.status(201).json({ 
            message: "Đặt hàng thành công!", 
            orderCode: newOrder.orderCode,
            totalAmount: newOrder.totalAmount
        });

    } catch (err) {
        console.error("Lỗi tạo đơn hàng:", err);
        res.status(500).json({ error: "Lỗi hệ thống khi đặt hàng!" });
    }
});

// --- API LẤY DANH SÁCH ĐƠN HÀNG CỦA USER ---
app.get('/api/orders/my-orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Chưa đăng nhập!" });

        // Giải mã token để lấy ID user
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Tìm các đơn hàng thuộc về ID này, sắp xếp mới nhất lên đầu
        const orders = await Order.find({ userId: decoded.id }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng" });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy cực mượt tại: http://localhost:${PORT}`);
});