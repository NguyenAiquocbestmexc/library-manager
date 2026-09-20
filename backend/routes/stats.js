const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/stats - Thống kê tổng quan thư viện
router.get('/', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalTitles = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
    
    const totals = db.prepare(`
      SELECT 
        COALESCE(SUM(quantity), 0) as totalCopies,
        COALESCE(SUM(available_copies), 0) as availableCopies,
        COALESCE(SUM(quantity - available_copies), 0) as borrowedCopies,
        COALESCE(SUM(CASE WHEN available_copies = 0 THEN 1 ELSE 0 END), 0) as outOfStockTitles
      FROM books
    `).get();

    const categoryStats = db.prepare(`
      SELECT category, COUNT(*) as count, SUM(quantity) as totalBooks
      FROM books
      GROUP BY category
      ORDER BY count DESC
    `).all();

    // Thống kê phiếu mượn & quá hạn
    const allBorrows = db.prepare('SELECT * FROM borrow_records').all();
    const activeBorrows = allBorrows.filter(b => b.status === 'BORROWED');
    const overdueCount = activeBorrows.filter(b => b.due_date < today).length;

    res.json({
      success: true,
      data: {
        totalTitles,
        totalCopies: totals.totalCopies,
        availableCopies: totals.availableCopies,
        borrowedCopies: totals.borrowedCopies,
        outOfStockTitles: totals.outOfStockTitles,
        activeBorrowsCount: activeBorrows.length,
        overdueCount,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy dữ liệu thống kê' });
  }
});

module.exports = router;
