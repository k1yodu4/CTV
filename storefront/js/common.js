document.addEventListener('DOMContentLoaded', function () {
    
    // Kiểm tra xem có đang ở trang chủ hay không (home.html hoặc ở root /)
    const isHomePage = window.location.pathname.endsWith('home.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname.split('/').pop().indexOf('.') === -1;
    
    const htmlPath = isHomePage ? 'html/' : '';
    let isLoggedIn = !!localStorage.getItem('token'); 

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
    // 2. GẮN SỰ KIỆN CHO FORM (Rút gọn)
    // ==========================================
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = e.target[0].value, email = e.target[1].value, password = e.target[2].value;
            try {
                const res = await fetch('http://localhost/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullname: fullName, email, password })
                });
                if (res.ok) { alert("✅ Đăng ký thành công!"); openAuthModal('login'); } 
                else { const d = await res.json(); alert("❌ Lỗi: " + d.error); }
            } catch (err) { alert("❌ Lỗi kết nối Server"); }
        });
    }

    const logForm = document.getElementById('loginForm');
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target[0].value, password = e.target[1].value;
            try {
                const res = await fetch('http://localhost/api/login', {
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
    // 3. TẢI HEADER BẤT ĐỒNG BỘ & FIX PATHS
    // ==========================================
    async function loadHeader() {
        try {
            const headerFile = isHomePage ? 'html/header.html' : 'header.html';
            const response = await fetch(headerFile + '?v=' + new Date().getTime());
            let headerHTML = await response.text();
            
            // Xử lý lại đường dẫn trong Header dựa theo vị trí trang hiện tại
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = headerHTML;
            const links = tempDiv.querySelectorAll('a');
            links.forEach(a => {
                const href = a.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#') && href !== 'javascript:void(0)') {
                    if (isHomePage) {
                        if (href !== 'home.html') a.href = 'html/' + href;
                    } else {
                        if (href === 'home.html') a.href = '../home.html';
                    }
                }
            });
            
            document.getElementById('header-placeholder').innerHTML = tempDiv.innerHTML;

            renderSideMenu(); 
            renderMegamenuPanels(); 
            setupMegamenuEvents(); 
            setupHeaderEvents(); 
            updateUserUI(); 
            if (typeof window.updateCartBadge === 'function') window.updateCartBadge();
        } catch (error) {
            console.error('Lỗi khi tải Header:', error);
        }
    }

    // ==========================================
    // 4. CẬP NHẬT GIAO DIỆN HEADER
    // ==========================================
    function updateUserUI() {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');

        if (token) {
            const loginText = document.querySelector('.login-hover-box span');
            if (loginText) loginText.innerHTML = `Xin chào,<br><span class="fw-bold fs-6">${userName}</span>`;

            let adminHtml = (userRole === 'admin') ? `
                <a href="${htmlPath}admin.html" class="btn btn-warning w-100 fw-bold mb-2">
                    <i class="fas fa-cog"></i> QUẢN TRỊ ADMIN
                </a>` : '';

            const dropdown = document.querySelector('.account-dropdown');
            if (dropdown) dropdown.innerHTML = `${adminHtml}<a href="#" class="btn btn-outline-danger w-100 fw-bold" onclick="logout(event)">ĐĂNG XUẤT</a>`;

            const btnAdmin = document.getElementById('btn-admin-panel');
            if (btnAdmin) {
                btnAdmin.style.display = (userRole === 'admin') ? 'inline-block' : 'none';
                btnAdmin.href = `${htmlPath}admin.html`;
            }
        }
    }

    window.updateCartBadge = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cart-badge');
        if (badge) badge.innerText = total;
    };

    window.openAuthModal = (type) => {
        const m = new bootstrap.Modal(document.getElementById('authModal'));
        m.show();
        if (type === 'register') new bootstrap.Tab(document.getElementById('register-tab')).show();
        else new bootstrap.Tab(document.getElementById('login-tab')).show();
    };

    window.requireLogin = (e, action) => {
        e.preventDefault(); 
        if (!isLoggedIn) openAuthModal('login'); 
        else if(action === 'tracking') window.location.href = `${htmlPath}tracking.html`; 
    };

    window.logout = (e) => { e.preventDefault(); localStorage.clear(); window.location.reload(); };

    // ==========================================
    // 6. RENDER MENU / MEGAMENU
    // ==========================================
    function renderSideMenu() {
        const menuHTML = menuData.map(item => `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center side-menu-item" ${item.target ? `data-megamenu-target="${item.target}"` : ''}>
                <span class="d-flex align-items-center"><i class="bi ${item.icon} me-3"></i>${item.name}</span>
                <i class="bi bi-chevron-right small small-chevron"></i>
            </a>
        `).join('');
        ['header-side-menu-container', 'side-menu-container'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = menuHTML;
        });
    }

    function renderMegamenuPanels() {
        let allPanelsHTML = '';
        for (let key in megamenuData) {
            let cols = '';
            megamenuData[key].forEach(col => {
                cols += `
                    <div class="col-md-4 mb-3">
                        <h6 class="fw-bold text-ttg">${col.title}</h6>
                        <ul class="list-unstyled">
                            ${col.links.map(link => {
                                const url = typeof link === 'string' ? `${htmlPath}category.html?name=${link}` : (link.url.startsWith('http') ? link.url : htmlPath + link.url);
                                const label = typeof link === 'string' ? link : link.label;
                                return `<li><a href="${url}" class="text-decoration-none text-dark small">${label}</a></li>`;
                            }).join('')}
                        </ul>
                    </div>`;
            });
            allPanelsHTML += `<div class="megamenu-panel p-4" data-panel="megamenu-${key}" style="display: none;"><div class="row">${cols}</div></div>`;
        }
        ['header-megamenu-panels-container', 'megamenu-panels-container'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = allPanelsHTML;
        });
    }

    function setupMegamenuEvents() {
        const items = document.querySelectorAll('.side-menu-item[data-megamenu-target]');
        let timer;
        const hide = () => {
            document.querySelectorAll('.megamenu-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('show'); });
            items.forEach(i => i.classList.remove('active'));
            ['header-megamenu-content-card', 'megamenu-content-card'].forEach(id => { const c = document.getElementById(id); if(c) c.classList.remove('active'); });
        };
        items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                clearTimeout(timer); hide();
                const target = this.getAttribute('data-megamenu-target').replace('#', '');
                const isH = this.closest('#megamenu-wrapper') !== null;
                const card = isH ? document.getElementById('header-megamenu-content-card') : document.getElementById('megamenu-content-card');
                if (card && target) {
                    this.classList.add('active'); card.classList.add('active');
                    const p = card.querySelector(`[data-panel="${target}"]`);
                    if (p) { p.classList.add('show'); p.style.display = 'block'; }
                }
            });
            item.addEventListener('mouseleave', () => timer = setTimeout(hide, 100));
        });
        ['header-megamenu-content-card', 'megamenu-content-card'].forEach(id => {
            const c = document.getElementById(id);
            if (c) { c.addEventListener('mouseenter', () => clearTimeout(timer)); c.addEventListener('mouseleave', () => timer = setTimeout(hide, 100)); }
        });
    }

    function setupHeaderEvents() {
        const f = document.getElementById('searchForm');
        if (f) f.addEventListener('submit', e => { e.preventDefault(); const k = document.getElementById('searchInput').value; if(k) window.location.href = `${htmlPath}category.html?name=${k}`; });
        
        const btn = document.getElementById('btn-toggle-menu'), wrap = document.getElementById('megamenu-wrapper'), ov = document.getElementById('menu-overlay');
        if (wrap) wrap.style.display = 'none';
        if (btn && wrap) {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const show = wrap.style.display === 'none';
                wrap.style.display = show ? 'flex' : 'none';
                if(ov) ov.style.display = show ? 'block' : 'none';
            });
            document.addEventListener('click', e => { if(!wrap.contains(e.target) && e.target !== btn) { wrap.style.display = 'none'; if(ov) ov.style.display = 'none'; } });
        }
    }

    window.showCartPopup = (img, title) => {
        const p = document.getElementById('cart-popup-notification');
        if (!p) return;
        p.innerHTML = `
            <div class="cart-popup-title text-success fw-bold text-center mb-2">Thêm vào giỏ hàng thành công <i class="bi bi-check-circle-fill"></i></div>
            <div class="cart-popup-item d-flex align-items-center mb-3">
                <img src="${img}" alt="Product" style="width: 60px; height: 60px; object-fit: contain; border: 1px solid #eee; margin-right: 12px;">
                <div class="cart-popup-item-title" style="font-size: 13px; color: #333; overflow: hidden;">${title}</div>
            </div>
            <a href="${htmlPath}cart.html" class="btn btn-warning w-100 fw-bold text-dark text-center" style="padding: 10px 0;">XEM GIỎ HÀNG</a>
        `;
        p.classList.add('show');
        setTimeout(() => p.classList.remove('show'), 3500);
    };

    loadHeader(); 
});

window.renderRecentlyViewed = (id) => {
    const c = document.getElementById(id);
    if (!c) return;
    const isH = window.location.pathname.endsWith('home.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/') || window.location.pathname.split('/').pop().indexOf('.') === -1;
    const h = isH ? 'html/' : '';
    let v = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    if (v.length === 0) { c.innerHTML = '<div class="text-center text-muted py-4">Bạn chưa xem sản phẩm nào.</div>'; return; }
    let html = '<div class="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">';
    v.forEach(p => {
        html += `
            <div class="col">
                <a href="${h}product-detail.html?id=${p.id}" class="card h-100 shadow-sm text-decoration-none">
                    <img src="${p.image}" class="card-img-top p-3" style="height: 150px; object-fit: contain;" alt="${p.title}">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-dark" style="font-size: 14px; overflow: hidden;">${p.title}</h6>
                        <div class="mt-auto text-danger fw-bold">${p.price.toLocaleString('vi-VN')}đ</div>
                    </div>
                </a>
            </div>`;
    });
    html += '</div>';
    c.innerHTML = html;
};