const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const STOREFRONT_DIR = path.join(ROOT_DIR, 'storefront');
const IMAGES_DIR = path.join(STOREFRONT_DIR, 'images');
const PRODUCTS_IMG_DIR = path.join(IMAGES_DIR, 'products');
const BANNERS_IMG_DIR = path.join(IMAGES_DIR, 'banners');
const ICONS_IMG_DIR = path.join(IMAGES_DIR, 'icons');
const SEED_FILE = path.join(ROOT_DIR, 'inventory-service', 'src', 'products_seed.json');

// Đảm bảo các thư mục tồn tại
[IMAGES_DIR, PRODUCTS_IMG_DIR, BANNERS_IMG_DIR, ICONS_IMG_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Tạo ảnh placeholder SVG offline nếu chưa có
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <rect width="100%" height="100%" fill="#f1f5f9"/>
  <g fill="#94a3b8" transform="translate(160, 90)">
    <path d="M10 20v45h60v-45h-60zm55 40h-50v-35h50v35zM35 70h10v10h-10zM25 80h30v5h-30z"/>
    <path d="M70 10h-60c-5.5 0-10 4.5-10 10v50c0 5.5 4.5 10 10 10h20v10h-10v5h40v-5h-10v-10h20c5.5 0 10-4.5 10-10v-50c0-5.5-4.5-10-10-10zm5 60c0 2.8-2.2 5-5 5h-60c-2.8 0-5-2.2-5-5v-50c0-2.8 2.2-5 5-5h60c2.8 0 5 2.2 5 5v50z"/>
  </g>
  <text x="200" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#64748b" text-anchor="middle" font-weight="500">Hình ảnh sản phẩm</text>
  <text x="200" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Chế độ Offline</text>
</svg>`;

const placeholderPath = path.join(IMAGES_DIR, 'no-image.svg');
fs.writeFileSync(placeholderPath, placeholderSvg, 'utf8');
console.log('✅ Đã tạo ảnh fallback offline:', placeholderPath);

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'vi,en;q=0.9'
};

async function downloadFile(url, destPath) {
    try {
        const response = await fetch(url, {
            headers: HEADERS,
            signal: AbortSignal.timeout(15000)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
        return true;
    } catch (err) {
        console.warn(`⚠️ Lỗi tải ${url}: ${err.message}. Sử dụng ảnh placeholder thay thế.`);
        fs.writeFileSync(destPath, placeholderSvg, 'utf8');
        return false;
    }
}

function getExtension(url, defaultExt = '.jpg') {
    try {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const match = cleanUrl.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i);
        if (match) {
            return '.' + match[1].toLowerCase();
        }
    } catch (e) {}
    return defaultExt;
}

// Giới hạn luồng tải đồng thời
async function mapConcurrent(items, limit, fn) {
    const results = [];
    const executing = [];
    for (const [index, item] of items.entries()) {
        const p = Promise.resolve().then(() => fn(item, index));
        results.push(p);

        if (limit <= items.length) {
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);
            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }
    }
    return Promise.all(results);
}

async function processProducts() {
    console.log('\n--- BƯỚC 1: XỬ LÝ ẢNH SẢN PHẨM TRONG products_seed.json ---');
    if (!fs.existsSync(SEED_FILE)) {
        console.error('❌ Không tìm thấy file seed:', SEED_FILE);
        return;
    }

    const backupFile = SEED_FILE + '.backup_' + Date.now();
    fs.copyFileSync(SEED_FILE, backupFile);
    console.log(`📦 Đã tạo bản sao lưu seed tại: ${backupFile}`);

    const rawData = fs.readFileSync(SEED_FILE, 'utf8');
    const products = JSON.parse(rawData);

    console.log(`🔍 Tìm thấy ${products.length} sản phẩm cần xử lý...`);

    let downloadCount = 0;
    let cachedCount = 0;

    await mapConcurrent(products, 6, async (product, index) => {
        const imgUrl = product.image;
        if (!imgUrl || !imgUrl.startsWith('http')) {
            return;
        }

        const ext = getExtension(imgUrl, '.jpg');
        const id = product._id?.$oid || product._id || (index + 1);
        const fileName = `prod_${id}${ext}`;
        const destPath = path.join(PRODUCTS_IMG_DIR, fileName);
        const localPath = `/images/products/${fileName}`;

        if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
            cachedCount++;
        } else {
            const ok = await downloadFile(imgUrl, destPath);
            if (ok) downloadCount++;
        }

        // Cập nhật đường dẫn trong sản phẩm
        product.image = localPath;
        process.stdout.write(`\rĐang tải: [${index + 1}/${products.length}] -> ${fileName}`);
    });

    console.log(`\n✅ Hoàn tất tải ảnh sản phẩm: ${downloadCount} tải mới, ${cachedCount} đã có sẵn.`);

    // Lưu lại file seed
    fs.writeFileSync(SEED_FILE, JSON.stringify(products, null, 2), 'utf8');
    console.log(`💾 Đã cập nhật toàn bộ đường dẫn ảnh offline trong: ${SEED_FILE}`);
}

async function processHtmlBanners() {
    console.log('\n--- BƯỚC 2: XỬ LÝ BANNER & LOGO TRÊN GIAO DIỆN STOREFRONT ---');

    const htmlFiles = [
        path.join(STOREFRONT_DIR, 'home.html'),
        path.join(STOREFRONT_DIR, 'html', 'header.html')
    ];

    for (const filePath of htmlFiles) {
        if (!fs.existsSync(filePath)) continue;
        let content = fs.readFileSync(filePath, 'utf8');
        const imgRegex = /https?:\/\/[^\s"'<>]+\.(png|jpg|jpeg|webp|gif|svg)/gi;
        const matches = [...new Set(content.match(imgRegex) || [])];

        console.log(`📄 Tệp: ${path.basename(filePath)} - Tìm thấy ${matches.length} liên kết ảnh trực tuyến.`);

        for (let i = 0; i < matches.length; i++) {
            const url = matches[i];
            const ext = getExtension(url, '.png');
            const cleanBase = path.basename(url.split('?')[0], ext).replace(/[^a-zA-Z0-9_-]/g, '_');
            const fileName = `banner_${cleanBase.slice(0, 30)}_${i}${ext}`;
            const destPath = path.join(BANNERS_IMG_DIR, fileName);
            const localPath = `/images/banners/${fileName}`;

            if (!fs.existsSync(destPath) || fs.statSync(destPath).size === 0) {
                await downloadFile(url, destPath);
                console.log(`   ⬇️ Đã tải banner: ${fileName}`);
            }

            content = content.replaceAll(url, localPath);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   💾 Đã cập nhật file: ${filePath}`);
    }
}

async function processIcons() {
    console.log('\n--- BƯỚC 3: XỬ LÝ ICON TRONG CART & CATEGORY ---');

    const iconsToDownload = [
        { url: 'https://img.icons8.com/bubbles/200/shopping-cart.png', name: 'shopping-cart.png' },
        { url: 'https://img.icons8.com/color/96/000000/computer.png', name: 'computer.png' },
        { url: 'https://img.icons8.com/color/96/000000/monitor.png', name: 'monitor.png' },
        { url: 'https://img.icons8.com/puffy-filled/1200/nothing-found.jpg', name: 'nothing-found.jpg' }
    ];

    for (const icon of iconsToDownload) {
        const destPath = path.join(ICONS_IMG_DIR, icon.name);
        if (!fs.existsSync(destPath)) {
            await downloadFile(icon.url, destPath);
            console.log(`   ⬇️ Đã tải icon: ${icon.name}`);
        }
    }

    // Cập nhật cart.js
    const cartJsPath = path.join(STOREFRONT_DIR, 'js', 'cart.js');
    if (fs.existsSync(cartJsPath)) {
        let code = fs.readFileSync(cartJsPath, 'utf8');
        code = code.replace(/https:\/\/img\.icons8\.com\/bubbles\/200\/shopping-cart\.png/g, '/images/icons/shopping-cart.png');
        code = code.replace(/https:\/\/img\.icons8\.com\/color\/96\/000000\/computer\.png/g, '/images/icons/computer.png');
        code = code.replace(/https:\/\/img\.icons8\.com\/color\/96\/000000\/monitor\.png/g, '/images/icons/monitor.png');
        fs.writeFileSync(cartJsPath, code, 'utf8');
        console.log(`   💾 Đã cập nhật link icon trong cart.js`);
    }

    // Cập nhật category.html
    const categoryHtmlPath = path.join(STOREFRONT_DIR, 'html', 'category.html');
    if (fs.existsSync(categoryHtmlPath)) {
        let code = fs.readFileSync(categoryHtmlPath, 'utf8');
        code = code.replace(/https:\/\/img\.icons8\.com\/puffy-filled\/1200\/nothing-found\.jpg/g, '/images/icons/nothing-found.jpg');
        fs.writeFileSync(categoryHtmlPath, code, 'utf8');
        console.log(`   💾 Đã cập nhật link icon trong category.html`);
    }
}

async function main() {
    console.log('🚀 BẮT ĐẦU CHUYỂN ĐỔI TÀI NGUYÊN SANG OFFLINE...');
    const startTime = Date.now();

    await processProducts();
    await processHtmlBanners();
    await processIcons();

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n🎉 HOÀN TẤT TOÀN BỘ trong ${duration}s! Tất cả hình ảnh đã sẵn sàng cho chế độ offline 100%.`);
}

main().catch(err => {
    console.error('❌ Lỗi:', err);
});
