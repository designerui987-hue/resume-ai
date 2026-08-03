import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactNode | string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  compact?: boolean;
}

export function EmptyState({
  icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  compact = false,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <span className="text-base">{icon}</span>;
    }
    if (React.isValidElement(icon)) {
      return icon;
    }
    const IconComp = icon as LucideIcon;
    return <IconComp className="w-4 h-4 text-[#71717A]" />;
  };

  if (compact) {
    return (
      <div className="py-6 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-9 h-9 rounded-xl bg-zinc-100 border border-[#E4E4E7] flex items-center justify-center text-sm mb-2 shadow-2xs">
          {renderIcon()}
        </div>
        <h4 className="text-xs font-bold text-[#18181B]">{title}</h4>
        <p className="text-[11px] text-[#71717A] mt-0.5 mb-3 max-w-xs">{description}</p>
        {actionHref ? (
          <Link
            href={actionHref}
            className="px-3.5 py-1.5 bg-[#111827] text-white text-[11px] font-semibold rounded-lg shadow-2xs hover:bg-[#1f2937] transition-colors"
          >
            {actionLabel}
          </Link>
        ) : actionLabel && onAction ? (
          <button
            onClick={onAction}
            className="px-3.5 py-1.5 bg-[#111827] text-white text-[11px] font-semibold rounded-lg shadow-2xs hover:bg-[#1f2937] transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs max-w-md mx-auto my-4 select-none">
      <div className="w-10 h-10 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center text-[#18181B] mb-3 shadow-2xs">
        {renderIcon()}
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-[#18181B] tracking-tight">{title}</h3>
      <p className="text-xs text-[#71717A] leading-relaxed mt-1 mb-4 max-w-xs">
        {description}
      </p>
      {actionHref ? (
        <Link
          href={actionHref}
          className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold hover:bg-[#27272A] transition-all shadow-2xs"
        >
          {actionLabel}
        </Link>
      ) : actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold hover:bg-[#27272A] transition-all cursor-pointer shadow-2xs"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
