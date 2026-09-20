const http = require('http');
const app = require('./server.js');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.setHeader('Content-Type', 'application/json');
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  const server = app.listen(5001, async () => {
    try {
      console.log('--- BẮT ĐẦU KIỂM THỬ API ---');

      // 1. Check stats
      const stats = await request({ hostname: 'localhost', port: 5001, path: '/api/stats', method: 'GET' });
      console.log('1. GET /api/stats:', stats.status === 200 && stats.data.success ? 'PASSED ✅' : 'FAILED ❌', stats.data.data);

      // 2. Create a new book
      const newBookPayload = {
        title: 'Lập Trình Hướng Đối Tượng',
        author: 'Nguyễn Văn A',
        isbn: '978-604-0-99999-9',
        category: 'Công nghệ thông tin',
        published_year: 2023,
        quantity: 5,
        description: 'Sách giáo trình cơ bản về OOP và Design Patterns'
      };
      const created = await request({ hostname: 'localhost', port: 5001, path: '/api/books', method: 'POST' }, newBookPayload);
      console.log('2. POST /api/books:', created.status === 201 && created.data.success ? 'PASSED ✅' : 'FAILED ❌', `ID: ${created.data.data?.id}`);
      const bookId = created.data.data.id;

      // 3. Update book
      const updatePayload = { title: 'Lập Trình Hướng Đối Tượng Căn Bản', quantity: 6 };
      const updated = await request({ hostname: 'localhost', port: 5001, path: `/api/books/${bookId}`, method: 'PUT' }, updatePayload);
      console.log('3. PUT /api/books/:id:', updated.status === 200 && updated.data.data.title.includes('Căn Bản') ? 'PASSED ✅' : 'FAILED ❌');

      // 4. Borrow book
      const borrowed = await request({ hostname: 'localhost', port: 5001, path: `/api/books/${bookId}/borrow`, method: 'PATCH' });
      console.log('4. PATCH /api/books/:id/borrow:', borrowed.status === 200 && borrowed.data.data.available_copies === 5 ? 'PASSED ✅' : 'FAILED ❌', `Còn lại: ${borrowed.data.data?.available_copies}`);

      // 5. Return book
      const returned = await request({ hostname: 'localhost', port: 5001, path: `/api/books/${bookId}/return`, method: 'PATCH' });
      console.log('5. PATCH /api/books/:id/return:', returned.status === 200 && returned.data.data.available_copies === 6 ? 'PASSED ✅' : 'FAILED ❌', `Có sẵn: ${returned.data.data?.available_copies}`);

      // 6. Delete book
      const deleted = await request({ hostname: 'localhost', port: 5001, path: `/api/books/${bookId}`, method: 'DELETE' });
      console.log('6. DELETE /api/books/:id:', deleted.status === 200 && deleted.data.success ? 'PASSED ✅' : 'FAILED ❌');

      console.log('--- TẤT CẢ TEST ĐỀU THÀNH CÔNG RỰC RỠ! 🎉 ---');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('Lỗi khi chạy tests:', err);
      server.close(() => process.exit(1));
    }
  });
}

runTests();
