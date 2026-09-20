const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper: tính ngày hôm nay định dạng YYYY-MM-DD
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// GET /api/borrows - Danh sách phiếu mượn
router.get('/', (req, res) => {
  try {
    const { search = '', status = 'ALL' } = req.query;
    const today = getTodayStr();

    let query = 'SELECT * FROM borrow_records WHERE 1=1';
    const params = [];

    if (search.trim()) {
      query += ' AND (borrower_name LIKE ? OR borrower_phone LIKE ? OR book_title LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (status === 'BORROWED' || status === 'RETURNED') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC';

    let records = db.prepare(query).all(...params);

    // Bổ sung thông tin tính toán quá hạn
    const enriched = records.map(r => {
      const isReturned = r.status === 'RETURNED';
      const isOverdue = !isReturned && r.due_date < today;

      let diffDays = 0;
      if (!isReturned) {
        const msPerDay = 86400000;
        const dueTime = new Date(r.due_date).getTime();
        const nowTime = new Date(today).getTime();
        diffDays = Math.round((nowTime - dueTime) / msPerDay);
      }

      return {
        ...r,
        isOverdue,
        daysOverdue: isOverdue ? Math.max(diffDays, 1) : 0,
        daysLeft: !isReturned && !isOverdue ? Math.abs(diffDays) : 0
      };
    });

    // Nếu lọc riêng OVERDUE
    let finalRecords = enriched;
    if (status === 'OVERDUE') {
      finalRecords = enriched.filter(r => r.isOverdue);
    }

    res.json({
      success: true,
      data: finalRecords,
      total: finalRecords.length,
      overdueCount: enriched.filter(r => r.isOverdue).length,
      borrowingCount: enriched.filter(r => r.status === 'BORROWED').length
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách phiếu mượn:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách phiếu mượn' });
  }
});

// POST /api/borrows - Tạo phiếu mượn sách mới
router.post('/', (req, res) => {
  try {
    const {
      book_id,
      borrower_name,
      borrower_phone,
      borrower_card_id = '',
      borrow_date = getTodayStr(),
      due_date,
      notes = ''
    } = req.body;

    if (!book_id || !borrower_name || !borrower_phone || !due_date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ Tên người mượn, Số điện thoại và Hạn trả sách!'
      });
    }

    // Kiểm tra sách
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(book_id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy cuốn sách này' });
    }

    if (book.available_copies <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sách "${book.title}" hiện đã hết trong kho, không thể lập phiếu mượn!`
      });
    }

    // 1. Tạo phiếu mượn
    const insertTicket = db.prepare(`
      INSERT INTO borrow_records (book_id, book_title, borrower_name, borrower_phone, borrower_card_id, borrow_date, due_date, return_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertTicket.run(
      book.id,
      book.title,
      borrower_name.trim(),
      borrower_phone.trim(),
      borrower_card_id.trim(),
      borrow_date,
      due_date,
      null,
      'BORROWED',
      notes.trim()
    );

    // 2. Trừ tồn kho sách đi 1 cuốn
    const nextAvailable = book.available_copies - 1;
    const nextStatus = nextAvailable === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE';
    db.prepare(`
      UPDATE books
      SET available_copies = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nextAvailable, nextStatus, book.id);

    const newTicket = db.prepare('SELECT * FROM borrow_records WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: `Đã lập phiếu mượn sách "${book.title}" cho độc giả ${borrower_name} thành công!`,
      data: newTicket
    });
  } catch (error) {
    console.error('Lỗi tạo phiếu mượn:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo phiếu mượn' });
  }
});

// PATCH /api/borrows/:id/return - Xác nhận độc giả trả sách theo phiếu
router.patch('/:id/return', (req, res) => {
  try {
    const { id } = req.params;
    const ticket = db.prepare('SELECT * FROM borrow_records WHERE id = ?').get(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn này' });
    }

    if (ticket.status === 'RETURNED') {
      return res.status(400).json({ success: false, message: 'Phiếu mượn này đã được xác nhận trả trước đó rồi!' });
    }

    const today = getTodayStr();

    // 1. Cập nhật phiếu sang RETURNED
    db.prepare(`
      UPDATE borrow_records
      SET return_date = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(today, 'RETURNED', id);

    // 2. Cộng lại 1 cuốn vào kho sách
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(ticket.book_id);
    if (book) {
      const nextAvailable = Math.min(book.quantity, book.available_copies + 1);
      db.prepare(`
        UPDATE books
        SET available_copies = ?,
            status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(nextAvailable, 'AVAILABLE', book.id);
    }

    const updatedTicket = db.prepare('SELECT * FROM borrow_records WHERE id = ?').get(id);

    res.json({
      success: true,
      message: `Đã xác nhận nhận lại sách "${ticket.book_title}" từ độc giả ${ticket.borrower_name}!`,
      data: updatedTicket
    });
  } catch (error) {
    console.error('Lỗi trả sách theo phiếu:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi hoàn tất trả sách' });
  }
});

// DELETE /api/borrows/:id - Xóa phiếu mượn (khi cần dọn dẹp)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ticket = db.prepare('SELECT * FROM borrow_records WHERE id = ?').get(id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu mượn' });
    }

    // Nếu xóa phiếu đang mượn, hoàn lại 1 cuốn sách vào kho
    if (ticket.status === 'BORROWED') {
      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(ticket.book_id);
      if (book) {
        const nextAvailable = Math.min(book.quantity, book.available_copies + 1);
        db.prepare('UPDATE books SET available_copies = ?, status = ? WHERE id = ?').run(nextAvailable, 'AVAILABLE', book.id);
      }
    }

    db.prepare('DELETE FROM borrow_records WHERE id = ?').run(id);

    res.json({ success: true, message: `Đã xóa phiếu mượn #${id} thành công!` });
  } catch (error) {
    console.error('Lỗi xóa phiếu mượn:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa phiếu mượn' });
  }
});

module.exports = router;
