import React, { useState, useEffect } from 'react';
import { X, BookPlus, Image as ImageIcon, Sparkles } from 'lucide-react';

const PRESET_COVERS = [
  { label: 'Kỹ năng / Đọc sách', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80' },
  { label: 'Công nghệ / Lập trình', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&q=80' },
  { label: 'Văn học / Tiểu thuyết', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80' },
  { label: 'Khoa học / Tri thức', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80' },
  { label: 'Kinh doanh / Tài chính', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80' }
];

const SUGGESTED_CATEGORIES = [
  'Công nghệ thông tin',
  'Văn học',
  'Kỹ năng sống',
  'Lịch sử & Khoa học',
  'Kinh tế & Tài chính',
  'Thiếu nhi',
  'Tâm lý học'
];

export default function BookModal({ isOpen, onClose, onSubmit, book, isSubmitting }) {
  const isEditing = Boolean(book && book.id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Công nghệ thông tin',
    customCategory: '',
    published_year: new Date().getFullYear(),
    quantity: 5,
    cover_url: PRESET_COVERS[0].url,
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      const isCustom = !SUGGESTED_CATEGORIES.includes(book.category);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: isCustom ? '__other__' : (book.category || 'Công nghệ thông tin'),
        customCategory: isCustom ? book.category : '',
        published_year: book.published_year || new Date().getFullYear(),
        quantity: book.quantity || 1,
        cover_url: book.cover_url || PRESET_COVERS[0].url,
        description: book.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'Công nghệ thông tin',
        customCategory: '',
        published_year: new Date().getFullYear(),
        quantity: 5,
        cover_url: PRESET_COVERS[0].url,
        description: ''
      });
    }
    setErrors({});
  }, [book, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên sách';
    if (!formData.author.trim()) newErrors.author = 'Vui lòng nhập tên tác giả';
    if (!formData.isbn.trim()) newErrors.isbn = 'Vui lòng nhập mã ISBN';

    const finalCategory = formData.category === '__other__' ? formData.customCategory.trim() : formData.category;
    if (!finalCategory) newErrors.category = 'Vui lòng chọn hoặc nhập thể loại';

    if (!formData.published_year || formData.published_year < 1000 || formData.published_year > new Date().getFullYear() + 1) {
      newErrors.published_year = 'Năm xuất bản không hợp lệ';
    }

    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = 'Số lượng phải từ 1 trở lên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = formData.category === '__other__' ? formData.customCategory.trim() : formData.category;

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn.trim(),
      category: finalCategory,
      published_year: parseInt(formData.published_year, 10),
      quantity: parseInt(formData.quantity, 10),
      cover_url: formData.cover_url.trim() || PRESET_COVERS[0].url,
      description: formData.description.trim()
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Cập Nhật Thông Tin Sách' : 'Thêm Sách Mới Vào Thư Viện'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Mã sách #${book.id}` : 'Điền các thông tin để lưu sách vào cơ sở dữ liệu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tên sách */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tên Sách <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Đắc Nhân Tâm, Clean Code..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tác giả */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tác Giả <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="VD: Dale Carnegie"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
              />
              {errors.author && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.author}</p>}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mã ISBN <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="VD: 978-604-58-9123-1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm font-mono transition outline-hidden"
              />
              {errors.isbn && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.isbn}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Thể loại */}
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Thể Loại <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
              >
                {SUGGESTED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__other__">Khác (Tự nhập)...</option>
              </select>
              {formData.category === '__other__' && (
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  placeholder="Nhập tên thể loại mới..."
                  className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              )}
              {errors.category && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.category}</p>}
            </div>

            {/* Năm XB */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Năm Xuất Bản <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.published_year}
                onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
              />
              {errors.published_year && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.published_year}</p>}
            </div>

            {/* Số lượng */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tổng Số Lượng <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                min="1"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
              />
              {errors.quantity && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.quantity}</p>}
            </div>
          </div>

          {/* Link ảnh bìa & Mẫu chọn nhanh */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ảnh Bìa Sách (URL)
              </label>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Chọn mẫu bên dưới
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.cover_url}
                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs transition outline-hidden"
              />
              {formData.cover_url && (
                <img
                  src={formData.cover_url}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>
            {/* Quick preset pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setFormData({ ...formData, cover_url: preset.url })}
                  className="text-2xs px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-lg transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mô tả tóm tắt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mô Tả / Tóm Tắt Nội Dung Sách
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Giới thiệu đôi nét về cuốn sách..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm transition outline-hidden"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Đang lưu...'
                : isEditing
                ? 'Lưu Thay Đổi'
                : 'Thêm Vào Thư Viện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
