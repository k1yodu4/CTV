document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('name') || '';
    let category = urlParams.get('category') || ''; 
    const currentSort = urlParams.get('sort') || '';

    // Tự động nhận diện danh mục từ khóa
    if (!category && keyword) {
        const kw = keyword.toLowerCase();
        if (kw.includes('laptop')) category = 'Laptop';
        else if (kw.includes('man hinh')) category = 'Màn hình';
        else if (kw.includes('pc')) category = 'PC';
        else if (kw.includes('card')) category = 'VGA';
    }

    // Cập nhật tiêu đề
    const queryText = document.getElementById('search-query-text');
    if (keyword) queryText.innerHTML = `Kết quả tìm kiếm cho <span class="fw-bold text-danger">"${keyword}"</span>.`;
    else if (category) queryText.innerHTML = `Đang hiển thị danh mục: <span class="fw-bold text-danger">${category}</span>.`;
    else queryText.innerHTML = `Tất cả sản phẩm`;

    // 1. LẤY TÊN NHÃN TỪ DB (Để dịch key 'cpu' -> 'CPU')
    let specsConfigMap = {};
    try {
        const resConfig = await fetch('http://localhost:3000/api/specs-config');
        const allSpecsConfig = await resConfig.json();
        Object.values(allSpecsConfig).forEach(catSpecs => {
            catSpecs.forEach(spec => {
                specsConfigMap[spec.key] = spec.label; // Lưu từ điển { cpu: "CPU", vga: "Card đồ họa" }
            });
        });
    } catch(e) { console.error("Lỗi tải config:", e); }

    // 2. TẢI DỮ LIỆU GỐC & VẼ BỘ LỌC THÔNG MINH
    async function loadAndFilter() {
        try {
            // Chỉ gọi API backend dựa trên Tìm kiếm (name) và Danh mục (category)
            let baseUrl = 'http://localhost:3000/api/products?';
            if (keyword) baseUrl += `name=${encodeURIComponent(keyword)}&`;
            if (category) baseUrl += `category=${encodeURIComponent(category)}&`;

            const res = await fetch(baseUrl);
            const baseProducts = await res.json(); // Danh sách GỐC (VD: Toàn bộ đồ Asus)

            const filterContainer = document.getElementById('dynamic-filters');
            filterContainer.innerHTML = '';

            if (baseProducts.length === 0) {
                renderProducts([]); 
                return;
            }

            // --- A. QUÉT TÌM CÁC THUỘC TÍNH CÓ THẬT ---
            const availableSpecs = {};
            const availableCats = new Set();

            baseProducts.forEach(p => {
                if (p.category) availableCats.add(p.category);
                
                if (p.specs) {
                    Object.keys(p.specs).forEach(key => {
                        if (!availableSpecs[key]) availableSpecs[key] = new Set();
                        if (p.specs[key].trim() !== '') {
                            availableSpecs[key].add(p.specs[key]);
                        }
                    });
                }
            });

            // --- B. VẼ DROPDOWN DANH MỤC (Nếu có nhiều hơn 1 danh mục) ---
            const catSelect = document.createElement('select');
            catSelect.className = 'form-select form-select-sm w-auto border-secondary';
            catSelect.innerHTML = `<option value="">-- Tất cả danh mục --</option>`;
            
            availableCats.forEach(cat => {
                const isSelected = category === cat ? 'selected' : '';
                catSelect.innerHTML += `<option value="${cat}" ${isSelected}>${cat}</option>`;
            });
            catSelect.addEventListener('change', (e) => {
                // Khi đổi danh mục, xóa hết các bộ lọc con đi để tránh lỗi
                const newParams = new URLSearchParams();
                if (keyword) newParams.set('name', keyword);
                if (e.target.value) newParams.set('category', e.target.value);
                window.location.search = newParams.toString(); 
            });
            filterContainer.appendChild(catSelect);

            // --- C. VẼ DROPDOWN THUỘC TÍNH ---
            Object.keys(availableSpecs).forEach(key => {
                const options = Array.from(availableSpecs[key]).sort(); // Sắp xếp A-Z
                
                // Chỉ hiển thị dropdown nếu thuộc tính này có từ 1 tùy chọn trở lên
                if (options.length > 0) {
                    const label = specsConfigMap[key] || key.toUpperCase();
                    const selectBox = document.createElement('select');
                    selectBox.className = 'form-select form-select-sm w-auto';
                    selectBox.innerHTML = `<option value="">-- ${label} --</option>`;
                    
                    options.forEach(opt => {
                        const isSelected = urlParams.get(key) === opt ? 'selected' : '';
                        selectBox.innerHTML += `<option value="${opt}" ${isSelected}>${opt}</option>`;
                    });

                    selectBox.addEventListener('change', (e) => {
                        if (e.target.value) urlParams.set(key, e.target.value);
                        else urlParams.delete(key);
                        window.location.search = urlParams.toString();
                    });

                    filterContainer.appendChild(selectBox);
                }
            });

            // Bắt lấy giá trị giá trên URL (nếu có)
            const minPrice = parseInt(urlParams.get('minPrice')) || 0;
            const maxPrice = parseInt(urlParams.get('maxPrice')) || Infinity;

            // --- D. LỌC TRỰC TIẾP SẢN PHẨM HIỂN THỊ DỰA TRÊN URL ---
            let finalProducts = baseProducts.filter(p => {
                // 1. Kiểm tra điều kiện Giá trước
                if (p.price < minPrice) return false;
                if (maxPrice !== Infinity && p.price > maxPrice) return false;

                // 2. Kiểm tra điều kiện Thông số kỹ thuật (Specs)
                let isMatch = true;
                for (const [key, value] of urlParams.entries()) {
                    // Bỏ qua các param hệ thống và param giá để không bị lỗi
                    if (['name', 'category', 'sort', 'minPrice', 'maxPrice'].includes(key)) continue; 
                    
                    if (!p.specs || p.specs[key] !== value) {
                        isMatch = false;
                        break;
                    }
                }
                return isMatch;
            });

            // Sắp xếp
            if (currentSort === 'asc') finalProducts.sort((a, b) => a.price - b.price);
            else if (currentSort === 'desc') finalProducts.sort((a, b) => b.price - a.price);

            // Vẽ lưới sản phẩm
            renderProducts(finalProducts);

        } catch(e) { console.error("Lỗi tải sản phẩm:", e); }
    }

    // 3. XỬ LÝ LỌC GIÁ
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = currentSort; 
        sortSelect.addEventListener('change', (e) => {
            if (e.target.value) urlParams.set('sort', e.target.value);
            else urlParams.delete('sort');
            window.location.search = urlParams.toString();
        });
    }

    // 4. FORMAT THÔNG SỐ
    function formatSpecs(p) {
        if (p.specs && Object.keys(p.specs).length > 0) {
            return Object.values(p.specs).slice(0, 4).join(' &bull; '); 
        }
        if (p.description && p.description.trim() !== "") return p.description;
        return 'Đang cập nhật cấu hình...'; 
    }

    // 5. VẼ LƯỚI SẢN PHẨM
    function renderProducts(products) {
        const productGrid = document.getElementById('product-list');
        const filterBar = document.getElementById('filter-bar');
        const emptyBox = document.getElementById('search-empty');

        productGrid.innerHTML = ''; 

        // Luôn hiện thanh filter để người dùng có thể gỡ bỏ filter nếu lỡ tay chọn sai
        filterBar.classList.remove('d-none');
        filterBar.classList.add('d-flex');

        if (products.length === 0) {
            emptyBox.style.display = 'block';
            return;
        }

        emptyBox.style.display = 'none';

products.forEach(p => {
    const specsHTML = formatSpecs(p);
    // Lấy ID chuẩn xác
    const productId = p._id || p.id; 

    productGrid.innerHTML += `
        <div class="col">
            <div class="card h-100 shadow-sm product-card p-2 position-relative">
                
                <img src="${p.image}" class="card-img-top p-2" alt="${p.title}">
                
                <div class="card-body p-2 d-flex flex-column flex-grow-1">
                    <a href="product-detail.html?id=${productId}" class="product-title mb-2 text-decoration-none text-dark stretched-link">
                        ${p.title}
                    </a>
                    
                    <div class="product-specs mt-auto">${specsHTML}</div>
                    
                    <div class="mt-1 d-flex justify-content-between align-items-center position-relative" style="z-index: 2;">
                        <div class="price-new">${Number(p.price).toLocaleString('vi-VN')}đ</div>
                        <div class="small text-warning"><i class="fas fa-star"></i> ${p.rating?.rate || 5}</div>
                    </div>
                </div>

            </div>
        </div>
    `;
});
    }

    loadAndFilter();
});