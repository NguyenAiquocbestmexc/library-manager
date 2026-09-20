import React from 'react';
import { Edit3, Trash2, ArrowDownRight, BookOpen, QrCode, Lock } from 'lucide-react';

const categoryColorMap = {
  'Công nghệ thông tin': 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Văn học': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Kỹ năng sống': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Lịch sử & Khoa học': 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Kinh tế & Tài chính': 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
};

export default function BookGrid({
  books,
  onEdit,
  onDelete,
  onBorrow,
  onViewQR,
  actionLoadingId,
  isAdmin,
  onRequireAdmin
}) {
  if (books.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center my-6 shadow-xs">
        <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Không tìm thấy sách phù hợp</h3>
        <p className="text-sm text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
      {books.map((book) => {
        const isOut = book.available_copies <= 0;
        const percent = Math.round((book.available_copies / book.quantity) * 100);
        const badgeColor = categoryColorMap[book.category] || 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        const isLoading = actionLoadingId === book.id;

        return (
          <div
            key={book.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
          >
            {/* Top Image + Badges */}
            <div className="relative h-52 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
              <img
                src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {book.available_copies > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-emerald-700 shadow-sm backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Còn sách
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-rose-700 shadow-sm backdrop-blur-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Hết sách
                  </span>
                )}
              </div>

              {/* Quick Actions (QR / Edit / Delete) */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1 rounded-xl shadow-sm">
                <button
                  onClick={() => onViewQR(book)}
                  title="Xem mã QR sách"
                  className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => onEdit(book)}
                      title="Sửa sách"
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(book)}
                      title="Xóa sách"
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              {/* Category pill at bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full bg-white/95 shadow-sm backdrop-blur-xs ${badgeColor}`}>
                  {book.category}
                </span>
                <span className="text-xs font-medium text-white drop-shadow-sm">
                  {book.published_year}
                </span>
              </div>
            </div>

            {/* Book Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Tác giả: <span className="text-slate-800 dark:text-slate-200 font-semibold">{book.author}</span>
                </p>
                <p className="text-2xs font-mono text-slate-400 mt-0.5">
                  ISBN: {book.isbn}
                </p>

                {book.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2.5 font-normal leading-relaxed">
                    {book.description}
                  </p>
                )}
              </div>

              {/* Stock Bar & Borrow */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className={isOut ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-400'}>
                    {book.available_copies} có sẵn
                  </span>
                  <span className="text-slate-400 font-normal">/ {book.quantity} bản in</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percent === 0
                        ? 'bg-rose-500'
                        : percent < 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Borrow Button */}
                <button
                  onClick={() => {
                    if (!isAdmin) onRequireAdmin();
                    else onBorrow(book);
                  }}
                  disabled={isOut || isLoading}
                  className="w-full py-2 px-3 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer border border-indigo-200/60 dark:border-indigo-800"
                >
                  {!isAdmin && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Lập Phiếu Mượn Sách</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
