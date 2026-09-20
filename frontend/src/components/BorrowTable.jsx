import React, { useState } from 'react';
import { Search, X, CheckCircle, AlertTriangle, Clock, RotateCcw, Trash2, User, Phone, FileText, Lock } from 'lucide-react';

export default function BorrowTable({
  borrows = [],
  loading,
  onReturnTicket,
  onDeleteTicket,
  actionLoadingId,
  isAdmin = true,
  onRequireAdmin
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter records
  const filteredBorrows = borrows.filter(ticket => {
    // Status filter
    if (statusFilter === 'BORROWED' && ticket.status !== 'BORROWED') return false;
    if (statusFilter === 'OVERDUE' && (!ticket.isOverdue || ticket.status === 'RETURNED')) return false;
    if (statusFilter === 'RETURNED' && ticket.status !== 'RETURNED') return false;

    // Search filter
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      const matchName = ticket.borrower_name?.toLowerCase().includes(term);
      const matchPhone = ticket.borrower_phone?.toLowerCase().includes(term);
      const matchBook = ticket.book_title?.toLowerCase().includes(term);
      const matchCard = ticket.borrower_card_id?.toLowerCase().includes(term);
      return matchName || matchPhone || matchBook || matchCard;
    }

    return true;
  });

  const overdueTotal = borrows.filter(b => b.isOverdue && b.status === 'BORROWED').length;
  const borrowingTotal = borrows.filter(b => b.status === 'BORROWED').length;
  const returnedTotal = borrows.filter(b => b.status === 'RETURNED').length;

  return (
    <div className="space-y-4 mb-8">
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên độc giả, số điện thoại hoặc tên sách..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 focus:bg-white dark:focus:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Tất cả ({borrows.length})
          </button>
          <button
            onClick={() => setStatusFilter('BORROWED')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'BORROWED'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-2xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Đang mượn ({borrowingTotal})
          </button>
          <button
            onClick={() => setStatusFilter('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'OVERDUE'
                ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-2xs font-bold'
                : 'text-rose-600 dark:text-rose-400 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Quá hạn ({overdueTotal})
          </button>
          <button
            onClick={() => setStatusFilter('RETURNED')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'RETURNED'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Đã trả ({returnedTotal})
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xs">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Đang tải danh sách phiếu mượn...</p>
        </div>
      ) : filteredBorrows.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Không tìm thấy phiếu mượn nào</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Thử đổi bộ lọc hoặc bấm "Mượn sách" ở tab Kho Sách để lập phiếu mới.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã & Sách Mượn</th>
                  <th className="py-3.5 px-4">Độc Giả & Liên Hệ</th>
                  <th className="py-3.5 px-4">Ngày Mượn & Hạn Trả</th>
                  <th className="py-3.5 px-4">Tình Trạng Hạn</th>
                  <th className="py-3.5 px-4">Ghi Chú</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {filteredBorrows.map((ticket) => {
                  const isReturned = ticket.status === 'RETURNED';
                  const isOverdue = ticket.isOverdue && !isReturned;
                  const isLoading = actionLoadingId === ticket.id;

                  return (
                    <tr key={ticket.id} className={`transition ${isOverdue ? 'bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/40' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'}`}>
                      {/* Mã & Sách */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mt-0.5">
                            #{ticket.id}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                              {ticket.book_title}
                            </div>
                            <div className="text-2xs text-slate-400 mt-0.5">
                              ID Sách: #{ticket.book_id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Độc giả */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {ticket.borrower_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`tel:${ticket.borrower_phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-mono">
                            {ticket.borrower_phone}
                          </a>
                        </div>
                        {ticket.borrower_card_id && (
                          <div className="text-2xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-md inline-block mt-1 border border-indigo-100 dark:border-indigo-900/40">
                            Mã: {ticket.borrower_card_id}
                          </div>
                        )}
                      </td>

                      {/* Ngày mượn & Hạn trả */}
                      <td className="py-4 px-4 text-xs font-medium">
                        <div className="text-slate-500 dark:text-slate-400">
                          Mượn: <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.borrow_date}</span>
                        </div>
                        <div className="mt-1">
                          Hạn: <span className={`font-bold ${isOverdue ? 'text-rose-600 dark:text-rose-400 underline' : 'text-slate-800 dark:text-slate-200'}`}>{ticket.due_date}</span>
                        </div>
                        {isReturned && ticket.return_date && (
                          <div className="text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Đã trả: {ticket.return_date}
                          </div>
                        )}
                      </td>

                      {/* Badge Tình trạng */}
                      <td className="py-4 px-4">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            Đã Hoàn Tất Trả
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            Quá hạn {ticket.daysOverdue} ngày!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            Còn {ticket.daysLeft} ngày
                          </span>
                        )}
                      </td>

                      {/* Ghi chú */}
                      <td className="py-4 px-4 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                        {ticket.notes ? (
                          <span className="line-clamp-2 italic">"{ticket.notes}"</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-600">—</span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isReturned ? (
                            <button
                              onClick={() => {
                                if (!isAdmin && onRequireAdmin) {
                                  onRequireAdmin();
                                } else {
                                  onReturnTicket(ticket);
                                }
                              }}
                              disabled={isLoading}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-200 dark:shadow-none cursor-pointer disabled:opacity-50"
                            >
                              {!isAdmin && <Lock className="w-3 h-3 opacity-70" />}
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Xác Nhận Trả Sách</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!isAdmin && onRequireAdmin) {
                                  onRequireAdmin();
                                } else {
                                  onDeleteTicket(ticket);
                                }
                              }}
                              disabled={isLoading}
                              title={isAdmin ? "Xóa phiếu mượn cũ" : "Cần quyền Admin để xóa"}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      )}
    </div>
  );
}
