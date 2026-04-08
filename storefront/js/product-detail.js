document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert("Không tìm thấy mã sản phẩm!");
        window.location.href = 'category.html';
        return;
    }

    try {
        // 1. Tải từ điển Cấu hình
        const resConfig = await fetch('http://localhost/api/specs-config');
        const allSpecsConfig = await resConfig.json();
        
        let specsMap = {}; 
        Object.values(allSpecsConfig).forEach(cat => {
            cat.forEach(s => specsMap[s.key] = s.label);
        });

        // 2. Tải dữ liệu Sản phẩm
        const resProduct = await fetch(`http://localhost/api/products/${productId}`);
        if (!resProduct.ok) throw new Error("Sản phẩm không tồn tại");
        const product = await resProduct.json(); 

        // 3. Đổ dữ liệu lên giao diện
        document.title = product.title + " - KVB";
        document.getElementById('bc-title').innerText = product.title;
        document.getElementById('bc-category').innerText = product.category;
        document.getElementById('bc-category').href = `category.html?category=${product.category}`;
        
        document.getElementById('pd-image').src = product.image;
        document.getElementById('pd-title').innerText = product.title;
        document.getElementById('pd-price').innerText = product.price.toLocaleString('vi-VN') + 'đ';
        document.getElementById('pd-old-price').innerText = (product.price * 1.1).toLocaleString('vi-VN') + 'đ';
        
        if (product.description) {
            document.getElementById('pd-desc').innerHTML = `<strong>Mô tả:</strong> ${product.description}`;
        }

        // Lưu vào lịch sử xem
        saveRecentlyViewed(product);

        // 4. VẼ BẢNG THÔNG SỐ
        const tbody = document.getElementById('pd-specs-table');
        tbody.innerHTML = ''; 

        if (product.specs && Object.keys(product.specs).length > 0) {
            for (const [key, value] of Object.entries(product.specs)) {
                const label = specsMap[key] || key.toUpperCase(); 
                tbody.innerHTML += `<tr><th>${label}</th><td>${value}</td></tr>`;
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="2" class="text-center text-muted">Đang cập nhật thông số chi tiết...</td></tr>`;
        }

        // 5. XỬ LÝ NÚT MUA NGAY
        document.getElementById('btn-buy-now').addEventListener('click', () => {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            if (typeof window.updateCartBadge === 'function') {
                window.updateCartBadge();
            }

            if (typeof window.showCartPopup === 'function') {
                window.showCartPopup(product.image, product.title);
            }
        });

    } catch (error) {
        console.error("Lỗi:", error);
        document.querySelector('.container').innerHTML = `<h3 class="text-center text-danger mt-5">Sản phẩm không tồn tại hoặc lỗi Server!</h3>`;
    }

    // Hiển thị sản phẩm đã xem
    if(typeof renderRecentlyViewed === 'function') {
        renderRecentlyViewed('bottom-history-container');
    }
});

// Hàm lưu lịch sử xem
function saveRecentlyViewed(product) {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    const productId = product._id || product.id;
    viewed = viewed.filter(p => (p._id || p.id) !== productId);
    
    viewed.unshift({
        id: productId,
        title: product.title,
        price: product.price,
        image: product.image
    });
    
    if (viewed.length > 10) viewed.pop();
    
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
}