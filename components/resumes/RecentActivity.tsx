import React from 'react';
import { Clock, FileText, Download, CheckCircle2, Edit3 } from 'lucide-react';

export function RecentActivity() {
  const activities = [
    { title: 'Senior Frontend Developer', text: 'Updated 2 hours ago', icon: FileText, bg: 'bg-emerald-50 text-emerald-600' },
    { title: 'Product Manager', text: 'Downloaded 2 days ago', icon: Download, bg: 'bg-[#FAFAF9] text-[#18181B] border border-[#E4E4E7]' },
    { title: 'Full Stack Developer', text: 'ATS Check completed', icon: CheckCircle2, bg: 'bg-amber-50 text-amber-600' },
    { title: 'UI/UX Designer', text: 'Edited 1 week ago', icon: Edit3, bg: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
        <Clock className="w-4 h-4 text-[#71717A]" />
        <span>Recent Activity</span>
      </div>

      <div className="space-y-3 pt-1">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.title} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.bg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#18181B] truncate">{act.title}</h4>
                <p className="text-[11px] text-[#71717A]">{act.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-2 rounded-xl border border-[#E4E4E7] text-xs font-semibold text-[#18181B] hover:bg-zinc-50 transition-colors cursor-pointer mt-2">
        View All Activity
      </button>
    </div>
  );
}
