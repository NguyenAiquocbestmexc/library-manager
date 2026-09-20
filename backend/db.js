const path = require('path');
const fs = require('fs');

const initialSampleBooks = [
  {
    id: 1,
    title: 'Đắc Nhân Tâm',
    author: 'Dale Carnegie',
    isbn: '978-604-58-9123-1',
    category: 'Kỹ năng sống',
    published_year: 2021,
    quantity: 10,
    available_copies: 7,
    status: 'AVAILABLE',
    description: 'Cuốn sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp và đối nhân xử thế.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-013-23-5088-4',
    category: 'Công nghệ thông tin',
    published_year: 2008,
    quantity: 5,
    available_copies: 2,
    status: 'AVAILABLE',
    description: 'Cẩm nang kinh điển về cách viết mã nguồn sạch sẽ, dễ bảo trì và mở rộng cho lập trình viên.',
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Nhà Giả Kim',
    author: 'Paulo Coelho',
    isbn: '978-604-55-1245-8',
    category: 'Văn học',
    published_year: 2020,
    quantity: 8,
    available_copies: 0,
    status: 'OUT_OF_STOCK',
    description: 'Hành trình theo đuổi ước mơ và lắng nghe tiếng gọi từ trái tim của chàng chăn cừu Santiago.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Sapiens: Lược Sử Loài Người',
    author: 'Yuval Noah Harari',
    isbn: '978-604-30-4491-1',
    category: 'Lịch sử & Khoa học',
    published_year: 2017,
    quantity: 6,
    available_copies: 4,
    status: 'AVAILABLE',
    description: 'Cái nhìn toàn cảnh về hành trình tiến hóa của loài người từ thời kỳ đồ đá đến thế kỷ 21.',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Tâm Lý Học Về Tiền',
    author: 'Morgan Housel',
    isbn: '978-604-32-1402-4',
    category: 'Kinh tế & Tài chính',
    published_year: 2021,
    quantity: 7,
    available_copies: 5,
    status: 'AVAILABLE',
    description: 'Những bài học vượt thời gian về sự giàu có, lòng tham và hạnh phúc.',
    cover_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    title: 'Thiết Kế Hệ Thống Quy Mô Lớn (System Design Interview)',
    author: 'Alex Xu',
    isbn: '978-173-60-4911-2',
    category: 'Công nghệ thông tin',
    published_year: 2020,
    quantity: 4,
    available_copies: 3,
    status: 'AVAILABLE',
    description: 'Hướng dẫn chi tiết từng bước thiết kế các hệ thống hàng triệu người dùng như YouTube, Twitter.',
    cover_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 7,
    title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu?',
    author: 'Rosie Nguyễn',
    isbn: '978-604-58-6204-0',
    category: 'Kỹ năng sống',
    published_year: 2018,
    quantity: 12,
    available_copies: 9,
    status: 'AVAILABLE',
    description: 'Tác phẩm truyền cảm hứng rèn luyện bản thân và định hướng tương lai cho giới trẻ.',
    cover_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 8,
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    isbn: '978-604-2-08573-0',
    category: 'Văn học',
    published_year: 2019,
    quantity: 15,
    available_copies: 11,
    status: 'AVAILABLE',
    description: 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam với bài học sâu sắc về tình bạn và lòng nhân ái.',
    cover_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const now = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];
const subDays = (d, n) => new Date(d.getTime() - n * 86400000);
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

const initialSampleBorrows = [
  {
    id: 1,
    book_id: 1,
    book_title: 'Đắc Nhân Tâm',
    borrower_name: 'Nguyễn Văn An',
    borrower_phone: '0912345678',
    borrower_card_id: 'SV2024-001',
    borrow_date: formatDate(subDays(now, 3)),
    due_date: formatDate(addDays(now, 11)),
    return_date: null,
    status: 'BORROWED',
    notes: 'Sách mới nguyên vẹn, độc giả có cọc thẻ SV'
  },
  {
    id: 2,
    book_id: 2,
    book_title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    borrower_name: 'Trần Thị Mai',
    borrower_phone: '0987654321',
    borrower_card_id: 'SV2024-045',
    borrow_date: formatDate(subDays(now, 20)),
    due_date: formatDate(subDays(now, 6)), // Quá hạn 6 ngày
    return_date: null,
    status: 'BORROWED',
    notes: 'Đã gửi SMS nhắc hạn trả sách lần 1'
  },
  {
    id: 3,
    book_id: 3,
    book_title: 'Nhà Giả Kim',
    borrower_name: 'Lê Quốc Huy',
    borrower_phone: '0903123456',
    borrower_card_id: 'SV2024-089',
    borrow_date: formatDate(subDays(now, 14)),
    due_date: formatDate(subDays(now, 2)),
    return_date: formatDate(subDays(now, 1)),
    status: 'RETURNED',
    notes: 'Đã trả đủ sách, tình trạng tốt'
  }
];

let db;

// 1. Module chuẩn node:sqlite (Native Node.js 22.5+)
try {
  const { DatabaseSync } = require('node:sqlite');
  if (DatabaseSync) {
    const dbPath = path.resolve(__dirname, 'library.db');
    const sqlite = new DatabaseSync(dbPath);
    sqlite.exec('PRAGMA journal_mode = WAL;');
    
    // Tạo bảng books
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        published_year INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        available_copies INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL DEFAULT 'AVAILABLE',
        description TEXT,
        cover_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tạo bảng borrow_records
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS borrow_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        book_title TEXT NOT NULL,
        borrower_name TEXT NOT NULL,
        borrower_phone TEXT NOT NULL,
        borrower_card_id TEXT,
        borrow_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        return_date TEXT,
        status TEXT NOT NULL DEFAULT 'BORROWED',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed books nếu trống
    const countRow = sqlite.prepare('SELECT COUNT(*) as count FROM books').get();
    if (!countRow || countRow.count === 0) {
      const insert = sqlite.prepare(`
        INSERT INTO books (title, author, isbn, category, published_year, quantity, available_copies, status, description, cover_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      sqlite.exec('BEGIN');
      for (const b of initialSampleBooks) {
        insert.run(b.title, b.author, b.isbn, b.category, b.published_year, b.quantity, b.available_copies, b.status, b.description, b.cover_url);
      }
      sqlite.exec('COMMIT');
    }

    // Seed borrows nếu trống
    const countBorrow = sqlite.prepare('SELECT COUNT(*) as count FROM borrow_records').get();
    if (!countBorrow || countBorrow.count === 0) {
      const insertB = sqlite.prepare(`
        INSERT INTO borrow_records (book_id, book_title, borrower_name, borrower_phone, borrower_card_id, borrow_date, due_date, return_date, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      sqlite.exec('BEGIN');
      for (const br of initialSampleBorrows) {
        insertB.run(br.book_id, br.book_title, br.borrower_name, br.borrower_phone, br.borrower_card_id, br.borrow_date, br.due_date, br.return_date, br.status, br.notes);
      }
      sqlite.exec('COMMIT');
    }

    db = sqlite;
    console.log('✅ Cơ sở dữ liệu: node:sqlite (Native Node.js)');
  }
} catch (e) {
  // node:sqlite không có trên Node < 22.5
}

// 2. Fallback JSON File Database (Universal Safe Storage)
if (!db) {
  console.log('✅ Cơ sở dữ liệu: Pure JSON File Database (Universal Safe Storage)');
  const jsonFilePath = path.resolve(__dirname, 'library-data.json');

  let memoryData = { books: [], borrow_records: [] };
  if (fs.existsSync(jsonFilePath)) {
    try {
      memoryData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
      if (!memoryData.borrow_records) {
        memoryData.borrow_records = [...initialSampleBorrows];
      }
    } catch (err) {
      memoryData = { books: [...initialSampleBooks], borrow_records: [...initialSampleBorrows] };
    }
  } else {
    memoryData = { books: [...initialSampleBooks], borrow_records: [...initialSampleBorrows] };
    fs.writeFileSync(jsonFilePath, JSON.stringify(memoryData, null, 2), 'utf-8');
  }

  function persist() {
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(memoryData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Lỗi ghi file CSDL JSON:', e);
    }
  }

  db = {
    exec(sql) {},
    prepare(sql) {
      return {
        get(...params) {
          const s = sql.toLowerCase();
          // Borrow records queries
          if (s.includes('from borrow_records')) {
            if (s.includes('where id = ?')) {
              const id = Number(params[0]);
              return memoryData.borrow_records.find(b => b.id === id) || null;
            }
            if (s.includes('count(*) as count')) {
              return { count: memoryData.borrow_records.length };
            }
          }

          // Books queries
          if (s.includes('count(*) as count from books')) {
            return { count: memoryData.books.length };
          }
          if (s.includes('from books where id = ?')) {
            const id = Number(params[0]);
            return memoryData.books.find(b => b.id === id) || null;
          }
          if (s.includes('where isbn = ? and id != ?')) {
            const isbn = String(params[0]).trim();
            const id = Number(params[1]);
            return memoryData.books.find(b => b.isbn === isbn && b.id !== id) || null;
          }
          if (s.includes('where isbn = ?')) {
            const isbn = String(params[0]).trim();
            return memoryData.books.find(b => b.isbn === isbn) || null;
          }
          if (s.includes('totalcopies')) {
            const totalCopies = memoryData.books.reduce((acc, b) => acc + (Number(b.quantity) || 0), 0);
            const availableCopies = memoryData.books.reduce((acc, b) => acc + (Number(b.available_copies) || 0), 0);
            const borrowedCopies = totalCopies - availableCopies;
            const outOfStockTitles = memoryData.books.filter(b => (Number(b.available_copies) || 0) === 0).length;
            return { totalCopies, availableCopies, borrowedCopies, outOfStockTitles };
          }
          return null;
        },
        all(...params) {
          const s = sql.toLowerCase();

          // Query borrow_records
          if (s.includes('from borrow_records')) {
            let records = [...memoryData.borrow_records];
            let pIdx = 0;

            if (sql.includes('borrower_name LIKE ?')) {
              const term = String(params[pIdx] || '').replace(/%/g, '').toLowerCase();
              pIdx += 3;
              records = records.filter(r =>
                r.borrower_name.toLowerCase().includes(term) ||
                (r.borrower_phone && r.borrower_phone.toLowerCase().includes(term)) ||
                r.book_title.toLowerCase().includes(term)
              );
            }

            if (sql.includes('status = ?')) {
              const st = String(params[pIdx]);
              records = records.filter(r => r.status === st);
            }

            // Sort by id DESC
            records.sort((a, b) => (b.id || 0) - (a.id || 0));
            return records;
          }

          // Query categories
          if (s.includes('select distinct category')) {
            const set = new Set();
            for (const b of memoryData.books) {
              if (b.category) set.add(b.category);
            }
            return Array.from(set).sort().map(category => ({ category }));
          }

          // Group by category
          if (s.includes('group by category')) {
            const groups = {};
            for (const b of memoryData.books) {
              const cat = b.category || 'Chưa phân loại';
              if (!groups[cat]) groups[cat] = { category: cat, count: 0, totalBooks: 0 };
              groups[cat].count += 1;
              groups[cat].totalBooks += (Number(b.quantity) || 0);
            }
            return Object.values(groups).sort((a, b) => b.count - a.count);
          }

          // Query books with filters
          let results = [...memoryData.books];
          let paramIdx = 0;

          if (sql.includes('LIKE ?')) {
            const term = String(params[paramIdx] || '').replace(/%/g, '').toLowerCase();
            paramIdx += 3;
            results = results.filter(b =>
              b.title.toLowerCase().includes(term) ||
              b.author.toLowerCase().includes(term) ||
              b.isbn.toLowerCase().includes(term)
            );
          }

          if (sql.includes('category = ?')) {
            const cat = String(params[paramIdx] || '');
            paramIdx += 1;
            results = results.filter(b => b.category === cat);
          }

          if (sql.includes('status = ?')) {
            const st = String(params[paramIdx] || '');
            paramIdx += 1;
            results = results.filter(b => b.status === st);
          }

          if (sql.includes('ORDER BY')) {
            const match = sql.match(/ORDER BY\s+([a-zA-Z_]+)\s+(ASC|DESC)/i);
            if (match) {
              const col = match[1];
              const dir = match[2].toUpperCase() === 'ASC' ? 1 : -1;
              results.sort((a, b) => {
                if (a[col] < b[col]) return -1 * dir;
                if (a[col] > b[col]) return 1 * dir;
                return 0;
              });
            }
          }

          return results;
        },
        run(...params) {
          const s = sql.toLowerCase();

          // Insert borrow record
          if (s.includes('insert into borrow_records')) {
            const [book_id, book_title, borrower_name, borrower_phone, borrower_card_id, borrow_date, due_date, return_date, status, notes] = params;
            const nextId = memoryData.borrow_records.length > 0 ? Math.max(...memoryData.borrow_records.map(b => b.id || 0)) + 1 : 1;
            const newRecord = {
              id: nextId,
              book_id: Number(book_id),
              book_title,
              borrower_name,
              borrower_phone,
              borrower_card_id: borrower_card_id || '',
              borrow_date,
              due_date,
              return_date: return_date || null,
              status: status || 'BORROWED',
              notes: notes || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            memoryData.borrow_records.push(newRecord);
            persist();
            return { changes: 1, lastInsertRowid: nextId };
          }

          // Update borrow record (Return book)
          if (s.includes('update borrow_records')) {
            const id = Number(params[params.length - 1]);
            const record = memoryData.borrow_records.find(r => r.id === id);
            if (record) {
              record.return_date = params[0];
              record.status = params[1];
              record.updated_at = new Date().toISOString();
              persist();
              return { changes: 1 };
            }
          }

          // Delete borrow record
          if (s.includes('delete from borrow_records where id = ?')) {
            const id = Number(params[0]);
            memoryData.borrow_records = memoryData.borrow_records.filter(r => r.id !== id);
            persist();
            return { changes: 1 };
          }

          // Books CRUD
          if (s.includes('insert into books')) {
            const [title, author, isbn, category, published_year, quantity, available_copies, status, description, cover_url] = params;
            const nextId = memoryData.books.length > 0 ? Math.max(...memoryData.books.map(b => b.id || 0)) + 1 : 1;
            const newBook = {
              id: nextId,
              title,
              author,
              isbn,
              category,
              published_year: Number(published_year),
              quantity: Number(quantity),
              available_copies: Number(available_copies),
              status,
              description: description || '',
              cover_url: cover_url || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            memoryData.books.push(newBook);
            persist();
            return { changes: 1, lastInsertRowid: nextId };
          }

          if (s.includes('update books') && s.includes('where id = ?')) {
            const id = Number(params[params.length - 1]);
            const book = memoryData.books.find(b => b.id === id);
            if (book) {
              if (params.length === 3) {
                // PATCH borrow or return: available_copies, status, id
                book.available_copies = Number(params[0]);
                book.status = params[1];
              } else {
                // Full update
                book.title = params[0];
                book.author = params[1];
                book.isbn = params[2];
                book.category = params[3];
                book.published_year = Number(params[4]);
                book.quantity = Number(params[5]);
                book.available_copies = Number(params[6]);
                book.status = params[7];
                book.description = params[8];
                book.cover_url = params[9];
              }
              book.updated_at = new Date().toISOString();
              persist();
              return { changes: 1 };
            }
          }

          if (s.includes('delete from books where id = ?')) {
            const id = Number(params[0]);
            memoryData.books = memoryData.books.filter(b => b.id !== id);
            persist();
            return { changes: 1 };
          }

          return { changes: 0 };
        }
      };
    }
  };
}

module.exports = db;
