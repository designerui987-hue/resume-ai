import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Search, ChevronDown, LayoutGrid, List, X } from 'lucide-react';
import { ResumeItem } from './ResumeCard';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  // For instant search suggestion drop-down
  allResumes?: ResumeItem[];
  onSelectSuggestion?: (id: string) => void;
}

export function Filters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  allResumes = [],
  onSelectSuggestion,
}: FiltersProps) {
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Build suggestions: deduplicated matches across title, targetRole, skills, companies
  const suggestions = useCallback(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !focused) return [];

    return allResumes
      .filter(r => {
        return (
          r.title.toLowerCase().includes(q) ||
          (r.targetRole ?? '').toLowerCase().includes(q) ||
          (r.skills ?? []).some(s => s.toLowerCase().includes(q)) ||
          (r.companies ?? []).some(c => c.toLowerCase().includes(q))
        );
      })
      .slice(0, 6);
  }, [searchQuery, focused, allResumes]);

  const hits = suggestions();
  const showDropdown = focused && searchQuery.trim().length > 0 && hits.length > 0;

  // Reset activeIdx whenever hits change
  useEffect(() => { setActiveIdx(-1); }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      onSelectSuggestion?.(hits[activeIdx].id);
      setFocused(false);
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  // Highlight matching text in a string
  const highlight = (text: string, q: string) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-yellow-100 text-yellow-900 font-semibold rounded-sm px-0.5">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6">
      {/* Search Input + dropdown */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={e => { onSearchChange(e.target.value); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, role, skill, or company…"
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#111827] transition-colors shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => { onSearchChange(''); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Suggestion dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E4E4E7] rounded-xl shadow-xl z-40 overflow-hidden"
          >
            {hits.map((r, i) => {
              const q = searchQuery.trim().toLowerCase();
              // Determine which field matched for the subtitle
              let subtitle = r.targetRole || '';
              if (!subtitle && r.skills?.some(s => s.toLowerCase().includes(q))) {
                subtitle = r.skills!.filter(s => s.toLowerCase().includes(q)).join(', ');
              } else if (!subtitle && r.companies?.some(c => c.toLowerCase().includes(q))) {
                subtitle = r.companies!.filter(c => c.toLowerCase().includes(q)).join(', ');
              }

              return (
                <button
                  key={r.id}
                  onClick={() => {
                    onSearchChange(r.title);
                    onSelectSuggestion?.(r.id);
                    setFocused(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                    i === activeIdx ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-[#E4E4E7] flex items-center justify-center shrink-0">
                    <Search className="w-3 h-3 text-[#71717A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#18181B] truncate">
                      {highlight(r.title, searchQuery.trim())}
                    </p>
                    {subtitle && (
                      <p className="text-[10px] text-[#71717A] truncate mt-0.5">
                        {highlight(subtitle, searchQuery.trim())}
                      </p>
                    )}
                  </div>
                  <span className={`ml-auto text-[10px] font-semibold shrink-0 px-1.5 py-0.5 rounded-md ${
                    r.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {r.status ?? 'Draft'}
                  </span>
                </button>
              );
            })}
            <div className="px-3.5 py-2 border-t border-[#E4E4E7]">
              <p className="text-[10px] text-[#71717A]">
                {hits.length} result{hits.length !== 1 ? 's' : ''} · ↑↓ navigate · Enter to open · Esc to close
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dropdowns & Layout Toggle */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => onStatusFilterChange(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-semibold text-[#18181B] focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
            <option value="recently_updated">Recently Updated</option>
            <option value="highest_ats">Highest ATS Score</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A] pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white border border-[#E4E4E7] text-xs font-semibold text-[#18181B] focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="modified">Last Modified</option>
            <option value="score">ATS Score</option>
            <option value="title">Title (A–Z)</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717A] pointer-events-none" />
        </div>

        {/* Grid/List Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-white border border-[#E4E4E7] shadow-2xs">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-zinc-100 text-[#18181B]' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-zinc-100 text-[#18181B]' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
