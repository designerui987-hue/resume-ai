import React from 'react';
import { FileText, CheckCircle2, TrendingUp, Download } from 'lucide-react';

export function StatsCard() {
  const stats = [
    { label: 'Total Resumes', value: '12', icon: FileText, iconBg: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'ATS Optimized', value: '9', icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Average Score', value: '86', icon: TrendingUp, iconBg: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Total Downloads', value: '28', icon: Download, iconBg: 'bg-blue-50 text-blue-600 border-blue-100' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="p-4 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs flex items-center gap-4 hover:-translate-y-0.5 transition-transform"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#18181B] tracking-tight">{stat.value}</span>
              <p className="text-[11px] font-medium text-[#71717A]">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
