require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const booksRouter = require('./routes/books');
const statsRouter = require('./routes/stats');
const borrowsRouter = require('./routes/borrows');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Library API Server is running smoothly!', time: new Date() });
});

// API Routes
app.use('/api/books', booksRouter);
app.use('/api/stats', statsRouter);
app.use('/api/borrows', borrowsRouter);

// Phục vụ frontend nếu đã build (tiện cho việc deploy trọn gói 1 dịch vụ)
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 404 Handler for API requests
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint không tồn tại' });
});

// Fallback for Single Page Application (SPA)
if (fs.existsSync(distPath)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ success: false, message: 'Đã xảy ra lỗi máy chủ nội bộ' });
});

// Only listen when run directly (not required as a module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Library Management Backend đang chạy tại: http://localhost:${PORT}`);
  });
}

module.exports = app;
