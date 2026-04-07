require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const { Meilisearch } = require('meilisearch');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.get('/', (req, res) => {
    res.send('Chào mừng đến với API Quản lý Kho hàng!');
});

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; 

const CategorySpec = require('./models/CategorySpec');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const fs = require('fs');
const path = require('path');

// --- Meilisearch client (tìm kiếm nhanh) ---
// Trong index.js
const meiliClient = new Meilisearch({
  // Ưu tiên lấy từ biến môi trường của Docker, nếu không có thì mới dùng localhost (khi chạy node index.js bên ngoài)
  host: process.env.MEILI_HOST, 
  apiKey: process.env.MEILI_KEY,
});

// Hàm đồng bộ dữ liệu sang Meilisearch (gọi 1 lần khi cần)
async function syncDataToMeili() {
    try {
        const allProducts = await Product.find({});
        const meiliDocuments = allProducts.map(p => {
            // Tự động tạo chuỗi mô tả từ object specs (ví dụ: "Intel Core i7, 16GB, RTX 4050")
            let specSummary = "Đang cập nhật cấu hình...";
            if (p.specs && Object.keys(p.specs).length > 0) {
                specSummary = Object.values(p.specs).join(', ');
            }

            return {
                id: p._id.toString(),
                title: p.title,
                price: p.price,
                category: p.category,
                image: p.image,
                description: specSummary
            };
        });

        await meiliClient.index('products').addDocuments(meiliDocuments);
        console.log("⚡ Đã đồng bộ ẢNH và SPECS chuẩn từ MongoDB sang Meilisearch!");

        // 1. Cấu hình Typo (Bao dung lỗi gõ)
        await meiliClient.index('products').updateTypoTolerance({
            enabled: true,
            minWordSizeForTypos: { oneTypo: 3, twoTypos: 5 }
        });

        // 2. TÍNH NĂNG MỚI: DẠY TỪ ĐỒNG NGHĨA (SYNONYMS)
        await meiliClient.index('products').updateSynonyms({
            "pc": ["máy tính bàn", "desktop", "máy bộ"],
            "máy tính bàn": ["pc", "desktop"],
            "desktop": ["pc", "máy tính bàn"],
            "laptop": ["máy tính xách tay", "lap"],
            "máy tính xách tay": ["laptop", "lap"],
            "lap": ["laptop", "máy tính xách tay"],

            "main": ["bo mạch chủ", "mainboard"],
            "bo mạch chủ": ["main", "mainboard"],
            "mainboard": ["main", "bo mạch chủ"],
            "cpu": ["chip", "vi xử lý", "processor"],
            "chip": ["cpu", "vi xử lý"],
            "vi xử lý": ["cpu", "chip"],
            "vga": ["card màn hình", "card đồ họa", "gpu"],
            "card màn hình": ["vga", "card đồ họa", "gpu"],
            "card đồ họa": ["vga", "card màn hình", "gpu"],
            "gpu": ["vga", "card màn hình", "card đồ họa"],

            "case": ["thùng máy", "vỏ máy tính"],
            "thùng máy": ["case", "vỏ máy tính"],
            "vỏ máy tính": ["case", "thùng máy"],
            "nguồn": ["psu", "bộ nguồn"],
            "psu": ["nguồn", "bộ nguồn"],
            "tản": ["tản nhiệt", "cooling", "quạt tản nhiệt"],
            "tản nhiệt": ["tản", "cooling"],

            "ram": ["bộ nhớ", "bộ nhớ trong", "memory"],
            "bộ nhớ trong": ["ram", "memory"],
            "ổ cứng": ["hdd", "ssd", "ổ đĩa"],
            "hdd": ["ổ cứng"],
            "ssd": ["ổ cứng"],

            "màn hình": ["monitor", "màn", "display"],
            "monitor": ["màn hình", "màn"],
            "màn": ["màn hình", "monitor"],
            "màn hình đồ họa": ["designer monitor"],

            "bàn phím": ["keyboard", "phím"],
            "keyboard": ["bàn phím", "phím"],
            "phím": ["bàn phím", "keyboard"],
            "chuột": ["mouse"],
            "mouse": ["chuột"],
            "lót chuột": ["pad", "pad chuột", "mousepad"],
            "pad": ["lót chuột", "pad chuột", "mousepad"],
            "mousepad": ["lót chuột", "pad", "pad chuột"],

            "tai nghe": ["headphone", "earphone", "headset"],
            "headphone": ["tai nghe", "headset"],
            "loa": ["speaker"],
            "speaker": ["loa"],
            "micro": ["mic", "microphone"],
            "mic": ["micro", "microphone"],
            "webcam": ["cam", "camera"],
            "cam": ["webcam", "camera"],
            "camera": ["webcam", "cam"],

            "ghế": ["chair", "ghế gaming"],
            "chair": ["ghế", "ghế gaming"],
            "bàn": ["desk", "table", "bàn gaming"],
            "desk": ["bàn", "bàn gaming"]
        });
    } catch (err) {
        console.error("Lỗi đồng bộ:", err);
    }
}

// --- Hàm nạp dữ liệu mẫu (seed) ---
async function seedData() {
    const collectionsToSeed = [
        { model: Product, file: 'products_seed.json', name: 'Sản phẩm' },
        { model: User, file: 'users_seed.json', name: 'Người dùng' },
        { model: CategorySpec, file: 'specs_seed.json', name: 'Cấu hình Specs' },
        { model: Order, file: 'orders_seed.json', name: 'Đơn hàng' }
    ];

    try {
        let isProductSeeded = false;

        for (const item of collectionsToSeed) {
            const count = await item.model.countDocuments();
            if (count === 0) {
                const filePath = path.join(__dirname, item.file);
                if (fs.existsSync(filePath)) {
                    const rawData = fs.readFileSync(filePath, 'utf-8');
                    let jsonData = JSON.parse(rawData); // Lưu ý đổi const thành let ở đây nhé

                    // --- 4 DÒNG CODE CẦN THÊM BẮT ĐẦU TỪ ĐÂY ---
                    // Xóa trường _id bị lỗi định dạng $oid của Compass để MongoDB tự cấp ID chuẩn mới
                    jsonData = jsonData.map(doc => {
                        delete doc._id;
                        return doc;
                    });
                    // -------------------------------------------

                    await item.model.insertMany(jsonData);
                    console.log(`✅ Đã nạp ${jsonData.length} ${item.name}!`);
                    if (item.model === Product) isProductSeeded = true;
                } else {
                    console.log(`⚠️ Bỏ qua ${item.name}: Không tìm thấy file ${item.file}`);
                }
            } else {
                console.log(`📦 Bảng ${item.name} đã có dữ liệu, bỏ qua.`);
            }
        }

        if (isProductSeeded) {
            await syncDataToMeili();
        }
    } catch (err) {
        console.error("❌ Lỗi khi nạp dữ liệu mẫu:", err.message);
    }
}

// Gọi syncDataToMeili() một lần khi server start nếu bạn muốn tự động đẩy dữ liệu.
    syncDataToMeili(); // (chúng ta sẽ gọi nó sau khi MongoDB kết nối thành công)

app.get('/test', (req, res) => {
    res.send("Server đang chạy và nhận diện được Route này!");
});

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ Đã kết nối thành công tới MongoDB!');
        // Sau khi DB kết nối thành công, nạp dữ liệu mẫu nếu cần và đồng bộ Meili
        await seedData();
    })
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
        // TRƯỜNG HỢP 1: CÓ GÕ TÌM KIẾM -> DÙNG MEILISEARCH
        if (req.query.name) {
            let keyword = req.query.name;
            
            // Nhờ Meilisearch tìm kiếm mờ
            const searchResult = await meiliClient.index('products').search(keyword, {
                limit: 20 // Lấy tối đa 20 kết quả
            });

            // Trả thẳng về cho Frontend hiển thị (Meilisearch trả về 'hits')
            return res.json(searchResult.hits);
        }

        // TRƯỜNG HỢP 2: KHÔNG TÌM KIẾM, CHỈ LỌC BÌNH THƯỜNG -> DÙNG MONGODB
        let query = {};
        if (req.query.category) query.category = req.query.category;

        // Xử lý bộ lọc thông số kỹ thuật (Specs)
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
        res.status(500).json({ message: "Lỗi Server", error });
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
        // 1. Cất hàng vào kho: Lưu vào MongoDB
        const newProduct = new Product(req.body);
        await newProduct.save();

        // 2. Ghi vào sổ: Đồng bộ sang Meilisearch (Dùng addDocuments)
        try {
            let specText = req.body.specs ? Object.values(req.body.specs).join(', ') : "";
            await meiliClient.index('products').addDocuments([{
                id: newProduct._id.toString(), // Bắt buộc chuyển ObjectId thành String
                title: newProduct.title,
                price: newProduct.price,
                category: newProduct.category,
                image: newProduct.image,
                description: specText
            }]);
        } catch (meiliErr) {
            console.error('Lỗi đồng bộ Meilisearch khi thêm sản phẩm:', meiliErr);
            // Không chặn response chính nếu Meili thất bại
        }

        res.status(201).json({ message: "Thêm sản phẩm thành công ở cả 2 nơi!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error });
    }
});

// API Cập nhật (Sửa) sản phẩm - ĐÃ FIX LỖI :_id thành :id
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body; // Dữ liệu mới (tên, giá...)

        // 1. Cập nhật vào MongoDB (Nhà kho)
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        // 2. TỰ ĐỘNG CẬP NHẬT SANG MEILISEARCH
        try {
            let specText = updatedProduct.specs ? Object.values(updatedProduct.specs).join(', ') : "";
            await meiliClient.index('products').updateDocuments([{
                id: updatedProduct._id.toString(),
                title: updatedProduct.title,
                price: updatedProduct.price,
                category: updatedProduct.category,
                image: updatedProduct.image,
                description: specText
            }]);
        } catch (meiliErr) {
            console.error('Lỗi cập nhật Meilisearch:', meiliErr);
            // Không chặn response chính nếu Meili lỗi, chỉ log để kiểm tra
        }

        res.json({ message: "Cập nhật thành công cả 2 nơi!", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error });
    }
});

// API Xóa sản phẩm
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Xóa khỏi MongoDB
        if (mongoose.Types.ObjectId.isValid(productId)) {
            await Product.findByIdAndDelete(productId);
        } else {
            await Product.findOneAndDelete({ id: productId });
        }

        // Xóa khỏi Meilisearch (nếu index tồn tại)
        try {
            await meiliClient.index('products').deleteDocument(productId);
        } catch (meiliErr) {
            console.error('Lỗi xóa Meilisearch:', meiliErr);
            // Không trả lỗi 500 cho client nếu Meili thất bại; log để debug
        }

        res.json({ message: "Đã xóa sản phẩm ở cả 2 nơi!" });
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

// --- API LẤY TẤT CẢ ĐƠN HÀNG (Dành cho Admin) ---
app.get('/api/admin/orders', async (req, res) => {
    try {
        // Lấy tất cả đơn hàng, sắp xếp mới nhất lên đầu
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng" });
    }
});

// --- API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
app.put('/api/admin/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ message: "Cập nhật trạng thái thành công!", order: updatedOrder });
    } catch (err) {
        res.status(500).json({ error: "Lỗi cập nhật trạng thái" });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy cực mượt tại: http://localhost:${PORT}`);
});