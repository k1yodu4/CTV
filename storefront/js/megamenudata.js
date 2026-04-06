const menuData = [
    { name: "PC GVN", icon: "bi-pc-display", target: "#megamenu-pc-gvn" },
    { name: "Laptop", icon: "bi-laptop", target: "#megamenu-laptop" },
    { name: "Laptop Gaming", icon: "bi-headset", target: "#megamenu-laptop-gaming" },
    { name: "Main, CPU, VGA", icon: "bi-cpu", target: "#megamenu-linh-kien" },
    { name: "Case, Nguồn, Tản", icon: "bi-pc-display-horizontal", target: "#megamenu-tan-nhiet" },
    { name: "Ổ cứng, RAM", icon: "bi-memory", target: "#megamenu-luu-tru" },
    { name: "Loa, Micro, Webcam", icon: "bi-speaker", target: "#megamenu-am-thanh" },
    { name: "Màn hình", icon: "bi-display", target: "#megamenu-man-hinh" },
    { name: "Bàn phím", icon: "bi-keyboard", target: "#megamenu-ban-phim" },
    { name: "Chuột + Lót chuột", icon: "bi-mouse3", target: "#megamenu-chuot" },
    { name: "Tai nghe", icon: "bi bi-headphones", target: "#megamenu-tai-nghe" },
    { name: "Ghế - Bàn", icon: "bi-house", target: "#megamenu-ghe-ban" },
    { name: "Phần mềm, mạng", icon: "bi-box-seam", target: "#megamenu-phan-mem" },
    { name: "Handheld, Console", icon: "bi-controller", target: "#megamenu-game-console" },
    { name: "Phụ kiện", icon: "bi-plug-fill", target: "#megamenu-phu-kien" },
    { name: "Dịch vụ khác", icon: "bi-gift", target: "#megamenu-dich-vu" }
];

    const megamenuData = {
        "pc-gvn": [
    {
        title: "PC THEO GIÁ",
        links: [
            { label: "PC DƯỚI 30 TRIỆU", url: "category.html?category=PC&maxPrice=30000000" },
            { label: "PC TỪ 30 - 50 TRIỆU", url: "category.html?category=PC&minPrice=30000000&maxPrice=50000000" },
            { label: "PC TỪ 50 - 70 TRIỆU", url: "category.html?category=PC&minPrice=50000000&maxPrice=70000000" },
            { label: "PC TỪ 70 - 100 TRIỆU", url: "category.html?category=PC&minPrice=70000000&maxPrice=100000000" },
            { label: "PC TỪ 100 - 200 TRIỆU", url: "category.html?category=PC&minPrice=100000000&maxPrice=200000000" },
            { label: "PC TRÊN 200 TRIỆU", url: "category.html?category=PC&minPrice=200000000" }
        ]
    },
    {
        title: "PC RTX 50 Series",
        links: [
            { label: "PC RTX 5090", url: "category.html?name=PC RTX 5090" },
            { label: "PC RTX 5080", url: "category.html?name=PC RTX 5080" },
            { label: "PC RTX 5070Ti", url: "category.html?name=PC RTX 5070Ti" },
            { label: "PC RTX 5070", url: "category.html?name=PC RTX 5070" },
            { label: "PC RTX 5060Ti", url: "category.html?name=PC RTX 5060Ti" }
        ]
    },
    {
        title: "PC theo cấu hình VGA",
        links: [
            { label: "PC RTX 5060 (HOT)", url: "category.html?name=PC RTX 5060" },
            { label: "PC RTX 5050", url: "category.html?name=PC RTX 5050" },
            { label: "PC RTX 3060 (HOT)", url: "category.html?name=PC RTX 3060" },
            { label: "PC RTX 3050", url: "category.html?name=PC RTX 3050" }
        ]
    },
    {
        title: "PC khuyến mãi KHỦNG",
        links: [
            { label: "PC I7 TẶNG MÀN 240HZ", url: "category.html?name=I7" },
            { label: "GVN x MSI - Tặng màn OLED", url: "category.html?name=MSI" },
            { label: "GVN x ASUS - MAX SETTING", url: "category.html?name=ASUS" }
        ]
    },
    {
        title: "PC theo CPU AMD",
        links: [
            { label: "PC AMD R3", url: "category.html?name=AMD R3" },
            { label: "PC AMD R5 (HOT)", url: "category.html?name=AMD R5" },
            { label: "PC AMD R7", url: "category.html?name=AMD R7" },
            { label: "PC AMD R9", url: "category.html?name=AMD R9" }
        ]
    },
    {
        title: "PC theo CPU Intel",
        links: [
            { label: "PC Core i3", url: "category.html?name=Core i3" },
            { label: "PC Core i5", url: "category.html?name=Core i5" },
            { label: "PC Core i7 (HOT)", url: "category.html?name=Core i7" },
            { label: "PC Core i9", url: "category.html?name=Core i9" }
        ]
    },
    {
        title: "PC theo CPU Ultra",
        links: [
            { label: "PC Ultra 5", url: "category.html?name=Ultra 5" },
            { label: "PC Ultra 7", url: "category.html?name=Ultra 7" },
            { label: "PC Ultra 9", url: "category.html?name=Ultra 9" }
        ]
    },
    {
        title: "PC Văn phòng",
        links: [
            { label: "Homework Athlon - Giá chỉ 3.990k", url: "category.html?name=Athlon" },
            { label: "Homework R3 - Giá chỉ 5.690k", url: "category.html?name=Homework R3" },
            { label: "Homework R5 - Giá chỉ 5.690k", url: "category.html?name=Homework R5" },
            { label: "Homework I5 - Giá chỉ 5.690k", url: "category.html?name=Homework I5" }
        ]
    },
    {
        title: "Phần mềm bản quyền",
        links: [
            { label: "Window bản quyền - Chỉ từ 2.990K", url: "category.html?name=Windows" },
            { label: "Office 365 bản quyền - Chỉ từ 990K", url: "category.html?name=Office" }
        ]
    }
],
        "laptop": [
    {
        title: "LAPTOP THEO NHU CẦU",
        links: [
            { label: "Laptop Gaming (HOT)", url: "category.html?category=Laptop&name=Gaming" },
            { label: "Laptop Văn Phòng", url: "category.html?category=Laptop&name=Văn Phòng" },
            { label: "Laptop Đồ Họa", url: "category.html?category=Laptop&name=Đồ Họa" },
            { label: "Laptop Mỏng Nhẹ", url: "category.html?category=Laptop&name=Mỏng Nhẹ" },
            { label: "Laptop AI (NEW)", url: "category.html?category=Laptop&name=AI" },
            { label: "Laptop Cảm Ứng", url: "category.html?category=Laptop&name=Cảm Ứng" },
            { label: "Laptop Sinh Viên", url: "category.html?category=Laptop&name=Sinh Viên" }
        ]
    },
    {
        title: "LAPTOP GAMING",
        links: [
            { label: "Laptop RTX 40 Series", url: "category.html?category=Laptop&name=RTX 40" },
            { label: "Laptop RTX 30 Series", url: "category.html?category=Laptop&name=RTX 30" },
            { label: "Laptop Gaming Intel", url: "category.html?category=Laptop&name=Intel" },
            { label: "Laptop Gaming AMD", url: "category.html?category=Laptop&name=AMD" }
        ]
    },
    {
        title: "LAPTOP THEO GIÁ",
        links: [
            { label: "Dưới 15 Triệu", url: "category.html?category=Laptop&maxPrice=15000000" },
            { label: "Từ 15 - 20 Triệu", url: "category.html?category=Laptop&minPrice=15000000&maxPrice=20000000" },
            { label: "Từ 20 - 25 Triệu", url: "category.html?category=Laptop&minPrice=20000000&maxPrice=25000000" },
            { label: "Từ 25 - 30 Triệu", url: "category.html?category=Laptop&minPrice=25000000&maxPrice=30000000" },
            { label: "Trên 30 Triệu", url: "category.html?category=Laptop&minPrice=30000000" }
        ]
    },
    {
        title: "THƯƠNG HIỆU LAPTOP",
        links: [
            { label: "Laptop ASUS", url: "category.html?name=ASUS" },
            { label: "Laptop MSI", url: "category.html?name=MSI" },
            { label: "Laptop ACER", url: "category.html?name=ACER" },
            { label: "Laptop GIGABYTE", url: "category.html?name=GIGABYTE" },
            { label: "Laptop LENOVO", url: "category.html?name=LENOVO" },
            { label: "Laptop HP", url: "category.html?name=HP" },
            { label: "Laptop DELL", url: "category.html?name=DELL" }
        ]
    },
    {
        title: "APPLE (MACBOOK)",
        links: [
            { label: "Macbook Air M1", url: "category.html?name=Macbook Air M1" },
            { label: "Macbook Air M2", url: "category.html?name=Macbook Air M2" },
            { label: "Macbook Air M3", url: "category.html?name=Macbook Air M3" },
            { label: "Macbook Pro M3 Series", url: "category.html?name=Macbook Pro M3" }
        ]
    },
    {
        title: "LINH KIỆN LAPTOP",
        links: [
            { label: "RAM Laptop", url: "category.html?name=RAM Laptop" },
            { label: "SSD Laptop", url: "category.html?name=SSD Laptop" },
            { label: "Sạc Laptop", url: "category.html?name=Sạc Laptop" },
            { label: "Balo / Túi chống sốc", url: "category.html?name=Balo" },
            { label: "Giá đỡ Laptop / Đế tản nhiệt", url: "category.html?name=Giá đỡ Laptop" }
        ]
    }
],
"laptop-gaming": [
    {
        title: "Thương hiệu",
        links: [
            { label: "ACER / PREDATOR", url: "category.html?name=ACER" },
            { label: "ASUS / ROG", url: "category.html?name=ASUS" },
            { label: "MSI", url: "category.html?name=MSI" },
            { label: "LENOVO", url: "category.html?name=LENOVO" },
            { label: "DELL", url: "category.html?name=DELL" },
            { label: "GIGABYTE / AORUS", url: "category.html?name=GIGABYTE" },
            { label: "HP", url: "category.html?name=HP" }
        ]
    },
    {
        title: "Giá bán",
        links: [
            { label: "Dưới 20 triệu", url: "category.html?maxPrice=20000000" },
            { label: "Từ 20 đến 25 triệu", url: "category.html?minPrice=20000000&maxPrice=25000000" },
            { label: "Từ 25 đến 30 triệu", url: "category.html?minPrice=25000000&maxPrice=30000000" },
            { label: "Trên 30 triệu", url: "category.html?minPrice=30000000" },
            { label: "Gaming RTX 50 Series", url: "category.html?name=RTX 50" }
        ]
    },
    {
        title: "ACER | PREDATOR",
        links: [
            { label: "Nitro ProPanel Series", url: "category.html?name=Nitro" },
            { label: "Nitro Series", url: "category.html?name=Nitro" },
            { label: "Aspire Series", url: "category.html?name=Aspire" },
            { label: "Predator Series", url: "category.html?name=Predator" },
            { label: "ACER RTX 50 Series", url: "category.html?name=ACER RTX 50" }
        ]
    },
    {
        title: "ASUS | ROG Gaming",
        links: [
            { label: "ROG Series", url: "category.html?name=ROG" },
            { label: "TUF Series", url: "category.html?name=TUF" },
            { label: "Zephyrus Series", url: "category.html?name=Zephyrus" },
            { label: "ASUS RTX 50 Series", url: "category.html?name=ASUS RTX 50" }
        ]
    },
    {
        title: "MSI Gaming",
        links: [
            { label: "Titan GT Series", url: "category.html?name=Titan" },
            { label: "Stealth GS Series", url: "category.html?name=Stealth" },
            { label: "Raider GE Series", url: "category.html?name=Raider" },
            { label: "Vector GP Series", url: "category.html?name=Vector" },
            { label: "Crosshair / Pulse GL Series", url: "category.html?name=Crosshair" },
            { label: "Sword / Katana GF66 Series", url: "category.html?name=Sword" },
            { label: "Cyborg / Thin GF Series", url: "category.html?name=Cyborg" },
            { label: "MSI RTX 50 Series", url: "category.html?name=MSI RTX 50" }
        ]
    },
    {
        title: "LENOVO Gaming",
        links: [
            { label: "Legion Gaming", url: "category.html?name=Legion" },
            { label: "LOQ series", url: "category.html?name=LOQ" },
            { label: "RTX 50 Series", url: "category.html?name=RTX 50" }
        ]
    },
    {
        title: "GIGABYTE Gaming",
        links: [
            { label: "Gaming Gigabyte", url: "category.html?name=GIGABYTE" },
            { label: "GIGABYTE RTX 50 Series", url: "category.html?name=GIGABYTE RTX 50" }
        ]
    },
    {
        title: "HP Gaming",
        links: [
            { label: "HP Victus", url: "category.html?name=Victus" },
            { label: "HP Omen", url: "category.html?name=Omen" },
            { label: "HP RTX 50 Series", url: "category.html?name=HP RTX 50" }
        ]
    },
    {
        title: "Cấu hình",
        links: [
            { label: "RTX 50 Series", url: "category.html?name=RTX 50" },
            { label: "CPU Core Ultra", url: "category.html?name=Core Ultra" },
            { label: "CPU AMD", url: "category.html?name=AMD" }
        ]
    },
    {
        title: "Linh - Phụ kiện Laptop",
        links: [
            { label: "Ram laptop", url: "category.html?name=RAM Laptop" },
            { label: "SSD laptop", url: "category.html?name=SSD Laptop" },
            { label: "Ổ cứng di động", url: "category.html?name=Ổ cứng di động" }
        ]
    }
],
"linh-kien": [
    {
        title: "VGA RTX 50 SERIES",
        links: [
            { label: "RTX 5090", url: "category.html?name=RTX 5090" },
            { label: "RTX 5080", url: "category.html?name=RTX 5080" },
            { label: "RTX 5070Ti", url: "category.html?name=RTX 5070Ti" },
            { label: "RTX 5070", url: "category.html?name=RTX 5070" },
            { label: "RTX 5060Ti", url: "category.html?name=RTX 5060Ti" },
            { label: "RTX 5060", url: "category.html?name=RTX 5060" }
        ]
    },
    {
        title: "VGA (Trên 12 GB VRAM)",
        links: [
            { label: "RTX 4070 SUPER (12GB)", url: "category.html?name=RTX 4070 SUPER" },
            { label: "RTX 4070Ti SUPER (16GB)", url: "category.html?name=RTX 4070Ti SUPER" },
            { label: "RTX 4080 SUPER (16GB)", url: "category.html?name=RTX 4080 SUPER" },
            { label: "RTX 4090 SUPER (24GB)", url: "category.html?name=RTX 4090 SUPER" }
        ]
    },
    {
        title: "VGA (Dưới 12 GB VRAM)",
        links: [
            { label: "RTX 4060Ti (8 - 16GB)", url: "category.html?name=RTX 4060Ti" },
            { label: "RTX 4060 (8GB)", url: "category.html?name=RTX 4060" },
            { label: "RTX 3060 (12GB)", url: "category.html?name=RTX 3060" },
            { label: "RTX 3050 (6 - 8GB)", url: "category.html?name=RTX 3050" },
            { label: "GTX 1650 (4GB)", url: "category.html?name=GTX 1650" },
            { label: "GT 710 / GT 1030 (2-4GB)", url: "category.html?name=GT 710" }
        ]
    },
    {
        title: "VGA - Card màn hình",
        links: [
            { label: "NVIDIA Quadro", url: "category.html?name=NVIDIA Quadro" },
            { label: "AMD Radeon", url: "category.html?name=AMD Radeon" }
        ]
    },
    {
        title: "Bo mạch chủ Intel",
        links: [
            { label: "Z890 (Mới)", url: "category.html?name=Z890" },
            { label: "Z790", url: "category.html?name=Z790" },
            { label: "B760", url: "category.html?name=B760" },
            { label: "H610", url: "category.html?name=H610" },
            { label: "X299X", url: "category.html?name=X299X" },
            { label: "Xem tất cả", url: "category.html?name=Motherboard Intel" }
        ]
    },
    {
        title: "Bo mạch chủ AMD",
        links: [
            { label: "AMD X870 (Mới)", url: "category.html?name=X870" },
            { label: "AMD X670", url: "category.html?name=X670" },
            { label: "AMD X570", url: "category.html?name=X570" },
            { label: "AMD B650 (Mới)", url: "category.html?name=B650" },
            { label: "AMD B550", url: "category.html?name=B550" },
            { label: "AMD A320", url: "category.html?name=A320" },
            { label: "AMD TRX40", url: "category.html?name=TRX40" }
        ]
    },
    {
        title: "CPU - Bộ vi xử lý Intel",
        links: [
            { label: "CPU Intel Core Ultra Series 2 (Mới)", url: "category.html?name=Core Ultra" },
            { label: "CPU Intel 9", url: "category.html?name=Intel 9" },
            { label: "CPU Intel 7", url: "category.html?name=Intel 7" },
            { label: "CPU Intel 5", url: "category.html?name=Intel 5" },
            { label: "CPU Intel 3", url: "category.html?name=Intel 3" }
        ]
    },
    {
        title: "CPU - Bộ vi xử lý AMD",
        links: [
            { label: "CPU AMD Athlon", url: "category.html?name=Athlon" },
            { label: "CPU AMD R3", url: "category.html?name=R3" },
            { label: "CPU AMD R5", url: "category.html?name=R5" },
            { label: "CPU AMD R7", url: "category.html?name=R7" },
            { label: "CPU AMD R9", url: "category.html?name=R9" }
        ]
    }
],
"tan-nhiet": [
    {
        title: "VỎ MÁY - CASE",
        links: [
            { label: "Case MSI", url: "category.html?name=Case MSI" },
            { label: "Case ASUS / ROG", url: "category.html?name=Case ASUS" },
            { label: "Case GIGABYTE / AORUS", url: "category.html?name=Case GIGABYTE" },
            { label: "Case LIAN-LI", url: "category.html?name=Case LIAN-LI" },
            { label: "Case CORSAIR", url: "category.html?name=Case CORSAIR" },
            { label: "Case DEEPCOOL", url: "category.html?name=Case DEEPCOOL" },
            { label: "Case NZXT", url: "category.html?name=Case NZXT" },
            { label: "Case MIK", url: "category.html?name=Case MIK" },
            { label: "Case XIGMATEK", url: "category.html?name=Case XIGMATEK" }
        ]
    },
    {
        title: "NGUỒN MÁY TÍNH",
        links: [
            { label: "Nguồn MSI", url: "category.html?name=Nguồn MSI" },
            { label: "Nguồn ASUS / ROG", url: "category.html?name=Nguồn ASUS" },
            { label: "Nguồn GIGABYTE", url: "category.html?name=Nguồn GIGABYTE" },
            { label: "Nguồn CORSAIR", url: "category.html?name=Nguồn CORSAIR" },
            { label: "Nguồn DEEPCOOL", url: "category.html?name=Nguồn DEEPCOOL" },
            { label: "Nguồn NZXT", url: "category.html?name=Nguồn NZXT" },
            { label: "Nguồn LIAN-LI", url: "category.html?name=Nguồn LIAN-LI" },
            { label: "Nguồn MIK", url: "category.html?name=Nguồn MIK" },
            { label: "Nguồn XIGMATEK", url: "category.html?name=Nguồn XIGMATEK" },
            { label: "Nguồn JETEK", url: "category.html?name=Nguồn JETEK" }
        ]
    },
    {
        title: "TẢN NHIỆT NƯỚC AIO",
        links: [
            { label: "Tản AIO MSI", url: "category.html?name=Tản AIO MSI" },
            { label: "Tản AIO ASUS", url: "category.html?name=Tản AIO ASUS" },
            { label: "Tản AIO GIGABYTE", url: "category.html?name=Tản AIO GIGABYTE" },
            { label: "Tản AIO LIAN-LI", url: "category.html?name=Tản AIO LIAN-LI" },
            { label: "Tản AIO NZXT", url: "category.html?name=Tản AIO NZXT" },
            { label: "Tản AIO CORSAIR", url: "category.html?name=Tản AIO CORSAIR" },
            { label: "Tản AIO DEEPCOOL", url: "category.html?name=Tản AIO DEEPCOOL" },
            { label: "Tản AIO COOLER MASTER", url: "category.html?name=Tản AIO COOLER MASTER" }
        ]
    },
    {
        title: "TẢN NHIỆT KHÍ",
        links: [
            { label: "Tản khí Noctua", url: "category.html?name=Noctua" },
            { label: "Tản khí Deepcool", url: "category.html?name=Deepcool" },
            { label: "Tản khí Cooler Master", url: "category.html?name=Cooler Master" },
            { label: "Tản khí Thermalright", url: "category.html?name=Thermalright" },
            { label: "Tản khí ID-COOLING", url: "category.html?name=ID-COOLING" }
        ]
    },
    {
        title: "QUẠT TẢN NHIỆT (FAN)",
        links: [
            { label: "Fan Case LIAN-LI", url: "category.html?name=Fan LIAN-LI" },
            { label: "Fan Case CORSAIR", url: "category.html?name=Fan CORSAIR" },
            { label: "Fan Case NZXT", url: "category.html?name=Fan NZXT" },
            { label: "Fan Case DEEPCOOL", url: "category.html?name=Fan DEEPCOOL" },
            { label: "Fan Case MSI", url: "category.html?name=Fan MSI" },
            { label: "Fan Case ASUS", url: "category.html?name=Fan ASUS" }
        ]
    },
    {
        title: "PHỤ KIỆN TẢN NHIỆT",
        links: [
            { label: "Keo tản nhiệt", url: "category.html?name=Keo tản nhiệt" },
            { label: "Hub Fan / Controller", url: "category.html?name=Hub Fan" },
            { label: "Dây Led RGB", url: "category.html?name=Led RGB" },
            { label: "Giá đỡ VGA", url: "category.html?name=Giá đỡ VGA" }
        ]
    }
],
"luu-tru": [
    {
        title: "Dung lượng RAM",
        links: [
            { label: "8 GB", url: "category.html?name=RAM 8GB" },
            { label: "16 GB", url: "category.html?name=RAM 16GB" },
            { label: "32 GB", url: "category.html?name=RAM 32GB" },
            { label: "64 GB", url: "category.html?name=RAM 64GB" },
            { label: "Xem tất cả", url: "category.html?name=RAM" }
        ]
    },
    {
        title: "Loại RAM",
        links: [
            { label: "DDR4", url: "category.html?name=DDR4" },
            { label: "DDR5", url: "category.html?name=DDR5" },
            { label: "Xem tất cả", url: "category.html?name=RAM" }
        ]
    },
    {
        title: "Hãng RAM",
        links: [
            { label: "Corsair", url: "category.html?name=Corsair" },
            { label: "Kingston", url: "category.html?name=Kingston" },
            { label: "G.Skill", url: "category.html?name=G.Skill" },
            { label: "PNY", url: "category.html?name=PNY" },
            { label: "Xem tất cả", url: "category.html?name=RAM" }
        ]
    },
    {
        title: "Dung lượng HDD",
        links: [
            { label: "HDD 1 TB", url: "category.html?name=HDD 1TB" },
            { label: "HDD 2 TB", url: "category.html?name=HDD 2TB" },
            { label: "HDD 4 TB - 6 TB", url: "category.html?name=HDD 4TB" },
            { label: "HDD trên 8 TB", url: "category.html?name=HDD 8TB" },
            { label: "Xem tất cả", url: "category.html?name=HDD" }
        ]
    },
    {
        title: "Hãng HDD",
        links: [
            { label: "Western Digital", url: "category.html?name=Western Digital" },
            { label: "Seagate", url: "category.html?name=Seagate" },
            { label: "Toshiba", url: "category.html?name=Toshiba" },
            { label: "Xem tất cả", url: "category.html?name=HDD" }
        ]
    },
    {
        title: "Dung lượng SSD",
        links: [
            { label: "120GB - 128GB", url: "category.html?name=SSD 128GB" },
            { label: "250GB - 256GB", url: "category.html?name=SSD 256GB" },
            { label: "480GB - 512GB", url: "category.html?name=SSD 512GB" },
            { label: "960GB - 1TB", url: "category.html?name=SSD 1TB" },
            { label: "2TB", url: "category.html?name=SSD 2TB" },
            { label: "Trên 2TB", url: "category.html?name=SSD 2TB+" },
            { label: "Xem tất cả", url: "category.html?name=SSD" }
        ]
    },
    {
        title: "Hãng SSD",
        links: [
            { label: "Samsung", url: "category.html?name=Samsung" },
            { label: "Western Digital", url: "category.html?name=Western Digital" },
            { label: "Kingston", url: "category.html?name=Kingston" },
            { label: "Corsair", url: "category.html?name=Corsair" },
            { label: "PNY", url: "category.html?name=PNY" },
            { label: "Xem tất cả", url: "category.html?name=SSD" }
        ]
    },
    {
        title: "Thẻ nhớ / USB",
        links: [
            { label: "Sandisk", url: "category.html?name=Sandisk" }
        ]
    },
    {
        title: "Ổ cứng di động",
        links: []
    }
],
"am-thanh": [
    {
        title: "LOA MÁY TÍNH",
        links: [
            { label: "Loa Razer", url: "category.html?name=Razer Loa" },
            { label: "Loa Logitech", url: "category.html?name=Logitech Loa" },
            { label: "Loa Soundmax", url: "category.html?name=Soundmax" },
            { label: "Loa Microlab", url: "category.html?name=Microlab" },
            { label: "Loa Creative", url: "category.html?name=Creative" },
            { label: "Loa Edifier", url: "category.html?name=Edifier" },
            { label: "Xem tất cả", url: "category.html?name=Loa" }
        ]
    },
    {
        title: "LOA BLUETOOTH",
        links: [
            { label: "Loa Marshall", url: "category.html?name=Marshall" },
            { label: "Loa JBL", url: "category.html?name=JBL" },
            { label: "Loa Sony", url: "category.html?name=Sony" },
            { label: "Loa Bose", url: "category.html?name=Bose" },
            { label: "Loa Harman Kardon", url: "category.html?name=Harman Kardon" },
            { label: "Xem tất cả", url: "category.html?name=Loa Bluetooth" }
        ]
    },
    {
        title: "MICROPHONE",
        links: [
            { label: "Micro Razer", url: "category.html?name=Razer Micro" },
            { label: "Micro HyperX", url: "category.html?name=HyperX" },
            { label: "Micro Elgato", url: "category.html?name=Elgato" },
            { label: "Micro ASUS / ROG", url: "category.html?name=ASUS Micro" },
            { label: "Micro Blue (Logitech G)", url: "category.html?name=Blue Micro" },
            { label: "Xem tất cả", url: "category.html?name=Microphone" }
        ]
    },
    {
        title: "WEBCAM / THIẾT BỊ STREAM",
        links: [
            { label: "Webcam Razer", url: "category.html?name=Razer Webcam" },
            { label: "Webcam Logitech", url: "category.html?name=Logitech Webcam" },
            { label: "Webcam Elgato", url: "category.html?name=Elgato Webcam" },
            { label: "Thiết bị Stream Elgato", url: "category.html?name=Elgato Stream" },
            { label: "Capture Card", url: "category.html?name=Capture Card" },
            { label: "Đèn Stream / Phụ kiện", url: "category.html?name=Stream Light" },
            { label: "Xem tất cả", url: "category.html?name=Webcam" }
        ]
    },
    {
        title: "MÁY CHIẾU / PHỤ KIỆN",
        links: [
            { label: "Máy chiếu ASUS", url: "category.html?name=ASUS Projector" },
            { label: "Máy chiếu Samsung", url: "category.html?name=Samsung Projector" },
            { label: "Màn chiếu", url: "category.html?name=Màn chiếu" },
            { label: "Giá treo máy chiếu", url: "category.html?name=Giá treo" }
        ]
    }
],
"man-hinh": [
    {
        title: "Thương hiệu màn hình",
        links: [
            { label: "Màn hình ASUS", url: "category.html?name=ASUS Monitor" },
            { label: "Màn hình MSI", url: "category.html?name=MSI Monitor" },
            { label: "Màn hình GIGABYTE", url: "category.html?name=GIGABYTE Monitor" },
            { label: "Màn hình SAMSUNG", url: "category.html?name=Samsung Monitor" },
            { label: "Màn hình LG", url: "category.html?name=LG Monitor" },
            { label: "Màn hình DELL", url: "category.html?name=Dell Monitor" },
            { label: "Màn hình VIEWSONIC", url: "category.html?name=Viewsonic Monitor" },
            { label: "Màn hình AOC", url: "category.html?name=AOC Monitor" },
            { label: "Màn hình ACER", url: "category.html?name=Acer Monitor" }
        ]
    },
    {
        title: "Độ phân giải màn hình",
        links: [
            { label: "Màn hình Full HD (1080p)", url: "category.html?name=1080p" },
            { label: "Màn hình 2K (1440p)", url: "category.html?name=2K" },
            { label: "Màn hình 4K (2160p)", url: "category.html?name=4K" },
            { label: "Màn hình UltraWide (21:9)", url: "category.html?name=Ultrawide" }
        ]
    },
    {
        title: "Tần số quét màn hình",
        links: [
            { label: "Màn hình 60Hz - 75Hz", url: "category.html?name=60Hz" },
            { label: "Màn hình 100Hz - 144Hz", url: "category.html?name=144Hz" },
            { label: "Màn hình 165Hz - 180Hz", url: "category.html?name=165Hz" },
            { label: "Màn hình 240Hz - 360Hz", url: "category.html?name=240Hz" },
            { label: "Màn hình trên 360Hz", url: "category.html?name=360Hz" }
        ]
    },
    {
        title: "Kích thước màn hình",
        links: [
            { label: "Dưới 24 inch", url: "category.html?name=Monitor 21" },
            { label: "Màn hình 24 inch", url: "category.html?name=Monitor 24" },
            { label: "Màn hình 27 inch", url: "category.html?name=Monitor 27" },
            { label: "Màn hình 32 inch", url: "category.html?name=Monitor 32" },
            { label: "Trên 32 inch", url: "category.html?name=Monitor 34" }
        ]
    },
    {
        title: "Màn hình chuyên dụng",
        links: [
            { label: "Màn hình Gaming", url: "category.html?name=Gaming Monitor" },
            { label: "Màn hình Đồ họa (DCI-P3)", url: "category.html?name=Designer Monitor" },
            { label: "Màn hình Văn phòng", url: "category.html?name=Office Monitor" },
            { label: "Màn hình Cong", url: "category.html?name=Curved Monitor" },
            { label: "Màn hình OLED / QD-OLED", url: "category.html?name=OLED Monitor" }
        ]
    },
    {
        title: "Phụ kiện màn hình",
        links: [
            { label: "Giá treo màn hình (Arm)", url: "category.html?name=Arm" },
            { label: "Dây cáp HDMI / DisplayPort", url: "category.html?name=HDMI Cable" },
            { label: "Bộ vệ sinh màn hình", url: "category.html?name=Monitor Cleaner" }
        ]
    }
],
"ban-phim": [
    {
        title: "BÀN PHÍM THEO HÃNG",
        links: [
            { label: "Bàn phím AKKO", url: "category.html?name=AKKO" },
            { label: "Bàn phím RAZER", url: "category.html?name=Razer Keyboard" },
            { label: "Bàn phím LOGITECH", url: "category.html?name=Logitech Keyboard" },
            { label: "Bàn phím CORSAIR", url: "category.html?name=Corsair Keyboard" },
            { label: "Bàn phím ASUS / ROG", url: "category.html?name=ASUS Keyboard" },
            { label: "Bàn phím MSI", url: "category.html?name=MSI Keyboard" },
            { label: "Bàn phím STEELSERIES", url: "category.html?name=Steelseries Keyboard" },
            { label: "Bàn phím DAREU", url: "category.html?name=Dareu" },
            { label: "Bàn phím E-DRA", url: "category.html?name=E-DRA" }
        ]
    },
    {
        title: "BÀN PHÍM CƠ CAO CẤP",
        links: [
            { label: "Bàn phím Leopold", url: "category.html?name=Leopold" },
            { label: "Bàn phím Filco", url: "category.html?name=Filco" },
            { label: "Bàn phím Varmilo", url: "category.html?name=Varmilo" },
            { label: "Bàn phím Realforce", url: "category.html?name=Realforce" },
            { label: "Bàn phím Keychron", url: "category.html?name=Keychron" }
        ]
    },
    {
        title: "BÀN PHÍM CUSTOM / KIT",
        links: [
            { label: "Kit bàn phím cơ", url: "category.html?name=Keyboard Kit" },
            { label: "Switch bàn phím", url: "category.html?name=Keyboard Switch" },
            { label: "Keycap (Bộ nút phím)", url: "category.html?name=Keycap" },
            { label: "Dây cáp xoắn (Coiled Cable)", url: "category.html?name=Coiled Cable" },
            { label: "Dụng cụ Mod phím (Lube, Film)", url: "category.html?name=Keyboard Lube" }
        ]
    },
    {
        title: "BÀN PHÍM THEO NHU CẦU",
        links: [
            { label: "Bàn phím Gaming", url: "category.html?name=Gaming Keyboard" },
            { label: "Bàn phím Không dây (Wireless)", url: "category.html?name=Wireless Keyboard" },
            { label: "Bàn phím Văn phòng", url: "category.html?name=Office Keyboard" },
            { label: "Bàn phím Giả cơ", url: "category.html?name=Mechanical Keyboard" },
            { label: "Combo Phím + Chuột", url: "category.html?name=Keyboard Mouse Combo" }
        ]
    },
    {
        title: "KÍCH THƯỚC BÀN PHÍM",
        links: [
            { label: "Fullsize (104 - 108 phím)", url: "category.html?name=Fullsize Keyboard" },
            { label: "Tenkeyless (TKL - 80%)", url: "category.html?name=TKL Keyboard" },
            { label: "Mini (60% - 65% - 75%)", url: "category.html?name=60% Keyboard" }
        ]
    }
],
"chuot": [
    {
        title: "Thương hiệu chuột",
        links: [
            { label: "Logitech", url: "category.html?name=Logitech Mouse" },
            { label: "Razer", url: "category.html?name=Chuột Razer" },
            { label: "Corsair", url: "category.html?name=Corsair Mouse" },
            { label: "Microsoft", url: "category.html?name=Microsoft Mouse" },
            { label: "Dare-U", url: "category.html?name=DareU Mouse" },
            { label: "ASUS", url: "category.html?name=ASUS Mouse" },
            { label: "Steelseries", url: "category.html?name=Steelseries Mouse" },
            { label: "Glorious", url: "category.html?name=Glorious" },
            { label: "Rapoo", url: "category.html?name=Rapoo" },
            { label: "HyperX", url: "category.html?name=HyperX Mouse" },
            { label: "ATK", url: "category.html?name=ATK" }
        ]
    },
    {
        title: "Chuột theo giá tiền",
        links: [
            { label: "Dưới 500 nghìn", url: "category.html?maxPrice=500000" },
            { label: "Từ 500 nghìn - 1 triệu", url: "category.html?minPrice=500000&maxPrice=1000000" },
            { label: "Từ 1 triệu - 2 triệu", url: "category.html?minPrice=1000000&maxPrice=2000000" },
            { label: "Trên 2 triệu - 3 triệu", url: "category.html?minPrice=2000000&maxPrice=3000000" },
            { label: "Trên 3 triệu", url: "category.html?minPrice=3000000" }
        ]
    },
    {
        title: "Loại chuột",
        links: [
            { label: "Chuột Gaming", url: "category.html?name=Gaming Mouse" },
            { label: "Chuột Không dây", url: "category.html?name=Wireless Mouse" },
            { label: "Chuột có dây", url: "category.html?name=Wired Mouse" }
        ]
    },
    {
        title: "Cảm biến chuột",
        links: [
            { label: "Logitech MX", url: "category.html?name=Logitech MX" },
            { label: "Razer Focus", url: "category.html?name=Razer Focus" },
            { label: "Corsair Dark Core", url: "category.html?name=Dark Core" }
        ]
    },
    {
        title: "Phụ kiện chuột",
        links: [
            { label: "Lót chuột (Mousepad)", url: "category.html?name=Mousepad" },
            { label: "Lót chuột Gaming", url: "category.html?name=Gaming Mousepad" },
            { label: "Hỗ trợ chuột", url: "category.html?name=Mouse Rest" }
        ]
    },
    {
        title: "Loại Chuột",
        links: [
            { label: "Chuột chơi game", url: "category.html?name=Gaming Mouse" },
            { label: "Chuột văn phòng", url: "category.html?name=Office Mouse" },
            { label: "Logitech Gaming", url: "category.html?name=Logitech Gaming" },
            { label: "Logitech Văn phòng", url: "category.html?name=Logitech Office" }
        ]
    },
    {
        title: "Thương hiệu lót chuột",
        links: [
            "GEARVN",
            "ASUS",
            "Steelseries",
            "Dare-U",
            "Razer",
            "SKYLOONG"
        ]
    },
    {
        title: "Các loại lót chuột",
        links: [
            "Mềm",
            "Cứng",
            "Dày",
            "Mỏng",
            "Viền có led"
        ]
    },
    {
        title: "Lót chuột theo size",
        links: [
            "Nhỏ",
            "Vừa",
            "Lớn"
        ]
    }
],
"tai-nghe": [
    {
        title: "Thương hiệu tai nghe",
        links: [
            { label: "ASUS", url: "category.html?name=ASUS Headset" },
            { label: "HyperX", url: "category.html?name=HyperX Headset" },
            { label: "Corsair", url: "category.html?name=Corsair Headset" },
            { label: "Razer", url: "category.html?name=Razer Headset" },
            { label: "ONIKUMA", url: "category.html?name=Onikuma" },
            { label: "Steelseries", url: "category.html?name=Steelseries Headset" },
            { label: "Rapoo", url: "category.html?name=Rapoo" },
            { label: "Logitech", url: "category.html?name=Logitech Headset" },
            { label: "Edifier", url: "category.html?name=Edifier" }
        ]
    },
    {
        title: "Tai nghe theo giá",
        links: [
            { label: "Tai nghe dưới 1 triệu", url: "category.html?maxPrice=1000000" },
            { label: "Tai nghe 1 triệu đến 2 triệu", url: "category.html?minPrice=1000000&maxPrice=2000000" },
            { label: "Tai nghe 2 triệu đến 3 triệu", url: "category.html?minPrice=2000000&maxPrice=3000000" },
            { label: "Tai nghe 3 triệu đến 4 triệu", url: "category.html?minPrice=3000000&maxPrice=4000000" },
            { label: "Tai nghe trên 4 triệu", url: "category.html?minPrice=4000000" }
        ]
    },
    {
        title: "Kiểu kết nối",
        links: [
            { label: "Tai nghe Wireless", url: "category.html?name=Wireless Headset" },
            { label: "Tai nghe Bluetooth", url: "category.html?name=Bluetooth Headset" }
        ]
    },
    {
        title: "Kiểu tai nghe",
        links: [
            { label: "Tai nghe Over-ear", url: "category.html?name=Over-ear Headset" },
            { label: "Tai nghe Gaming In-ear", url: "category.html?name=In-ear Headset" }
        ]
    }
],
"ghe-ban": [
    {
        title: "Thương hiệu ghế Gaming",
        links: [
            { label: "Corsair", url: "category.html?name=Corsair Chair" },
            { label: "Warrior", url: "category.html?name=Warrior Chair" },
            { label: "E-DRA", url: "category.html?name=E-DRA Chair" },
            { label: "DXRacer", url: "category.html?name=DXRacer" },
            { label: "Cougar", url: "category.html?name=Cougar Chair" },
            { label: "AKRaing", url: "category.html?name=AKRaing" },
            { label: "Razer", url: "category.html?name=Razer Chair" }
        ]
    },
    {
        title: "Thương hiệu ghế CTH",
        links: [
            { label: "Warrior", url: "category.html?name=Warrior Ergonomic" },
            { label: "Sihoo", url: "category.html?name=Sihoo" },
            { label: "E-Dra", url: "category.html?name=E-Dra Ergonomic" }
        ]
    },
    {
        title: "Kiểu ghế",
        links: [
            { label: "Ghế Công thái học", url: "category.html?name=Ergonomic Chair" },
            { label: "Ghế Gaming", url: "category.html?name=Gaming Chair" }
        ]
    },
    {
        title: "Giá tiền",
        links: [
            { label: "Dưới 5 triệu", url: "category.html?maxPrice=5000000" },
            { label: "Từ 5 đến 10 triệu", url: "category.html?minPrice=5000000&maxPrice=10000000" },
            { label: "Trên 10 triệu", url: "category.html?minPrice=10000000" }
        ]
    },
    {
        title: "Bàn Gaming",
        links: [
            { label: "Bàn Gaming DXRacer", url: "category.html?name=DXRacer Desk" },
            { label: "Bàn Gaming E-Dra", url: "category.html?name=E-Dra Desk" },
            { label: "Bàn Gaming Warrior", url: "category.html?name=Warrior Desk" }
        ]
    },
    {
        title: "Bàn công thái học",
        links: [
            { label: "Bàn CTH Warrior", url: "category.html?name=Warrior Table" },
            { label: "Phụ kiện bàn ghế", url: "category.html?name=Desk Accessories" }
        ]
    }
],
"phan-mem": [
    {
        title: "Hệ điều hành",
        links: [
            { label: "Windows 11 Home / Pro", url: "category.html?name=Windows 11" },
            { label: "Windows 10 Home / Pro", url: "category.html?name=Windows 10" },
            { label: "Nâng cấp Windows", url: "category.html?name=Windows Upgrade" }
        ]
    },
    {
        title: "Phần mềm văn phòng",
        links: [
            { label: "Microsoft Office 365", url: "category.html?name=Office 365" },
            { label: "Microsoft Office 2021", url: "category.html?name=Office 2021" },
            { label: "Phần mềm PDF (Adobe, Foxit)", url: "category.html?name=PDF Software" }
        ]
    },
    {
        title: "Phần mềm diệt Virus",
        links: [
            { label: "Kaspersky", url: "category.html?name=Kaspersky" },
            { label: "ESET NOD32", url: "category.html?name=ESET" },
            { label: "McAfee", url: "category.html?name=McAfee" },
            { label: "Norton Antivirus", url: "category.html?name=Norton" }
        ]
    },
    {
        title: "Thiết bị mạng (Router)",
        links: [
            { label: "Router ASUS", url: "category.html?name=ASUS Router" },
            { label: "Router TP-Link", url: "category.html?name=TP-Link Router" },
            { label: "Router Totolink", url: "category.html?name=Totolink" },
            { label: "Hệ thống Mesh Wi-Fi", url: "category.html?name=Mesh WiFi" }
        ]
    },
    {
        title: "Thiết bị mạng khác",
        links: [
            { label: "USB Wi-Fi / Card Wi-Fi", url: "category.html?name=WiFi Card" },
            { label: "Bộ kích sóng Wi-Fi", url: "category.html?name=WiFi Booster" },
            { label: "Switch chia mạng", url: "category.html?name=Network Switch" },
            { label: "Cáp mạng / Đầu bấm", url: "category.html?name=Network Cable" }
        ]
    }
],
"game-console": [
    {
        title: "Handheld PC",
        links: [
            { label: "Rog Ally", url: "category.html?name=ROG Ally" },
            { label: "MSI Claw", url: "category.html?name=MSI Claw" },
            { label: "Legion Go", url: "category.html?name=Legion Go" }
        ]
    },
    {
        title: "Tay cầm",
        links: [
            { label: "Tay cầm Playstation", url: "category.html?name=PS Controller" },
            { label: "Tay cầm Rapoo", url: "category.html?name=Rapoo Controller" },
            { label: "Tay cầm DareU", url: "category.html?name=DareU Gamepad" },
            { label: "Xem tất cả", url: "category.html?name=Gamepad" }
        ]
    },
    {
        title: "Vô lăng lái xe, máy bay",
        links: [
            { label: "Vô lăng Logitech", url: "category.html?name=Logitech Wheel" },
            { label: "Vô lăng PXN", url: "category.html?name=PXN Wheel" }
        ]
    },
    {
        title: "Phụ kiện khác",
        links: [
            { label: "Ghế sim racing", url: "category.html?name=Sim Racing Seat" },
            { label: "Chân máy game", url: "category.html?name=Game Console Stand" },
            { label: "Xem tất cả", url: "category.html?name=Gaming Accessories" }
        ]
    }
],
"phu-kien": [
    {
        title: "Hub, sạc, cáp",
        links: [
            { label: "Hub chuyển đổi", url: "category.html?name=Hub" },
            { label: "Dây cáp", url: "category.html?name=Cable" },
            { label: "Củ sạc", url: "category.html?name=Charger" }
        ]
    },
    {
        title: "Quạt cầm tay, Quạt mini",
        links: [
            { label: "Jisulife", url: "category.html?name=Jisulife" }
        ]
    },
    {
        title: "Phụ kiện Elgato",
        links: [
            { label: "Giá đỡ / Arm", url: "category.html?name=Elgato Arm" },
            { label: "Phụ kiện Stream", url: "category.html?name=Elgato Accessories" }
        ]
    },
    {
        title: "Sạc dự phòng",
        links: [
            { label: "Sạc dự phòng chính hãng", url: "category.html?name=Power Bank" },
            { label: "Sạc dự phòng không dây", url: "category.html?name=Wireless Power Bank" }
        ]
    }
],
"dich-vu": [
    {
        title: "Dịch vụ",
        links: [
            { label: "Dịch vụ kỹ thuật tại nhà", url: "category.html?name=Technical Service" },
            { label: "Dịch vụ sửa chữa", url: "category.html?name=Repair Service" }
        ]
    },
    {
        title: "Chính sách",
        links: [
            { label: "Chính sách & bảng giá thu VGA qua sử dụng", url: "category.html?name=Trade-in Policy" },
            { label: "Chính sách bảo hành", url: "category.html?name=Warranty Policy" },
            { label: "Chính sách giao hàng", url: "category.html?name=Shipping Policy" },
            { label: "Chính sách đổi trả", url: "category.html?name=Return Policy" }
        ]
    },
    {
        title: "Build PC",
        links: [
            { label: "Xây dựng cấu hình PC máy tính", url: "category.html?name=PC Build Service" }
        ]
    }
]
};