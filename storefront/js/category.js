function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return params.toString(); 
}

// 1. Xử lý Tìm kiếm khi gõ ở Header
document.getElementById('searchBtn').addEventListener('click', () => {
    const keyword = document.getElementById('searchInput').value;
    window.location.href = `category.html?name=${keyword}`;
});

// 2. Xử lý Lọc giá (Thấp -> Cao / Cao -> Thấp)
// Giả sử bạn đặt ID cho thẻ select lọc giá là 'sortSelect'
const sortSelect = document.getElementById('sortSelect');
if(sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value; // 'asc' hoặc 'desc'
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('sortPrice', sortValue); // Thêm hoặc sửa tham số sortPrice
        window.location.search = currentParams.toString(); // Load lại trang với bộ lọc mới
    });
}

const keyword = new URLSearchParams(window.location.search).get('name') || '';
const queryText = document.getElementById('search-query-text');
if (queryText && keyword) {
    queryText.innerHTML = `Tìm kiếm theo <span class="fw-bold">${keyword}</span>.`;
}
async function loadProducts() {
    const params = window.location.search; 
    console.log("--- Bắt đầu tải sản phẩm với tham số: " + params);

    try {
        const response = await fetch(`http://localhost:3000/api/products${params}`);
        const products = await response.json();

        console.log("--- Đã lấy được dữ liệu từ Backend:", products);

        const productGrid = document.getElementById('product-list');
        
        if (!productGrid) {
            console.error("❌ LỖI: Không tìm thấy thẻ HTML có id='product-list'!");
            return;
        }

        productGrid.innerHTML = ''; // Xóa sạch đống cũ

        if (products.length === 0) {
            // SỬA Ở ĐÂY: Dùng classList thay vì style.display
            const filterBar = document.getElementById('filter-bar');
            filterBar.classList.remove('d-flex');
            filterBar.classList.add('d-none');
            
            const emptyBox = document.getElementById('search-empty');
            emptyBox.style.display = 'block';
            document.getElementById('empty-search-input').value = new URLSearchParams(window.location.search).get('name') || '';
            return;
        }

// Khi có kết quả thì hiện lại bộ lọc (phòng trường hợp load lại)
        const filterBar = document.getElementById('filter-bar');
        filterBar.classList.remove('d-none');
        filterBar.classList.add('d-flex');
        
        document.getElementById('search-empty').style.display = 'none';

        products.forEach(p => {
            productGrid.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm product-card p-2">
                        <img src="${p.image}" class="card-img-top p-2" alt="${p.title}">
                        <div class="card-body p-2 d-flex flex-column">
                            <a href="#" class="product-title mb-2 text-decoration-none text-dark fw-bold" style="font-size: 14px;">${p.title}</a>
                            <div class="product-specs mt-auto">
                                <small class="text-muted" style="font-size: 12px;">${p.description}</small>
                            </div>
                            <div class="mt-2">
                                <div class="price-new text-danger fw-bold">${Number(p.price).toLocaleString()}đ</div>
                                <div class="small text-warning">
                                    <i class="fas fa-star"></i> ${p.rating?.rate || 5} (${p.rating?.count || 0})
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        console.log("--- Đã vẽ xong " + products.length + " sản phẩm lên màn hình!");
    } catch (error) {
        console.error("❌ LỖI KHI GỌI API:", error);
    }
}

// Gọi hàm chạy ngay lập tức
loadProducts();