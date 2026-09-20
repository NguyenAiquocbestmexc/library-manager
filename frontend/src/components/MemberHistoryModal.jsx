import React from 'react';
import { X, History, CheckCircle, AlertTriangle, Clock, BookOpen } from 'lucide-react';

export default function MemberHistoryModal({ isOpen, onClose, memberData, loading }) {
  if (!isOpen || !memberData) return null;

  const { member, history = [] } = memberData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Lịch Sử Mượn Trả: {member.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mã thẻ: <span className="font-mono font-semibold">{member.card_id}</span> • SĐT: {member.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-slate-500">Đang tải lịch sử...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Chưa có lịch sử mượn sách</p>
              <p className="text-xs text-slate-400">Độc giả này chưa từng lập phiếu mượn sách nào trong hệ thống.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => {
                const isReturned = record.status === 'RETURNED';
                const today = new Date().toISOString().split('T')[0];
                const isOverdue = !isReturned && record.due_date < today;

                return (
                  <div
                    key={record.id}
                    className={`p-4 rounded-2xl border transition ${
                      isOverdue
                        ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/20'
                        : isReturned
                        ? 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-850/40'
                        : 'border-indigo-200 bg-indigo-50/30 dark:border-indigo-900/40 dark:bg-indigo-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-2xs font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mr-2">
                          #{record.id}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {record.book_title}
                        </span>
                      </div>
                      <div>
                        {isReturned ? (
                          <span className="text-2xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Đã trả
                          </span>
                        ) : isOverdue ? (
                          <span className="text-2xs px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Đang quá hạn!
                          </span>
                        ) : (
                          <span className="text-2xs px-2.5 py-1 rounded-full font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Đang mượn
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        Ngày mượn: <span className="font-semibold text-slate-800 dark:text-slate-200">{record.borrow_date}</span>
                      </div>
                      <div>
                        Hạn trả: <span className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>{record.due_date}</span>
                      </div>
                      {isReturned && (
                        <div>
                          Ngày trả: <span className="font-semibold text-emerald-600">{record.return_date || '—'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-right bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
