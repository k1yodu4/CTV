document.addEventListener('DOMContentLoaded', function () {
    
    const isHomePage = window.location.pathname.endsWith('home.html') || window.location.pathname === '/';

    // 1. TẢI HEADER
    async function loadHeader() {
        try {
            const response = await fetch('header.html');
            const headerHTML = await response.text();
            document.getElementById('header-placeholder').innerHTML = headerHTML;

            renderSideMenu(); 
            renderMegamenuPanels(); 
            setupMegamenuEvents(); 
            setupHeaderEvents(); 

        } catch (error) {
            console.error('Lỗi khi tải Header:', error);
        }
    }

    // 2. VẼ MENU DỌC
    function renderSideMenu() {
        const menuHTML = menuData.map(item => `
            <a href="#" 
               class="list-group-item list-group-item-action d-flex justify-content-between align-items-center side-menu-item" 
               ${item.target ? `data-megamenu-target="${item.target}"` : ''}>
                <span class="d-flex align-items-center">
                    <i class="bi ${item.icon} me-3"></i>${item.name}
                </span>
                <i class="bi bi-chevron-right small small-chevron"></i>
            </a>
        `).join('');

        const headerMenuContainer = document.getElementById('header-side-menu-container');
        if (headerMenuContainer) headerMenuContainer.innerHTML = menuHTML;

        const sideMenuContainer = document.getElementById('side-menu-container');
        if (sideMenuContainer) sideMenuContainer.innerHTML = menuHTML;
    }

    // 3. VẼ RUỘT MEGAMENU
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

            // SỬA LỖI 2 & 3: Dùng data-panel thay vì class để tra cứu chính xác 100%
            allPanelsHTML += `
                <div class="megamenu-panel p-4" data-panel="megamenu-${key}" style="display: none;">
                    <div class="row">${columnsHTML}</div>
                </div>`;
        }

        // SỬA LỖI 1: Cập nhật đúng ID container của cả 2 nơi
        const headerContentArea = document.getElementById('header-megamenu-panels-container');
        if (headerContentArea) headerContentArea.innerHTML = allPanelsHTML;

        const mainContentArea = document.getElementById('megamenu-panels-container');
        if (mainContentArea) mainContentArea.innerHTML = allPanelsHTML;
    }

    // 3.5 THIẾT LẬP SỰ KIỆN HOVER
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
            
            // SỬA LỖI 4: Gọi trực tiếp bằng ID thay vì class để tránh thiếu sót trong HTML
            const cards = [
                document.getElementById('header-megamenu-content-card'), 
                document.getElementById('megamenu-content-card')
            ];
            cards.forEach(card => { if(card) card.classList.remove('active'); });
        }

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                clearTimeout(leaveTimer);
                hideAllPanels(); 
                
                // Lấy ID gốc (vd: #megamenu-pc-gvn) và bỏ dấu # đi (thành megamenu-pc-gvn)
                const targetAttr = this.getAttribute('data-megamenu-target');
                const targetData = targetAttr ? targetAttr.replace('#', '') : ''; 
                
                const isHeaderMenu = this.closest('#megamenu-wrapper') !== null;
                
                const activeCard = isHeaderMenu 
                    ? document.getElementById('header-megamenu-content-card')
                    : document.getElementById('megamenu-content-card');

                if (activeCard && targetData) {
                    this.classList.add('active'); 
                    activeCard.classList.add('active'); 
                    
                    // Tìm đúng panel dựa trên data-panel
                    const targetPanel = activeCard.querySelector(`[data-panel="${targetData}"]`);
                    if (targetPanel) {
                        targetPanel.classList.add('show');
                        targetPanel.style.display = 'block'; 
                    }
                }
            });

            item.addEventListener('mouseleave', function () {
                leaveTimer = setTimeout(() => hideAllPanels(), 100);
            });
        });

        // Giữ menu khi hover vào Card
        const cards = [document.getElementById('header-megamenu-content-card'), document.getElementById('megamenu-content-card')];
        cards.forEach(card => {
            if (card) {
                card.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
                card.addEventListener('mouseleave', () => {
                    leaveTimer = setTimeout(() => hideAllPanels(), 100);
                });
            }
        });
    }

    // 4. THIẾT LẬP NÚT DANH MỤC & TÌM KIẾM
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

        // SỬA LỖI 5: Cho phép nút Toggle hoạt động bình thường trên mọi trang
        if (megamenuWrapper) {
            megamenuWrapper.style.display = 'none'; // Luôn ẩn mặc định
        }    

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
    // 1. TẠO HTML CHO MODAL ĐĂNG NHẬP / ĐĂNG KÝ
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
                            <div class="mb-3">
                                <input type="email" class="form-control" placeholder="Email" required>
                            </div>
                            <div class="mb-3">
                                <input type="password" class="form-control" placeholder="Mật khẩu" required>
                            </div>
                            <div class="text-end mb-3">
                                <a href="#" class="text-danger small text-decoration-none">Quên mật khẩu?</a>
                            </div>
                            <button type="submit" class="btn btn-danger w-100 fw-bold mb-3">ĐĂNG NHẬP</button>
                            <div class="text-center text-muted small mb-3">hoặc đăng nhập bằng</div>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-outline-danger w-50"><i class="fab fa-google"></i> Google</button>
                                <button type="button" class="btn btn-outline-primary w-50"><i class="fab fa-facebook-f"></i> Facebook</button>
                            </div>
                        </form>
                    </div>

                    <div class="tab-pane fade" id="register-pane" role="tabpanel">
                        <form id="registerForm">
                            <div class="mb-3"><input type="text" class="form-control" placeholder="Họ và tên" required></div>
                            <div class="mb-3"><input type="email" class="form-control" placeholder="Email" required></div>
                            <div class="mb-3"><input type="password" class="form-control" placeholder="Mật khẩu" required></div>
                            <button type="submit" class="btn btn-danger w-100 fw-bold">TẠO TÀI KHOẢN</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

// Tự động chèn Modal vào thẻ body khi trang vừa load xong
document.body.insertAdjacentHTML('beforeend', authModalHTML);

// 2. TẠO HTML CHO NÚT HEADER (Thay thế vào phần Header của bạn)
// Hãy gắn đoạn HTML này vào chỗ bạn đang vẽ thanh Header (cạnh thanh tìm kiếm)
const headerActionsHTML = `
<div class="d-flex align-items-center gap-4 text-white">
    <div class="header-action-item d-flex align-items-center" onclick="requireLogin(event, 'tracking')">
        <i class="fas fa-clipboard-list fs-4 me-2"></i>
        <span style="font-size: 13px;">Tra cứu<br><b>đơn hàng</b></span>
    </div>

    <div class="header-action-item d-flex align-items-center">
        <i class="far fa-user-circle fs-3 me-2"></i>
        <span style="font-size: 13px;">Đăng<br><b>nhập</b></span>
        
        <div class="account-dropdown text-center">
            <p class="mb-3 fw-bold">👋 Xin chào, vui lòng đăng nhập</p>
            <div class="d-flex gap-2 mb-3">
                <button class="btn btn-dark w-50" onclick="openAuthModal('login')">ĐĂNG NHẬP</button>
                <button class="btn btn-outline-dark w-50" onclick="openAuthModal('register')">ĐĂNG KÝ</button>
            </div>
            <a href="#" class="text-muted small text-decoration-none d-block text-start border-top pt-2">
                <i class="far fa-question-circle me-1"></i> Trợ giúp
            </a>
        </div>
    </div>
</div>
`;

// (Bạn tự điều chỉnh vị trí insert headerActionsHTML vào đúng div header của bạn)

// 3. LOGIC XỬ LÝ
// Giả lập trạng thái đăng nhập (Bạn sẽ thay bằng kiểm tra token thật sau này)
let isLoggedIn = false; 

function openAuthModal(tab) {
    // Khởi tạo và mở Modal
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
    
    // Chuyển Tab tương ứng (Login hoặc Register)
    if (tab === 'register') {
        const registerTab = new bootstrap.Tab(document.getElementById('register-tab'));
        registerTab.show();
    } else {
        const loginTab = new bootstrap.Tab(document.getElementById('login-tab'));
        loginTab.show();
    }
}

function requireLogin(event, action) {
    event.preventDefault(); // Ngăn chặn chuyển trang
    
    if (!isLoggedIn) {
        // Nếu chưa đăng nhập -> Mở modal yêu cầu đăng nhập
        openAuthModal('login');
    } else {
        // Nếu đã đăng nhập -> Thực hiện hành động
        if(action === 'tracking') {
            window.location.href = "tracking.html"; // Chuyển sang trang tra cứu
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. TẠO GIAO DIỆN MODAL ĐĂNG NHẬP/ĐĂNG KÝ
    const authModalHTML = `
    <div class="modal fade auth-modal" id="authModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header pt-4 px-4">
                    <h5 class="modal-title w-100 text-center fw-bold text-uppercase fs-5">Đăng nhập hoặc Tạo tài khoản</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body px-4 pb-4">
                    <ul class="nav nav-tabs justify-content-center" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="tab-login" data-bs-toggle="tab" data-bs-target="#pane-login" type="button" role="tab">ĐĂNG NHẬP</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="tab-register" data-bs-toggle="tab" data-bs-target="#pane-register" type="button" role="tab">ĐĂNG KÝ</button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="pane-login" role="tabpanel">
                            <form id="loginForm">
                                <div class="mb-3"><input type="email" class="form-control" placeholder="Email" required></div>
                                <div class="mb-3"><input type="password" class="form-control" placeholder="Mật khẩu" required></div>
                                <div class="text-end mb-3"><a href="#" class="text-danger small text-decoration-none">Quên mật khẩu?</a></div>
                                <button type="submit" class="btn btn-danger w-100 fw-bold py-2 mb-3">ĐĂNG NHẬP</button>
                                
                                <div class="text-center text-muted small border-bottom pb-2 mb-3" style="position:relative;">
                                    <span class="bg-white px-2" style="position:absolute; top:-10px; left:50%; transform:translateX(-50%);">hoặc đăng nhập bằng</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <button type="button" class="btn btn-outline-danger w-50 py-2"><i class="fab fa-google"></i> Google</button>
                                    <button type="button" class="btn btn-outline-primary w-50 py-2"><i class="fab fa-facebook-f"></i> Facebook</button>
                                </div>
                            </form>
                        </div>

                        <div class="tab-pane fade" id="pane-register" role="tabpanel">
                            <form id="registerForm">
                                <div class="mb-3"><input type="text" class="form-control" placeholder="Họ và tên" required></div>
                                <div class="mb-3"><input type="email" class="form-control" placeholder="Email" required></div>
                                <div class="mb-3"><input type="password" class="form-control" placeholder="Mật khẩu" required></div>
                                <button type="submit" class="btn btn-danger w-100 fw-bold py-2">ĐĂNG KÝ NGAY</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Chèn modal vào cuối body
    document.body.insertAdjacentHTML('beforeend', authModalHTML);
});

// 3. HÀM MỞ MODAL ĐĂNG NHẬP
window.openAuthModal = function(actionType) {
    const authModal = new bootstrap.Modal(document.getElementById('authModal'));
    authModal.show();
    
    // Tự động chuyển qua tab tương ứng
    if (actionType === 'register') {
        const tabTrigger = new bootstrap.Tab(document.getElementById('tab-register'));
        tabTrigger.show();
    } else {
        const tabTrigger = new bootstrap.Tab(document.getElementById('tab-login'));
        tabTrigger.show();
    }
};

// 4. HÀM KIỂM TRA ĐĂNG NHẬP KHI BẤM "TRA CỨU ĐƠN HÀNG"
window.requireLogin = function(event, action) {
    event.preventDefault(); // Ngăn trình duyệt chuyển trang
    
    if (!isLoggedIn) {
        openAuthModal('login'); // Trực tiếp bật popup đăng nhập lên
    } else {
        if(action === 'tracking') {
            window.location.href = "tracking.html"; 
        }
    }
};

    // KHỞI ĐỘNG
    loadHeader(); 
});