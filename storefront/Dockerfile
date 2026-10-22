FROM nginx:alpine

# Xóa cấu hình mặc định của Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copy file cấu hình tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy toàn bộ mã nguồn Frontend vào thư mục HTML của Nginx
COPY . /usr/share/nginx/html

# Xóa các file không cần thiết khỏi thư mục html
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
