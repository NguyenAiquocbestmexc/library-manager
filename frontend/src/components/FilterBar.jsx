import React from 'react';
import { Search, X, Filter, LayoutGrid, LayoutList, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  status,
  setStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode
}) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên sách, tác giả hoặc ISBN..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 focus:bg-white dark:focus:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            title="Chế độ Bảng"
            className={`p-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">Bảng</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Chế độ Thẻ (Lưới)"
            className={`p-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Lưới thẻ</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
            >
              <option value="Tất cả">Tất cả thể loại</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatus('ALL')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                status === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatus('AVAILABLE')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                status === 'AVAILABLE'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Còn sách
            </button>
            <button
              onClick={() => setStatus('OUT_OF_STOCK')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                status === 'OUT_OF_STOCK'
                  ? 'bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-2xs font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Hết sách
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            <option value="id">Thứ tự thêm (Mới nhất)</option>
            <option value="title">Tên sách (A-Z)</option>
            <option value="author">Tác giả</option>
            <option value="published_year">Năm xuất bản</option>
            <option value="quantity">Tổng số lượng</option>
            <option value="available_copies">Số lượng còn lại</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
            title={sortOrder === 'ASC' ? 'Tăng dần' : 'Giảm dần'}
            className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
          >
            {sortOrder === 'ASC' ? '↑ Tăng' : '↓ Giảm'}
          </button>
        </div>
      </div>
    </div>
  );
}
