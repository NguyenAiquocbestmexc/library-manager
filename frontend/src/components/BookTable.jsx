import React from 'react';
import { Edit3, Trash2, ArrowDownRight, ArrowUpRight, BookOpen, QrCode, Lock } from 'lucide-react';

const categoryColorMap = {
  'Công nghệ thông tin': 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Văn học': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Kỹ năng sống': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Lịch sử & Khoa học': 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Kinh tế & Tài chính': 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
};

export default function BookTable({
  books,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Sách & Chi tiết</th>
              <th className="py-3.5 px-4">Tác giả & ISBN</th>
              <th className="py-3.5 px-4">Thể loại</th>
              <th className="py-3.5 px-4">Số lượng / Kho</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Mượn / Trả</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
            {books.map((book) => {
              const isOut = book.available_copies <= 0;
              const percent = Math.round((book.available_copies / book.quantity) * 100);
              const badgeColor = categoryColorMap[book.category] || 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
              const isLoading = actionLoadingId === book.id;

              return (
                <tr key={book.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                  {/* Title & Cover */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-lg shadow-xs shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 leading-snug">
                          {book.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Năm XB: <span className="font-medium text-slate-600 dark:text-slate-400">{book.published_year}</span>
                        </div>
                        {book.description && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                            {book.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Author & ISBN */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{book.author}</div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">{book.isbn}</div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
                      {book.category}
                    </span>
                  </td>

                  {/* Quantity & Stock Progress */}
                  <td className="py-4 px-4 min-w-[130px]">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className={isOut ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-400'}>
                        {book.available_copies} có sẵn
                      </span>
                      <span className="text-slate-400 font-normal">/ {book.quantity} cuốn</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
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
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    {book.available_copies > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Còn sách
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Hết sách
                      </span>
                    )}
                  </td>

                  {/* Quick Borrow */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => {
                        if (!isAdmin) onRequireAdmin();
                        else onBorrow(book);
                      }}
                      disabled={isOut || isLoading}
                      title={!isAdmin ? 'Cần đăng nhập Admin để mượn sách' : (isOut ? 'Đã hết sách trong kho' : 'Lập phiếu mượn sách')}
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs mx-auto"
                    >
                      {!isAdmin && <Lock className="w-3 h-3 text-slate-400" />}
                      <ArrowDownRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Mượn sách</span>
                    </button>
                  </td>

                  {/* Actions (QR / Edit / Delete) */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Xem mã QR */}
                      <button
                        onClick={() => onViewQR(book)}
                        title="Xem & in mã QR sách"
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>

                      {/* Sửa & Xóa (Admin Only) */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(book)}
                            title="Chỉnh sửa thông tin sách"
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(book)}
                            title="Xóa cuốn sách này"
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
