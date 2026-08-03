import React from 'react';

export function LoadingSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-6 h-6 border-2 border-[#E4E4E7] dark:border-zinc-800 border-t-[#111827] dark:border-t-white rounded-full animate-spin" />
      {label && <p className="text-xs font-medium text-[#71717A] dark:text-zinc-400">{label}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 space-y-3 animate-pulse">
      <div className="h-4 bg-[#E4E4E7] dark:bg-zinc-800 rounded-md w-1/3" />
      <div className="h-8 bg-[#FAFAF9] dark:bg-zinc-800/50 rounded-lg w-1/2" />
      <div className="h-3 bg-[#E4E4E7] dark:bg-zinc-800 rounded-md w-2/3" />
    </div>
  );
}
