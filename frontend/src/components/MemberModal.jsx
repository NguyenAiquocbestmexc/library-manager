import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck } from 'lucide-react';

export default function MemberModal({ isOpen, onClose, onSubmit, member, isSubmitting }) {
  const isEditing = Boolean(member && member.id);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    card_id: '',
    email: '',
    department: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        card_id: member.card_id || '',
        email: member.email || '',
        department: member.department || '',
        notes: member.notes || ''
      });
    } else {
      const randomCardId = 'DG-' + Math.floor(1000 + Math.random() * 9000);
      setFormData({
        name: '',
        phone: '',
        card_id: randomCardId,
        email: '',
        department: 'Khoa Công Nghệ Thông Tin',
        notes: ''
      });
    }
    setErrors({});
  }, [member, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập họ và tên độc giả';
    if (!formData.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.card_id.trim()) errs.card_id = 'Vui lòng nhập mã thẻ độc giả';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      card_id: formData.card_id.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      notes: formData.notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-up my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {isEditing ? 'Cập Nhật Hồ Sơ Độc Giả' : 'Thêm Độc Giả Mới Vào Thư Viện'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? `Mã thẻ: ${member.card_id}` : 'Điền thông tin để cấp thẻ bạn đọc'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Họ Và Tên Độc Giả <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Văn An"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-850 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Số Điện Thoại <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0912 345 678"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Mã Thẻ / MSSV <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.card_id}
                onChange={(e) => setFormData({ ...formData, card_id: e.target.value })}
                placeholder="VD: DG-202401"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm font-mono transition outline-hidden dark:text-slate-100"
              />
              {errors.card_id && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.card_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="docgia@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Khoa / Lớp / Đơn Vị
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="VD: Khoa CNTT, Lớp K21..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Ghi Chú Độc Giả
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="VD: Hội viên năng nổ, bạn đọc thân thiết..."
              className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập Nhật' : 'Tạo Thẻ Độc Giả'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
