import React from 'react';
import { Lightbulb, Check } from 'lucide-react';

export function TipsCard() {
  const tips = [
    'Tailor your resume for each job',
    'Add more quantifiable achievements',
    'Include relevant keywords',
    'Keep your resume concise',
    'Ensure proper formatting',
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-[#18181B]">
        <Lightbulb className="w-4 h-4 text-[#71717A]" />
        <span>Pro Tips</span>
      </div>

      <div className="space-y-2 text-xs text-[#71717A]">
        {tips.map((tip) => (
          <div key={tip} className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#18181B] shrink-0 font-bold" />
            <span>{tip}</span>
          </div>
        ))}
      </div>

      <button className="w-full py-2 rounded-xl border border-[#E4E4E7] text-xs font-semibold text-[#18181B] hover:bg-zinc-50 transition-colors cursor-pointer mt-2">
        See All Tips
      </button>
    </div>
  );
}
