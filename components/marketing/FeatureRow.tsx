import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureRow({ icon: Icon, title, description }: FeatureRowProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl border border-[#E4E4E7] bg-white flex items-center justify-center text-[#18181B] shrink-0 shadow-2xs">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#18181B]">{title}</h4>
        <p className="text-xs text-[#71717A] leading-relaxed mt-0.5">{description}</p>
      </div>
    </div>
  );
}
