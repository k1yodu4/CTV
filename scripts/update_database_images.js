const fs = require('fs');
const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'inventory-service', 'node_modules', 'mongoose'));

// Đọc URI từ .env hoặc fallback
const envPath = path.join(__dirname, '..', '.env');
let mongoUri = 'mongodb://admin:gbao4132@127.0.0.1:27017/inventory_db?authSource=admin';
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/MONGO_URI=(.+)/);
    if (match) {
        mongoUri = match[1].trim();
    }
}

const seedPath = path.join(__dirname, '..', 'inventory-service', 'src', 'products_seed.json');

async function syncDatabase() {
    console.log('🔄 Đang kết nối tới MongoDB:', mongoUri);
    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Kết nối MongoDB thành công!');

        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const db = mongoose.connection.db;
        const productsCol = db.collection('products');

        let updated = 0;
        for (const item of seedData) {
            const idStr = item._id?.$oid || item._id;
            const query = idStr && mongoose.Types.ObjectId.isValid(idStr) 
                ? { _id: new mongoose.Types.ObjectId(idStr) } 
                : { title: item.title };

            const res = await productsCol.updateOne(query, {
                $set: { image: item.image }
            });
            if (res.modifiedCount > 0) updated++;
        }

        console.log(`🎉 Đã đồng bộ đường dẫn ảnh cho ${updated} sản phẩm trong MongoDB!`);
        console.log('💡 Lưu ý: Khi khởi động lại inventory-service, MeiliSearch sẽ tự động đồng bộ lại dữ liệu mới.');
    } catch (err) {
        console.error('⚠️ Không thể kết nối MongoDB (có thể container MongoDB chưa chạy):', err.message);
        console.log('👉 Nếu bạn đang chạy hệ thống mới, khi khởi động container lần đầu, file seed đã sẵn sàng ảnh offline nên không cần chạy script này.');
    } finally {
        await mongoose.disconnect();
    }
}

syncDatabase();
