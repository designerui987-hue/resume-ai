import React from 'react';

export function Divider() {
  return (
    <div className="relative flex items-center my-6">
      <div className="flex-grow border-t border-[#E4E4E7]" />
      <span className="shrink-0 px-3 text-[11px] font-medium text-[#71717A] bg-white uppercase tracking-wider">
        or
      </span>
      <div className="flex-grow border-t border-[#E4E4E7]" />
    </div>
  );
}
