# 📚 Thư Viện Tri Thức — Web Quản Lý Sách Thư Viện (Library Manager)

Ứng dụng web quản lý sách thư viện với giao diện hiện đại, trực quan, hỗ trợ đầy đủ các tính năng CRUD, mượn trả và thống kê số liệu trong thời gian thực.

![React](https://img.shields.io/badge/Frontend-React_19-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38bdf8?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Backend-Express_5-green?logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?logo=sqlite)

---

## ✨ Tính Năng Nổi Bật

- 📖 **CRUD Quản Lý Sách Đầy Đủ**:
  - Thêm mới sách với validation chặt chẽ (ISBN, tiêu đề, tác giả, năm XB, số lượng).
  - Cập nhật, chỉnh sửa thông tin sách nhanh chóng.
  - Xóa sách có hộp thoại xác nhận an toàn.
  - Xem danh sách linh hoạt: **Dạng Bảng (Table View)** hoặc **Dạng Thẻ Lưới (Grid Cards)**.
- 🤝 **Nghiệp Vụ Mượn & Trả Sách**:
  - Nút bấm nhanh 1 chạm: **Mượn Sách** (-1 cuốn) & **Trả Sách** (+1 cuốn).
  - Tự động chuyển trạng thái "Còn sách" ⟷ "Hết sách" dựa trên tồn kho.
  - Thanh tiến độ hiển thị trực quan tỷ lệ sách còn trong kho.
- 🔍 **Tìm Kiếm & Bộ Lọc Nâng Cao**:
  - Tìm kiếm tức thời (real-time) theo tên sách, tác giả hoặc mã ISBN.
  - Lọc theo Thể loại sách (Công nghệ, Văn học, Kinh tế, Kỹ năng sống,...).
  - Lọc theo Trạng thái (Tất cả, Còn sách, Hết sách).
  - Sắp xếp đa dạng: Mới nhất, A-Z, Tác giả, Năm XB, Số lượng.
- 📊 **Thống Kê Thư Viện (Dashboard Stats)**:
  - Tổng số đầu sách (Titles).
  - Tổng số bản in (Copies).
  - Số lượng sách có sẵn trong kho.
  - Số lượng sách đang được độc giả mượn.
  - Số tựa sách tạm thời hết hàng.
- 🔔 **Thông Báo & Trải Nghiệm Người Dùng (UX)**:
  - Toast notifications góc màn hình sau mỗi thao tác.
  - Giao diện thân thiện trên cả máy tính và điện thoại (Responsive 100%).
  - Tích hợp sẵn bộ ảnh bìa mẫu đẹp mắt.

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)

### 1. Cài đặt thư viện
```bash
npm run install:all
```

### 2. Khởi chạy ở môi trường phát triển (Dev Mode)
Chạy Backend (Port 5000):
```bash
npm run dev:backend
```

Mở một cửa sổ terminal khác và chạy Frontend (Port 3000):
```bash
npm run dev:frontend
```

Truy cập: `http://localhost:3000`

---

## 🌐 Hướng Dẫn Deploy Lên Internet (Render / Vercel)

Xem chi tiết từng bước trong file [DEPLOYMENT.md](./DEPLOYMENT.md).
