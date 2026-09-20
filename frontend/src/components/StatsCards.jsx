import React from 'react';
import { Book, Layers, Users, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Tổng đầu sách',
      value: stats.totalTitles || 0,
      unit: 'tựa sách',
      icon: Book,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white'
    },
    {
      title: 'Tổng bản in',
      value: stats.totalCopies || 0,
      unit: 'cuốn sách',
      icon: Layers,
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-100',
      iconBg: 'bg-sky-600 text-white'
    },
    {
      title: 'Sẵn sàng trong kho',
      value: stats.availableCopies || 0,
      unit: 'cuốn có sẵn',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white'
    },
    {
      title: 'Đang cho mượn',
      value: stats.borrowedCopies || 0,
      unit: 'cuốn đã mượn',
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-600 text-white'
    },
    {
      title: 'Tạm hết sách',
      value: stats.outOfStockTitles || 0,
      unit: 'tựa hết',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-600 text-white'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border bg-white shadow-xs transition hover:shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
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
