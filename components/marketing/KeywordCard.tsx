import React from 'react';

export function KeywordCard() {
  return (
    <div className="w-[110px] bg-white rounded-xl border border-[#E4E4E7] p-3 shadow-md select-none">
      <p className="text-[8px] font-medium text-[#71717A]">Keyword Match</p>
      <div className="my-1.5">
        <span className="text-xs font-black text-[#18181B]">28</span>
        <span className="text-[8px] text-[#71717A]"> / 38</span>
        <p className="text-[7.5px] text-[#71717A] mt-0.5">Matched</p>
      </div>

      {/* Mini Bar Chart */}
      <div className="flex items-end gap-[2px] h-5 pt-1">
        <span className="w-1.5 h-full bg-emerald-600 rounded-xs" />
        <span className="w-1.5 h-[90%] bg-emerald-600 rounded-xs" />
        <span className="w-1.5 h-[80%] bg-emerald-600 rounded-xs" />
        <span className="w-1.5 h-[100%] bg-emerald-600 rounded-xs" />
        <span className="w-1.5 h-[75%] bg-amber-500 rounded-xs" />
        <span className="w-1.5 h-[40%] bg-amber-500 rounded-xs" />
        <span className="w-1.5 h-[20%] bg-[#E4E4E7] rounded-xs" />
        <span className="w-1.5 h-[15%] bg-[#E4E4E7] rounded-xs" />
      </div>
    </div>
  );
}
