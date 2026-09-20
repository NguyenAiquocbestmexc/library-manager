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

let db;

// 1. Thử dùng module chuẩn node:sqlite (có sẵn trong Node 22.5+)
try {
  const { DatabaseSync } = require('node:sqlite');
  if (DatabaseSync) {
    const dbPath = path.resolve(__dirname, 'library.db');
    const sqlite = new DatabaseSync(dbPath);
    sqlite.exec('PRAGMA journal_mode = WAL;');
    
    // Tạo bảng
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

    db = sqlite;
    console.log('✅ Cơ sở dữ liệu: node:sqlite (Native Node.js)');
  }
} catch (e) {
  // node:sqlite không có trên phiên bản Node cũ hơn (Node < 22.5)
}

// 2. Fallback thuần JavaScript: File-based JSON database (100% không bao giờ crash, không cần C++ addon)
if (!db) {
  console.log('✅ Cơ sở dữ liệu: Pure JSON File Database (Universal Safe Storage)');
  const jsonFilePath = path.resolve(__dirname, 'library-data.json');

  let memoryData = { books: [] };
  if (fs.existsSync(jsonFilePath)) {
    try {
      memoryData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
    } catch (err) {
      memoryData = { books: [...initialSampleBooks] };
    }
  } else {
    memoryData = { books: [...initialSampleBooks] };
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
    exec(sql) {
      // no-op for JSON store
    },
    prepare(sql) {
      return {
        get(...params) {
          const s = sql.toLowerCase();
          if (s.includes('count(*) as count')) {
            return { count: memoryData.books.length };
          }
          if (s.includes('where id = ?')) {
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
          if (s.includes('select distinct category')) {
            const set = new Set();
            for (const b of memoryData.books) {
              if (b.category) set.add(b.category);
            }
            return Array.from(set).sort().map(category => ({ category }));
          }
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
          // Query GET /api/books with filters
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

          // Sorting
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
              if (params.length === 2) {
                // PATCH borrow or return: available_copies, status, id
                book.available_copies = Number(params[0]);
                book.status = params[1];
              } else if (params.length === 3) {
                // PATCH borrow or return
                book.available_copies = Number(params[0]);
                book.status = params[1];
              } else {
                // Full update: title, author, isbn, category, published_year, quantity, available_copies, status, description, cover_url, id
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
