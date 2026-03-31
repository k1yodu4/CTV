document.addEventListener('DOMContentLoaded', function () {

const menuData = [
    { name: "PC GVN", icon: "bi-pc-display", target: "#megamenu-pc-gvn" },
    { name: "Laptop", icon: "bi-laptop", target: "#megamenu-laptop" },
    { name: "Laptop Gaming", icon: "bi-headset", target: "#megamenu-laptop-gaming" },
    { name: "Main, CPU, VGA", icon: "bi-cpu", target: "#megamenu-linh-kien" },
    { name: "Case, Nguồn, Tản", icon: "bi-pc-display-horizontal", target: "#megamenu-tan-nhiet" },
    { name: "Ổ cứng, RAM, Thẻ nhớ", icon: "bi-memory", target: "#megamenu-luu-tru" },
    { name: "Loa, Micro, Webcam", icon: "bi-speakers", target: "#megamenu-am-thanh" },
    { name: "Màn hình", icon: "bi-display", target: "#megamenu-man-hinh" },
    { name: "Bàn phím", icon: "bi-keyboard", target: "#megamenu-ban-phim" },
    { name: "Chuột + Lót chuột", icon: "bi-mouse3", target: "#megamenu-chuot" },
    { name: "Tai nghe", icon: "bi-headset-mic", target: "#megamenu-tai-nghe" },
    { name: "Ghế - Bàn", icon: "bi-armchair", target: "#megamenu-ghe-ban" },
    { name: "Phần mềm, mạng", icon: "bi-box-seam", target: "#megamenu-phan-mem" },
    { name: "Handheld, Console", icon: "bi-controller", target: "#megamenu-game-console" },
    { name: "Phụ kiện", icon: "bi-plug-fill", target: "#megamenu-phu-kien" },
    { name: "Dịch vụ khác", icon: "bi-gift", target: "#megamenu-dich-vu" }
];
           

menuItems.forEach(item => {
    // 1. KHI CHUỘT ĐI VÀO MỤC MENU DỌC
    item.addEventListener('mouseenter', function () {
        clearTimeout(leaveTimer); // Giữ menu không bị tắt
        hideAllPanels(); 
        
        const targetId = this.getAttribute('data-megamenu-target');
        const targetPanel = document.querySelector(targetId);

        if (targetPanel) {
            this.classList.add('active'); 
            targetPanel.classList.add('show'); 
            if (initialContent) initialContent.style.display = 'none'; 

            // Giữ bảng hiển thị khi chuột chui vào trong bảng
            targetPanel.addEventListener('mouseenter', function() {
                clearTimeout(leaveTimer);
            });

            // Tắt bảng khi chuột chui ra khỏi bảng
            targetPanel.addEventListener('mouseleave', function() {
                leaveTimer = setTimeout(() => {
                    hideAllPanels();
                    item.classList.remove('active');
                    if (initialContent) initialContent.style.display = 'block';
                }, 100); 
            });
        }
    });

    // 2. KHI CHUỘT ĐI RA KHỎI MỤC MENU DỌC
    item.addEventListener('mouseleave', function () {
        leaveTimer = setTimeout(() => {
            hideAllPanels();
            this.classList.remove('active');
            if (initialContent) initialContent.style.display = 'block';
        }, 100);
    });
});

});
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ❗ chặn reload

    const keyword = document.getElementById('searchInput').value;

    if (keyword) {
        window.location.href = `category.html?name=${keyword}`;
    }
});
