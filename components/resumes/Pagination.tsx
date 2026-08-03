import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 pt-4 pb-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-[#E4E4E7] bg-white text-[#71717A] hover:text-[#18181B] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Previous Page"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentPage === page
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-white border border-[#E4E4E7] text-[#18181B] hover:bg-zinc-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-[#E4E4E7] bg-white text-[#71717A] hover:text-[#18181B] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        title="Next Page"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
