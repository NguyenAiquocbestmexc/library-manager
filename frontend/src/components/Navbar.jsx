import React from 'react';
import {
  BookOpen,
  Plus,
  RefreshCw,
  Layers,
  FileText,
  Users,
  BarChart3,
  QrCode,
  Moon,
  Sun,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenQRScanner,
  onRefresh,
  loading,
  overdueCount = 0,
  activeBorrowsCount = 0,
  darkMode,
  setDarkMode,
  isAdmin,
  onOpenLoginModal,
  onLogout
}) {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none shrink-0">
              <BookOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Thư Viện Tri Thức
                </h1>
                {isAdmin ? (
                  <span className="hidden lg:inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Thủ Thư (Admin)
                  </span>
                ) : (
                  <span className="hidden lg:inline-flex text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Khách / Bạn Đọc
                  </span>
                )}
              </div>
              <p className="text-2xs text-slate-400 hidden md:block">
                Hệ thống số hóa kho sách, mượn trả & quản lý độc giả
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Center) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'books'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Kho Sách</span>
            </button>

            <button
              onClick={() => setActiveTab('borrows')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer relative ${
                activeTab === 'borrows'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Phiếu Mượn</span>
              {overdueCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-2xs font-bold bg-rose-500 text-white animate-pulse">
                  {overdueCount} trễ
                </span>
              ) : activeBorrowsCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-2xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {activeBorrowsCount}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Độc Giả</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Báo Cáo</span>
            </button>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Camera QR Scanner */}
            <button
              onClick={onOpenQRScanner}
              title="Bật camera quét mã QR sách"
              className="p-2 sm:px-2.5 sm:py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden xl:inline">Quét QR</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
              className="p-2 text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Làm mới dữ liệu"
              className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {/* Admin Login / Logout */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAddModal}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Thêm Sách</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Đăng xuất quyền Admin"
                  className="p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs (Row below for mobile) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-1 px-2.5 rounded-lg ${activeTab === 'books' ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-500'}`}
          >
            Kho Sách
          </button>
          <button
            onClick={() => setActiveTab('borrows')}
            className={`py-1 px-2.5 rounded-lg flex items-center gap-1 ${activeTab === 'borrows' ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-500'}`}
          >
            Phiếu Mượn {overdueCount > 0 && `(${overdueCount}!)`}
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`py-1 px-2.5 rounded-lg ${activeTab === 'members' ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-500'}`}
          >
            Độc Giả
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-1 px-2.5 rounded-lg ${activeTab === 'reports' ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-500'}`}
          >
            Báo Cáo
          </button>
        </div>
      </div>
    </header>
  );
}
