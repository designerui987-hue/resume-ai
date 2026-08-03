import React from 'react';
import Link from 'next/link';
import { MarketingPanel } from './MarketingPanel';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'signup';
}

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen w-full bg-[#FAFAF9] flex font-sans selection:bg-[#111827] selection:text-white antialiased">
      {/* Left Marketing Panel (Hidden on Mobile, 45% on Tablet, 50% on Desktop) */}
      <div className="hidden lg:block lg:w-[45%] xl:w-1/2 h-screen sticky top-0">
        <MarketingPanel mode={mode} />
      </div>

      {/* Right Authentication Form Panel */}
      <div className="w-full lg:w-[55%] xl:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto bg-white">
        {/* Top Right Header Toggle */}
        <div className="flex items-center justify-end gap-3 w-full max-w-md mx-auto lg:max-w-none">
          <span className="text-xs font-semibold text-[#71717A]">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <Link
            href={isLogin ? '/signup' : '/login'}
            className="px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] hover:bg-zinc-50 transition-colors shadow-2xs"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </div>

        {/* Center Main Form Body */}
        <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto py-8">
          {children}
        </div>

        {/* Footer Link / Spacing */}
        <div className="w-full text-center" />
      </div>
    </div>
  );
}
