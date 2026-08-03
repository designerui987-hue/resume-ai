import React from 'react';

export function ATSCard() {
  return (
    <div className="w-[110px] bg-white rounded-xl border border-[#E4E4E7] p-3 shadow-md text-center select-none">
      <p className="text-[9px] font-semibold text-[#71717A] mb-2 text-left">ATS Score</p>
      
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center my-1">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[#E4E4E7]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-emerald-600"
            strokeDasharray="86, 100"
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-sm font-black text-[#18181B]">86</span>
          <span className="text-[7px] text-[#71717A] font-medium mt-0.5">/100</span>
        </div>
      </div>

      <p className="text-[8px] font-medium text-[#71717A] mt-2">Good Match</p>
    </div>
  );
}
