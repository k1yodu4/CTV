document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 cart.html loaded - running initialization');
    renderCart();
    initDebugUI();
});

// Hàm chính: Vẽ toàn bộ giỏ hàng
function renderCart() {
    console.log('🔍 renderCart() được gọi');
    const cartWrapper = document.getElementById('cart-items-wrapper');
    console.log('📦 cartWrapper element:', cartWrapper);
    const totalPriceEl = document.getElementById('cart-total-price');
    const btnCheckout = document.getElementById('btn-checkout');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('🛒 Dữ liệu giỏ hàng từ localStorage:', cart);
    console.log('📊 Số lượng item:', cart.length);
    
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
    
    const step2Total = document.getElementById('step-2-total-price');
    if (step2Total) step2Total.innerText = totalPrice.toLocaleString('vi-VN') + 'đ';
    
    // Cập nhật lại số trên Header
    if (typeof window.updateCartBadge === 'function') {
        window.updateCartBadge();
    }
}

// DEBUG: Thêm sản phẩm test và hiển thị button nếu cart trống
function initDebugUI() {
    console.log('🧪 Khởi tạo Debug UI');
    
    // Hiển thị button test nếu cart trống
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const btnTest = document.getElementById('btn-test-add');
    
    if (btnTest) {
        if (cart.length === 0) {
            btnTest.style.display = 'block';
            console.log('✅ Button test đã hiển thị');
        }
        
        btnTest.addEventListener('click', () => {
            console.log('🧪 Thêm sản phẩm test');
            const testCart = [
                {
                    id: '1',
                    title: 'PC Gaming Pro - Test',
                    price: 15000000,
                    image: 'https://img.icons8.com/color/96/000000/computer.png',
                    quantity: 1
                },
                {
                    id: '2',
                    title: 'Màn hình 4K - Test',
                    price: 8000000,
                    image: 'https://img.icons8.com/color/96/000000/monitor.png',
                    quantity: 2
                }
            ];
            
            localStorage.setItem('cart', JSON.stringify(testCart));
            console.log('💾 Test data saved to localStorage:', testCart);
            renderCart();
            btnTest.style.display = 'none';
        });
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
    const city = document.getElementById('cusCity').value;
    const district = document.getElementById('cusDistrict').value;
    const ward = document.getElementById('cusWard').value;
    const street = document.getElementById('cusStreet').value.trim();

    if (!name || !phone || !city || !district || !ward || !street) {
        alert("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!");
        return;
    }
    
    goToStep(3); // Nếu ok thì sang bước 3
};

// 3. Hàm gửi dữ liệu lên Backend
window.submitOrder = async function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Giỏ hàng trống!");

    // Thu thập dữ liệu theo giao diện mới
    const customerInfo = {
        gender: document.querySelector('input[name="cusGender"]:checked').value,
        fullname: document.getElementById('cusName').value.trim(),
        phone: document.getElementById('cusPhone').value.trim(),
        address: `${document.getElementById('cusStreet').value.trim()}, ${document.getElementById('cusWard').value}, ${document.getElementById('cusDistrict').value}, ${document.getElementById('cusCity').value}`,
        note: document.getElementById('cusNote').value.trim(),
        requireInvoice: document.getElementById('requireInvoice').checked,
        receiveMethod: document.querySelector('input[name="receiveMethod"]:checked').value,
        shippingService: document.querySelector('input[name="shippingService"]:checked').value
    };
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Lấy token để gửi kèm (Backend sẽ giải mã token để lấy userId)
    const token = localStorage.getItem('token');

    // Đổi trạng thái nút bấm chống click đúp
    const btnSubmit = document.getElementById('btn-submit-order');
    btnSubmit.innerText = "ĐANG XỬ LÝ...";
    btnSubmit.disabled = true;

    try {
        // GỌI API - GỖI TOKEN TRONG HEADER ĐỂ BACKEND LẤY USERID
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost/api/orders', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                customerInfo,
                items: cart,
                paymentMethod
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

// ==========================================
// HIỂN THỊ MÃ QR VIETQR KHI CHỌN NGÂN HÀNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[name="paymentMethod"]');
    const qrContainer = document.getElementById('qr-container');
    const qrImage = document.getElementById('qr-image');
    const qrMessage = document.getElementById('qr-message');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'BANK') {
                // 1. Lấy thông tin (Tổng tiền, SĐT)
                const totalString = document.getElementById('step-2-total-price').innerText;
                const totalAmount = parseInt(totalString.replace(/\D/g, '')) || 0;
                const phone = document.getElementById('cusPhone').value || 'KhachHang';

                // 2. Điền thông tin ngân hàng của bạn vào đây
                const bankId = 'MB'; // Mã ngân hàng (VD: VCB, TCB, MB, ACB...)
                const accountNo = '0979541020'; // Số tài khoản
                const accountName = 'BUI VU GIA BAO'; // Tên chủ tài khoản
                const addInfo = `Thanh toan don hang ${phone}`; // Lời nhắn

                // 3. Tạo link API VietQR
                const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${totalAmount}&addInfo=${encodeURIComponent(addInfo)}&accountName=${encodeURIComponent(accountName)}`;

                // 4. Hiển thị
                qrImage.src = qrUrl;
                qrMessage.innerText = addInfo;
                qrContainer.style.display = 'block';
            } else {
                // Ẩn đi nếu chọn COD
                qrContainer.style.display = 'none';
            }
        });
    });
});