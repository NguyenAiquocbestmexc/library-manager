const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'library.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Initialize database schema
function initDatabase() {
  db.exec(`
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

  // Check if initial seed is needed
  const count = db.prepare('SELECT COUNT(*) as count FROM books').get().count;
  if (count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const insert = db.prepare(`
    INSERT INTO books (title, author, isbn, category, published_year, quantity, available_copies, status, description, cover_url)
    VALUES (@title, @author, @isbn, @category, @published_year, @quantity, @available_copies, @status, @description, @cover_url)
  `);

  const initialBooks = [
    {
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      isbn: '978-604-58-9123-1',
      category: 'Kỹ năng sống',
      published_year: 2021,
      quantity: 10,
      available_copies: 7,
      status: 'AVAILABLE',
      description: 'Cuốn sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp và đối nhân xử thế.',
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-013-23-5088-4',
      category: 'Công nghệ thông tin',
      published_year: 2008,
      quantity: 5,
      available_copies: 2,
      status: 'AVAILABLE',
      description: 'Cẩm nang kinh điển về cách viết mã nguồn sạch sẽ, dễ bảo trì và mở rộng cho lập trình viên.',
      cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&q=80'
    },
    {
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      isbn: '978-604-55-1245-8',
      category: 'Văn học',
      published_year: 2020,
      quantity: 8,
      available_copies: 0,
      status: 'OUT_OF_STOCK',
      description: 'Hành trình theo đuổi ước mơ và lắng nghe tiếng gọi từ trái tim của chàng chăn cừu Santiago.',
      cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80'
    },
    {
      title: 'Sapiens: Lược Sử Loài Người',
      author: 'Yuval Noah Harari',
      isbn: '978-604-30-4491-1',
      category: 'Lịch sử & Khoa học',
      published_year: 2017,
      quantity: 6,
      available_copies: 4,
      status: 'AVAILABLE',
      description: 'Cái nhìn toàn cảnh về hành trình tiến hóa của loài người từ thời kỳ đồ đá đến thế kỷ 21.',
      cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80'
    },
    {
      title: 'Tâm Lý Học Về Tiền',
      author: 'Morgan Housel',
      isbn: '978-604-32-1402-4',
      category: 'Kinh tế & Tài chính',
      published_year: 2021,
      quantity: 7,
      available_copies: 5,
      status: 'AVAILABLE',
      description: 'Những bài học vượt thời gian về sự giàu có, lòng tham và hạnh phúc.',
      cover_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80'
    },
    {
      title: 'Thiết Kế Hệ Thống Quy Mô Lớn (System Design Interview)',
      author: 'Alex Xu',
      isbn: '978-173-60-4911-2',
      category: 'Công nghệ thông tin',
      published_year: 2020,
      quantity: 4,
      available_copies: 3,
      status: 'AVAILABLE',
      description: 'Hướng dẫn chi tiết từng bước thiết kế các hệ thống hàng triệu người dùng như YouTube, Twitter.',
      cover_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'
    },
    {
      title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu?',
      author: 'Rosie Nguyễn',
      isbn: '978-604-58-6204-0',
      category: 'Kỹ năng sống',
      published_year: 2018,
      quantity: 12,
      available_copies: 9,
      status: 'AVAILABLE',
      description: 'Tác phẩm truyền cảm hứng rèn luyện bản thân và định hướng tương lai cho giới trẻ.',
      cover_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80'
    },
    {
      title: 'Dế Mèn Phiêu Lưu Ký',
      author: 'Tô Hoài',
      isbn: '978-604-2-08573-0',
      category: 'Văn học',
      published_year: 2019,
      quantity: 15,
      available_copies: 11,
      status: 'AVAILABLE',
      description: 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam với bài học sâu sắc về tình bạn và lòng nhân ái.',
      cover_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80'
    }
  ];

  const insertMany = db.transaction((books) => {
    for (const b of books) {
      insert.run(b);
    }
  });

  insertMany(initialBooks);
  console.log(`Đã nạp thành công ${initialBooks.length} cuốn sách mẫu vào CSDL.`);
}

initDatabase();

module.exports = db;
