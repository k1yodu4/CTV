document.addEventListener('DOMContentLoaded', function () {
    
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

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
                            ${col.links.map(link => `<li><a href="category.html?name=${link}" class="text-decoration-none text-dark small">${link}</a></li>`).join('')}
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

    // KHỞI ĐỘNG
    loadHeader(); 
});