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

// ==========================================
// XỬ LÝ LUỒNG ĐẶT HÀNG (SPA)
// ==========================================
window.checkLoginAndGoToStep = function(stepNumber) {
    if (stepNumber === 2) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Vui lòng đăng nhập để tiếp tục đặt hàng!");
            // Gọi modal đăng nhập ở header hiện lên
            if (typeof window.openAuthModal === 'function') {
                window.openAuthModal('login');
            }
            return; // Chặn không cho qua bước 2
        }
    }
    
    // Nếu đã đăng nhập (có token), cho phép chuyển bước bình thường
    goToStep(stepNumber);
};
// 1. Hàm chuyển đổi giữa các bước (1, 2, 3)
window.goToStep = function(stepNumber) {
    // Ẩn tất cả các khối
    document.getElementById('step-1-cart').style.display = 'none';
    document.getElementById('step-2-info').style.display = 'none';
    document.getElementById('step-3-payment').style.display = 'none';
    
    // Hiện khối được gọi
    if(stepNumber === 1) document.getElementById('step-1-cart').style.display = 'block';
    if(stepNumber === 2) document.getElementById('step-2-info').style.display = 'block';
    if(stepNumber === 3) document.getElementById('step-3-payment').style.display = 'block';

    // Cập nhật màu đỏ cho thanh tiến trình
    const steps = document.querySelectorAll('.step-progress .step');
    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
};

// 2. Hàm kiểm tra form trước khi cho qua bước Thanh toán
window.validateAndGoToPayment = function() {
    const name = document.getElementById('cusName').value.trim();
    const phone = document.getElementById('cusPhone').value.trim();
    const address = document.getElementById('cusAddress').value.trim();

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
        return;
    }
    
    goToStep(3); // Nếu ok thì sang bước 3
};

// 3. Hàm gửi dữ liệu lên Backend
window.submitOrder = async function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    // Thu thập dữ liệu
    const customerInfo = {
        fullname: document.getElementById('cusName').value.trim(),
        phone: document.getElementById('cusPhone').value.trim(),
        email: document.getElementById('cusEmail').value.trim(),
        address: document.getElementById('cusAddress').value.trim(),
        note: document.getElementById('cusNote').value.trim()
    };
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Lấy ID user nếu đã đăng nhập (Nếu dùng JWT để decode thì truyền vào đây, tạm thời để null cho khách vãng lai)
    const token = localStorage.getItem('token'); 
    let userId = null; 
    // *Lưu ý: Thực tế Backend sẽ giải mã token để lấy userId, ở đây gửi lên tạm*

    // Đổi trạng thái nút bấm chống click đúp
    const btnSubmit = document.getElementById('btn-submit-order');
    btnSubmit.innerText = "ĐANG XỬ LÝ...";
    btnSubmit.disabled = true;

    try {
        // GỌI API ĐÃ VIẾT Ở BƯỚC TRƯỚC
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerInfo,
                items: cart,
                paymentMethod,
                userId
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Đặt hàng thành công -> Xóa giỏ hàng
            localStorage.removeItem('cart');
            if (typeof updateCartBadge === 'function') updateCartBadge();
            
            // CHUYỂN HƯỚNG SANG TRANG CẢM ƠN (KÈM DỮ LIỆU ĐỂ TẠO MÃ QR)
            window.location.href = `success.html?orderCode=${data.orderCode}&method=${paymentMethod}&total=${data.totalAmount}`;
        } else {
            alert("❌ Lỗi: " + data.error);
            btnSubmit.innerText = "HOÀN TẤT ĐẶT HÀNG";
            btnSubmit.disabled = false;
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("❌ Không thể kết nối đến Server!");
        btnSubmit.innerText = "HOÀN TẤT ĐẶT HÀNG";
        btnSubmit.disabled = false;
    }
};