import React from 'react';
import { TrendingUp } from 'lucide-react';

export function ResumeInsights() {
  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4 select-none">
      <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
        <TrendingUp className="w-4 h-4 text-[#71717A]" />
        <span>Resume Insights</span>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        {/* Circular Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#15803D"
              strokeWidth="3"
              strokeDasharray="94"
              strokeDashoffset="13"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-xl font-bold text-[#18181B]">86</span>
            <span className="text-[9px] text-[#71717A] font-medium mt-0.5">Average Score</span>
          </div>
        </div>

        {/* Score Legend */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-[#71717A] text-[11px]">Excellent</span>
            </div>
            <span className="font-bold text-[#18181B]">6</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[#71717A] text-[11px]">Good</span>
            </div>
            <span className="font-bold text-[#18181B]">3</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[#71717A] text-[11px]">Needs Work</span>
            </div>
            <span className="font-bold text-[#18181B]">2</span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[#71717A] text-[11px]">Poor</span>
            </div>
            <span className="font-bold text-[#18181B]">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
