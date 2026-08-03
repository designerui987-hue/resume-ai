import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-6 border-t border-[#E4E4E7] mt-6">
      {/* Current Page Text */}
      <div className="text-xs text-[#71717A] font-medium">
        Page <span className="font-bold text-[#18181B]">{currentPage}</span> of{' '}
        <span className="font-bold text-[#18181B]">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={isFirstPage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white border border-[#E4E4E7] text-[#18181B] hover:bg-zinc-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={isLastPage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          title="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
