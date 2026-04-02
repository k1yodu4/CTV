document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

// Hàm chính: Vẽ toàn bộ giỏ hàng
function renderCart() {
    const cartWrapper = document.getElementById('cart-items-wrapper');
    const totalPriceEl = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Nếu giỏ hàng trống
if (cart.length === 0) {
        cartWrapper.innerHTML = `
            <div class="text-center py-5">
                <img src="https://img.icons8.com/bubbles/200/shopping-cart.png" style="width: 120px;">
                <p class="text-muted mt-2">Giỏ hàng của bạn đang trống</p>
            </div>
        `;
        totalPriceEl.innerText = '0đ';
        
        // QUAN TRỌNG: Vẫn phải gọi cập nhật Header để nó về số 0
        if (typeof window.updateCartBadge === 'function') {
            window.updateCartBadge();
        }
        return;
    }

    // Nếu có hàng
    btnCheckout.disabled = false;
    btnCheckout.style.backgroundColor = '#ed1b24';
    
    let html = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-info">
                    <a href="product-detail.html?id=${item.id}" class="cart-title">${item.title}</a>
                    <span class="cart-action" onclick="removeCartItem('${item.id}')">
                        <i class="far fa-trash-alt me-1"></i> Xoá
                    </span>
                </div>
                <div class="cart-price-wrap">
                    <div class="cart-price">${item.price.toLocaleString('vi-VN')}đ</div>
                    <div class="qty-control">
                        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    cartWrapper.innerHTML = html;
    totalPriceEl.innerText = totalPrice.toLocaleString('vi-VN') + 'đ';
    
    // Cập nhật lại số trên Header
    if (typeof window.updateCartBadge === 'function') {
        window.updateCartBadge();
    }
}

// Hàm thay đổi số lượng
window.changeQty = function(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(p => p.id === id);
    
    if (item) {
        item.quantity += delta;
        
        // Nếu số lượng tụt xuống 0 -> Hỏi xem có xóa không
        if (item.quantity <= 0) {
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
                cart = cart.filter(p => p.id !== id);
            } else {
                item.quantity = 1; // Hủy xóa thì trả về 1
            }
        }
        
        // Lưu lại và vẽ lại giao diện
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); 
    }
};

// Hàm xóa thẳng sản phẩm
window.removeCartItem = function(id) {
    if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(p => p.id !== id);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
};

// Xử lý nút Đặt hàng
document.getElementById('btn-checkout')?.addEventListener('click', () => {
    alert("Tính năng Đặt hàng đang được hoàn thiện!");
    // Sau này có thể chuyển sang trang checkout.html tại đây
});