import React from 'react';

export function FooterLinks() {
  return (
    <div className="flex items-center justify-center gap-6 text-[11px] font-semibold text-[#71717A] pt-8">
      <a href="#" className="hover:text-[#18181B] transition-colors">
        Terms of Service
      </a>
      <a href="#" className="hover:text-[#18181B] transition-colors">
        Privacy Policy
      </a>
      <a href="#" className="hover:text-[#18181B] transition-colors">
        Contact Us
      </a>
    </div>
  );
}
