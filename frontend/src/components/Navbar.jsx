import React from 'react';
import { BookOpen, Plus, RefreshCw, Layers, FileText, AlertTriangle } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onRefresh,
  loading,
  overdueCount = 0,
  activeBorrowsCount = 0
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & App Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Thư Viện Tri Thức
                <span className="hidden md:inline-block text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Quản Lý Nghiệp Vụ
                </span>
              </h1>
              <p className="text-2xs text-slate-400 hidden sm:block">
                Hệ thống số hóa kho sách & quản lý mượn trả độc giả
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Center) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'books'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Kho Sách</span>
            </button>

            <button
              onClick={() => setActiveTab('borrows')}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'borrows'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Phiếu Mượn Trả</span>
              {overdueCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-2xs font-bold bg-rose-500 text-white animate-pulse" title={`${overdueCount} phiếu quá hạn!`}>
                  {overdueCount} trễ
                </span>
              ) : activeBorrowsCount > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full text-2xs font-bold bg-slate-200 text-slate-700">
                  {activeBorrowsCount}
                </span>
              ) : null}
            </button>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Làm mới dữ liệu"
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 text-xs sm:text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden md:inline">Làm mới</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="px-3 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium text-xs sm:text-sm shadow-md shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Thêm Sách Mới</span>
              <span className="sm:hidden">Thêm</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
