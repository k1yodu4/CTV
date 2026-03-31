document.addEventListener('DOMContentLoaded', function () {
    // 2. HÀM TẢI HEADER (TRUNG TÂM ĐIỀU KHIỂN)
    // Giả sử bạn ĐÃ có file header.html và có thẻ <div id="header-placeholder"></div> trong file chính
    async function loadHeader() {
        try {
            // NẾU BẠN CHƯA DÙNG HEADER.HTML TÁCH RỜI MÀ VẪN DÙNG HTML CŨ, BẠN CÓ THỂ BỎ QUA ĐOẠN FETCH NÀY
            // VÀ CHỈ CẦN GỌI HÀM setupHeaderEvents() LÀ ĐƯỢC.
            
             // Bỏ comment đoạn này nếu bạn dùng header.html
            const response = await fetch('header.html');
            const headerHTML = await response.text();
            document.getElementById('header-placeholder').innerHTML = headerHTML;
            

            // CHỈ CHẠY CÁC HÀM NÀY SAU KHI HTML ĐÃ SẴN SÀNG
            renderSideMenu();
            renderMegamenuPanels();
            setupHeaderEvents(); 

        } catch (error) {
            console.error('Lỗi khi tải Header:', error);
        }
    }

    // 3. HÀM VẼ MENU DỌC BÊN TRÁI
    function renderSideMenu() {
        const menuContainer = document.getElementById('side-menu-container');
        if (menuContainer) {
            menuContainer.innerHTML = menuData.map(item => `
                <a href="#" 
                   class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                   ${item.target ? `data-megamenu-target="${item.target}"` : ''}>
                    <span class="d-flex align-items-center">
                        <i class="bi ${item.icon} me-3"></i>${item.name}
                    </span>
                    <i class="bi bi-chevron-right small small-chevron"></i>
                </a>
            `).join('');
        }
    }

    // 4. HÀM VẼ CÁC BẢNG PANEL BÊN PHẢI
    function renderMegamenuPanels() {

        // Logic cho nút "Danh mục" và Overlay
    const btnToggle = document.getElementById('btn-toggle-menu');
    const megamenuWrapper = document.getElementById('megamenu-wrapper');
    const menuOverlay = document.getElementById('menu-overlay'); // Gọi Overlay ra

    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (megamenuWrapper) {
        if (isHomePage) {
            // Nếu là trang chủ: Luôn hiện menu, không cần lớp phủ tối
            megamenuWrapper.style.display = 'flex';
            if (menuOverlay) menuOverlay.style.display = 'none';
        } else {
            // Các trang khác (như category.html): Mặc định ẩn
            megamenuWrapper.style.display = 'none';
        }
    }    

    if (btnToggle && megamenuWrapper) {
        btnToggle.addEventListener('click', function (e) {
            e.stopPropagation(); 
            const isHidden = megamenuWrapper.style.display === 'none' || megamenuWrapper.style.display === '';
            
            // Hiện/ẩn Menu
            megamenuWrapper.style.display = isHidden ? 'flex' : 'none';
            // Hiện/ẩn Overlay nền đen
            if (menuOverlay) menuOverlay.style.display = isHidden ? 'block' : 'none';
        });

        // Click ra ngoài hoặc click vào nền đen thì đóng tất cả
        document.addEventListener('click', function (e) {
            if (!megamenuWrapper.contains(e.target) && e.target !== btnToggle) {
                megamenuWrapper.style.display = 'none';
                if (menuOverlay) menuOverlay.style.display = 'none';
            }
        });
    }

        const contentArea = document.getElementById('megamenu-panels-container');
        if (!contentArea) return;

        let allPanelsHTML = '';
        for (let key in megamenuData) {
            let columnsHTML = '';
            megamenuData[key].forEach(col => {
                columnsHTML += `
                    <div class="col-md-4 mb-3">
                        <h6 class="fw-bold text-ttg">${col.title}</h6>
                        <ul class="list-unstyled">
                            ${col.links.map(link => `<li><a href="category.html?q=${link}" class="text-decoration-none text-dark small">${link}</a></li>`).join('')}
                        </ul>
                    </div>`;
            });

            allPanelsHTML += `
                <div class="megamenu-panel p-4" id="megamenu-${key}" style="display: none;">
                    <div class="row">${columnsHTML}</div>
                </div>`;
        }
        contentArea.insertAdjacentHTML('beforeend', allPanelsHTML);
    }

    // 5. CÀI ĐẶT SỰ KIỆN (SEARCH & HOVER)
    function setupHeaderEvents() {
        // --- Xử lý form search ---
        const searchForm = document.getElementById('searchForm');
        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const keyword = document.getElementById('searchInput').value;
                if (keyword) window.location.href = `category.html?name=${keyword}`;
            });
        }

        // --- Xử lý Hover Megamenu ---
        const menuItems = document.querySelectorAll('.side-menu .list-group-item[data-megamenu-target]');
        const megamenuPanels = document.querySelectorAll('.megamenu-panel');
        const initialContent = document.getElementById('initial-content');
        let leaveTimer;

        function hideAllPanels() {
            megamenuPanels.forEach(panel => {
                panel.classList.remove('show');
                panel.style.display = 'none'; // Đảm bảo ẩn hẳn
            });
            menuItems.forEach(item => item.classList.remove('active'));
            if (initialContent) initialContent.style.setProperty('display', 'flex', 'important'); 
        }

        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                clearTimeout(leaveTimer);
                hideAllPanels(); 
                
                const targetId = this.getAttribute('data-megamenu-target');
                const targetPanel = document.querySelector(targetId);

                if (targetPanel) {
                    this.classList.add('active'); 
                    targetPanel.classList.add('show'); 
                    targetPanel.style.display = 'block'; // Hiện bảng lên
                    if (initialContent) initialContent.style.setProperty('display', 'none', 'important');

                    targetPanel.addEventListener('mouseenter', function() {
                        clearTimeout(leaveTimer);
                    });

                    targetPanel.addEventListener('mouseleave', function() {
                        leaveTimer = setTimeout(() => {
                            hideAllPanels();
                        }, 100); 
                    });
                }
            });

            item.addEventListener('mouseleave', function () {
                leaveTimer = setTimeout(() => {
                    hideAllPanels();
                }, 100);
            });
        });
    }

    // KHỞI ĐỘNG HỆ THỐNG
    loadHeader(); 
});