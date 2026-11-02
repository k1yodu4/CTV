document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('name') || '';
    let category = urlParams.get('category') || ''; 
    const currentSort = urlParams.get('sort') || '';

    // Tự động nhận diện danh mục từ khóa nếu chưa chọn danh mục
    if (!category && keyword) {
        const kw = keyword.toLowerCase();
        if (kw.includes('laptop')) category = 'Laptop';
        else if (kw.includes('man hinh') || kw.includes('màn hình')) category = 'Màn hình';
        else if (kw.includes('bàn phím') || kw.includes('ban phim')) category = 'Bàn phím';
        else if (kw.includes('chuột') || kw.includes('chuot') || kw.includes('mouse')) category = 'Chuột';
        else if (kw.includes('pc')) category = 'PC';
        else if (kw.includes('case')) category = 'Case';
        else if (kw.includes('chair') || kw.includes('ghế') || kw.includes('ghe')) category = 'Chair';
        else if (kw.includes('card') || kw.includes('vga')) category = 'VGA';
    }

    // Cập nhật tiêu đề hiển thị
    const queryText = document.getElementById('search-query-text');
    if (keyword && category) {
        queryText.innerHTML = `Kết quả tìm kiếm cho <span class="fw-bold text-danger">"${keyword}"</span> trong danh mục: <span class="fw-bold text-danger">${category}</span>.`;
    } else if (keyword) {
        queryText.innerHTML = `Kết quả tìm kiếm cho <span class="fw-bold text-danger">"${keyword}"</span>.`;
    } else if (category) {
        queryText.innerHTML = `Đang hiển thị danh mục: <span class="fw-bold text-danger">${category}</span>.`;
    } else {
        queryText.innerHTML = `Tất cả sản phẩm`;
    }

    // 1. LẤY CẤU HÌNH NHÃN TỪ DB
    let specsConfigMap = {};
    let allSpecsConfig = {};
    try {
        const resConfig = await fetch('/api/specs-config');
        allSpecsConfig = await resConfig.json();
        Object.values(allSpecsConfig).forEach(catSpecs => {
            if (Array.isArray(catSpecs)) {
                catSpecs.forEach(spec => {
                    specsConfigMap[spec.key] = spec.label;
                });
            }
        });
    } catch(e) { console.error("Lỗi tải config:", e); }

    // 2. TẢI DỮ LIỆU & RENDER BỘ LỌC
    async function loadAndFilter() {
        try {
            let baseUrl = '/api/products?';
            if (keyword) baseUrl += `name=${encodeURIComponent(keyword)}&`;
            if (category) baseUrl += `category=${encodeURIComponent(category)}&`;

            const res = await fetch(baseUrl);
            const baseProducts = await res.json();

            const filterContainer = document.getElementById('dynamic-filters');
            filterContainer.innerHTML = '';

            // --- A. QUÉT TÌM CÁC THUỘC TÍNH & DANH MỤC CÓ THẬT ---
            const availableSpecs = {};
            const availableCats = new Set();

            if (Array.isArray(baseProducts)) {
                baseProducts.forEach(p => {
                    if (p.category) availableCats.add(p.category);
                    
                    if (p.specs && typeof p.specs === 'object') {
                        Object.keys(p.specs).forEach(key => {
                            if (!availableSpecs[key]) availableSpecs[key] = new Set();
                            const val = String(p.specs[key]).trim();
                            if (val !== '') {
                                availableSpecs[key].add(val);
                            }
                        });
                    }
                });
            }

            // --- B. VẼ DROPDOWN DANH MỤC (luôn có tất cả danh mục của hệ thống) ---
            const catSelect = document.createElement('select');
            catSelect.className = 'form-select form-select-sm w-auto border-danger text-danger fw-bold';
            catSelect.innerHTML = `<option value="">-- Tất cả danh mục --</option>`;
            
            const allCategories = new Set();
            Object.keys(allSpecsConfig).forEach(c => allCategories.add(c));
            availableCats.forEach(c => allCategories.add(c));

            Array.from(allCategories).sort().forEach(cat => {
                const isSelected = category && (category.toLowerCase() === cat.toLowerCase()) ? 'selected' : '';
                catSelect.innerHTML += `<option value="${cat}" ${isSelected}>${cat}</option>`;
            });

            catSelect.addEventListener('change', (e) => {
                const selectedCat = e.target.value;
                const newParams = new URLSearchParams();
                if (selectedCat) {
                    newParams.set('category', selectedCat);
                }
                // Nếu có keyword và keyword không trùng với category cũ, giữ lại keyword
                if (keyword && (!category || keyword.toLowerCase() !== category.toLowerCase())) {
                    newParams.set('name', keyword);
                }
                if (currentSort) {
                    newParams.set('sort', currentSort);
                }
                window.location.search = newParams.toString(); 
            });
            filterContainer.appendChild(catSelect);

            if (!Array.isArray(baseProducts) || baseProducts.length === 0) {
                renderProducts([]); 
                return;
            }

            // --- C. VẼ DROPDOWN THUỘC TÍNH (Specs) ---
            Object.keys(availableSpecs).forEach(key => {
                const options = Array.from(availableSpecs[key]).sort();
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
                        const currentParams = new URLSearchParams(window.location.search);
                        if (e.target.value) currentParams.set(key, e.target.value);
                        else currentParams.delete(key);
                        window.location.search = currentParams.toString();
                    });

                    filterContainer.appendChild(selectBox);
                }
            });

            // Bắt lấy giá trị giá trên URL
            const minPrice = parseInt(urlParams.get('minPrice')) || 0;
            const maxPrice = parseInt(urlParams.get('maxPrice')) || Infinity;

            // --- D. LỌC SẢN PHẨM HIỂN THỊ DỰA TRÊN URL ---
            let finalProducts = baseProducts.filter(p => {
                // 1. Kiểm tra danh mục nếu có
                if (category && p.category && p.category.toLowerCase() !== category.toLowerCase()) {
                    return false;
                }

                // 2. Kiểm tra điều kiện Giá
                if (p.price < minPrice) return false;
                if (maxPrice !== Infinity && p.price > maxPrice) return false;

                // 3. Kiểm tra điều kiện Thông số kỹ thuật (Specs)
                for (const [key, value] of urlParams.entries()) {
                    if (['name', 'category', 'sort', 'minPrice', 'maxPrice'].includes(key)) continue; 
                    
                    if (!p.specs || !p.specs[key] || String(p.specs[key]).toLowerCase() !== value.toLowerCase()) {
                        return false;
                    }
                }
                return true;
            });

            // Sắp xếp theo giá
            if (currentSort === 'asc') finalProducts.sort((a, b) => a.price - b.price);
            else if (currentSort === 'desc') finalProducts.sort((a, b) => b.price - a.price);

            // Vẽ lưới sản phẩm
            renderProducts(finalProducts);

        } catch(e) { 
            console.error("Lỗi tải sản phẩm:", e); 
        }
    }

    // 3. XỬ LÝ SẮP XẾP GIÁ
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = currentSort; 
        sortSelect.addEventListener('change', (e) => {
            const currentParams = new URLSearchParams(window.location.search);
            if (e.target.value) currentParams.set('sort', e.target.value);
            else currentParams.delete('sort');
            window.location.search = currentParams.toString();
        });
    }

    // 4. FORMAT THÔNG SỐ
    function formatSpecs(p) {
        if (p.specs && typeof p.specs === 'object' && Object.keys(p.specs).length > 0) {
            return Object.values(p.specs).filter(v => v).slice(0, 4).join(' &bull; '); 
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

        // Luôn hiển thị thanh filter để người dùng có thể đổi danh mục hoặc gỡ lọc
        filterBar.classList.remove('d-none');
        filterBar.classList.add('d-flex');

        if (!products || products.length === 0) {
            emptyBox.style.display = 'block';
            return;
        }

        emptyBox.style.display = 'none';

        products.forEach(p => {
            const specsHTML = formatSpecs(p);
            const productId = p._id || p.id; 

            productGrid.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm product-card p-2 position-relative">
                        
                        <img src="${p.image}" onerror="this.onerror=null; this.src='/images/no-image.svg';" class="card-img-top p-2" alt="${p.title}">
                        
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
