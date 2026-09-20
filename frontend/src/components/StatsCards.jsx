import React from 'react';
import { Book, Layers, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const overdueCount = stats.overdueCount || 0;

  const cards = [
    {
      title: 'Tổng đầu sách',
      value: stats.totalTitles || 0,
      unit: 'tựa sách',
      icon: Book,
      iconBg: 'bg-indigo-600 text-white'
    },
    {
      title: 'Tổng bản in',
      value: stats.totalCopies || 0,
      unit: 'cuốn trong kho',
      icon: Layers,
      iconBg: 'bg-sky-600 text-white'
    },
    {
      title: 'Sẵn sàng trong kho',
      value: stats.availableCopies || 0,
      unit: 'cuốn có sẵn',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'Đang cho mượn',
      value: stats.borrowedCopies || 0,
      unit: 'cuốn đang mượn',
      icon: Users,
      iconBg: 'bg-amber-600 text-white'
    },
    {
      title: 'Phiếu quá hạn',
      value: overdueCount,
      unit: overdueCount > 0 ? 'cần thu hồi gấp' : 'không có phiếu trễ',
      icon: AlertTriangle,
      iconBg: overdueCount > 0 ? 'bg-rose-600 text-white animate-bounce' : 'bg-slate-300 dark:bg-slate-700 text-white',
      isOverdue: overdueCount > 0
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
              card.isOverdue
                ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 ring-2 ring-rose-100 dark:ring-rose-950'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider ${card.isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-black tracking-tight ${card.isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {card.value.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {card.unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
