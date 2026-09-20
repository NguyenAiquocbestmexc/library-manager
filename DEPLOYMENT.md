# 🚀 Hướng Dẫn Triển Khai (Deploy) Web Quản Lý Thư Viện Lên Internet Miễn Phí

Ứng dụng được thiết kế thông minh với khả năng **chạy trọn gói (Fullstack)**:
Express Backend có thể tự động phục vụ file giao diện React đã build. Vì vậy, bạn có thể deploy toàn bộ dự án lên một nền tảng miễn phí chỉ với **1 dịch vụ duy nhất**!

---

## 📌 Cách 1: Deploy Trọn Gói Lên Render.com (Khuyến nghị - Miễn phí & Đơn giản nhất)

Render.com cho phép tạo Web Service Node.js miễn phí có hỗ trợ HTTPS tự động.

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở terminal tại thư mục `library-manager`:
   ```bash
   git init
   git add .
   git commit -m "Khởi tạo dự án Quản lý Sách Thư viện"
   ```
2. Truy cập [GitHub](https://github.com/) -> Tạo một Repository mới (ví dụ: `library-manager`).
3. Đẩy code lên GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/NguyenAiquocbestmexc/library-manager.git
   git push -u origin main
   ```

### Bước 2: Tạo Web Service trên Render
1. Đăng ký/Đăng nhập tài khoản tại [Render.com](https://render.com/) (có thể đăng nhập bằng GitHub).
2. Nhấn nút **New +** -> Chọn **Web Service**.
3. Chọn mục **Build and deploy from a Git repository** và kết nối với repository `library-manager` vừa tạo trên GitHub.
4. Điền các thông tin cấu hình như sau:
   - **Name**: `thu-vien-tri-thuc` (hoặc tên tùy thích).
   - **Region**: Singapore (hoặc gần Việt Nam nhất để tải nhanh).
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm run install:all && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Instance Type**: Chọn gói **Free**.
5. Nhấn **Deploy Web Service**.
6. Đợi 2-3 phút, Render sẽ tự động cài đặt, build React và khởi động Express. Bạn sẽ nhận được đường dẫn trực tuyến dạng:
   👉 `https://thu-vien-tri-thuc.onrender.com`

---

## 📌 Cách 2: Deploy Frontend Lên Vercel & Backend Lên Render (Tùy chọn)

Nếu bạn muốn tách biệt hoàn toàn Frontend lên CDN toàn cầu của Vercel:

### Bước 1: Deploy Backend lên Render
- Làm tương tự Cách 1 nhưng trong phần Settings:
  - **Root Directory**: `backend`
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
- Lấy URL backend (ví dụ: `https://my-backend.onrender.com`).

### Bước 2: Deploy Frontend lên Vercel
1. Đăng nhập [Vercel.com](https://vercel.com/) -> Chọn **Add New Project**.
2. Import repository `library-manager`.
3. Trong phần **Framework Preset**, chọn **Vite**.
4. Trong phần **Root Directory**, chọn thư mục `frontend`.
5. Trong phần **Environment Variables**, bạn có thể cấu hình URL của Backend nếu cần.
6. Nhấn **Deploy**!

---

## 💻 Cách Chạy Dự Án Cục Bộ Trên Máy Tính (Localhost)

Nếu muốn tiếp tục phát triển trên máy cá nhân:

1. **Khởi động Backend** (Port 5000):
   ```bash
   cd backend
   npm run dev
   ```
2. **Khởi động Frontend** (Port 3000):
   ```bash
   cd frontend
   npm run dev
   ```
3. Mở trình duyệt tại: `http://localhost:3000`

---

## 🛠️ Cấu Trúc Dự Án

```
library-manager/
├── backend/
│   ├── db.js             # Kết nối SQLite & Tự động nạp dữ liệu mẫu
│   ├── server.js         # Máy chủ Express & Phục vụ React SPA
│   ├── routes/
│   │   ├── books.js      # Các API CRUD, lọc, tìm kiếm, mượn/trả
│   │   └── stats.js      # API thống kê số liệu thư viện
│   ├── test-api.js       # Script kiểm thử API tự động
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, StatsCards, FilterBar, BookTable, BookGrid, BookModal, ConfirmModal, Toast
│   │   ├── services/     # api.js gọi fetch API
│   │   ├── App.jsx       # Component chính
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json          # Root package điều phối lệnh chạy và build
└── DEPLOYMENT.md
```
