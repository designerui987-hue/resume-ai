import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-2xs select-none';

    const variants = {
      default: 'bg-[#111827] text-white hover:bg-[#27272A]',
      destructive: 'bg-rose-600 text-white hover:bg-rose-700',
      outline: 'border border-[#E4E4E7] bg-white text-[#18181B] hover:bg-[#FAFAF9] hover:border-[#111827]',
      secondary: 'bg-[#FAFAF9] text-[#18181B] border border-[#E4E4E7] hover:bg-zinc-100',
      ghost: 'text-[#71717A] hover:bg-zinc-100 hover:text-[#18181B]',
      link: 'text-[#18181B] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-8 px-3 py-1.5',
      sm: 'h-7 px-2.5 text-[11px]',
      lg: 'h-9 px-4 text-sm',
      icon: 'h-8 w-8 p-0',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
