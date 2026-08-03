import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon: Icon, rightElement, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label className="block text-xs font-semibold text-[#18181B]">
          {label}
        </label>
        <div className="relative flex items-center">
          <input
            ref={ref}
            {...props}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAF9] border text-xs text-[#18181B] placeholder:text-[#A1A1AA] transition-colors focus:outline-none focus:bg-white focus:border-[#111827] focus:ring-1 focus:ring-[#111827] ${
              error ? 'border-[#B91C1C]' : 'border-[#E4E4E7]'
            } ${Icon ? 'pr-10' : ''} ${className}`}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
          {Icon && !rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <p className="text-[11px] font-medium text-[#B91C1C]">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
