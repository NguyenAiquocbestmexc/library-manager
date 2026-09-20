import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import BookTable from './components/BookTable';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import {
  fetchBooks,
  fetchStats,
  fetchCategories,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
} from './services/api';

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [viewMode, setViewMode] = useState('table');

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  // Load books with current filters
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

  // Initial load
  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  // Search debounce & Filter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooksList();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadBooksList]);

  // Refresh all
  const handleRefresh = async () => {
    await Promise.all([loadBooksList(), loadMeta()]);
    showToast('Đã làm mới dữ liệu thư viện thành công!', 'success');
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
      setIsModalOpen(false);
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
      await Promise.all([loadBooksList(), loadMeta()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Borrow Book
  const handleBorrow = async (book) => {
    try {
      setActionLoadingId(book.id);
      const res = await borrowBook(book.id);
      showToast(res.message);
      await Promise.all([loadBooksList(), loadMeta()]);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Return Book
  const handleReturn = async (book) => {
    try {
      setActionLoadingId(book.id);
      const res = await returnBook(book.id);
      showToast(res.message);
      await Promise.all([loadBooksList(), loadMeta()]);
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
        onOpenAddModal={() => {
          setEditingBook(null);
          setIsModalOpen(true);
        }}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title Section */}
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Quản Lý Sách Thư Viện
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi, tra cứu, thực hiện mượn trả và quản lý danh mục sách một cách hiệu quả.
          </p>
        </div>

        {/* Quick Stats Overview */}
        <StatsCards stats={stats} />

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
              setIsModalOpen(true);
            }}
            onDelete={(b) => setDeletingBook(b)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            actionLoadingId={actionLoadingId}
          />
        ) : (
          <BookGrid
            books={books}
            onEdit={(b) => {
              setEditingBook(b);
              setIsModalOpen(true);
            }}
            onDelete={(b) => setDeletingBook(b)}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            actionLoadingId={actionLoadingId}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>Hệ thống Quản lý Thư viện © {new Date().getFullYear()} — Hoạt động trên Node.js Express & React</p>
      </footer>

      {/* Add / Edit Book Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleSubmitBook}
        book={editingBook}
        isSubmitting={isSubmitting}
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
