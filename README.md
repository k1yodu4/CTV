Yêu cầu IDE: Visual Studio Code (để chạy local server)
Hệ thống này chạy trên nền tảng **Docker**. Docker giúp bạn không phải cài đặt từng phần mềm (Node, Mongo, Redis...) vào máy, mà nó sẽ tự động tải và chạy mọi thứ trong các "hộp" (container) riêng biệt.

## 🛠 Bước 1: **Cài đặt Docker Desktop:**
- [Tải Docker Desktop tại đây](https://www.docker.com/products/docker-desktop/).
- Sau khi cài và chạy thành công thì bạn sẽ thấy icon chú cá voi ở góc màn hình

*(Dành cho hệ điều hành Ubuntu/Linux, mở Terminal và chạy 2 lệnh sau):*
`sudo apt update && sudo apt install git -y`
`sudo apt install docker.io docker-compose -y`

## 🛠 Bước 2: **Tạo file cấu hình môi trường (.env)**
MONGO_INITDB_ROOT_USERNAME=nhap_ten_user_vao_day<br>
MONGO_INITDB_ROOT_PASSWORD=nhap_mat_khau_vao_day<br>
MONGO_URI=mongodb://user:password@mongodb:27017/inventory_db?authSource=admin<br>
REDIS_PASSWORD=nhap_mat_khau_redis<br>
PORT=3000<br>
MEILI_HOST=http://meilisearch:7700<br>
MEILI_KEY=nhap_key_bi_mat_cua_ban_vao_day(yêu cầu ít nhất 16 kí tự)<br>

## 🛠 Bước 3:
Tại cửa sổ Terminal đang ở thư mục dự án, gõ lệnh:<br>
docker-compose up --build

## 🛠 Bước 4:
Truy cập trang chủ: Vào file storefront/home.html -> ấn "Go Live"<br>
Giao diện quản lý Tìm kiếm (Meilisearch): http://localhost:7700 (Nếu nó hỏi mật khẩu, hãy nhập "MEILI_KEY=nhap_key_bi_mat_cua_ban_vao_day")<br>
Tài khoản đăng nhập admin: admin123@gmail.com
Mk: admin123<br>
Địa chỉ monitor: http://localhost:3001<br>
tk:admin<br>
mk:admin<br>
vào mục Dashboards ở thanh mục bên trái