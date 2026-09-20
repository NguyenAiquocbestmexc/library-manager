import React from 'react';
import { Edit3, Trash2, ArrowDownRight, ArrowUpRight, BookOpen } from 'lucide-react';

const categoryColorMap = {
  'Công nghệ thông tin': 'bg-blue-50 text-blue-700 border-blue-200',
  'Văn học': 'bg-amber-50 text-amber-700 border-amber-200',
  'Kỹ năng sống': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lịch sử & Khoa học': 'bg-purple-50 text-purple-700 border-purple-200',
  'Kinh tế & Tài chính': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function BookTable({
  books,
  onEdit,
  onDelete,
  onBorrow,
  onReturn,
  actionLoadingId
}) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy sách phù hợp</h3>
        <p className="text-sm text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Sách & Chi tiết</th>
              <th className="py-3.5 px-4">Tác giả & ISBN</th>
              <th className="py-3.5 px-4">Thể loại</th>
              <th className="py-3.5 px-4">Số lượng / Kho</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4 text-center">Mượn / Trả</th>
              <th className="py-3.5 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {books.map((book) => {
              const isOut = book.available_copies <= 0;
              const isFull = book.available_copies >= book.quantity;
              const percent = Math.round((book.available_copies / book.quantity) * 100);
              const badgeColor = categoryColorMap[book.category] || 'bg-slate-50 text-slate-700 border-slate-200';
              const isLoading = actionLoadingId === book.id;

              return (
                <tr key={book.id} className="hover:bg-slate-50/70 transition">
                  {/* Title & Cover */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded-lg shadow-xs shrink-0 border border-slate-200 bg-slate-100"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 line-clamp-1 leading-snug">
                          {book.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Năm XB: <span className="font-medium text-slate-600">{book.published_year}</span>
                        </div>
                        {book.description && (
                          <div className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                            {book.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Author & ISBN */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{book.author}</div>
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
                      <span className={isOut ? 'text-rose-600' : 'text-emerald-700'}>
                        {book.available_copies} có sẵn
                      </span>
                      <span className="text-slate-400 font-normal">/ {book.quantity} cuốn</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Còn sách
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Hết sách
                      </span>
                    )}
                  </td>

                  {/* Quick Borrow / Return */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => onBorrow(book)}
                        disabled={isOut || isLoading}
                        title={isOut ? 'Đã hết sách trong kho' : 'Mượn 1 cuốn'}
                        className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
                      >
                        <ArrowDownRight className="w-3.5 h-3.5 text-indigo-600" />
                        Mượn
                      </button>
                      <button
                        onClick={() => onReturn(book)}
                        disabled={isFull || isLoading}
                        title={isFull ? 'Tất cả sách đã ở trong kho' : 'Trả 1 cuốn'}
                        className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                        Trả
                      </button>
                    </div>
                  </td>

                  {/* Actions (Edit / Delete) */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(book)}
                        title="Chỉnh sửa thông tin sách"
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book)}
                        title="Xóa cuốn sách này"
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
