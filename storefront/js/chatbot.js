/**
 * ===================================================
 * KVB ASSISTANT CHATBOT (Tư vấn bán hàng & FAQ tự động)
 * ===================================================
 */

(function () {
    if (window.__KVB_CHATBOT_INITIALIZED__) return;
    window.__KVB_CHATBOT_INITIALIZED__ = true;

    // Xác định đường dẫn tương đối tùy theo trang chủ hay trang con trong thư mục /html
    const isHomePage = window.location.pathname.endsWith('home.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname.split('/').pop().indexOf('.') === -1;

    const htmlPath = isHomePage ? 'html/' : '';
    const cssPath = isHomePage ? 'css/' : '../css/';

    // Tự động nhúng file CSS chatbot nếu chưa có
    if (!document.getElementById('kvb-chatbot-css')) {
        const link = document.createElement('link');
        link.id = 'kvb-chatbot-css';
        link.rel = 'stylesheet';
        link.href = `${cssPath}chatbot.css`;
        document.head.appendChild(link);
    }

    // Giao diện HTML của Chatbot
    const chatbotHTML = `
        <!-- Nút Launcher góc phải dưới -->
        <div id="kvbChatLauncher" class="kvb-chat-launcher" title="Chat với KVB Assistant" style="position: fixed; bottom: 25px; right: 25px; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #e50000 0%, #b30000 100%); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 26px; cursor: pointer; box-shadow: 0 6px 20px rgba(229, 0, 0, 0.4); z-index: 999999;">
            <i class="bi bi-chat-dots-fill"></i>
            <span class="kvb-chat-badge"></span>
        </div>

        <!-- Cửa sổ Chatbot -->
        <div id="kvbChatWindow" class="kvb-chat-window">
            <!-- Header -->
            <div class="kvb-chat-header">
                <div class="kvb-chat-header-info">
                    <div class="kvb-chat-avatar">
                        <i class="bi bi-robot"></i>
                        <span class="kvb-chat-status-dot"></span>
                    </div>
                    <div>
                        <h4 class="kvb-chat-title">KVB Assistant</h4>
                        <p class="kvb-chat-subtitle">Tư vấn bán hàng & CSKH 24/7</p>
                    </div>
                </div>
                <div class="kvb-chat-header-actions">
                    <button id="kvbChatCloseBtn" title="Đóng">&times;</button>
                </div>
            </div>

            <!-- Messages Area -->
            <div id="kvbChatMessages" class="kvb-chat-messages">
                <!-- Tin nhắn chào mừng mặc định -->
                <div class="kvb-msg kvb-msg-bot">
                    <div class="kvb-msg-bubble">
                        Xin chào! 👋 Mình là <b>KVB Assistant</b>. Mình có thể giúp gì cho bạn hôm nay?
                        <div class="kvb-chat-suggestions">
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Tư vấn Laptop')">💻 Tư vấn Laptop</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Cấu hình PC')">🖥️ Cấu hình PC</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Màn hình máy tính')">🖥️ Màn hình</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Chính sách bảo hành')">🛡️ Bảo hành</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Tra cứu đơn hàng')">📦 Tra cứu đơn</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Chính sách giao hàng')">🚚 Giao hàng</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Phương thức thanh toán')">💳 Thanh toán</span>
                            <span class="kvb-chip" onclick="kvbSendQuickMsg('Liên hệ cửa hàng')">📞 Hotline</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer / Input -->
            <form id="kvbChatForm" class="kvb-chat-footer">
                <input type="text" id="kvbChatInput" class="kvb-chat-input" placeholder="Hỏi về sản phẩm, giá, bảo hành..." autocomplete="off">
                <button type="submit" class="kvb-chat-send-btn" title="Gửi tin nhắn">
                    <i class="bi bi-send-fill"></i>
                </button>
            </form>
        </div>
    `;

    function initChatbot() {
        if (!document.body) {
            window.addEventListener('load', initChatbot, { once: true });
            return;
        }

        // Chèn giao diện vào trang nếu chưa có
        if (!document.getElementById('kvbChatLauncher')) {
            document.body.insertAdjacentHTML('beforeend', chatbotHTML);
        }

        const launcher = document.getElementById('kvbChatLauncher');
        const chatWindow = document.getElementById('kvbChatWindow');
        const closeBtn = document.getElementById('kvbChatCloseBtn');
        const chatForm = document.getElementById('kvbChatForm');
        const chatInput = document.getElementById('kvbChatInput');

        if (!launcher || !chatWindow) return;

        function toggleChat(forceOpen) {
            const isCurrentlyOpen = chatWindow.classList.contains('active') || chatWindow.style.display === 'flex';
            const willOpen = (typeof forceOpen === 'boolean') ? forceOpen : !isCurrentlyOpen;

            if (willOpen) {
                chatWindow.classList.add('active');
                chatWindow.style.display = 'flex';
                if (chatInput) setTimeout(() => chatInput.focus(), 100);
                // Ẩn badge nhấp nháy khi đã mở chat
                const badge = launcher.querySelector('.kvb-chat-badge');
                if (badge) badge.style.display = 'none';
            } else {
                chatWindow.classList.remove('active');
                chatWindow.style.display = 'none';
            }
        }

        // Bật / tắt khung chat với onclick duy nhất
        launcher.onclick = (e) => {
            e.stopPropagation();
            toggleChat();
        };

        if (closeBtn) {
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                toggleChat(false);
            };
        }

        // Xử lý khi gửi tin nhắn
        if (chatForm) {
            chatForm.onsubmit = (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;
                chatInput.value = '';
                kvbHandleUserMessage(text);
            };
        }

        console.log("🤖 [KVB Chatbot] Đã khởi tạo thành công KVB Assistant.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }

    // Hàm gửi tin nhắn nhanh khi bấm vào chip gợi ý
    window.kvbSendQuickMsg = function(msgText) {
        kvbHandleUserMessage(msgText);
    };

    // Hàm append tin nhắn vào khung chat
    function appendMessage(sender, contentHTML) {
        const messagesContainer = document.getElementById('kvbChatMessages');
        if (!messagesContainer) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `kvb-msg kvb-msg-${sender}`;

        const now = new Date();
        const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        msgDiv.innerHTML = `
            <div class="kvb-msg-bubble">
                ${contentHTML}
                <div class="kvb-msg-time">${timeStr}</div>
            </div>
        `;

        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hiển thị hiệu ứng "Bot đang soạn tin nhắn..."
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('kvbChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'kvbTypingIndicator';
        typingDiv.className = 'kvb-msg kvb-msg-bot';
        typingDiv.innerHTML = `
            <div class="kvb-typing-indicator">
                <span class="kvb-typing-dot"></span>
                <span class="kvb-typing-dot"></span>
                <span class="kvb-typing-dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('kvbTypingIndicator');
        if (indicator) indicator.remove();
    }

    // Xử lý hội thoại thông minh
    async function kvbHandleUserMessage(userText) {
        appendMessage('user', escapeHTML(userText));
        showTypingIndicator();

        // Độ trễ giả lập 400ms để tạo cảm giác tự nhiên
        await new Promise(r => setTimeout(r, 400));

        try {
            const botResponse = await generateBotReply(userText);
            removeTypingIndicator();
            appendMessage('bot', botResponse);
        } catch (err) {
            console.error("Chatbot error:", err);
            removeTypingIndicator();
            appendMessage('bot', "Xin lỗi bạn, hệ thống đang bận một chút. Bạn có thể thử lại hoặc gọi Hotline <b>1800 6975</b> để được trợ giúp nhé!");
        }
    }

    // ==========================================
    // BỘ NÃO PHÂN TÍCH VÀ PHẢN HỒI (AI RULE & API)
    // ==========================================
    async function generateBotReply(rawText) {
        const text = rawText.toLowerCase().trim();

        // 1. Chào hỏi
        if (matchesAny(text, ['chào', 'hello', 'hi', 'xin chào', 'alo', 'hey'])) {
            return `Chào bạn! Rất vui được gặp bạn. KVB Store hiện có rất nhiều mẫu Laptop, PC gaming, linh kiện giá cực tốt. Bạn muốn tìm sản phẩm nào ạ?
                <div class="kvb-chat-suggestions">
                    <span class="kvb-chip" onclick="kvbSendQuickMsg('Tìm laptop bán chạy')">🔥 Laptop bán chạy</span>
                    <span class="kvb-chip" onclick="kvbSendQuickMsg('PC Gaming giá tốt')">⚡ PC Gaming</span>
                    <span class="kvb-chip" onclick="kvbSendQuickMsg('Chính sách bảo hành')">🛡️ Bảo hành</span>
                </div>`;
        }

        // 2. Cảm ơn / Tạm biệt
        if (matchesAny(text, ['cảm ơn', 'cam on', 'thanks', 'thank you', 'ok cảm ơn', 'tuyệt vời'])) {
            return `Dạ không có gì ạ! KVB Store luôn sẵn sàng phục vụ bạn. Chúc bạn một ngày tốt lành và mua sắm vui vẻ! ❤️`;
        }
        if (matchesAny(text, ['tạm biệt', 'bye', 'tam biet'])) {
            return `Tạm biệt bạn! Khi nào cần tư vấn máy tính hay linh kiện cứ nhắn cho mình nhé. Hẹn gặp lại bạn! 👋`;
        }

        // 3. Chính sách bảo hành & Đổi trả
        if (matchesAny(text, ['bảo hành', 'bao hanh', 'đổi trả', 'doi tra', 'bị lỗi', 'hỏng', 'bảo dưỡng'])) {
            return `<b>🛡️ Chính sách bảo hành tại KVB Store:</b><br>
                - Bảo hành chính hãng <b>12 đến 36 tháng</b> tùy sản phẩm.<br>
                - <b>1 đổi 1 trong vòng 30 ngày</b> đầu tiên nếu có lỗi kỹ thuật từ nhà sản xuất.<br>
                - Hỗ trợ gửi bảo hành trực tiếp tại các showroom hoặc qua bưu điện toàn quốc.<br>
                - Hotline hỗ trợ kỹ thuật: <b>1800 6975</b> (nhánh 2).`;
        }

        // 4. Vận chuyển & Giao hàng
        if (matchesAny(text, ['giao hàng', 'giao hang', 'vận chuyển', 'van chuyen', 'ship', 'phí ship', 'bao lâu nhận được'])) {
            return `<b>🚚 Chính sách giao hàng:</b><br>
                - <b>MIỄN PHÍ VẬN CHUYỂN</b> toàn quốc cho đơn hàng từ 1.000.000đ.<br>
                - <b>Giao hỏa tốc 2 - 4 giờ</b> trong khu vực nội thành Hà Nội & TP. HCM.<br>
                - <b>Giao tiêu chuẩn 1 - 3 ngày</b> cho các tỉnh thành khác.<br>
                - Khách hàng được quyền <b>kiểm tra hàng trước khi thanh toán</b>.`;
        }

        // 5. Thanh toán
        if (matchesAny(text, ['thanh toán', 'thanh toan', 'trả góp', 'tra gop', 'cod', 'chuyển khoản', 'ngân hàng'])) {
            return `<b>💳 Các phương thức thanh toán:</b><br>
                1. <b>Thanh toán khi nhận hàng (COD):</b> Nhận hàng, kiểm tra và trả tiền mặt cho shipper.<br>
                2. <b>Chuyển khoản ngân hàng (BANK):</b> Quét mã QR thanh toán nhanh chóng và an toàn.<br>
                3. Hỗ trợ <b>trả góp 0%</b> qua thẻ tín dụng khi mua sắm trực tiếp tại showroom.`;
        }

        // 6. Tra cứu đơn hàng
        if (matchesAny(text, ['tra cứu đơn', 'tra cuu don', 'đơn hàng của tôi', 'kiểm tra đơn', 'tình trạng đơn', 'don hang'])) {
            return `<b>📦 Tra cứu tình trạng đơn hàng:</b><br>
                Bạn có thể tự tra cứu hành trình đơn hàng của mình bất kỳ lúc nào tại: <br>
                👉 <a href="${htmlPath}tracking.html" class="fw-bold text-danger text-decoration-none">Nhấn vào đây để Tra Cứu Đơn Hàng</a><br>
                <i>(Chỉ cần đăng nhập tài khoản hoặc nhập mã đơn hàng dạng KVB-XXXXXX).</i>`;
        }

        // 7. Địa chỉ & Hotline
        if (matchesAny(text, ['địa chỉ', 'dia chi', 'cửa hàng', 'cua hang', 'hotline', 'sđt', 'sdt', 'ở đâu', 'o dau', 'showroom'])) {
            return `<b>🏢 Hệ thống showroom KVB Store:</b><br>
                - <b>Hà Nội:</b> Khu đô thị Dịch Vọng, Quận Cầu Giấy, TP. Hà Nội.<br>
                - <b>TP. HCM:</b> Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh.<br>
                - <b>Hotline mua hàng & CSKH:</b> <a href="tel:18006975" class="text-danger fw-bold">1800 6975</a> (8h00 - 21h30).<br>
                - <b>Email:</b> support@kvbstore.vn`;
        }

        // 8. TÌM KIẾM SẢN PHẨM THEO TỪ KHÓA (Laptop, PC, Màn hình, Chuột, Bàn phím, MSI, Asus, Nitro...)
        let searchKeyword = '';
        let targetCategory = '';

        if (text.includes('laptop')) { targetCategory = 'Laptop'; searchKeyword = text.replace(/tư vấn|tìm|mua|cho mình|xem|giá rẻ/g, '').trim(); }
        else if (text.includes('màn hình') || text.includes('man hinh')) { targetCategory = 'Màn hình'; searchKeyword = 'Màn hình'; }
        else if (text.includes('bàn phím') || text.includes('ban phim')) { targetCategory = 'Bàn phím'; searchKeyword = 'Bàn phím'; }
        else if (text.includes('chuột') || text.includes('chuot') || text.includes('mouse')) { targetCategory = 'Chuột'; searchKeyword = 'Chuột'; }
        else if (text.includes('pc') || text.includes('máy tính bàn')) { targetCategory = 'PC'; searchKeyword = 'PC'; }
        else if (text.includes('tai nghe')) { targetCategory = 'TAI NGHE'; searchKeyword = 'tai nghe'; }
        else if (text.includes('ghế') || text.includes('chair')) { targetCategory = 'Chair'; searchKeyword = 'ghế'; }
        else if (matchesAny(text, ['asus', 'acer', 'msi', 'dell', 'lenovo', 'nitro', 'rtx', 'i5', 'i7', 'vga'])) {
            searchKeyword = extractBrandOrModel(text);
        }

        if (targetCategory || searchKeyword) {
            const queryName = searchKeyword || targetCategory;
            const queryParams = new URLSearchParams();
            if (queryName) queryParams.set('name', queryName);
            if (targetCategory) queryParams.set('category', targetCategory);

            try {
                const res = await fetch(`/api/products?${queryParams.toString()}`);
                const products = await res.json();

                if (Array.isArray(products) && products.length > 0) {
                    const top3 = products.slice(0, 3);
                    let productCardsHTML = '';

                    top3.forEach(p => {
                        const pid = p._id || p.id;
                        const priceStr = Number(p.price || 0).toLocaleString('vi-VN') + 'đ';
                        productCardsHTML += `
                            <a href="${htmlPath}product-detail.html?id=${pid}" class="kvb-chat-product-card" target="_blank" title="Bấm xem chi tiết">
                                <img src="${p.image}" onerror="this.onerror=null; this.src='/images/no-image.svg';" class="kvb-chat-product-img" alt="${escapeHTML(p.title)}">
                                <div class="kvb-chat-product-info">
                                    <div class="kvb-chat-product-title">${escapeHTML(p.title)}</div>
                                    <div class="kvb-chat-product-price">${priceStr}</div>
                                </div>
                                <i class="bi bi-chevron-right text-muted small"></i>
                            </a>
                        `;
                    });

                    const catUrl = `${htmlPath}category.html?${queryParams.toString()}`;

                    return `Dưới đây là một số mẫu <b>${targetCategory || queryName}</b> bán chạy tại KVB Store gợi ý cho bạn:
                        ${productCardsHTML}
                        <div class="mt-2 text-center">
                            <a href="${catUrl}" class="btn btn-sm btn-outline-danger w-100 fw-bold" style="font-size: 11.5px;">
                                <i class="bi bi-grid-fill me-1"></i> Xem tất cả (${products.length} sản phẩm)
                            </a>
                        </div>`;
                }
            } catch (err) {
                console.error("Lỗi tìm kiếm sản phẩm:", err);
            }
        }

        // 9. Phản hồi mặc định khi không khớp từ khóa
        const searchLink = `${htmlPath}category.html?name=${encodeURIComponent(rawText)}`;
        return `Dạ, về yêu cầu <i>"${escapeHTML(rawText)}"</i>, bạn có thể xem các sản phẩm liên quan tại đây:<br>
            👉 <a href="${searchLink}" class="fw-bold text-danger text-decoration-none"><i class="bi bi-search me-1"></i>Tìm "${escapeHTML(rawText)}" trên cửa hàng</a><br><br>
            Hoặc bạn có thể chọn các chủ đề trợ giúp nhanh bên dưới:
            <div class="kvb-chat-suggestions">
                <span class="kvb-chip" onclick="kvbSendQuickMsg('Tư vấn Laptop')">💻 Tư vấn Laptop</span>
                <span class="kvb-chip" onclick="kvbSendQuickMsg('Cấu hình PC')">🖥️ Cấu hình PC</span>
                <span class="kvb-chip" onclick="kvbSendQuickMsg('Chính sách bảo hành')">🛡️ Bảo hành</span>
                <span class="kvb-chip" onclick="kvbSendQuickMsg('Liên hệ cửa hàng')">📞 Hotline 1800 6975</span>
            </div>`;
    }

    // Các hàm helper
    function matchesAny(str, keywords) {
        return keywords.some(kw => str.includes(kw));
    }

    function extractBrandOrModel(str) {
        const brands = ['asus', 'acer', 'msi', 'dell', 'lenovo', 'nitro', 'rtx 4050', 'rtx 4060', 'rtx 3050', 'rtx', 'i5', 'i7', 'vga'];
        for (const b of brands) {
            if (str.includes(b)) return b;
        }
        return str;
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
