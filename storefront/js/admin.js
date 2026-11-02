document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra quyền Admin
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        alert("⛔ Bạn không có quyền truy cập trang quản trị!");
        window.location.href = 'home.html';
        return;
    }

    // Khởi chạy data cho Tab mặc định (Sản phẩm)
    fetchSpecsConfig();
    fetchAdminProducts();
});

// HÀM CHUYỂN TAB ADMIN
function switchAdminTab(tabId, element) {
    document.querySelectorAll('.admin-nav li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
    
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');

    // Nếu chuyển sang tab Đơn hàng thì load dữ liệu đơn hàng
    if (tabId === 'orders') {
        loadAllOrders();
    }
}

// Đăng xuất
function logoutAdmin() {
    localStorage.clear();
    window.location.href = 'home.html';
}

// ==========================================
// MODULE 1: QUẢN LÝ SẢN PHẨM (Code cũ)
// ==========================================
let categorySpecsConfig = {};
let allProducts = []; 

async function fetchSpecsConfig() {
    try {
        const response = await fetch('api/specs-config');
        categorySpecsConfig = await response.json();
        
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        Object.keys(categorySpecsConfig).forEach(cat => {
            categorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
        });
    } catch (error) { console.error("Lỗi tải config:", error); }
}

function renderAdminTable(dataToRender) {
    const tbody = document.getElementById('adminProductList');
    tbody.innerHTML = '';
    dataToRender.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td><img src="${p.image}" onerror="this.onerror=null; this.src='/images/no-image.svg';" class="product-img-sm border rounded"></td>
                <td class="fw-bold">${p.title}</td>
                <td><span class="badge bg-secondary">${p.category}</span></td>
                <td class="text-danger fw-bold">${p.price.toLocaleString()}đ</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${p._id || p.id}')">Sửa</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p._id || p.id}')">Xóa</button>
                </td>
            </tr>
        `;
    });
}

async function fetchAdminProducts() {
    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();
        renderAdminTable(allProducts); 
    } catch (error) { console.error("Lỗi tải SP:", error); }
}

function searchAdminProducts() {
    const keyword = document.getElementById('adminSearchInput').value.toLowerCase();
    const filteredProducts = allProducts.filter(p => {
        let normalizedTitle = p.title.toLowerCase().replace(/\s+/g, ' ');
        let isMatch = normalizedTitle.includes(keyword);

        // Thêm đoạn này để ép từ khóa
        if (keyword === 'man') {
            isMatch = isMatch || normalizedTitle.includes('màn hình') || normalizedTitle.includes('monitor');
        }

        return isMatch;
    });
    renderAdminTable(filteredProducts); 
}

document.getElementById('category').addEventListener('change', function() {
    renderSpecsFields(this.value);
});

function renderSpecsFields(categoryName, existingSpecs = {}) {
    const dynamicContainer = document.getElementById('dynamicSpecsContainer');
    const specsFields = document.getElementById('specsFields');
    const requiredSpecs = categorySpecsConfig[categoryName];
    
    specsFields.innerHTML = '';
    if (requiredSpecs && requiredSpecs.length > 0) {
        dynamicContainer.classList.remove('d-none');
        requiredSpecs.forEach(spec => {
            const optionsHTML = spec.options.map(opt => `<option value="${opt}">`).join('');
            const val = existingSpecs[spec.key] || '';
            specsFields.innerHTML += `
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-secondary">${spec.label}</label>
                    <input type="text" class="form-control spec-input" data-key="${spec.key}" list="datalist-${spec.key}" value="${val}">
                    <datalist id="datalist-${spec.key}">${optionsHTML}</datalist>
                </div>
            `;
        });
    } else {
        dynamicContainer.classList.add('d-none');
    }
}

async function deleteProduct(id) {
    if (!confirm("⚠️ Chắc chắn xóa sản phẩm này khỏi Database?")) return;
    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) fetchAdminProducts(); 
        else alert("Xóa thất bại!");
    } catch (err) { alert("Lỗi Server"); }
}

function editProduct(id) {
    const p = allProducts.find(item => (item._id || item.id) === id);
    if(!p) return;

    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit me-2"></i>Cập Nhật Sản Phẩm';
    document.getElementById('btnSubmit').innerText = "LƯU THAY ĐỔI";
    document.getElementById('btnSubmit').classList.replace('btn-danger', 'btn-success');
    document.getElementById('btnCancelEdit').classList.remove('d-none');
    
    document.getElementById('editProductId').value = id;
    document.getElementById('title').value = p.title;
    document.getElementById('price').value = p.price;
    document.getElementById('image').value = p.image;
    document.getElementById('description').value = p.description || '';
    document.getElementById('category').value = p.category;

    renderSpecsFields(p.category, p.specs);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle me-2"></i>Thêm Sản Phẩm Mới';
    document.getElementById('btnSubmit').innerText = "THÊM SẢN PHẨM";
    document.getElementById('btnSubmit').classList.replace('btn-success', 'btn-danger');
    document.getElementById('btnCancelEdit').classList.add('d-none');
    document.getElementById('editProductId').value = '';
    document.getElementById('dynamicSpecsContainer').classList.add('d-none');
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    document.getElementById('loadingOverlay').style.display = 'flex';

    const specsData = {};
    document.querySelectorAll('.spec-input').forEach(input => {
        if (input.value.trim() !== '') specsData[input.dataset.key] = input.value.trim();
    });

    const productData = {
        title: document.getElementById('title').value,
        price: Number(document.getElementById('price').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value,
        specs: specsData
    };

    const editId = document.getElementById('editProductId').value;
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `/products/${editId}` : '/api/products';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            alert(editId ? "✅ Cập nhật thành công!" : "✅ Thêm mới thành công!");
            cancelEdit(); 
            fetchAdminProducts(); 
        } else { alert("❌ Có lỗi xảy ra!"); }
    } catch (error) { alert("❌ Không kết nối được Backend"); }
    finally { document.getElementById('loadingOverlay').style.display = 'none'; }
});

// ==========================================
// MODULE 2: QUẢN LÝ ĐƠN HÀNG
// ==========================================
async function loadAllOrders() {
    const tbodyActive = document.getElementById('admin-order-active');
    const tbodyHistory = document.getElementById('admin-order-history');
    
    tbodyActive.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">Đang tải dữ liệu...</td></tr>';
    tbodyHistory.innerHTML = '';

    try {
        const res = await fetch('/api/admin/orders');
        const orders = await res.json();

        if (orders.length === 0) {
            tbodyActive.innerHTML = '<tr><td colspan="6" class="text-center py-4">Chưa có đơn hàng nào.</td></tr>';
            return;
        }

        let htmlActive = '';
        let htmlHistory = '';

        orders.forEach(order => {
            const customer = order.customerInfo || {};
            const date = new Date(order.createdAt).toLocaleDateString('vi-VN') + ' ' + new Date(order.createdAt).toLocaleTimeString('vi-VN');
            
            const statuses = ['Chờ xác nhận', 'Đang xử lý', 'Đang vận chuyển', 'Hoàn tất', 'Đã hủy'];
            let statusOptions = statuses.map(s => 
                `<option value="${s}" ${order.status === s ? 'selected' : ''}>${s}</option>`
            ).join('');

            const rowHtml = `
                <tr>
                    <td>
                        <div class="fw-bold text-danger">${order.orderCode}</div>
                        <div class="small text-muted">${date}</div>
                    </td>
                    <td>
                        <div class="fw-bold">${customer.fullname || 'Khách vãng lai'}</div>
                        <div class="small"><span class="badge bg-secondary">${order.paymentMethod}</span></div>
                    </td>
                    <td>
                        <div><i class="fas fa-phone-alt me-1 text-muted"></i>${customer.phone || 'N/A'}</div>
                        <div class="small text-muted"><i class="fas fa-map-marker-alt me-1"></i>${customer.address || 'N/A'}</div>
                    </td>
                    <td class="fw-bold text-primary fs-6">${(order.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                    <td>
                        <select class="form-select form-select-sm" id="status-${order._id}">
                            ${statusOptions}
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-success fw-bold" onclick="updateOrderStatus('${order._id}')">
                            <i class="fas fa-save"></i> LƯU
                        </button>
                    </td>
                </tr>
            `;

            // Phân loại đơn hàng
            if (order.status === 'Hoàn tất' || order.status === 'Đã hủy') {
                htmlHistory += rowHtml;
            } else {
                htmlActive += rowHtml;
            }
        });

        tbodyActive.innerHTML = htmlActive || '<tr><td colspan="6" class="text-center py-4 text-muted">Không có đơn hàng cần xử lý.</td></tr>';
        tbodyHistory.innerHTML = htmlHistory || '<tr><td colspan="6" class="text-center py-4 text-muted">Lịch sử trống.</td></tr>';
    } catch (error) {
        tbodyActive.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Lỗi kết nối Server!</td></tr>';
    }
}

window.updateOrderStatus = async function(orderId) {
    const newStatus = document.getElementById(`status-${orderId}`).value;
    try {
        const res = await fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            alert("✅ Đã cập nhật trạng thái đơn hàng!");
            loadAllOrders(); // Load lại ngay lập tức để đơn hàng tự động "nhảy" sang bảng lịch sử nếu cần
        } else {
            const data = await res.json();
            alert("❌ Lỗi: " + data.error);
        }
    } catch (err) {
        alert("❌ Lỗi kết nối Server");
    }
};

// ==========================================
// MODULE 3: XUẤT EXCEL ĐƠN HÀNG HOÀN TẤT
// ==========================================
window.exportCompletedOrdersToExcel = async function() {
    console.log("👉 Đã kích hoạt exportCompletedOrdersToExcel()");
    await exportOrdersToExcel('Hoàn tất');
};

window.exportOrdersToExcel = async function(filterStatus = 'Hoàn tất') {
    console.log("👉 Đang xuất đơn hàng trạng thái:", filterStatus);

    // Hiển thị trạng thái đang xử lý trên nút bấm nếu có
    const exportBtns = document.querySelectorAll('.btn-export-excel');
    exportBtns.forEach(btn => {
        btn.disabled = true;
        btn.dataset.originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang xuất...';
    });

    try {
        if (typeof XLSX === 'undefined') {
            throw new Error("Thư viện SheetJS (XLSX) chưa được tải. Vui lòng kiểm tra lại kết nối mạng hoặc làm mới trang!");
        }

        // Tải danh sách đơn hàng mới nhất từ server
        const res = await fetch('/api/admin/orders');
        if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng từ Server (HTTP " + res.status + ")!");
        const allOrders = await res.json();

        // Lọc các đơn hàng theo trạng thái
        const targetOrders = filterStatus 
            ? allOrders.filter(order => order.status === filterStatus)
            : allOrders;

        if (!targetOrders || targetOrders.length === 0) {
            alert(`ℹ️ Hiện không có đơn hàng nào ở trạng thái "${filterStatus}" để xuất Excel!`);
            return;
        }

        // Chuẩn bị dữ liệu cho file Excel
        const excelRows = targetOrders.map((order, idx) => {
            const customer = order.customerInfo || {};
            const createdAtDate = order.createdAt 
                ? new Date(order.createdAt).toLocaleString('vi-VN') 
                : 'N/A';

            // Định dạng chi tiết các sản phẩm trong đơn hàng
            const itemsText = (order.items || []).map((item, itemIdx) => {
                const itemPrice = (item.price || 0).toLocaleString('vi-VN') + 'đ';
                return `${itemIdx + 1}. ${item.title || 'Sản phẩm'} | SL: ${item.quantity || 1} | Đơn giá: ${itemPrice}`;
            }).join('\n');

            return {
                "STT": idx + 1,
                "Mã Đơn Hàng": order.orderCode || 'N/A',
                "Ngày Đặt": createdAtDate,
                "Tên Khách Hàng": customer.fullname || 'Khách vãng lai',
                "Số Điện Thoại": customer.phone ? String(customer.phone) : 'N/A',
                "Địa Chỉ Giao Hàng": customer.address || 'N/A',
                "Danh Sách Sản Phẩm": itemsText,
                "Phương Thức TT": order.paymentMethod || 'COD',
                "Tổng Tiền (VNĐ)": order.totalAmount || 0,
                "Trạng Thái": order.status || 'Hoàn tất',
                "Ghi Chú": customer.note || ''
            };
        });

        // Tạo Sheet từ mảng Object
        const worksheet = XLSX.utils.json_to_sheet(excelRows);

        // Căn chỉnh độ rộng các cột đẹp mắt
        worksheet['!cols'] = [
            { wch: 6 },  // STT
            { wch: 16 }, // Mã Đơn Hàng
            { wch: 22 }, // Ngày Đặt
            { wch: 24 }, // Tên Khách Hàng
            { wch: 15 }, // Số Điện Thoại
            { wch: 38 }, // Địa Chỉ Giao Hàng
            { wch: 55 }, // Danh Sách Sản Phẩm
            { wch: 18 }, // Phương Thức TT
            { wch: 18 }, // Tổng Tiền (VNĐ)
            { wch: 14 }, // Trạng Thái
            { wch: 25 }  // Ghi Chú
        ];

        // Tạo Workbook và gắn Sheet vào
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Đơn Hàng Hoàn Tất");

        // Đặt tên file theo ngày giờ xuất
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mi = String(now.getMinutes()).padStart(2, '0');
        const fileName = `Don_Hang_Hoan_Tat_${yyyy}${mm}${dd}_${hh}${mi}.xlsx`;

        // Kích hoạt tải file về máy (có fallback qua Blob)
        try {
            XLSX.writeFile(workbook, fileName);
        } catch (writeErr) {
            console.warn("XLSX.writeFile gặp sự cố, chuyển sang cơ chế Blob:", writeErr);
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(downloadUrl);
            }, 500);
        }

        alert(`✅ Đã xuất thành công ${targetOrders.length} đơn hàng "Hoàn tất" sang file Excel:\n${fileName}`);
    } catch (error) {
        console.error("Lỗi xuất Excel:", error);
        alert("❌ Đã xảy ra lỗi khi xuất file Excel: " + error.message);
    } finally {
        exportBtns.forEach(btn => {
            btn.disabled = false;
            if (btn.dataset.originalHtml) {
                btn.innerHTML = btn.dataset.originalHtml;
            }
        });
    }
};
