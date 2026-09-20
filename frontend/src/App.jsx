import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import BookTable from './components/BookTable';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';
import BorrowModal from './components/BorrowModal';
import BorrowTable from './components/BorrowTable';
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
  deleteBorrowTicket
} from './services/api';

export default function App() {
  // Navigation Tab: 'books' | 'borrows'
  const [activeTab, setActiveTab] = useState('books');

  // Books State
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Borrows State
  const [borrows, setBorrows] = useState([]);
  const [borrowsLoading, setBorrowsLoading] = useState(false);

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

  // Action loading indicator
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
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

  // Initial load
  useEffect(() => {
    loadMeta();
    loadBorrowsList();
  }, [loadMeta, loadBorrowsList]);

  // Books search debounce & filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooksList();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadBooksList]);

  // Refresh all data
  const handleRefresh = async () => {
    await Promise.all([loadBooksList(), loadBorrowsList(), loadMeta()]);
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
      await Promise.all([loadBooksList(), loadBorrowsList(), loadMeta()]);
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
      await Promise.all([loadBooksList(), loadBorrowsList(), loadMeta()]);
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
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
        onRefresh={handleRefresh}
        loading={loading || borrowsLoading}
        overdueCount={stats?.overdueCount || 0}
        activeBorrowsCount={stats?.activeBorrowsCount || 0}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title Section */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeTab === 'books' ? 'Quản Lý Kho Sách Thư Viện' : 'Quản Lý Phiếu Mượn & Trả Sách'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {activeTab === 'books'
              ? 'Theo dõi danh mục sách, số lượng tồn kho, tình trạng sẵn có và lập phiếu mượn cho độc giả.'
              : 'Theo dõi chi tiết danh sách người mượn, thời hạn mượn, cảnh báo quá hạn và xác nhận thu hồi sách.'}
          </p>
        </div>

        {/* Quick Stats Overview */}
        <StatsCards stats={stats} />

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
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-medium text-slate-500">Đang tải danh sách sách...</p>
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
                actionLoadingId={actionLoadingId}
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
                onReturn={() => setActiveTab('borrows')}
                actionLoadingId={actionLoadingId}
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
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>Hệ thống Quản lý Nghiệp vụ Thư viện © {new Date().getFullYear()} — Hoạt động trên Node.js & React</p>
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
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa cuốn sách"
        bookTitle={deletingBook ? `${deletingBook.title} (${deletingBook.author})` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
