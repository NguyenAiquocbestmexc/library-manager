// Tiện ích xuất và nhập dữ liệu Excel / CSV chuẩn UTF-8 (mở trong Excel không bị lỗi font tiếng Việt)

function downloadCSV(csvContent, fileName) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 1. Xuất danh sách toàn bộ kho sách
export function exportBooksToCSV(books) {
  const headers = ['ID', 'Tên Sách', 'Tác Giả', 'ISBN', 'Thể Loại', 'Năm XB', 'Tổng Số Lượng', 'Còn Lại', 'Tình Trạng', 'Mô Tả'];
  const rows = books.map(b => [
    b.id,
    `"${(b.title || '').replace(/"/g, '""')}"`,
    `"${(b.author || '').replace(/"/g, '""')}"`,
    `"${b.isbn || ''}"`,
    `"${b.category || ''}"`,
    b.published_year || '',
    b.quantity || 0,
    b.available_copies || 0,
    b.available_copies > 0 ? 'Còn sách' : 'Hết sách',
    `"${(b.description || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const today = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `Danh_Sach_Kho_Sach_${today}.csv`);
}

// 2. Xuất danh sách phiếu mượn (đặc biệt lọc phiếu quá hạn)
export function exportBorrowsToCSV(borrows, onlyOverdue = false) {
  const data = onlyOverdue ? borrows.filter(b => b.isOverdue && b.status === 'BORROWED') : borrows;
  const headers = ['Mã Phiếu', 'ID Sách', 'Tên Sách', 'Người Mượn', 'Số Điện Thoại', 'Mã Thẻ', 'Ngày Mượn', 'Hạn Trả', 'Ngày Trả', 'Trạng Thái', 'Quá Hạn (Ngày)', 'Ghi Chú'];

  const rows = data.map(r => [
    r.id,
    r.book_id,
    `"${(r.book_title || '').replace(/"/g, '""')}"`,
    `"${(r.borrower_name || '').replace(/"/g, '""')}"`,
    `"${r.borrower_phone || ''}"`,
    `"${r.borrower_card_id || ''}"`,
    r.borrow_date || '',
    r.due_date || '',
    r.return_date || '',
    r.status === 'RETURNED' ? 'Đã trả' : (r.isOverdue ? 'QUÁ HẠN' : 'Đang mượn'),
    r.isOverdue ? r.daysOverdue : 0,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const today = new Date().toISOString().split('T')[0];
  const prefix = onlyOverdue ? 'Bao_Cao_Sach_Qua_Han' : 'Danh_Sach_Phieu_Muon';
  downloadCSV(csv, `${prefix}_${today}.csv`);
}

// 3. Xuất danh sách độc giả
export function exportMembersToCSV(members) {
  const headers = ['ID', 'Mã Thẻ', 'Họ Tên', 'Số Điện Thoại', 'Email', 'Khoa / Đơn Vị', 'Ngày Tham Gia', 'Điểm Uy Tín', 'Xếp Hạng', 'Đang Mượn (Cuốn)', 'Quá Hạn (Cuốn)'];
  const rows = members.map(m => [
    m.id,
    `"${m.card_id || ''}"`,
    `"${(m.name || '').replace(/"/g, '""')}"`,
    `"${m.phone || ''}"`,
    `"${m.email || ''}"`,
    `"${(m.department || '').replace(/"/g, '""')}"`,
    m.joined_date || '',
    m.reputationScore || 100,
    `"${m.reputationRank || ''}"`,
    m.activeBorrowsCount || 0,
    m.overdueCount || 0
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const today = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `Danh_Sach_Doc_Gia_${today}.csv`);
}

// 4. Đọc file CSV để nhập sách hàng loạt
export function parseCSVToBooks(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) throw new Error('File CSV không có dữ liệu');

  const books = [];
  // Bỏ qua dòng tiêu đề
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma ignoring commas inside quotes
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.trim().replace(/^"|"$/g, ''));
    if (parts.length >= 4) {
      const [title, author, isbn, category, published_year, quantity] = parts;
      if (title && author && isbn) {
        books.push({
          title,
          author,
          isbn,
          category: category || 'Công nghệ thông tin',
          published_year: parseInt(published_year, 10) || new Date().getFullYear(),
          quantity: parseInt(quantity, 10) || 5
        });
      }
    }
  }
  return books;
}
