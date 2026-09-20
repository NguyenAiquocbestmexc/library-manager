import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mật khẩu mặc định là admin123
    if (password === 'admin123') {
      onLoginSuccess();
      onClose();
      setPassword('');
      setError('');
    } else {
      setError('Mật khẩu không chính xác! (Gợi ý: admin123)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          Đăng Nhập Quản Trị Viên
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Chỉ Thủ thư có mật khẩu mới có quyền Thêm, Sửa, Xóa và Lập phiếu mượn trả sách.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Mật khẩu Quản Trị
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
          </div>

          <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl text-2xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-600" />
            <span>Mật khẩu mặc định hệ thống: <b>admin123</b></span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition cursor-pointer"
            >
              Đăng Nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
