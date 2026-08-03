import React, { useState, useEffect } from 'react';
import { Clock, FileText, Download, CheckCircle2, Edit3, Copy, Trash2 } from 'lucide-react';
import { getActivityLogs, ActivityLogEntry } from '@/lib/activityLogger';

const iconMap = {
  created: { icon: FileText, bg: 'bg-emerald-50 text-emerald-600', label: 'Created' },
  edited: { icon: Edit3, bg: 'bg-blue-50 text-blue-600', label: 'Updated' },
  ats_scan: { icon: CheckCircle2, bg: 'bg-amber-50 text-amber-600', label: 'ATS Check completed' },
  downloaded: { icon: Download, bg: 'bg-[#FAFAF9] text-[#18181B] border border-[#E4E4E7]', label: 'Downloaded' },
  duplicated: { icon: Copy, bg: 'bg-purple-50 text-purple-600', label: 'Duplicated' },
  deleted: { icon: Trash2, bg: 'bg-rose-50 text-rose-600', label: 'Deleted' },
};

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 2) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);

  const loadLogs = () => {
    const logs = getActivityLogs();
    // Sort newest activity first
    const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setActivities(sorted.slice(0, 5));
  };

  useEffect(() => {
    loadLogs();
    window.addEventListener('activity_logged', loadLogs);
    return () => window.removeEventListener('activity_logged', loadLogs);
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
        <Clock className="w-4 h-4 text-[#71717A]" />
        <span>Recent Activity</span>
      </div>

      <div className="space-y-3 pt-1">
        {activities.map((act) => {
          const config = iconMap[act.type] || iconMap.edited;
          const Icon = config.icon;
          const timeText = `${config.label} ${formatRelativeTime(act.timestamp)}`;

          return (
            <div key={act.id} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#18181B] truncate">{act.title}</h4>
                <p className="text-[11px] text-[#71717A]">{timeText}</p>
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
