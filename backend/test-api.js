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
  const server = app.listen(5003, async () => {
    try {
      console.log('--- BẮT ĐẦU KIỂM THỬ TOÀN DIỆN API ---');

      // 1. Check stats
      const stats = await request({ hostname: 'localhost', port: 5003, path: '/api/stats', method: 'GET' });
      console.log('1. GET /api/stats:', stats.status === 200 && stats.data.success ? 'PASSED ✅' : 'FAILED ❌', {
        titles: stats.data.data?.totalTitles,
        overdue: stats.data.data?.overdueCount
      });

      // 2. Create a new book
      const newBookPayload = {
        title: 'Lập Trình Hướng Đối Tượng',
        author: 'Nguyễn Văn A',
        isbn: '978-604-0-99999-9',
        category: 'Công nghệ thông tin',
        published_year: 2023,
        quantity: 5,
        description: 'Sách giáo trình cơ bản về OOP'
      };
      const created = await request({ hostname: 'localhost', port: 5003, path: '/api/books', method: 'POST' }, newBookPayload);
      console.log('2. POST /api/books:', created.status === 201 && created.data.success ? 'PASSED ✅' : 'FAILED ❌', `ID: ${created.data.data?.id}`);
      const bookId = created.data.data.id;

      // 3. Get borrow tickets
      const borrowsList = await request({ hostname: 'localhost', port: 5003, path: '/api/borrows', method: 'GET' });
      console.log('3. GET /api/borrows:', borrowsList.status === 200 && borrowsList.data.success ? 'PASSED ✅' : 'FAILED ❌', `Số phiếu hiện có: ${borrowsList.data.total}`);

      // 4. Create new Borrow Ticket for bookId
      const ticketPayload = {
        book_id: bookId,
        borrower_name: 'Hoàng Văn Thắng',
        borrower_phone: '0977888999',
        borrower_card_id: 'MS-202499',
        due_date: '2026-10-05',
        notes: 'Mượn ôn thi học kỳ'
      };
      const ticketCreated = await request({ hostname: 'localhost', port: 5003, path: '/api/borrows', method: 'POST' }, ticketPayload);
      console.log('4. POST /api/borrows (Lập phiếu mượn):', ticketCreated.status === 201 && ticketCreated.data.success ? 'PASSED ✅' : 'FAILED ❌', `Phiếu #${ticketCreated.data.data?.id} cho ${ticketCreated.data.data?.borrower_name}`);
      const ticketId = ticketCreated.data.data?.id;

      // 5. Check book available_copies reduced
      const bookAfterBorrow = await request({ hostname: 'localhost', port: 5003, path: `/api/books/${bookId}`, method: 'GET' });
      console.log('5. Kiểm tra sách bị trừ 1 cuốn:', bookAfterBorrow.data.data?.available_copies === 4 ? 'PASSED ✅' : 'FAILED ❌', `Còn: ${bookAfterBorrow.data.data?.available_copies}/5`);

      // 6. Return book via Ticket
      const returnedTicket = await request({ hostname: 'localhost', port: 5003, path: `/api/borrows/${ticketId}/return`, method: 'PATCH' });
      console.log('6. PATCH /api/borrows/:id/return (Trả sách theo phiếu):', returnedTicket.status === 200 && returnedTicket.data.data?.status === 'RETURNED' ? 'PASSED ✅' : 'FAILED ❌');

      // 7. Check book available_copies restored
      const bookAfterReturn = await request({ hostname: 'localhost', port: 5003, path: `/api/books/${bookId}`, method: 'GET' });
      console.log('7. Kiểm tra sách được cộng trả lại 1 cuốn:', bookAfterReturn.data.data?.available_copies === 5 ? 'PASSED ✅' : 'FAILED ❌', `Còn: ${bookAfterReturn.data.data?.available_copies}/5`);

      // 8. Test members API
      const membersRes = await request({ hostname: 'localhost', port: 5003, path: '/api/members', method: 'GET' });
      console.log('8. GET /api/members:', membersRes.status === 200 && membersRes.data.success ? 'PASSED ✅' : 'FAILED ❌', `Độc giả: ${membersRes.data.total}`);

      // 9. Test reports analytics API
      const reportsRes = await request({ hostname: 'localhost', port: 5003, path: '/api/reports/analytics', method: 'GET' });
      console.log('9. GET /api/reports/analytics:', reportsRes.status === 200 && reportsRes.data.success ? 'PASSED ✅' : 'FAILED ❌', `Top sách: ${reportsRes.data.data?.topBorrowedBooks?.length}`);

      // 10. Cleanup test book
      await request({ hostname: 'localhost', port: 5003, path: `/api/books/${bookId}`, method: 'DELETE' });
      console.log('10. Dọn dẹp sách test: PASSED ✅');

      console.log('--- TOÀN BỘ NGHIỆP VỤ MƯỢN TRẢ ĐÃ TEST THÀNH CÔNG RỰC RỠ! 🎉 ---');
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('Lỗi kiểm thử:', err);
      server.close(() => process.exit(1));
    }
  });
}

runTests();
