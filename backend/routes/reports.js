const express = require('express');
const router = express.Router();
const db = require('../db');

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// GET /api/reports/analytics - Thống kê báo cáo phân tích chuyên sâu
router.get('/analytics', (req, res) => {
  try {
    const today = getTodayStr();
    const books = db.prepare('SELECT * FROM books').all();
    const borrows = db.prepare('SELECT * FROM borrow_records').all();
    const members = db.prepare('SELECT * FROM members').all();

    // 1. Phân bổ thể loại (Category Distribution)
    const categoryMap = {};
    for (const b of books) {
      const cat = b.category || 'Khác';
      if (!categoryMap[cat]) categoryMap[cat] = { category: cat, titles: 0, copies: 0 };
      categoryMap[cat].titles += 1;
      categoryMap[cat].copies += (Number(b.quantity) || 0);
    }
    const categoryDistribution = Object.values(categoryMap).sort((a, b) => b.copies - a.copies);

    // 2. Tình trạng lưu thông (Circulation status)
    const totalCopies = books.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (Number(b.available_copies) || 0), 0);
    const activeBorrows = borrows.filter(b => b.status === 'BORROWED');
    const overdueBorrows = activeBorrows.filter(b => b.due_date < today);
    const returnedBorrows = borrows.filter(b => b.status === 'RETURNED');

    // 3. Top sách được mượn nhiều nhất
    const bookBorrowCounts = {};
    for (const br of borrows) {
      const bId = br.book_id;
      if (!bookBorrowCounts[bId]) {
        bookBorrowCounts[bId] = { id: bId, title: br.book_title, borrowCount: 0 };
      }
      bookBorrowCounts[bId].borrowCount += 1;
    }
    const topBorrowedBooks = Object.values(bookBorrowCounts)
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 5);

    // 4. Phân loại uy tín độc giả
    const memberRankCounts = { excellent: 0, good: 0, average: 0, warning: 0 };
    for (const m of members) {
      const mOverdue = borrows.filter(b => 
        ((b.borrower_card_id && b.borrower_card_id === m.card_id) || b.borrower_phone === m.phone) &&
        b.status === 'BORROWED' && b.due_date < today
      ).length;
      if (mOverdue > 0) memberRankCounts.warning += 1;
      else memberRankCounts.excellent += 1;
    }

    res.json({
      success: true,
      data: {
        totalBooksCount: books.length,
        totalCopies,
        availableCopies,
        activeBorrowsCount: activeBorrows.length,
        overdueCount: overdueBorrows.length,
        returnedCount: returnedBorrows.length,
        totalMembersCount: members.length,
        categoryDistribution,
        topBorrowedBooks,
        memberRankCounts
      }
    });
  } catch (error) {
    console.error('Lỗi tính toán báo cáo phân tích:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo báo cáo' });
  }
});

module.exports = router;
