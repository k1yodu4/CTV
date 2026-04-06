// File: js/specs-config.js

// 1. KHO DỮ LIỆU TÙY CHỌN
const predefinedData = {
    cpus: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'],
    rams: ['8GB', '16GB', '32GB', '64GB'],
    vgas: ['RTX 4090', 'RTX 4080', 'RTX 4070', 'RTX 4060', 'RTX 3060', 'AMD Radeon RX 7900', 'AMD Radeon RX 7600', 'Onboard / Tích hợp'],
    storages: ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD'],
    resolutions: ['Full HD (1920x1080)', '2K (2560x1440)', '4K (3840x2160)'],
    refreshRates: ['60Hz', '75Hz', '144Hz', '165Hz', '240Hz', '360Hz'],
    panels: ['IPS', 'VA', 'TN', 'OLED']
};

// 2. CẤU HÌNH CÁC TRƯỜNG THÔNG SỐ CHO TỪNG DANH MỤC
const categorySpecsConfig = {
    Laptop: [
        { key: 'cpu', label: 'CPU', options: predefinedData.cpus },
        { key: 'ram', label: 'RAM', options: predefinedData.rams },
        { key: 'vga', label: 'Card đồ họa (VGA)', options: predefinedData.vgas },
        { key: 'storage', label: 'Ổ cứng', options: predefinedData.storages },
        { key: 'screen', label: 'Màn hình', options: ['13.3 inch', '14 inch', '15.6 inch', '16 inch', '17.3 inch'] },
        { key: 'weight', label: 'Trọng lượng', options: ['Dưới 1.5 kg', '1.5 - 2.0 kg', 'Trên 2.0 kg'] }
    ],
    PC: [
        { key: 'cpu', label: 'CPU', options: predefinedData.cpus },
        { key: 'ram', label: 'RAM', options: predefinedData.rams },
        { key: 'vga', label: 'Card đồ họa (VGA)', options: predefinedData.vgas },
        { key: 'storage', label: 'Ổ cứng', options: predefinedData.storages },
        { key: 'mainboard', label: 'Mainboard', options: ['H610', 'B660', 'B760', 'Z690', 'Z790', 'A620', 'B650', 'X670'] },
        { key: 'psu', label: 'Nguồn (PSU)', options: ['450W', '550W', '650W', '750W', '850W', '1000W'] }
    ],
    ManHinh: [
        { key: 'resolution', label: 'Độ phân giải', options: predefinedData.resolutions },
        { key: 'refreshRate', label: 'Tần số quét', options: predefinedData.refreshRates },
        { key: 'panel', label: 'Tấm nền', options: predefinedData.panels },
        { key: 'size', label: 'Kích thước', options: ['21.5 inch', '24 inch', '27 inch', '32 inch', '34 inch Ultrawide'] }
    ]
    // Bạn cứ thoải mái thêm các danh mục khác (Bàn phím, Chuột...) vào đây
};