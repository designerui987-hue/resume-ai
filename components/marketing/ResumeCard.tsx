import React from 'react';

export function ResumeCard() {
  return (
    <div className="w-[280px] bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-md text-[10px] leading-tight select-none">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-bold text-xs text-[#18181B] tracking-tight">ALEX MORGAN</h3>
        <p className="text-[9px] text-[#71717A] font-medium mt-0.5">Senior Product Designer</p>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[8px] text-[#71717A] mt-1.5 opacity-90">
          <span>alex.morgan@email.com</span>
          <span>+1 (555) 123-4567</span>
          <span>San Francisco, CA</span>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-[#E4E4E7] pt-2 mb-3">
        <h4 className="font-bold text-[8px] text-[#18181B] tracking-widest uppercase mb-1">
          Professional Summary
        </h4>
        <p className="text-[8px] text-[#71717A] leading-relaxed">
          Product designer with 6+ years of experience designing intuitive digital products for SaaS companies. Passionate about solving complex problems and creating delightful user experiences.
        </p>
      </div>

      {/* Experience */}
      <div className="border-t border-[#E4E4E7] pt-2">
        <h4 className="font-bold text-[8px] text-[#18181B] tracking-widest uppercase mb-1">
          Experience
        </h4>
        <div className="flex justify-between items-center text-[8px]">
          <span className="font-bold text-[#18181B]">Senior Product Designer</span>
          <span className="text-[#71717A]">2021 – Present</span>
        </div>
        <p className="text-[8px] text-[#71717A] font-medium mb-1">Acme Inc.</p>
        <ul className="space-y-1 text-[7.5px] text-[#71717A] leading-normal pl-2">
          <li>• Led the design of a SaaS platform used by 100K+ users daily.</li>
          <li>• Collaborated with product managers and engineers to ship features that improve user engagement and retention.</li>
        </ul>
      </div>
    </div>
  );
}
