import React, { useState, useEffect } from 'react';
import { X, UserCheck, Calendar, BookOpen, Clock, AlertCircle, Users } from 'lucide-react';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function addDaysStr(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export default function BorrowModal({ isOpen, onClose, onSubmit, book, isSubmitting, members = [] }) {
  const [formData, setFormData] = useState({
    borrower_name: '',
    borrower_phone: '',
    borrower_card_id: '',
    borrow_date: getTodayStr(),
    due_date: addDaysStr(14),
    presetDays: 14,
    notes: '',
    selectedMemberId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        borrower_name: '',
        borrower_phone: '',
        borrower_card_id: '',
        borrow_date: getTodayStr(),
        due_date: addDaysStr(14),
        presetDays: 14,
        notes: '',
        selectedMemberId: ''
      });
      setErrors({});
    }
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  const handleSelectPreset = (days) => {
    setFormData(prev => ({
      ...prev,
      presetDays: days,
      due_date: addDaysStr(days)
    }));
  };

  const handleMemberSelect = (memberId) => {
    if (!memberId) {
      setFormData(prev => ({
        ...prev,
        selectedMemberId: '',
        borrower_name: '',
        borrower_phone: '',
        borrower_card_id: ''
      }));
      return;
    }

    const member = members.find(m => String(m.id) === String(memberId));
    if (member) {
      setFormData(prev => ({
        ...prev,
        selectedMemberId: memberId,
        borrower_name: member.name,
        borrower_phone: member.phone,
        borrower_card_id: member.card_id
      }));
    }
  };

  const selectedMember = members.find(m => String(m.id) === String(formData.selectedMemberId));

  const validate = () => {
    const errs = {};
    if (!formData.borrower_name.trim()) errs.borrower_name = 'Vui lòng nhập họ và tên người mượn';
    if (!formData.borrower_phone.trim()) errs.borrower_phone = 'Vui lòng nhập số điện thoại để liên lạc';
    if (!formData.due_date) errs.due_date = 'Vui lòng chọn hạn trả sách';
    if (formData.due_date < formData.borrow_date) errs.due_date = 'Hạn trả không thể trước ngày mượn';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      book_id: book.id,
      borrower_name: formData.borrower_name.trim(),
      borrower_phone: formData.borrower_phone.trim(),
      borrower_card_id: formData.borrower_card_id.trim(),
      borrow_date: formData.borrow_date,
      due_date: formData.due_date,
      notes: formData.notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Lập Phiếu Mượn Sách</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ghi nhận thông tin độc giả và thời hạn mượn sách</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Book Info Card */}
        <div className="mx-6 mt-5 p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl flex items-center gap-3.5">
          <img
            src={book.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'}
            alt={book.title}
            className="w-12 h-16 object-cover rounded-lg shadow-xs border border-indigo-200/60 dark:border-indigo-800 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
              {book.category}
            </div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 mt-0.5">
              {book.title}
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tác giả: <span className="font-medium text-slate-700 dark:text-slate-300">{book.author}</span>
            </div>
            <div className="text-2xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              ✓ Sẵn sàng trong kho: {book.available_copies}/{book.quantity} cuốn
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Chọn nhanh độc giả có sẵn */}
          {members.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <label className="block text-2xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Chọn nhanh bạn đọc đã có thẻ thư viện:</span>
              </label>
              <select
                value={formData.selectedMemberId}
                onChange={(e) => handleMemberSelect(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="">-- Tự nhập độc giả mới hoặc chọn từ danh sách --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.card_id}) - {m.phone}
                  </option>
                ))}
              </select>

              {selectedMember && selectedMember.overdueCount > 0 && (
                <div className="mt-2 text-2xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cảnh báo: Độc giả này đang có {selectedMember.overdueCount} cuốn sách quá hạn chưa trả!</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tên độc giả */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tên Độc Giả <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.borrower_name}
                onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
              {errors.borrower_name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.borrower_name}</p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Số Điện Thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.borrower_phone}
                onChange={(e) => setFormData({ ...formData, borrower_phone: e.target.value })}
                placeholder="VD: 0912 345 678"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
              {errors.borrower_phone && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.borrower_phone}</p>
              )}
            </div>
          </div>

          {/* Mã thẻ độc giả */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Mã Thẻ / MSSV / Lớp (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.borrower_card_id}
              onChange={(e) => setFormData({ ...formData, borrower_card_id: e.target.value })}
              placeholder="VD: SV2024-001 hoặc DG-012"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
            />
          </div>

          {/* Ngày mượn & Hạn trả */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Ngày Mượn
              </label>
              <input
                type="date"
                value={formData.borrow_date}
                onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Hạn Trả Sách <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value, presetDays: null })}
                min={formData.borrow_date}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
              {errors.due_date && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.due_date}</p>
              )}
            </div>
          </div>

          {/* Quick preset due dates */}
          <div>
            <span className="text-2xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
              Chọn nhanh thời hạn mượn:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { days: 7, label: '7 ngày (1 tuần)' },
                { days: 14, label: '14 ngày (2 tuần - Chuẩn)' },
                { days: 30, label: '30 ngày (1 tháng)' }
              ].map(preset => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => handleSelectPreset(preset.days)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition cursor-pointer border ${
                    formData.presetDays === preset.days
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Ghi Chú Tình Trạng Sách / Tiền Cọc (Nếu có)
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="VD: Sách mới 100%, có cọc thẻ sinh viên..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang tạo phiếu...' : 'Xác Nhận Lập Phiếu Mượn'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
