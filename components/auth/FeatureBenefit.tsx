import React from 'react';
import { ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export function FeatureBenefit() {
  return (
    <div className="grid grid-cols-3 gap-3 pt-6">
      {/* Card 1 */}
      <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col items-center text-center space-y-1.5">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-center text-[#18181B]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h5 className="text-[11px] font-bold text-[#18181B]">Secure & Private</h5>
        <p className="text-[9.5px] text-[#71717A] leading-snug">
          Your data is encrypted and protected.
        </p>
      </div>

      {/* Card 2 */}
      <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col items-center text-center space-y-1.5">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-center text-[#18181B]">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <h5 className="text-[11px] font-bold text-[#18181B]">No Credit Card</h5>
        <p className="text-[9.5px] text-[#71717A] leading-snug">
          Get started for free. Upgrade anytime.
        </p>
      </div>

      {/* Card 3 */}
      <div className="p-3 rounded-2xl bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col items-center text-center space-y-1.5">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#E4E4E7] flex items-center justify-center text-[#18181B]">
          <Sparkles className="w-4 h-4" />
        </div>
        <h5 className="text-[11px] font-bold text-[#18181B]">Cancel Anytime</h5>
        <p className="text-[9.5px] text-[#71717A] leading-snug">
          No contracts. Cancel whenever you want.
        </p>
      </div>
    </div>
  );
}
