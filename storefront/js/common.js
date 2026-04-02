document.addEventListener('DOMContentLoaded', function () {
    
    const isHomePage = window.location.pathname.endsWith('home.html') || window.location.pathname === '/';
    let isLoggedIn = !!localStorage.getItem('token'); // Kiểm tra ngay lập tức xem có token không

    // ==========================================
    // 1. TẠO VÀ CHÈN MODAL ĐĂNG NHẬP VÀO BODY
    // ==========================================
    const authModalHTML = `
    <div class="modal fade auth-modal" id="authModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-3">
                <div class="modal-header">
                    <h5 class="modal-title w-100 text-center fw-bold text-uppercase fs-6">Đăng nhập hoặc Tạo tài khoản</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs justify-content-center" id="authTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login-pane" type="button" role="tab">ĐĂNG NHẬP</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register-pane" type="button" role="tab">ĐĂNG KÝ</button>
                        </li>
                    </ul>

                    <div class="tab-content" id="authTabContent">
                        <div class="tab-pane fade show active" id="login-pane" role="tabpanel">
                            <form id="loginForm">
                                <div class="mb-3"><input type="email" class="form-control" placeholder="Email" required></div>
                                <div class="mb-3"><input type="password" class="form-control" placeholder="Mật khẩu" required></div>
                                <div class="text-end mb-3"><a href="#" class="text-danger small text-decoration-none">Quên mật khẩu?</a></div>
                                <button type="submit" class="btn btn-danger w-100 fw-bold py-2 mb-3">ĐĂNG NHẬP</button>
                            </form>
                        </div>
                        <div class="tab-pane fade" id="register-pane" role="tabpanel">
                            <form id="registerForm">
                                <div class="mb-3"><input type="text" class="form-control" placeholder="Họ và tên" required></div>
                                <div class="mb-3"><input type="email" class="form-control" placeholder="Email" required></div>
                                <div class="mb-3"><input type="password" class="form-control" placeholder="Mật khẩu" required></div>
                                <button type="submit" class="btn btn-danger w-100 fw-bold py-2">TẠO TÀI KHOẢN</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', authModalHTML);

    // ==========================================
    // 2. GẮN SỰ KIỆN CHO FORM ĐĂNG KÝ / ĐĂNG NHẬP
    // ==========================================
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = e.target[0].value;
            const email = e.target[1].value;
            const password = e.target[2].value;

            try {
                const res = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert("✅ Đăng ký thành công! Vui lòng đăng nhập.");
                    openAuthModal('login'); // Chuyển tab đăng nhập
                } else alert("❌ Lỗi: " + data.error);
            } catch (err) { alert("❌ Lỗi kết nối Server"); }
        });
    }

    const logForm = document.getElementById('loginForm');
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const password = e.target[1].value;

            try {
                const res = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userName', data.fullname);
                    alert("✅ Đăng nhập thành công!");
                    window.location.reload(); 
                } else alert("❌ Lỗi: " + data.error);
            } catch (err) { alert("❌ Lỗi kết nối Server"); }
        });
    }

    // ==========================================
    // 3. TẢI HEADER BẤT ĐỒNG BỘ
    // ==========================================
    async function loadHeader() {
        try {
            const response = await fetch('header.html?v=' + new Date().getTime());
            const headerHTML = await response.text();
            document.getElementById('header-placeholder').innerHTML = headerHTML;

            // Chạy các hàm vẽ UI sau khi Header ĐÃ NẰM TRONG DOM
            renderSideMenu(); 
            renderMegamenuPanels(); 
            setupMegamenuEvents(); 
            setupHeaderEvents(); 

            // Cập nhật giao diện Đăng nhập
            updateUserUI(); 
            
            // QUAN TRỌNG: Gọi hàm này ở đây để đảm bảo Header đã load xong
            if (typeof window.updateCartBadge === 'function') {
                window.updateCartBadge();
            }

        } catch (error) {
            console.error('Lỗi khi tải Header:', error);
        }
    }

    // ==========================================
    // 4. CẬP NHẬT GIAO DIỆN HEADER (Auth UI & Cart)
    // ==========================================
    function updateUserUI() {
        const token = localStorage.getItem('token');
        if (token) {
            const userName = localStorage.getItem('userName');
            const userRole = localStorage.getItem('userRole');

            const loginText = document.querySelector('.login-hover-box span');
            if (loginText) loginText.innerHTML = `Xin chào,<br><span class="fw-bold fs-6">${userName}</span>`;

            let adminHtml = '';
            if (userRole === 'admin') {
                adminHtml = `
                    <a href="admin.html" class="btn btn-warning w-100 fw-bold mb-2">
                        <i class="fas fa-cog"></i> QUẢN TRỊ ADMIN
                    </a>
                `;
            }

            const dropdown = document.querySelector('.account-dropdown');
            if (dropdown) {
                dropdown.innerHTML = `
                    ${adminHtml}
                    <a href="#" class="btn btn-outline-danger w-100 fw-bold" onclick="logout(event)">ĐĂNG XUẤT</a>
                `;
            }
        }
    }

    // Hàm đếm số Giỏ hàng - ĐỊNH NGHĨA GLOBAL
    window.updateCartBadge = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Tìm đúng cái ID đã đặt
        const badge = document.getElementById('cart-badge');
        if (badge) {
            badge.innerText = totalItems;
        }
    };

    // ==========================================
    // 5. CÁC HÀM GLOBAL (Dùng ở thẻ HTML onclick="")
    // ==========================================
    window.openAuthModal = function(actionType) {
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
        if (actionType === 'register') {
            new bootstrap.Tab(document.getElementById('register-tab')).show();
        } else {
            new bootstrap.Tab(document.getElementById('login-tab')).show();
        }
    };

    window.requireLogin = function(event, action) {
        event.preventDefault(); 
        if (!isLoggedIn) {
            openAuthModal('login'); 
        } else {
            if(action === 'tracking') window.location.href = "tracking.html"; 
        }
    };

    window.logout = function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    };

    // ==========================================
    // 6. CÁC HÀM VẼ MEGAMENU (Giữ nguyên của bạn)
    // ==========================================
    function renderSideMenu() {
        const menuHTML = menuData.map(item => `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center side-menu-item" ${item.target ? `data-megamenu-target="${item.target}"` : ''}>
                <span class="d-flex align-items-center"><i class="bi ${item.icon} me-3"></i>${item.name}</span>
                <i class="bi bi-chevron-right small small-chevron"></i>
            </a>
        `).join('');

        const headerMenuContainer = document.getElementById('header-side-menu-container');
        if (headerMenuContainer) headerMenuContainer.innerHTML = menuHTML;
        const sideMenuContainer = document.getElementById('side-menu-container');
        if (sideMenuContainer) sideMenuContainer.innerHTML = menuHTML;
    }

    function renderMegamenuPanels() {
        let allPanelsHTML = '';
        for (let key in megamenuData) {
            let columnsHTML = '';
            megamenuData[key].forEach(col => {
                columnsHTML += `
                    <div class="col-md-4 mb-3">
                        <h6 class="fw-bold text-ttg">${col.title}</h6>
                        <ul class="list-unstyled">
                            ${col.links.map(link => {
                                const url = typeof link === 'string' ? `category.html?name=${link}` : link.url;
                                const label = typeof link === 'string' ? link : link.label;
                                return `<li><a href="${url}" class="text-decoration-none text-dark small">${label}</a></li>`;
                            }).join('')}
                        </ul>
                    </div>`;
            });
            allPanelsHTML += `<div class="megamenu-panel p-4" data-panel="megamenu-${key}" style="display: none;"><div class="row">${columnsHTML}</div></div>`;
        }

        const headerContentArea = document.getElementById('header-megamenu-panels-container');
        if (headerContentArea) headerContentArea.innerHTML = allPanelsHTML;
        const mainContentArea = document.getElementById('megamenu-panels-container');
        if (mainContentArea) mainContentArea.innerHTML = allPanelsHTML;
    }

    function setupMegamenuEvents() {
        const menuItems = document.querySelectorAll('.side-menu-item[data-megamenu-target]');
        let leaveTimer;
        if (menuItems.length === 0) return;

        function hideAllPanels() {
            document.querySelectorAll('.megamenu-panel').forEach(panel => {
                panel.style.display = 'none';
                panel.classList.remove('show');
            });
            menuItems.forEach(item => item.classList.remove('active'));
            [document.getElementById('header-megamenu-content-card'), document.getElementById('megamenu-content-card')]
                .forEach(card => { if(card) card.classList.remove('active'); });
        }

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                clearTimeout(leaveTimer);
                hideAllPanels(); 
                const targetAttr = this.getAttribute('data-megamenu-target');
                const targetData = targetAttr ? targetAttr.replace('#', '') : ''; 
                const isHeaderMenu = this.closest('#megamenu-wrapper') !== null;
                const activeCard = isHeaderMenu ? document.getElementById('header-megamenu-content-card') : document.getElementById('megamenu-content-card');

                if (activeCard && targetData) {
                    this.classList.add('active'); 
                    activeCard.classList.add('active'); 
                    const targetPanel = activeCard.querySelector(`[data-panel="${targetData}"]`);
                    if (targetPanel) {
                        targetPanel.classList.add('show');
                        targetPanel.style.display = 'block'; 
                    }
                }
            });
            item.addEventListener('mouseleave', () => leaveTimer = setTimeout(() => hideAllPanels(), 100));
        });

        [document.getElementById('header-megamenu-content-card'), document.getElementById('megamenu-content-card')].forEach(card => {
            if (card) {
                card.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
                card.addEventListener('mouseleave', () => leaveTimer = setTimeout(() => hideAllPanels(), 100));
            }
        });
    }

    function setupHeaderEvents() {
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const keyword = document.getElementById('searchInput').value;
                if (keyword) window.location.href = `category.html?name=${keyword}`;
            });
        }
        const btnToggle = document.getElementById('btn-toggle-menu');
        const megamenuWrapper = document.getElementById('megamenu-wrapper');
        const menuOverlay = document.getElementById('menu-overlay');

        if (megamenuWrapper) megamenuWrapper.style.display = 'none'; 

        if (btnToggle && megamenuWrapper) {
            btnToggle.addEventListener('click', function (e) {
                e.stopPropagation(); 
                const isHidden = megamenuWrapper.style.display === 'none' || megamenuWrapper.style.display === '';
                megamenuWrapper.style.display = isHidden ? 'flex' : 'none';
                if (menuOverlay) menuOverlay.style.display = isHidden ? 'block' : 'none';
            });
            document.addEventListener('click', function (e) {
                if (!megamenuWrapper.contains(e.target) && e.target !== btnToggle) {
                    megamenuWrapper.style.display = 'none';
                    if (menuOverlay) menuOverlay.style.display = 'none';
                }
            });
        }
    }

    // Biến đếm ngược thời gian để tắt popup
// Biến đếm ngược thời gian để tắt popup
let cartPopupTimeout;

window.showCartPopup = function(image, title) {
    const popup = document.getElementById('cart-popup-notification');
    if (!popup) return;

    // Đã thêm CSS trực tiếp vào đây để đẹp như GearVN
    popup.innerHTML = `
        <div class="cart-popup-title text-success fw-bold text-center mb-2">Thêm vào giỏ hàng thành công <i class="bi bi-check-circle-fill"></i></div>
        <div class="cart-popup-item d-flex align-items-center mb-3">
            <img src="${image}" alt="Product" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #eee; margin-right: 12px;">
            <div class="cart-popup-item-title" style="font-size: 13px; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${title}</div>
        </div>
        <a href="cart.html" class="btn btn-warning w-100 fw-bold text-dark text-decoration-none text-center" style="background-color: #f39c12; border: none; padding: 10px 0;">XEM GIỎ HÀNG</a>
    `;

    popup.classList.add('show');

    clearTimeout(cartPopupTimeout);
    
    cartPopupTimeout = setTimeout(() => {
        popup.classList.remove('show');
    }, 3500);
};

    // ==========================================
    // 7. KHỞI CHẠY TẤT CẢ
    // ==========================================
    loadHeader(); 
});