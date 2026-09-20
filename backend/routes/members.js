const express = require('express');
const router = express.Router();
const db = require('../db');

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// GET /api/members - Danh sách độc giả kèm điểm uy tín
router.get('/', (req, res) => {
  try {
    const { search = '' } = req.query;
    const today = getTodayStr();

    let query = 'SELECT * FROM members WHERE 1=1';
    const params = [];

    if (search.trim()) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR card_id LIKE ? OR department LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY id DESC';
    const members = db.prepare(query).all(...params);

    // Lấy toàn bộ phiếu mượn để tính toán thống kê và điểm uy tín
    const allBorrows = db.prepare('SELECT * FROM borrow_records').all();

    const enriched = members.map(m => {
      const userBorrows = allBorrows.filter(b => 
        (b.borrower_card_id && b.borrower_card_id === m.card_id) || 
        (b.borrower_phone && b.borrower_phone === m.phone)
      );

      const activeBorrows = userBorrows.filter(b => b.status === 'BORROWED');
      const overdueBorrows = activeBorrows.filter(b => b.due_date < today);
      const returnedBorrows = userBorrows.filter(b => b.status === 'RETURNED');

      // Điểm uy tín
      let score = 100;
      if (overdueBorrows.length > 0) {
        score -= (overdueBorrows.length * 20);
      }
      score = Math.max(20, Math.min(100, score));

      let rank = 'Xuất sắc ⭐⭐⭐';
      let rankColor = 'emerald';
      if (score < 50) {
        rank = 'Cần chú ý ⚠️';
        rankColor = 'rose';
      } else if (score < 75) {
        rank = 'Trung bình ⭐';
        rankColor = 'amber';
      } else if (score < 90) {
        rank = 'Tốt ⭐⭐';
        rankColor = 'blue';
      }

      return {
        ...m,
        totalBorrowsCount: userBorrows.length,
        activeBorrowsCount: activeBorrows.length,
        overdueCount: overdueBorrows.length,
        returnedCount: returnedBorrows.length,
        reputationScore: score,
        reputationRank: rank,
        rankColor
      };
    });

    res.json({ success: true, data: enriched, total: enriched.length });
  } catch (error) {
    console.error('Lỗi lấy danh sách độc giả:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách độc giả' });
  }
});

// GET /api/members/:id/history - Lịch sử mượn sách của độc giả
router.get('/:id/history', (req, res) => {
  try {
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả này' });
    }

    const allBorrows = db.prepare('SELECT * FROM borrow_records').all();
    const history = allBorrows.filter(b => 
      (b.borrower_card_id && b.borrower_card_id === member.card_id) || 
      (b.borrower_phone && b.borrower_phone === member.phone)
    );

    res.json({ success: true, data: { member, history } });
  } catch (error) {
    console.error('Lỗi lấy lịch sử mượn độc giả:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử mượn' });
  }
});

// POST /api/members - Thêm độc giả mới
router.post('/', (req, res) => {
  try {
    const {
      name,
      phone,
      email = '',
      card_id,
      department = '',
      joined_date = getTodayStr(),
      notes = ''
    } = req.body;

    if (!name || !phone || !card_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mã thẻ độc giả!'
      });
    }

    const existing = db.prepare('SELECT id FROM members WHERE card_id = ?').get(card_id.trim());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Mã thẻ "${card_id}" đã tồn tại trên hệ thống!`
      });
    }

    const insert = db.prepare(`
      INSERT INTO members (name, phone, email, card_id, department, joined_date, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name.trim(),
      phone.trim(),
      email.trim(),
      card_id.trim(),
      department.trim(),
      joined_date,
      'ACTIVE',
      notes.trim()
    );

    const newMember = db.prepare('SELECT * FROM members WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: `Thêm độc giả "${name}" thành công!`,
      data: newMember
    });
  } catch (error) {
    console.error('Lỗi thêm độc giả:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm độc giả' });
  }
});

// PUT /api/members/:id - Cập nhật độc giả
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, card_id, department, status, notes } = req.body;

    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    }

    const update = db.prepare(`
      UPDATE members
      SET name = ?, phone = ?, email = ?, card_id = ?, department = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      name ? name.trim() : member.name,
      phone ? phone.trim() : member.phone,
      email !== undefined ? email.trim() : member.email,
      card_id ? card_id.trim() : member.card_id,
      department !== undefined ? department.trim() : member.department,
      status || member.status,
      notes !== undefined ? notes.trim() : member.notes,
      id
    );

    const updated = db.prepare('SELECT * FROM members WHERE id = ?').get(id);
    res.json({
      success: true,
      message: 'Cập nhật thông tin độc giả thành công!',
      data: updated
    });
  } catch (error) {
    console.error('Lỗi cập nhật độc giả:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật độc giả' });
  }
});

// DELETE /api/members/:id - Xóa độc giả
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy độc giả' });
    }

    // Kiểm tra độc giả có đang mượn sách không
    const allBorrows = db.prepare('SELECT * FROM borrow_records').all();
    const active = allBorrows.some(b => 
      ((b.borrower_card_id && b.borrower_card_id === member.card_id) || b.borrower_phone === member.phone) &&
      b.status === 'BORROWED'
    );

    if (active) {
      return res.status(400).json({
        success: false,
        message: `Độc giả "${member.name}" hiện đang mượn sách chưa trả, không thể xóa tài khoản!`
      });
    }

    db.prepare('DELETE FROM members WHERE id = ?').run(id);
    res.json({ success: true, message: `Đã xóa độc giả "${member.name}" thành công!` });
  } catch (error) {
    console.error('Lỗi xóa độc giả:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa độc giả' });
  }
});

module.exports = router;
