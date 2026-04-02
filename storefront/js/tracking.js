document.addEventListener('DOMContentLoaded', () => {
    // 1. Kiểm tra đăng nhập (Bảo vệ trang)
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Vui lòng đăng nhập để xem thông tin tài khoản!");
        window.location.href = 'home.html';
        return;
    }

    // 2. Tạo danh sách Ngày/Tháng/Năm
    initBirthdayDropdowns();

    // 3. Tải thông tin User từ Backend
    loadUserProfile();
});

// Hàm chuyển đổi Tab (SPA)
window.switchTab = function(tabId, element) {
    // 1. Xóa class active ở tất cả các menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // 2. Thêm class active cho menu vừa click
    element.classList.add('active');

    // 3. Ẩn tất cả các tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // 4. Hiện tab content được chọn
    document.getElementById('tab-' + tabId).classList.add('active');

    // Nếu người dùng click vào tab Đơn hàng, gọi hàm tải dữ liệu
    if (tabId === 'orders') {
        loadMyOrders(); 
    }
};

// Biến toàn cục để lưu lại danh sách đơn hàng đã tải về
let allMyOrdersList = [];

// Hàm kéo dữ liệu đơn hàng từ Backend
window.loadMyOrders = async function() {
    const tbody = document.getElementById('order-list-body');
    tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';

    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('http://localhost:3000/api/orders/my-orders', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();

        if (res.ok) {
            allMyOrdersList = orders; // Lưu lại để dùng cho bộ lọc
            renderMyOrdersTable(allMyOrdersList); // Mặc định vẽ tất cả
        } else {
            tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Lỗi: ${orders.error}</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Không thể kết nối Server!</td></tr>';
    }
};

// Hàm vẽ bảng (Tách riêng để tái sử dụng)
function renderMyOrdersTable(ordersToRender) {
    const tbody = document.getElementById('order-list-body');
    
    if (ordersToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Không có đơn hàng nào ở trạng thái này.</td></tr>';
        return;
    }

    let html = '';
    ordersToRender.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('vi-VN');
        
        // Chọn màu sắc cho trạng thái
        let badgeClass = 'bg-secondary'; // Chờ xác nhận
        if (order.status === 'Đang xử lý') badgeClass = 'bg-info text-dark';
        if (order.status === 'Đang vận chuyển') badgeClass = 'bg-primary';
        if (order.status === 'Hoàn tất') badgeClass = 'bg-success';
        if (order.status === 'Đã hủy') badgeClass = 'bg-danger';

        html += `
            <tr>
                <td class="fw-bold text-danger">${order.orderCode}</td>
                <td>${date}</td>
                <td><span class="badge ${badgeClass}">${order.status || 'Chờ xác nhận'}</span></td>
                <td class="fw-bold">${order.totalAmount.toLocaleString('vi-VN')}đ</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

// Hàm lọc đơn hàng khi bấm vào các Tab
window.filterMyOrders = function(status, element) {
    // Đổi style của các Tab
    const tabs = document.querySelectorAll('#order-filter-tabs .nav-link');
    tabs.forEach(tab => {
        tab.classList.remove('active', 'text-dark', 'fw-bold');
        tab.classList.add('text-muted');
    });
    element.classList.remove('text-muted');
    element.classList.add('active', 'text-dark', 'fw-bold');

    // Lọc dữ liệu
    if (status === 'Tất cả') {
        renderMyOrdersTable(allMyOrdersList);
    } else {
        const filtered = allMyOrdersList.filter(o => o.status === status);
        renderMyOrdersTable(filtered);
    }
};

// Hàm tự động tạo danh sách Ngày, Tháng, Năm cho form Thông tin tài khoản
function initBirthdayDropdowns() {
    const daySelect = document.getElementById('profile-day');
    const monthSelect = document.getElementById('profile-month');
    const yearSelect = document.getElementById('profile-year');

    if (!daySelect || !monthSelect || !yearSelect) return;

    // Tạo Ngày (1 - 31)
    for (let i = 1; i <= 31; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        daySelect.add(option);
    }

    // Tạo Tháng (1 - 12)
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = `Tháng ${i}`;
        monthSelect.add(option);
    }

    // Tạo Năm (Từ năm 1950 đến năm hiện tại)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1950; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.add(option);
    }
}

// Hàm lấy thông tin User từ Backend
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await res.json();

        if (res.ok) {
            // 1. Thay thế email
            const emailEl = document.getElementById('profile-email');
            if (emailEl) emailEl.innerText = user.email;

            // 2. Thay thế họ tên trong form
            const nameInput = document.getElementById('profile-name');
            if (nameInput) nameInput.value = user.fullname;

            // 3. Cập nhật SĐT (thay đổi từ innerText thành value vì giờ là input)
            const phoneInput = document.getElementById('profile-phone');
            if (phoneInput) phoneInput.value = user.phone || "";

            // 4. Cập nhật Sidebar
            const sidebarName = document.getElementById('sidebar-name');
            if (sidebarName) sidebarName.innerText = user.fullname;

            const sidebarPhone = document.getElementById('sidebar-phone');
            if (sidebarPhone) sidebarPhone.innerText = user.phone || "Thành viên";
            
            // 5. Tự động tích chọn giới tính (nếu có)
            if (user.gender === 'Nữ') {
                const genderFemale = document.getElementById('genderFemale');
                if (genderFemale) genderFemale.checked = true;
            } else {
                const genderMale = document.getElementById('genderMale');
                if (genderMale) genderMale.checked = true;
            }

            // 6. Điền lại ngày sinh vào các select box
            if (user.birthday) {
                const daySelect = document.getElementById('profile-day');
                const monthSelect = document.getElementById('profile-month');
                const yearSelect = document.getElementById('profile-year');
                
                if (daySelect) daySelect.value = user.birthday.day || "";
                if (monthSelect) monthSelect.value = user.birthday.month || "";
                if (yearSelect) yearSelect.value = user.birthday.year || "";
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải thông tin cá nhân:", error);
    }
}

// Hàm gửi dữ liệu cập nhật lên Backend
window.updateUserProfile = async function() {
    const token = localStorage.getItem('token');
    
    // Thu thập dữ liệu trên form
    const fullname = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const gender = document.querySelector('input[name="profileGender"]:checked').value;
    const birthday = {
        day: document.getElementById('profile-day').value,
        month: document.getElementById('profile-month').value,
        year: document.getElementById('profile-year').value
    };

    if (!fullname) return alert("Họ tên không được để trống!");

    try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ fullname, phone, gender, birthday })
        });

        const data = await res.json();
        
        if (res.ok) {
            alert("✅ Cập nhật thông tin thành công!");
            
            // Cập nhật lại giao diện Sidebar ngay lập tức
            localStorage.setItem('userName', fullname); // Cập nhật tên ở local
            document.getElementById('sidebar-name').innerText = fullname;
            document.getElementById('sidebar-phone').innerText = phone || "Thành viên";
            
            // Nếu có hàm update tên ở Header, gọi luôn
            if (typeof updateUserUI === 'function') updateUserUI();
        } else {
            alert("❌ Lỗi: " + data.error);
        }
    } catch (err) {
        alert("❌ Lỗi kết nối Server");
    }
};