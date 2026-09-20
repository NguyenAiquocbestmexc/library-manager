import React, { useState } from 'react';
import { Search, X, UserPlus, History, Edit3, Trash2, ShieldCheck, AlertTriangle, Phone, Mail, Award, Users } from 'lucide-react';

export default function MembersTable({
  members = [],
  loading,
  onOpenAddModal,
  onEditMember,
  onDeleteMember,
  onViewHistory,
  isAdmin
}) {
  const [search, setSearch] = useState('');

  const filteredMembers = members.filter(m => {
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.phone.toLowerCase().includes(term) ||
      m.card_id.toLowerCase().includes(term) ||
      (m.department && m.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-4 mb-8">
      {/* Search & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên độc giả, số điện thoại, mã thẻ, đơn vị..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/80 focus:bg-white dark:focus:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded-xl text-sm transition outline-hidden dark:text-slate-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add Member Button (Only Admin) */}
        {isAdmin && (
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Độc Giả Mới</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-xs">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-500">Đang tải danh sách độc giả...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">Không tìm thấy độc giả nào</h3>
          <p className="text-sm text-slate-500">Hãy thử đổi từ khóa tìm kiếm hoặc thêm bạn đọc mới.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Độc Giả & Mã Thẻ</th>
                  <th className="py-3.5 px-4">Liên Hệ & Đơn Vị</th>
                  <th className="py-3.5 px-4">Tình Trạng Mượn</th>
                  <th className="py-3.5 px-4">Điểm Uy Tín</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {filteredMembers.map((member) => {
                  const hasOverdue = member.overdueCount > 0;
                  const score = member.reputationScore || 100;

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      {/* Tên & Mã thẻ */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                          {member.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                            {member.card_id}
                          </span>
                          <span className="text-2xs text-slate-400">
                            Ngày cấp: {member.joined_date}
                          </span>
                        </div>
                      </td>

                      {/* SĐT & Đơn vị */}
                      <td className="py-4 px-4 text-xs">
                        <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${member.phone}`} className="hover:text-indigo-600 font-mono">
                            {member.phone}
                          </a>
                        </div>
                        {member.email && (
                          <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        <div className="text-2xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                          {member.department || 'Bạn đọc tự do'}
                        </div>
                      </td>

                      {/* Tình trạng mượn */}
                      <td className="py-4 px-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-700 dark:text-slate-300">
                            Đang mượn: <b className="text-indigo-600 dark:text-indigo-400">{member.activeBorrowsCount}</b> cuốn
                          </span>
                        </div>
                        {hasOverdue ? (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              Quá hạn {member.overdueCount} cuốn!
                            </span>
                          </div>
                        ) : (
                          <div className="text-2xs text-emerald-600 dark:text-emerald-400 mt-1">
                            ✓ Không có sách trễ hạn
                          </div>
                        )}
                      </td>

                      {/* Điểm Uy Tín */}
                      <td className="py-4 px-4 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className={score >= 90 ? 'text-emerald-600 dark:text-emerald-400' : score >= 75 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'}>
                            {score}/100
                          </span>
                          <span className="text-2xs font-semibold text-slate-500 dark:text-slate-400">
                            {member.reputationRank}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              score >= 90
                                ? 'bg-emerald-500'
                                : score >= 75
                                ? 'bg-blue-500'
                                : score >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewHistory(member)}
                            title="Xem lịch sử mượn trả"
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition cursor-pointer"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() => onEditMember(member)}
                                title="Sửa thông tin độc giả"
                                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onDeleteMember(member)}
                                title="Xóa hồ sơ độc giả"
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
