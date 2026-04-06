Hệ thống này chạy trên nền tảng **Docker**. Docker giúp bạn không phải cài đặt lắt nhắt từng phần mềm (Node, Mongo, Redis...) vào máy, mà nó sẽ tự động tải và chạy mọi thứ trong các "hộp" (container) riêng biệt.

## 🛠 Bước 1: **Cài đặt Docker Desktop:**
- [Tải Docker Desktop tại đây](https://www.docker.com/products/docker-desktop/).
- Sau khi cài và chạy thành công thì bạn sẽ thấy icon chú cá voi ở góc màn hình

*(Dành cho hệ điều hành Ubuntu/Linux, mở Terminal và chạy 2 lệnh sau):*
`sudo apt update && sudo apt install git -y`
`sudo apt install docker.io docker-compose -y`

## 🛠 Bước 2: **Tạo file cấu hình môi trường (.env)**
MONGO_INITDB_ROOT_USERNAME=nhap_ten_user_vao_day
MONGO_INITDB_ROOT_PASSWORD=nhap_mat_khau_vao_day
MONGO_URI=mongodb://user:password@mongodb:27017/inventory_db?authSource=admin
REDIS_PASSWORD=nhap_mat_khau_redis
PORT=3000
MEILI_HOST=http://meilisearch:7700
MEILI_KEY=nhap_key_bi_mat_cua_ban_vao_day

## 🛠 Bước 3:
Hãy đảm bảo Docker Desktop đang được mở. Sau đó, tại cửa sổ Terminal (đang ở thư mục dự án), gõ lệnh:
docker-compose up --build

## 🛠 Bước 4:
Frontend: http://127.0.0.1:5500/storefront/home.html
Backend API: http://localhost:3000
Giao diện quản lý Tìm kiếm (Meilisearch): http://localhost:7700 (Nếu nó hỏi mật khẩu, hãy nhập "MEILI_KEY=nhap_key_bi_mat_cua_ban_vao_day")
