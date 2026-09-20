import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Users
} from 'lucide-react';
import {
  exportBooksToCSV,
  exportBorrowsToCSV,
  exportMembersToCSV,
  parseCSVToBooks
} from '../utils/exportExcel';
import { fetchAnalyticsReport, createBook } from '../services/api';

export default function ReportsView({ books = [], borrows = [], members = [], onRefreshAll, showToast, isAdmin }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetchAnalyticsReport();
      if (res.success) setAnalytics(res.data);
    } catch (err) {
      console.error('Lỗi tải báo cáo phân tích:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setImporting(true);
        const text = event.target.result;
        const parsedBooks = parseCSVToBooks(text);
        if (parsedBooks.length === 0) {
          showToast('File CSV không chứa dữ liệu sách hợp lệ!', 'error');
          return;
        }

        let successCount = 0;
        for (const b of parsedBooks) {
          try {
            await createBook(b);
            successCount++;
          } catch (_) {
            // Bỏ qua nếu trùng ISBN
          }
        }

        showToast(`Đã nạp thành công ${successCount}/${parsedBooks.length} cuốn sách từ file CSV!`, 'success');
        onRefreshAll();
        loadAnalytics();
      } catch (err) {
        showToast(err.message || 'Lỗi đọc file CSV!', 'error');
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Export & Import Action Cards */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Xuất & Nhập Dữ Liệu Excel / CSV
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tải về các bảng báo cáo chuẩn định dạng Excel (hỗ trợ tiếng Việt 100%)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Xuất Kho Sách */}
          <button
            onClick={() => {
              exportBooksToCSV(books);
              showToast('Đã tải xuống file Excel danh sách kho sách!', 'success');
            }}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition">
                Xuất Kho Sách
              </div>
              <div className="text-2xs text-slate-400">
                Toàn bộ {books.length} đầu sách
              </div>
            </div>
          </button>

          {/* Xuất Báo Cáo Quá Hạn */}
          <button
            onClick={() => {
              exportBorrowsToCSV(borrows, true);
              showToast('Đã tải xuống danh sách phiếu sách quá hạn!', 'success');
            }}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition">
                Báo Cáo Quá Hạn
              </div>
              <div className="text-2xs text-slate-400">
                Danh sách cần thu hồi
              </div>
            </div>
          </button>

          {/* Xuất Danh Sách Độc Giả */}
          <button
            onClick={() => {
              exportMembersToCSV(members);
              showToast('Đã tải xuống danh sách độc giả!', 'success');
            }}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition">
                Xuất DS Độc Giả
              </div>
              <div className="text-2xs text-slate-400">
                Kèm điểm uy tín
              </div>
            </div>
          </button>

          {/* Nhập Sách Bằng CSV (Only Admin) */}
          {isAdmin && (
            <label className="p-3.5 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition flex items-center gap-3 text-left cursor-pointer group">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={importing}
                className="hidden"
              />
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  {importing ? 'Đang nạp dữ liệu...' : 'Nhập Sách Bằng CSV'}
                </div>
                <div className="text-2xs text-slate-400">
                  Tải lên file danh sách sách
                </div>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Analytics Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Cơ Cấu Sách Theo Thể Loại
            </h4>
          </div>

          <div className="space-y-3.5">
            {analytics?.categoryDistribution?.map((cat, idx) => {
              const total = analytics.totalCopies || 1;
              const percent = Math.round((cat.copies / total) * 100);
              const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
              const barColor = colors[idx % colors.length];

              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700 dark:text-slate-300">{cat.category}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {cat.copies} cuốn ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Most Borrowed Books */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Top 5 Tác Phẩm Được Mượn Nhiều Nhất
            </h4>
          </div>

          <div className="space-y-3">
            {analytics?.topBorrowedBooks?.length > 0 ? (
              analytics.topBorrowedBooks.map((book, idx) => (
                <div
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1">
                      {book.title}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 pl-2">
                    {book.borrowCount} lượt mượn
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Chưa có lượt mượn nào được ghi nhận</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
