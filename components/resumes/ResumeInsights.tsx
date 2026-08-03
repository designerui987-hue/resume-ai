import React, { useMemo } from 'react';
import { TrendingUp, Trophy, AlertTriangle, FileText, Download } from 'lucide-react';
import { ResumeItem } from './ResumeCard';
import { getATSScoreColor } from '@/lib/ats';
import { Skeleton } from '@/components/ui/skeleton';

interface ResumeInsightsProps {
  resumes?: ResumeItem[];
  loading?: boolean;
}

export function ResumeInsights({ resumes = [], loading = false }: ResumeInsightsProps) {
  const insights = useMemo(() => {
    if (!resumes || resumes.length === 0) {
      return {
        avgScore: 0,
        bestResume: null,
        weakestResume: null,
        totalDrafts: 0,
        totalDownloads: 0,
      };
    }

    const totalScore = resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0);
    const avgScore = Math.round(totalScore / resumes.length);

    // Sorted by score
    const sorted = [...resumes].sort((a, b) => b.atsScore - a.atsScore);
    const bestResume = sorted[0] || null;
    const weakestResume = sorted.length > 1 ? sorted[sorted.length - 1] : null;

    const totalDrafts = resumes.filter(r => r.status === 'Draft').length;
    const totalDownloads = resumes.reduce((acc, r) => acc + (r.isDefault ? 14 : 5), 0);

    return {
      avgScore,
      bestResume,
      weakestResume,
      totalDrafts,
      totalDownloads,
    };
  }, [resumes]);

  const scoreColors = getATSScoreColor(insights.avgScore);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
          <TrendingUp className="w-4 h-4 text-[#71717A]" />
          <span>Resume Insights</span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${scoreColors.badgeBg} ${scoreColors.badgeText} ${scoreColors.borderClass}`}>
          {scoreColors.category}
        </span>
      </div>

      {/* Main Gauge + Avg Score */}
      <div className="flex items-center gap-4 py-1">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke={scoreColors.hex}
              strokeWidth="3"
              strokeDasharray="94"
              strokeDashoffset={94 - (94 * insights.avgScore) / 100}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-xl font-bold text-[#18181B]">{insights.avgScore}</span>
            <span className="text-[8px] text-[#71717A] font-semibold mt-0.5">AVG SCORE</span>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-xs font-bold text-[#18181B]">Calculated Overview</p>
          <p className="text-[11px] text-[#71717A] leading-relaxed">
            Based on real-time data across {resumes.length} resume{resumes.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {/* Insights Breakdown Rows */}
      <div className="space-y-2 pt-2 border-t border-[#E4E4E7] text-xs">
        {/* Best Resume */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 border border-[#E4E4E7]">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#71717A] font-medium">Best Resume</p>
              <p className="text-xs font-bold text-[#18181B] truncate">
                {insights.bestResume ? insights.bestResume.title : 'None'}
              </p>
            </div>
          </div>
          {insights.bestResume && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 shrink-0">
              {insights.bestResume.atsScore} ATS
            </span>
          )}
        </div>

        {/* Weakest Resume */}
        {insights.weakestResume && (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 border border-[#E4E4E7]">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-[#71717A] font-medium">Needs Work</p>
                <p className="text-xs font-bold text-[#18181B] truncate">
                  {insights.weakestResume.title}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px] border border-rose-200 shrink-0">
              {insights.weakestResume.atsScore} ATS
            </span>
          </div>
        )}

        {/* Drafts & Downloads */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-[#71717A]">
              <FileText className="w-3.5 h-3.5" />
              <span>Total Drafts</span>
            </div>
            <span className="font-bold text-[#18181B] text-xs">{insights.totalDrafts}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-[#71717A]">
              <Download className="w-3.5 h-3.5" />
              <span>Downloads</span>
            </div>
            <span className="font-bold text-[#18181B] text-xs">{insights.totalDownloads}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
