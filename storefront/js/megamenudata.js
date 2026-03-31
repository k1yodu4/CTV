const menuData = [
    { name: "PC GVN", icon: "bi-pc-display", target: "#megamenu-pc-gvn" },
    { name: "Laptop", icon: "bi-laptop", target: "#megamenu-laptop" },
    { name: "Laptop Gaming", icon: "bi-headset", target: "#megamenu-laptop-gaming" },
    { name: "Main, CPU, VGA", icon: "bi-cpu", target: "#megamenu-linh-kien" },
    { name: "Case, Nguồn, Tản", icon: "bi-pc-display-horizontal", target: "#megamenu-tan-nhiet" },
    { name: "Ổ cứng, RAM, Thẻ nhớ", icon: "bi-memory", target: "#megamenu-luu-tru" },
    { name: "Loa, Micro, Webcam", icon: "bi-speakers", target: "#megamenu-am-thanh" },
    { name: "Màn hình", icon: "bi-display", target: "#megamenu-man-hinh" },
    { name: "Bàn phím", icon: "bi-keyboard", target: "#megamenu-ban-phim" },
    { name: "Chuột + Lót chuột", icon: "bi-mouse3", target: "#megamenu-chuot" },
    { name: "Tai nghe", icon: "bi-headset-mic", target: "#megamenu-tai-nghe" },
    { name: "Ghế - Bàn", icon: "bi-armchair", target: "#megamenu-ghe-ban" },
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
            "PC DƯỚI 30 TRIỆU",
            "PC TỪ 30 - 50 TRIỆU",
            "PC TỪ 50 - 70 TRIỆU",
            "PC TỪ 70 - 100 TRIỆU",
            "PC TỪ 100 - 200 TRIỆU",
            "PC TRÊN 200 TRIỆU"
        ]
    },
    {
        title: "PC RTX 50 Series",
        links: [
            "PC RTX 5090",
            "PC RTX 5080",
            "PC RTX 5070Ti",
            "PC RTX 5070",
            "PC RTX 5060Ti"
        ]
    },
    {
        title: "PC theo cấu hình VGA",
        links: [
            "PC RTX 5060 (HOT)",
            "PC RTX 5050",
            "PC RTX 3060 (HOT)",
            "PC RTX 3050"
        ]
    },
    {
        title: "PC theo cấu hình VGA", // Cột VGA thứ 2 trong ảnh
        links: [
            "PC RTX 5060Ti",
            "PC RTX 5070",
            "PC RTX 5070Ti",
            "PC RTX 5080",
            "PC RTX 5090"
        ]
    },
    {
        title: "PC khuyến mãi KHỦNG",
        links: [
            "PC I7 TẶNG MÀN 240HZ",
            "GVN x MSI - Tặng màn OLED",
            "GVN x ASUS - MAX SETTING"
        ]
    },
    {
        title: "PC theo CPU AMD",
        links: [
            "PC AMD R3",
            "PC AMD R5 (HOT)",
            "PC AMD R7",
            "PC AMD R9"
        ]
    },
    {
        title: "PC theo CPU Intel",
        links: [
            "PC Core i3",
            "PC Core i5",
            "PC Core i7 (HOT)",
            "PC Core i9"
        ]
    },
    {
        title: "PC theo CPU Intel", // Dòng Ultra mới
        links: [
            "PC Ultra 5",
            "PC Ultra 7",
            "PC Ultra 9"
        ]
    },
    {
        title: "PC Văn phòng",
        links: [
            "Homework Athlon - Giá chỉ 3.990k",
            "Homework R3 - Giá chỉ 5.690k",
            "Homework R5 - Giá chỉ 5.690k",
            "Homework I5 - Giá chỉ 5.690k"
        ]
    },
    {
        title: "Phần mềm bản quyền",
        links: [
            "Window bản quyền - Chỉ từ 2.990K",
            "Office 365 bản quyền - Chỉ từ 990K"
        ]
    }
],
        "laptop": [
    {
        title: "LAPTOP THEO NHU CẦU",
        links: [
            "Laptop Gaming (HOT)",
            "Laptop Văn Phòng",
            "Laptop Đồ Họa",
            "Laptop Mỏng Nhẹ",
            "Laptop AI (NEW)",
            "Laptop Cảm Ứng",
            "Laptop Sinh Viên"
        ]
    },
    {
        title: "LAPTOP GAMING",
        links: [
            "Laptop RTX 40 Series",
            "Laptop RTX 30 Series",
            "Laptop Gaming Intel",
            "Laptop Gaming AMD"
        ]
    },
    {
        title: "LAPTOP THEO GIÁ",
        links: [
            "Dưới 15 Triệu",
            "Từ 15 - 20 Triệu",
            "Từ 20 - 25 Triệu",
            "Từ 25 - 30 Triệu",
            "Trên 30 Triệu"
        ]
    },
    {
        title: "THƯƠNG HIỆU LAPTOP",
        links: [
            "Laptop ASUS",
            "Laptop MSI",
            "Laptop ACER",
            "Laptop GIGABYTE",
            "Laptop LENOVO",
            "Laptop HP",
            "Laptop DELL"
        ]
    },
    {
        title: "APPLE (MACBOOK)",
        links: [
            "Macbook Air M1",
            "Macbook Air M2",
            "Macbook Air M3",
            "Macbook Pro M3 Series"
        ]
    },
    {
        title: "LINH KIỆN LAPTOP",
        links: [
            "RAM Laptop",
            "SSD Laptop",
            "Sạc Laptop",
            "Balo / Túi chống sốc",
            "Giá đỡ Laptop / Đế tản nhiệt"
        ]
    }
],
"laptop-gaming": [
    {
        title: "Thương hiệu",
        links: [
            "ACER / PREDATOR",
            "ASUS / ROG",
            "MSI",
            "LENOVO",
            "DELL",
            "GIGABYTE / AORUS",
            "HP"
        ]
    },
    {
        title: "Giá bán",
        links: [
            "Dưới 20 triệu",
            "Từ 20 đến 25 triệu",
            "Từ 25 đến 30 triệu",
            "Trên 30 triệu",
            "Gaming RTX 50 Series"
        ]
    },
    {
        title: "ACER | PREDATOR",
        links: [
            "Nitro ProPanel Series",
            "Nitro Series",
            "Aspire Series",
            "Predator Series",
            "ACER RTX 50 Series"
        ]
    },
    {
        title: "ASUS | ROG Gaming",
        links: [
            "ROG Series",
            "TUF Series",
            "Zephyrus Series",
            "ASUS RTX 50 Series"
        ]
    },
    {
        title: "MSI Gaming",
        links: [
            "Titan GT Series",
            "Stealth GS Series",
            "Raider GE Series",
            "Vector GP Series",
            "Crosshair / Pulse GL Series",
            "Sword / Katana GF66 Series",
            "Cyborg / Thin GF Series",
            "MSI RTX 50 Series"
        ]
    },
    {
        title: "LENOVO Gaming",
        links: [
            "Legion Gaming",
            "LOQ series",
            "RTX 50 Series"
        ]
    },
    {
        title: "GIGABYTE Gaming",
        links: [
            "Gaming Gigabyte",
            "GIGABYTE RTX 50 Series"
        ]
    },
    {
        title: "HP Gaming",
        links: [
            "HP Victus",
            "HP Omen",
            "HP RTX 50 Series"
        ]
    },
    {
        title: "Cấu hình",
        links: [
            "RTX 50 Series",
            "CPU Core Ultra",
            "CPU AMD"
        ]
    },
    {
        title: "Linh - Phụ kiện Laptop",
        links: [
            "Ram laptop",
            "SSD laptop",
            "Ổ cứng di động"
        ]
    }
],
"linh-kien": [
    {
        title: "VGA RTX 50 SERIES",
        links: [
            "RTX 5090",
            "RTX 5080",
            "RTX 5070Ti",
            "RTX 5070",
            "RTX 5060Ti",
            "RTX 5060"
        ]
    },
    {
        title: "VGA (Trên 12 GB VRAM)",
        links: [
            "RTX 4070 SUPER (12GB)",
            "RTX 4070Ti SUPER (16GB)",
            "RTX 4080 SUPER (16GB)",
            "RTX 4090 SUPER (24GB)"
        ]
    },
    {
        title: "VGA (Dưới 12 GB VRAM)",
        links: [
            "RTX 4060Ti (8 - 16GB)",
            "RTX 4060 (8GB)",
            "RTX 3060 (12GB)",
            "RTX 3050 (6 - 8GB)",
            "GTX 1650 (4GB)",
            "GT 710 / GT 1030 (2-4GB)"
        ]
    },
    {
        title: "VGA - Card màn hình",
        links: [
            "NVIDIA Quadro",
            "AMD Radeon"
        ]
    },
    {
        title: "Bo mạch chủ Intel",
        links: [
            "Z890 (Mới)",
            "Z790",
            "B760",
            "H610",
            "X299X",
            "Xem tất cả"
        ]
    },
    {
        title: "Bo mạch chủ AMD",
        links: [
            "AMD X870 (Mới)",
            "AMD X670",
            "AMD X570",
            "AMD B650 (Mới)",
            "AMD B550",
            "AMD A320",
            "AMD TRX40"
        ]
    },
    {
        title: "CPU - Bộ vi xử lý Intel",
        links: [
            "CPU Intel Core Ultra Series 2 (Mới)",
            "CPU Intel 9",
            "CPU Intel 7",
            "CPU Intel 5",
            "CPU Intel 3"
        ]
    },
    {
        title: "CPU - Bộ vi xử lý AMD",
        links: [
            "CPU AMD Athlon",
            "CPU AMD R3",
            "CPU AMD R5",
            "CPU AMD R7",
            "CPU AMD R9"
        ]
    }
],
"tan-nhiet": [
    {
        title: "VỎ MÁY - CASE",
        links: [
            "Case MSI",
            "Case ASUS / ROG",
            "Case GIGABYTE / AORUS",
            "Case LIAN-LI",
            "Case CORSAIR",
            "Case DEEPCOOL",
            "Case NZXT",
            "Case MIK",
            "Case DEEPCOOL",
            "Case XIGMATEK"
        ]
    },
    {
        title: "NGUỒN MÁY TÍNH",
        links: [
            "Nguồn MSI",
            "Nguồn ASUS / ROG",
            "Nguồn GIGABYTE",
            "Nguồn CORSAIR",
            "Nguồn DEEPCOOL",
            "Nguồn NZXT",
            "Nguồn LIAN-LI",
            "Nguồn MIK",
            "Nguồn XIGMATEK",
            "Nguồn JETEK"
        ]
    },
    {
        title: "TẢN NHIỆT NƯỚC AIO",
        links: [
            "Tản AIO MSI",
            "Tản AIO ASUS",
            "Tản AIO GIGABYTE",
            "Tản AIO LIAN-LI",
            "Tản AIO NZXT",
            "Tản AIO CORSAIR",
            "Tản AIO DEEPCOOL",
            "Tản AIO COOLER MASTER"
        ]
    },
    {
        title: "TẢN NHIỆT KHÍ",
        links: [
            "Tản khí Noctua",
            "Tản khí Deepcool",
            "Tản khí Cooler Master",
            "Tản khí Thermalright",
            "Tản khí ID-COOLING"
        ]
    },
    {
        title: "QUẠT TẢN NHIỆT (FAN)",
        links: [
            "Fan Case LIAN-LI",
            "Fan Case CORSAIR",
            "Fan Case NZXT",
            "Fan Case DEEPCOOL",
            "Fan Case MSI",
            "Fan Case ASUS"
        ]
    },
    {
        title: "PHỤ KIỆN TẢN NHIỆT",
        links: [
            "Keo tản nhiệt",
            "Hub Fan / Controller",
            "Dây Led RGB",
            "Giá đỡ VGA"
        ]
    }
],
"luu-tru": [
    {
        title: "Dung lượng RAM",
        links: ["8 GB", "16 GB", "32 GB", "64 GB", "Xem tất cả"]
    },
    {
        title: "Loại RAM",
        links: ["DDR4", "DDR5", "Xem tất cả"]
    },
    {
        title: "Hãng RAM",
        links: ["Corsair", "Kingston", "G.Skill", "PNY", "Xem tất cả"]
    },
    {
        title: "Dung lượng HDD",
        links: ["HDD 1 TB", "HDD 2 TB", "HDD 4 TB - 6 TB", "HDD trên 8 TB", "Xem tất cả"]
    },
    {
        title: "Hãng HDD",
        links: ["Western Digital", "Seagate", "Toshiba", "Xem tất cả"]
    },
    {
        title: "Dung lượng SSD",
        links: [
            "120GB - 128GB",
            "250GB - 256GB",
            "480GB - 512GB",
            "960GB - 1TB",
            "2TB",
            "Trên 2TB",
            "Xem tất cả"
        ]
    },
    {
        title: "Hãng SSD",
        links: [
            "Samsung",
            "Western Digital",
            "Kingston",
            "Corsair",
            "PNY",
            "Xem tất cả"
        ]
    },
    {
        title: "Thẻ nhớ / USB",
        links: ["Sandisk"]
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
            "Loa Razer",
            "Loa Logitech",
            "Loa Soundmax",
            "Loa Microlab",
            "Loa Creative",
            "Loa Edifier",
            "Xem tất cả"
        ]
    },
    {
        title: "LOA BLUETOOTH",
        links: [
            "Loa Marshall",
            "Loa JBL",
            "Loa Sony",
            "Loa Bose",
            "Loa Harman Kardon",
            "Xem tất cả"
        ]
    },
    {
        title: "MICROPHONE",
        links: [
            "Micro Razer",
            "Micro HyperX",
            "Micro Elgato",
            "Micro ASUS / ROG",
            "Micro Blue (Logitech G)",
            "Xem tất cả"
        ]
    },
    {
        title: "WEBCAM / THIẾT BỊ STREAM",
        links: [
            "Webcam Razer",
            "Webcam Logitech",
            "Webcam Elgato",
            "Thiết bị Stream Elgato",
            "Capture Card",
            "Đèn Stream / Phụ kiện",
            "Xem tất cả"
        ]
    },
    {
        title: "MÁY CHIẾU / PHỤ KIỆN",
        links: [
            "Máy chiếu ASUS",
            "Máy chiếu Samsung",
            "Màn chiếu",
            "Giá treo máy chiếu"
        ]
    }
],
"man-hinh": [
    {
        title: "Thương hiệu màn hình",
        links: [
            "Màn hình ASUS",
            "Màn hình MSI",
            "Màn hình GIGABYTE",
            "Màn hình SAMSUNG",
            "Màn hình LG",
            "Màn hình DELL",
            "Màn hình VIEWSONIC",
            "Màn hình AOC",
            "Màn hình ACER"
        ]
    },
    {
        title: "Độ phân giải màn hình",
        links: [
            "Màn hình Full HD (1080p)",
            "Màn hình 2K (1440p)",
            "Màn hình 4K (2160p)",
            "Màn hình UltraWide (21:9)"
        ]
    },
    {
        title: "Tần số quét màn hình",
        links: [
            "Màn hình 60Hz - 75Hz",
            "Màn hình 100Hz - 144Hz",
            "Màn hình 165Hz - 180Hz",
            "Màn hình 240Hz - 360Hz",
            "Màn hình trên 360Hz"
        ]
    },
    {
        title: "Kích thước màn hình",
        links: [
            "Dưới 24 inch",
            "Màn hình 24 inch",
            "Màn hình 27 inch",
            "Màn hình 32 inch",
            "Trên 32 inch"
        ]
    },
    {
        title: "Màn hình chuyên dụng",
        links: [
            "Màn hình Gaming",
            "Màn hình Đồ họa (DCI-P3)",
            "Màn hình Văn phòng",
            "Màn hình Cong",
            "Màn hình OLED / QD-OLED"
        ]
    },
    {
        title: "Phụ kiện màn hình",
        links: [
            "Giá treo màn hình (Arm)",
            "Dây cáp HDMI / DisplayPort",
            "Bộ vệ sinh màn hình"
        ]
    }
],
"ban-phim": [
    {
        title: "BÀN PHÍM THEO HÃNG",
        links: [
            "Bàn phím AKKO",
            "Bàn phím RAZER",
            "Bàn phím LOGITECH",
            "Bàn phím CORSAIR",
            "Bàn phím ASUS / ROG",
            "Bàn phím MSI",
            "Bàn phím STEELSERIES",
            "Bàn phím DAREU",
            "Bàn phím E-DRA"
        ]
    },
    {
        title: "BÀN PHÍM CƠ CAO CẤP",
        links: [
            "Bàn phím Leopold",
            "Bàn phím Filco",
            "Bàn phím Varmilo",
            "Bàn phím Realforce",
            "Bàn phím Keychron"
        ]
    },
    {
        title: "BÀN PHÍM CUSTOM / KIT",
        links: [
            "Kit bàn phím cơ",
            "Switch bàn phím",
            "Keycap (Bộ nút phím)",
            "Dây cáp xoắn (Coiled Cable)",
            "Dụng cụ Mod phím (Lube, Film)"
        ]
    },
    {
        title: "BÀN PHÍM THEO NHU CẦU",
        links: [
            "Bàn phím Gaming",
            "Bàn phím Không dây (Wireless)",
            "Bàn phím Văn phòng",
            "Bàn phím Giả cơ",
            "Combo Phím + Chuột"
        ]
    },
    {
        title: "KÍCH THƯỚC BÀN PHÍM",
        links: [
            "Fullsize (104 - 108 phím)",
            "Tenkeyless (TKL - 80%)",
            "Mini (60% - 65% - 75%)"
        ]
    }
],
"chuot": [
    {
        title: "Thương hiệu chuột",
        links: [
            "Logitech",
            "Razer",
            "Corsair",
            "Microsoft",
            "Dare-U",
            "ASUS",
            "Steelseries",
            "Glorious",
            "Rapoo",
            "HyperX",
            "ATK"
        ]
    },
    {
        title: "Chuột theo giá tiền",
        links: [
            "Dưới 500 nghìn",
            "Từ 500 nghìn - 1 triệu",
            "Từ 1 triệu - 2 triệu",
            "Trên 2 triệu - 3 triệu",
            "Trên 3 triệu"
        ]
    },
    {
        title: "Loại Chuột",
        links: [
            "Chuột chơi game",
            "Chuột văn phòng",
            "Logitech Gaming",
            "Logitech Văn phòng"
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
            "ASUS",
            "HyperX",
            "Corsair",
            "Razer",
            "ONIKUMA",
            "Steelseries",
            "Rapoo",
            "Logitech",
            "Edifier"
        ]
    },
    {
        title: "Tai nghe theo giá",
        links: [
            "Tai nghe dưới 1 triệu",
            "Tai nghe 1 triệu đến 2 triệu",
            "Tai nghe 2 triệu đến 3 triệu",
            "Tai nghe 3 triệu đến 4 triệu",
            "Tai nghe trên 4 triệu"
        ]
    },
    {
        title: "Kiểu kết nối",
        links: [
            "Tai nghe Wireless",
            "Tai nghe Bluetooth"
        ]
    },
    {
        title: "Kiểu tai nghe",
        links: [
            "Tai nghe Over-ear",
            "Tai nghe Gaming In-ear"
        ]
    }
],
"ghe-ban": [
    {
        title: "Thương hiệu ghế Gaming",
        links: [
            "Corsair",
            "Warrior",
            "E-DRA",
            "DXRacer",
            "Cougar",
            "AKRaing",
            "Razer"
        ]
    },
    {
        title: "Thương hiệu ghế CTH",
        links: [
            "Warrior",
            "Sihoo",
            "E-Dra"
        ]
    },
    {
        title: "Kiểu ghế",
        links: [
            "Ghế Công thái học",
            "Ghế Gaming"
        ]
    },
    {
        title: "Giá tiền",
        links: [
            "Dưới 5 triệu",
            "Từ 5 đến 10 triệu",
            "Trên 10 triệu"
        ]
    },
    {
        title: "Bàn Gaming",
        links: [
            "Bàn Gaming DXRacer",
            "Bàn Gaming E-Dra",
            "Bàn Gaming Warrior"
        ]
    },
    {
        title: "Bàn công thái học",
        links: [
            "Bàn CTH Warrior",
            "Phụ kiện bàn ghế"
        ]
    }
],
"phan-mem": [
    {
        title: "Hệ điều hành",
        links: [
            "Windows 11 Home / Pro",
            "Windows 10 Home / Pro",
            "Nâng cấp Windows"
        ]
    },
    {
        title: "Phần mềm văn phòng",
        links: [
            "Microsoft Office 365",
            "Microsoft Office 2021",
            "Phần mềm PDF (Adobe, Foxit)"
        ]
    },
    {
        title: "Phần mềm diệt Virus",
        links: [
            "Kaspersky",
            "ESET NOD32",
            "McAfee",
            "Norton Antivirus"
        ]
    },
    {
        title: "Thiết bị mạng (Router)",
        links: [
            "Router ASUS",
            "Router TP-Link",
            "Router Totolink",
            "Hệ thống Mesh Wi-Fi"
        ]
    },
    {
        title: "Thiết bị mạng khác",
        links: [
            "USB Wi-Fi / Card Wi-Fi",
            "Bộ kích sóng Wi-Fi",
            "Switch chia mạng",
            "Cáp mạng / Đầu bấm"
        ]
    }
],
"game-console": [
    {
        title: "Handheld PC",
        links: [
            "Rog Ally",
            "MSI Claw",
            "Legion Go"
        ]
    },
    {
        title: "Tay cầm",
        links: [
            "Tay cầm Playstation",
            "Tay cầm Rapoo",
            "Tay cầm DareU",
            "Xem tất cả"
        ]
    },
    {
        title: "Vô lăng lái xe, máy bay",
        links: [
            "Vô lăng Logitech",
            "Vô lăng PXN",
            "Cần lái máy bay"
        ]
    },
    {
        title: "Sony Playstation",
        links: [
            "Sony PS5 (Máy) chính hãng",
            "Tay cầm chính hãng",
            "Phụ kiện PS5",
            "Đĩa game PS5"
        ]
    }
],
"phu-kien": [
    {
        title: "Hub, sạc, cáp",
        links: [
            "Hub chuyển đổi",
            "Dây cáp",
            "Củ sạc"
        ]
    },
    {
        title: "Quạt cầm tay, Quạt mini",
        links: [
            "Jisulife"
        ]
    },
    {
        title: "Phụ kiện Elgato",
        links: [
            "Giá đỡ / Arm",
            "Phụ kiện Stream"
        ]
    },
    {
        title: "Sạc dự phòng",
        links: [
            "Sạc dự phòng chính hãng",
            "Sạc dự phòng không dây"
        ]
    }
],
"dich-vu": [
    {
        title: "Dịch vụ",
        links: [
            "Dịch vụ kỹ thuật tại nhà",
            "Dịch vụ sửa chữa"
        ]
    },
    {
        title: "Chính sách",
        links: [
            "Chính sách & bảng giá thu VGA qua sử dụng",
            "Chính sách bảo hành",
            "Chính sách giao hàng",
            "Chính sách đổi trả"
        ]
    },
    {
        title: "Build PC",
        links: [
            "Xây dựng cấu hình PC máy tính"
        ]
    }
]
};