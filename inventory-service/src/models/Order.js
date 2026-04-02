const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
    orderCode: { type: String, required: true, unique: true }, // Mã đơn (VD: KVB-123456)
    customerInfo: {
        fullname: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        address: { type: String, required: true },
        note: { type: String }
    },
    items: [orderItemSchema], // Danh sách sản phẩm mua
    totalAmount: { type: Number, required: true }, // Tổng tiền
    paymentMethod: { type: String, enum: ['COD', 'BANK'], default: 'COD' },
    status: { 
        type: String, 
        enum: ['Chờ xác nhận', 'Đang xử lý', 'Đang vận chuyển', 'Hoàn tất', 'Đã hủy'], 
        default: 'Chờ xác nhận' 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // Lưu ID nếu khách đã đăng nhập
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);