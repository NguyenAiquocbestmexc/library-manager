import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import BookTable from './components/BookTable';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';
import BorrowModal from './components/BorrowModal';
import BorrowTable from './components/BorrowTable';
import MembersTable from './components/MembersTable';
import MemberModal from './components/MemberModal';
import MemberHistoryModal from './components/MemberHistoryModal';
import ReportsView from './components/ReportsView';
import QRCodeModal from './components/QRCodeModal';
import QRScannerModal from './components/QRScannerModal';
import LoginModal from './components/LoginModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import {
  fetchBooks,
  fetchStats,
  fetchCategories,
  createBook,
  updateBook,
  deleteBook,
  fetchBorrows,
  createBorrowTicket,
  returnBorrowTicket,
  deleteBorrowTicket,
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  fetchMemberHistory
} from './services/api';

export default function App() {
  // Navigation Tab: 'books' | 'borrows' | 'members' | 'reports'
  const [activeTab, setActiveTab] = useState('books');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('lib_dark_mode');
    if (saved !== null) return saved === 'true';
    return false; // Mặc định giao diện Sáng, người dùng bấm nút Mặt trăng / Mặt trời để chuyển đổi
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lib_dark_mode', String(darkMode));
  }, [darkMode]);

  // Admin Role State
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lib_is_admin') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Books State
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Borrows State
  const [borrows, setBorrows] = useState([]);
  const [borrowsLoading, setBorrowsLoading] = useState(false);

  // Members State
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [isMemberSubmitting, setIsMemberSubmitting] = useState(false);
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  // Member History Modal
  const [historyMemberData, setHistoryMemberData] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Filters & Sorting for Books
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [viewMode, setViewMode] = useState('table');

  // Book Modal (Add / Edit)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Borrow Modal
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [borrowingBook, setBorrowingBook] = useState(null);
  const [isBorrowSubmitting, setIsBorrowSubmitting] = useState(false);

  // QR Code & Scanner Modals
  const [qrModalBook, setQrModalBook] = useState(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  // Action loading indicator
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRequireAdmin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('lib_is_admin', 'true');
    showToast('Đăng nhập quyền Quản trị viên (Thủ thư) thành công!', 'success');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('lib_is_admin');
    showToast('Đã chuyển sang chế độ Khách / Bạn đọc.', 'info');
  };

  // Load stats and categories
  const loadMeta = useCallback(async () => {
    try {
      const [statsRes, catRes] = await Promise.all([
        fetchStats(),
        fetchCategories()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error('Lỗi nạp metadata:', err);
    }
  }, []);

  // Load books list
  const loadBooksList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBooks({
        search,
        category,
        status,
        sortBy,
        sortOrder
      });
      if (res.success) {
        setBooks(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, category, status, sortBy, sortOrder]);

  // Load borrow tickets list
  const loadBorrowsList = useCallback(async () => {
    try {
      setBorrowsLoading(true);
      const res = await fetchBorrows();
      if (res.success) {
        setBorrows(res.data);
      }
    } catch (err) {
      console.error('Lỗi nạp danh sách phiếu mượn:', err);
    } finally {
      setBorrowsLoading(false);
    }
  }, []);

  // Load members list
  const loadMembersList = useCallback(async () => {
    try {
      setMembersLoading(true);
      const res = await fetchMembers();
      if (res.success) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error('Lỗi nạp danh sách độc giả:', err);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMeta();
    loadBorrowsList();
    loadMembersList();
  }, [loadMeta, loadBorrowsList, loadMembersList]);

  // Books search debounce & filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooksList();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadBooksList]);

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([
      loadBooksList(),
      loadBorrowsList(),
      loadMembersList(),
      loadMeta()
    ]);
    showToast('Đã làm mới dữ liệu hệ thống thành công!', 'success');
  };

  // Create or Update Book
  const handleSubmitBook = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingBook) {
        const res = await updateBook(editingBook.id, formData);
        showToast(res.message || 'Cập nhật sách thành công!');
      } else {
        const res = await createBook(formData);
        showToast(res.message || 'Thêm sách mới thành công!');
      }
      setIsBookModalOpen(false);
      setEditingBook(null);
      await Promise.all([loadBooksList(), loadMeta()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Book
  const handleConfirmDelete = async () => {
    if (!deletingBook) return;
    try {
      setIsDeleting(true);
      const res = await deleteBook(deletingBook.id);
      showToast(res.message || 'Đã xóa sách thành công!');
      setDeletingBook(null);
      await Promise.all([loadBooksList(), loadMeta(), loadBorrowsList()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Borrow Modal for a Book
  const handleOpenBorrowModal = (book) => {
    if (book.available_copies <= 0) {
      showToast('Sách này hiện đã hết trong kho, không thể mượn thêm!', 'error');
      return;
    }
    setBorrowingBook(book);
    setIsBorrowModalOpen(true);
  };

  // Submit Borrow Ticket
  const handleSubmitBorrowTicket = async (ticketData) => {
    try {
      setIsBorrowSubmitting(true);
      const res = await createBorrowTicket(ticketData);
      showToast(res.message || 'Lập phiếu mượn sách thành công!');
      setIsBorrowModalOpen(false);
      setBorrowingBook(null);
      await Promise.all([loadBooksList(), loadBorrowsList(), loadMeta(), loadMembersList()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsBorrowSubmitting(false);
    }
  };

  // Return Book from Ticket
  const handleReturnTicket = async (ticket) => {
    try {
      setActionLoadingId(ticket.id);
      const res = await returnBorrowTicket(ticket.id);
      showToast(res.message || 'Xác nhận trả sách thành công!');
      await Promise.all([loadBooksList(), loadBorrowsList(), loadMeta(), loadMembersList()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Borrow Ticket
  const handleDeleteTicket = async (ticket) => {
    try {
      setActionLoadingId(ticket.id);
      const res = await deleteBorrowTicket(ticket.id);
      showToast(res.message || 'Đã xóa phiếu mượn!');
      await Promise.all([loadBorrowsList(), loadBooksList(), loadMeta()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Create or Update Member
  const handleSubmitMember = async (formData) => {
    try {
      setIsMemberSubmitting(true);
      if (editingMember) {
        const res = await updateMember(editingMember.id, formData);
        showToast(res.message || 'Cập nhật thông tin độc giả thành công!');
      } else {
        const res = await createMember(formData);
        showToast(res.message || 'Thêm độc giả mới thành công!');
      }
      setIsMemberModalOpen(false);
      setEditingMember(null);
      await loadMembersList();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsMemberSubmitting(false);
    }
  };

  // Delete Member
  const handleConfirmDeleteMember = async () => {
    if (!deletingMember) return;
    try {
      setIsDeletingMember(true);
      const res = await deleteMember(deletingMember.id);
      showToast(res.message || 'Đã xóa hồ sơ độc giả thành công!');
      setDeletingMember(null);
      await loadMembersList();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeletingMember(false);
    }
  };

  // View Member History
  const handleViewMemberHistory = async (member) => {
    try {
      setHistoryLoading(true);
      setIsHistoryModalOpen(true);
      const res = await fetchMemberHistory(member.id);
      if (res.success) {
        setHistoryMemberData(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Handle QR Scan Success
  const handleScanSuccess = (matchedBook) => {
    setIsQRScannerOpen(false);
    if (!matchedBook) return;

    showToast(`Tìm thấy sách: "${matchedBook.title}"`, 'success');
    if (isAdmin && matchedBook.available_copies > 0) {
      setBorrowingBook(matchedBook);
      setIsBorrowModalOpen(true);
    } else {
      setActiveTab('books');
      setSearch(matchedBook.title);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingBook(null);
          setIsBookModalOpen(true);
        }}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        onRefresh={handleRefresh}
        loading={loading || borrowsLoading || membersLoading}
        overdueCount={stats?.overdueCount || 0}
        activeBorrowsCount={stats?.activeBorrowsCount || 0}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title Section */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {activeTab === 'books' && 'Quản Lý Kho Sách Thư Viện'}
            {activeTab === 'borrows' && 'Quản Lý Phiếu Mượn & Trả Sách'}
            {activeTab === 'members' && 'Quản Lý Độc Giả & Thẻ Thư Viện'}
            {activeTab === 'reports' && 'Báo Cáo Thống Kê & Phân Tích Dữ Liệu'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'books' && 'Theo dõi danh mục sách, số lượng tồn kho, quét mã QR/Barcode và lập phiếu mượn.'}
            {activeTab === 'borrows' && 'Theo dõi chi tiết danh sách mượn sách, thời hạn trả, cảnh báo quá hạn và xác nhận thu hồi.'}
            {activeTab === 'members' && 'Quản lý hồ sơ bạn đọc, số điện thoại, lịch sử mượn trả và điểm uy tín thành viên.'}
            {activeTab === 'reports' && 'Tổng quan biểu đồ phân tích, sách mượn nhiều nhất, xuất báo cáo Excel/CSV và nhập dữ liệu.'}
          </p>
        </div>

        {/* Quick Stats Overview (Visible on Books & Borrows tabs) */}
        {(activeTab === 'books' || activeTab === 'borrows') && (
          <StatsCards stats={stats} />
        )}

        {/* TAB 1: KHO SÁCH (Books Catalog) */}
        {activeTab === 'books' && (
          <div>
            {/* Filter, Search & View Controls */}
            <FilterBar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              status={status}
              setStatus={setStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Books List (Table View or Grid View) */}
            {loading && books.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xs">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải danh sách sách...</p>
              </div>
            ) : viewMode === 'table' ? (
              <BookTable
                books={books}
                onEdit={(b) => {
                  setEditingBook(b);
                  setIsBookModalOpen(true);
                }}
                onDelete={(b) => setDeletingBook(b)}
                onBorrow={handleOpenBorrowModal}
                onReturn={() => setActiveTab('borrows')}
                onViewQR={(b) => setQrModalBook(b)}
                actionLoadingId={actionLoadingId}
                isAdmin={isAdmin}
                onRequireAdmin={handleRequireAdmin}
              />
            ) : (
              <BookGrid
                books={books}
                onEdit={(b) => {
                  setEditingBook(b);
                  setIsBookModalOpen(true);
                }}
                onDelete={(b) => setDeletingBook(b)}
                onBorrow={handleOpenBorrowModal}
                onViewQR={(b) => setQrModalBook(b)}
                actionLoadingId={actionLoadingId}
                isAdmin={isAdmin}
                onRequireAdmin={handleRequireAdmin}
              />
            )}
          </div>
        )}

        {/* TAB 2: QUẢN LÝ PHIẾU MƯỢN TRẢ (Borrow Tickets) */}
        {activeTab === 'borrows' && (
          <BorrowTable
            borrows={borrows}
            loading={borrowsLoading}
            onReturnTicket={handleReturnTicket}
            onDeleteTicket={handleDeleteTicket}
            actionLoadingId={actionLoadingId}
            isAdmin={isAdmin}
            onRequireAdmin={handleRequireAdmin}
          />
        )}

        {/* TAB 3: QUẢN LÝ ĐỘC GIẢ (Members) */}
        {activeTab === 'members' && (
          <MembersTable
            members={members}
            loading={membersLoading}
            onOpenAddModal={() => {
              setEditingMember(null);
              setIsMemberModalOpen(true);
            }}
            onEditMember={(m) => {
              setEditingMember(m);
              setIsMemberModalOpen(true);
            }}
            onDeleteMember={(m) => setDeletingMember(m)}
            onViewHistory={handleViewMemberHistory}
            isAdmin={isAdmin}
          />
        )}

        {/* TAB 4: BÁO CÁO & XUẤT NHẬP DỮ LIỆU (Reports) */}
        {activeTab === 'reports' && (
          <ReportsView
            books={books}
            borrows={borrows}
            members={members}
            onRefreshAll={handleRefresh}
            showToast={showToast}
            isAdmin={isAdmin}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Hệ thống Quản lý Thư viện Thông minh © {new Date().getFullYear()} — Mã QR & Phân Tích Dữ Liệu</p>
      </footer>

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmitBook}
        book={editingBook}
        isSubmitting={isSubmitting}
      />

      {/* Borrow Book Modal (Lập Phiếu Mượn) */}
      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => {
          setIsBorrowModalOpen(false);
          setBorrowingBook(null);
        }}
        onSubmit={handleSubmitBorrowTicket}
        book={borrowingBook}
        isSubmitting={isBorrowSubmitting}
        members={members}
      />

      {/* Delete Book Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa cuốn sách"
        bookTitle={deletingBook ? `${deletingBook.title} (${deletingBook.author})` : ''}
        message="Bạn có chắc chắn muốn xóa cuốn sách này khỏi kho? Mọi dữ liệu liên quan sẽ bị xóa."
        isDeleting={isDeleting}
      />

      {/* Add / Edit Member Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={handleSubmitMember}
        member={editingMember}
        isSubmitting={isMemberSubmitting}
      />

      {/* Delete Member Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDeleteMember}
        title="Xác nhận xóa hồ sơ độc giả"
        bookTitle={deletingMember ? `${deletingMember.name} (Mã thẻ: ${deletingMember.card_id})` : ''}
        message="Bạn có chắc chắn muốn xóa độc giả này khỏi hệ thống thư viện?"
        isDeleting={isDeletingMember}
      />

      {/* Member History Modal */}
      <MemberHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setHistoryMemberData(null);
        }}
        memberData={historyMemberData}
        loading={historyLoading}
      />

      {/* Book QR Code Modal */}
      <QRCodeModal
        isOpen={Boolean(qrModalBook)}
        onClose={() => setQrModalBook(null)}
        book={qrModalBook}
      />

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        books={books}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
