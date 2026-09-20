import React, { useState } from 'react';
import { Search, X, CheckCircle, AlertTriangle, Clock, RotateCcw, Trash2, User, Phone, FileText } from 'lucide-react';

export default function BorrowTable({
  borrows = [],
  loading,
  onReturnTicket,
  onDeleteTicket,
  actionLoadingId
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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên độc giả, số điện thoại hoặc tên sách..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tất cả ({borrows.length})
          </button>
          <button
            onClick={() => setStatusFilter('BORROWED')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'BORROWED'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Đang mượn ({borrowingTotal})
          </button>
          <button
            onClick={() => setStatusFilter('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'OVERDUE'
                ? 'bg-white text-rose-700 shadow-2xs font-bold'
                : 'text-rose-600 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Quá hạn ({overdueTotal})
          </button>
          <button
            onClick={() => setStatusFilter('RETURNED')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              statusFilter === 'RETURNED'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Đã trả ({returnedTotal})
          </button>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-xs">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Đang tải danh sách phiếu mượn...</p>
        </div>
      ) : filteredBorrows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 mb-1">Không tìm thấy phiếu mượn nào</h3>
          <p className="text-sm text-slate-500">Thử đổi bộ lọc hoặc bấm "Mượn sách" ở tab Kho Sách để lập phiếu mới.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã & Sách Mượn</th>
                  <th className="py-3.5 px-4">Độc Giả & Liên Hệ</th>
                  <th className="py-3.5 px-4">Ngày Mượn & Hạn Trả</th>
                  <th className="py-3.5 px-4">Tình Trạng Hạn</th>
                  <th className="py-3.5 px-4">Ghi Chú</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredBorrows.map((ticket) => {
                  const isReturned = ticket.status === 'RETURNED';
                  const isOverdue = ticket.isOverdue && !isReturned;
                  const isLoading = actionLoadingId === ticket.id;

                  return (
                    <tr key={ticket.id} className={`transition ${isOverdue ? 'bg-rose-50/30 hover:bg-rose-50/60' : 'hover:bg-slate-50/70'}`}>
                      {/* Mã & Sách */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 mt-0.5">
                            #{ticket.id}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">
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
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {ticket.borrower_name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a href={`tel:${ticket.borrower_phone}`} className="hover:text-indigo-600 font-mono">
                            {ticket.borrower_phone}
                          </a>
                        </div>
                        {ticket.borrower_card_id && (
                          <div className="text-2xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                            Mã: {ticket.borrower_card_id}
                          </div>
                        )}
                      </td>

                      {/* Ngày mượn & Hạn trả */}
                      <td className="py-4 px-4 text-xs font-medium">
                        <div className="text-slate-500">
                          Mượn: <span className="font-semibold text-slate-800">{ticket.borrow_date}</span>
                        </div>
                        <div className="mt-1">
                          Hạn: <span className={`font-bold ${isOverdue ? 'text-rose-600 underline' : 'text-slate-800'}`}>{ticket.due_date}</span>
                        </div>
                        {isReturned && ticket.return_date && (
                          <div className="text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Đã trả: {ticket.return_date}
                          </div>
                        )}
                      </td>

                      {/* Badge Tình trạng */}
                      <td className="py-4 px-4">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Đã Hoàn Tất Trả
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Quá hạn {ticket.daysOverdue} ngày!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                            Còn {ticket.daysLeft} ngày
                          </span>
                        )}
                      </td>

                      {/* Ghi chú */}
                      <td className="py-4 px-4 max-w-xs text-xs text-slate-500">
                        {ticket.notes ? (
                          <span className="line-clamp-2 italic">"{ticket.notes}"</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isReturned ? (
                            <button
                              onClick={() => onReturnTicket(ticket)}
                              disabled={isLoading}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-200 cursor-pointer disabled:opacity-50"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Xác Nhận Trả Sách</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onDeleteTicket(ticket)}
                              disabled={isLoading}
                              title="Xóa phiếu mượn cũ"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
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
