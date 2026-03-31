const mongoose = require('mongoose');
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGO_URI;

const pcMarketData = [
    // --- BÀN PHÍM ---
    {
        title: "Bàn phím cơ DrunkDeer A75 - Magnetic Switch",
        price: 2850000,
        description: "Switch nam châm cực nhạy cho game thủ Valorant/CS2",
        category: "Keyboard",
        image: "https://www.phongcachxanh.vn/cdn/shop/files/ban-phim-t-he-drunkdeer-a75-magnetic-switch-rapid-trigger-39632589553909.jpg?v=1702004213&width=800",
        rating: { rate: 5, count: 20 }
    },
    {
        title: "Logitech G Pro X 60 Lightspeed",
        price: 4500000,
        description: "Bàn phím không dây 60% chuyên dụng cho thi đấu",
        category: "Keyboard",
        image: "https://product.hstatic.net/200000722513/product/5mcsgas4_32ac8fe0d75c469292dab3e5a70e9ca6_master.png",
        rating: { rate: 4.8, count: 12 }
    },
    // --- CHUỘT ---
    {
        title: "Chuột Logitech G Pro X Superlight 2",
        price: 3290000,
        description: "Chuột gaming siêu nhẹ 60g, cảm biến HERO 2",
        category: "Mouse",
        image: "https://product.hstatic.net/200000722513/product/3_7c1bf2ff4e504450a42de78e6cc48087_master.jpg",
        rating: { rate: 4.9, count: 56 }
    },
    // --- MÀN HÌNH ---
    {
        title: "Màn hình ASUS ROG Swift 360Hz PG259QN",
        price: 15500000,
        description: "24.5 inch, Full HD, 360Hz cực mượt cho FPS",
        category: "Monitor",
        image: "https://product.hstatic.net/200000722513/product/asus_pg259qn_gearvn_923dae607c984aff91aae2400180a4a6_37e0672ddeeb4ee09d9f2b39da1691a0_master.jpg",
        rating: { rate: 5, count: 8 }
    },
    // --- LINH KIỆN ---
    {
        title: "NVIDIA GeForce RTX 5080 Founders Edition",
        price: 38000000,
        description: "Card đồ họa mạnh mẽ nhất phân khúc hi-end",
        category: "VGA",
        image: "https://product.hstatic.net/200000722513/product/prime-rtx5080-o16g_box-with-card_nv_463e41f360f045debdc1cf3937fa5eb6_master.png",
        rating: { rate: 5, count: 2 }
    },
    {
        title: "Laptop ASUS ROG Zephyrus G16 GA605WI-QR090W",
        price: 64990000,
        oldPrice: 71990000,
        discount: 10,
        description: "Siêu phẩm laptop gaming mỏng nhẹ, màn hình OLED 240Hz cực đỉnh",
        category: "Laptop",
        image: "https://bizweb.dktcdn.net/thumb/grande/100/329/122/products/laptop-gaming-asus-rog-zephyrus-g16-ga605wi-qr090ws-8.jpg?v=1726200779280",
        specs: {
            cpu: "Ryzen 9 AI",
            ram: "32GB LPDDR5X",
            storage: "1TB SSD Gen4",
            gpu: "RTX 4070 8GB",
            screen: "16\" 2.5K OLED 240Hz"
        },
        rating: { rate: 5, count: 15 }
    },
    
    {
        "title": "Laptop ASUS ROG Zephyrus G14 GA403UI-QS063W",
        "price": 54990000,
        "oldPrice": 59990000,
        "discount": 8,
        "description": "Laptop gaming 14 inch mạnh mẽ nhất thế giới, thiết kế nhôm nguyên khối",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Ryzen 9 8945HS",
            "ram": "32GB LPDDR5X",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4070 8GB",
            "screen": "14\" 3K OLED 120Hz"
        },
        "rating": { "rate": 4.9, "count": 12 }
    },
    {
        "title": "Laptop Razer Blade 16 (2024)",
        "price": 95000000,
        "oldPrice": 99000000,
        "discount": 4,
        "description": "Đẳng cấp Gaming vương giả, màn hình OLED 240Hz đầu tiên trên thế giới",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Core i9-14900HX",
            "ram": "32GB DDR5",
            "storage": "2TB SSD Gen4",
            "gpu": "RTX 4080 12GB",
            "screen": "16\" QHD+ OLED 240Hz"
        },
        "rating": { "rate": 5, "count": 8 }
    },
    {
        "title": "Laptop MSI Stealth 16 AI Studio A1V",
        "price": 62990000,
        "oldPrice": 68000000,
        "discount": 7,
        "description": "Sự kết hợp hoàn hảo giữa laptop doanh nhân và sức mạnh gaming",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Ultra 9 185H",
            "ram": "32GB DDR5",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4070 8GB",
            "screen": "16\" QHD+ OLED 240Hz"
        },
        "rating": { "rate": 4.7, "count": 10 }
    },
    {
        "title": "Laptop Lenovo Legion Slim 7i Gen 8",
        "price": 48500000,
        "oldPrice": 52000000,
        "discount": 6,
        "description": "Thiết kế tinh tế, build quality xuất sắc, tản nhiệt cực mát",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Core i9-13900H",
            "ram": "32GB DDR5",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4070 8GB",
            "screen": "16\" 3.2K IPS 165Hz"
        },
        "rating": { "rate": 4.8, "count": 20 }
    },
    {
        "title": "Laptop Dell Alienware x16 R2",
        "price": 88000000,
        "oldPrice": 92000000,
        "discount": 4,
        "description": "Thiết kế tương lai Alienware Legend 3.0, mỏng nhẹ vượt trội",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Ultra 9 185H",
            "ram": "32GB LPDDR5X",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4080 12GB",
            "screen": "16\" QHD+ 240Hz"
        },
        "rating": { "rate": 4.6, "count": 5 }
    },
    {
        "title": "Laptop HP Omen Transcend 14",
        "price": 45990000,
        "oldPrice": 49990000,
        "discount": 8,
        "description": "Laptop gaming 14 inch mỏng nhẹ nhất của HP, màn hình OLED rực rỡ",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Ultra 7 155H",
            "ram": "16GB LPDDR5X",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4060 8GB",
            "screen": "14\" 2.8K OLED 120Hz"
        },
        "rating": { "rate": 4.5, "count": 14 }
    },
    {
        "title": "Laptop Acer Predator Triton Neo 16",
        "price": 42000000,
        "oldPrice": 45000000,
        "discount": 6,
        "description": "Dòng Triton mới tối ưu cho sáng tạo nội dung và chơi game",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Ultra 7 155H",
            "ram": "16GB LPDDR5",
            "storage": "512GB SSD Gen4",
            "gpu": "RTX 4060 8GB",
            "screen": "16\" 3.2K IPS 165Hz"
        },
        "rating": { "rate": 4.4, "count": 9 }
    },
    {
        "title": "Laptop Gigabyte AORUS 16X (2024)",
        "price": 51000000,
        "oldPrice": 55000000,
        "discount": 7,
        "description": "Tối ưu hóa AI, hiệu năng đồ họa cực mạnh trong thân máy mỏng",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Core i7-14650HX",
            "ram": "16GB DDR5",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4070 8GB",
            "screen": "16\" QHD+ 165Hz"
        },
        "rating": { "rate": 4.3, "count": 7 }
    },
    {
        "title": "Laptop Apple MacBook Pro 16 M3 Max",
        "price": 92990000,
        "oldPrice": 99990000,
        "discount": 7,
        "description": "Đỉnh cao đồ họa chuyên nghiệp và thời lượng pin vô đối",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Apple M3 Max (14-Core)",
            "ram": "36GB Unified Memory",
            "storage": "1TB SSD",
            "gpu": "30-Core GPU",
            "screen": "16.2\" Liquid Retina XDR"
        },
        "rating": { "rate": 5, "count": 25 }
    },
    {
        "title": "Laptop Lenovo Yoga Pro 9i Gen 9",
        "price": 56000000,
        "oldPrice": 60000000,
        "discount": 6,
        "description": "Màn hình Mini-LED siêu sáng, chuẩn màu cho designer",
        "category": "Laptop",
        "image": "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_6__4_24.png",
        "specs": {
            "cpu": "Core i9-13905H",
            "ram": "32GB LPDDR5X",
            "storage": "1TB SSD Gen4",
            "gpu": "RTX 4060 8GB",
            "screen": "16\" 3.2K Mini-LED 165Hz"
        },
        "rating": { "rate": 4.8, "count": 11 }
    },
    {
        title: "Màn hình ZOWIE XL2566K 24.5 inch TN 360Hz DyAc+",
        price: 16490000,
        oldPrice: 17990000,
        discount: 8,
        description: "Màn hình quốc dân cho game thủ CS2 và Valorant chuyên nghiệp",
        category: "Monitor",
        image: "https://product.hstatic.net/200000637319/product/ezgif-4-fc59f44f37_c5c23480d15744499d31be6c04e6c6a8_master.png",
        specs: {
            cpu: "360Hz",
            ram: "0.5ms GtG",
            storage: "DyAc+ Technology",
            gpu: "Black eQualizer",
            screen: "24.5\" Full HD"
        },
        rating: { rate: 4.9, count: 42 }
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(pcMarketData);
        console.log("🚀 Đã nạp thành công bộ sưu tập PC Market xịn xò!");
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seed();