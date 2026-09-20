const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/books - Danh sách sách có tìm kiếm, lọc, sắp xếp
router.get('/', (req, res) => {
  try {
    const { search = '', category = '', status = '', sortBy = 'id', sortOrder = 'DESC' } = req.query;

    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (search.trim()) {
      query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (category.trim() && category !== 'Tất cả') {
      query += ' AND category = ?';
      params.push(category.trim());
    }

    if (status.trim() && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status.trim());
    }

    // Allowed sort columns to prevent SQL injection
    const allowedSort = ['id', 'title', 'author', 'published_year', 'quantity', 'available_copies', 'created_at'];
    const orderCol = allowedSort.includes(sortBy) ? sortBy : 'id';
    const orderDir = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${orderCol} ${orderDir}`;

    const books = db.prepare(query).all(...params);
    res.json({ success: true, data: books, total: books.length });
  } catch (error) {
    console.error('Lỗi lấy danh sách sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách sách' });
  }
});

// GET /api/books/categories - Lấy danh sách thể loại sách hiện có
router.get('/meta/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM books WHERE category IS NOT NULL AND category != "" ORDER BY category ASC').all();
    const categories = rows.map(r => r.category);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách thể loại' });
  }
});

// GET /api/books/:id - Chi tiết 1 cuốn sách
router.get('/:id', (req, res) => {
  try {
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách với mã này' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin sách' });
  }
});

// POST /api/books - Thêm sách mới
router.post('/', (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      published_year,
      quantity = 1,
      description = '',
      cover_url = ''
    } = req.body;

    // Validation cơ bản
    if (!title || !author || !isbn || !category || !published_year) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ các thông tin bắt buộc (Tên sách, Tác giả, ISBN, Thể loại, Năm xuất bản)!'
      });
    }

    const numQty = parseInt(quantity, 10) || 1;
    const numYear = parseInt(published_year, 10);

    if (numQty < 1) {
      return res.status(400).json({ success: false, message: 'Số lượng sách phải lớn hơn 0!' });
    }

    // Kiểm tra trùng ISBN
    const existing = db.prepare('SELECT id FROM books WHERE isbn = ?').get(isbn.trim());
    if (existing) {
      return res.status(400).json({ success: false, message: `Mã ISBN "${isbn}" đã tồn tại trong thư viện!` });
    }

    const defaultCover = cover_url.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
    const status = 'AVAILABLE';

    const insert = db.prepare(`
      INSERT INTO books (title, author, isbn, category, published_year, quantity, available_copies, status, description, cover_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title.trim(),
      author.trim(),
      isbn.trim(),
      category.trim(),
      numYear,
      numQty,
      numQty, // Ban đầu số sách có sẵn bằng tổng số lượng
      status,
      description.trim(),
      defaultCover
    );

    const newBook = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Thêm sách mới thành công!',
      data: newBook
    });
  } catch (error) {
    console.error('Lỗi thêm sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi thêm sách' });
  }
});

// PUT /api/books/:id - Cập nhật sách
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      isbn,
      category,
      published_year,
      quantity,
      description,
      cover_url
    } = req.body;

    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách để cập nhật' });
    }

    // Kiểm tra trùng ISBN với cuốn sách khác
    if (isbn && isbn.trim() !== book.isbn) {
      const existing = db.prepare('SELECT id FROM books WHERE isbn = ? AND id != ?').get(isbn.trim(), id);
      if (existing) {
        return res.status(400).json({ success: false, message: `Mã ISBN "${isbn}" đã được dùng bởi cuốn sách khác!` });
      }
    }

    const newQuantity = quantity !== undefined ? parseInt(quantity, 10) : book.quantity;
    if (newQuantity < 1) {
      return res.status(400).json({ success: false, message: 'Tổng số lượng sách không thể nhỏ hơn 1!' });
    }

    // Tính toán lại số lượng khả dụng
    const borrowedCount = book.quantity - book.available_copies;
    if (newQuantity < borrowedCount) {
      return res.status(400).json({
        success: false,
        message: `Tổng số lượng (${newQuantity}) không thể nhỏ hơn số sách đang được mượn (${borrowedCount})!`
      });
    }

    const newAvailable = newQuantity - borrowedCount;
    const newStatus = newAvailable > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK';

    const update = db.prepare(`
      UPDATE books
      SET title = ?,
          author = ?,
          isbn = ?,
          category = ?,
          published_year = ?,
          quantity = ?,
          available_copies = ?,
          status = ?,
          description = ?,
          cover_url = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    update.run(
      title ? title.trim() : book.title,
      author ? author.trim() : book.author,
      isbn ? isbn.trim() : book.isbn,
      category ? category.trim() : book.category,
      published_year ? parseInt(published_year, 10) : book.published_year,
      newQuantity,
      newAvailable,
      newStatus,
      description !== undefined ? description.trim() : book.description,
      cover_url !== undefined ? cover_url.trim() : book.cover_url,
      id
    );

    const updatedBook = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    res.json({
      success: true,
      message: 'Cập nhật thông tin sách thành công!',
      data: updatedBook
    });
  } catch (error) {
    console.error('Lỗi sửa sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi cập nhật sách' });
  }
});

// DELETE /api/books/:id - Xóa sách
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách để xóa' });
    }

    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    res.json({ success: true, message: `Đã xóa cuốn sách "${book.title}" thành công!` });
  } catch (error) {
    console.error('Lỗi xóa sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xóa sách' });
  }
});

// PATCH /api/books/:id/borrow - Mượn 1 cuốn sách
router.patch('/:id/borrow', (req, res) => {
  try {
    const { id } = req.params;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    }

    if (book.available_copies <= 0) {
      return res.status(400).json({ success: false, message: 'Sách này hiện đã hết trong kho, không thể mượn thêm!' });
    }

    const nextAvailable = book.available_copies - 1;
    const nextStatus = nextAvailable === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE';

    db.prepare(`
      UPDATE books
      SET available_copies = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nextAvailable, nextStatus, id);

    const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    res.json({
      success: true,
      message: `Đã ghi nhận mượn thành công sách "${book.title}". Còn lại: ${nextAvailable} cuốn.`,
      data: updated
    });
  } catch (error) {
    console.error('Lỗi mượn sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thực hiện mượn sách' });
  }
});

// PATCH /api/books/:id/return - Trả 1 cuốn sách
router.patch('/:id/return', (req, res) => {
  try {
    const { id } = req.params;
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sách' });
    }

    if (book.available_copies >= book.quantity) {
      return res.status(400).json({ success: false, message: 'Tất cả các bản in của sách này đã ở trong kho, không có cuốn nào đang mượn!' });
    }

    const nextAvailable = book.available_copies + 1;
    const nextStatus = 'AVAILABLE';

    db.prepare(`
      UPDATE books
      SET available_copies = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nextAvailable, nextStatus, id);

    const updated = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    res.json({
      success: true,
      message: `Đã ghi nhận trả sách "${book.title}". Số lượng có sẵn hiện tại: ${nextAvailable} cuốn.`,
      data: updated
    });
  } catch (error) {
    console.error('Lỗi trả sách:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi thực hiện trả sách' });
  }
});

module.exports = router;
