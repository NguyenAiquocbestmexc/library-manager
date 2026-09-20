import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, bookTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            {title || 'Xác nhận xóa sách'}
          </h3>

          <p className="text-sm text-slate-600 mb-3">
            {message || 'Bạn có chắc chắn muốn xóa cuốn sách này khỏi hệ thống thư viện? Thao tác này không thể hoàn tác.'}
          </p>

          {bookTitle && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 mb-6 line-clamp-2">
              📖 {bookTitle}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-rose-200 transition disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? 'Đang xóa...' : 'Đồng ý Xóa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
