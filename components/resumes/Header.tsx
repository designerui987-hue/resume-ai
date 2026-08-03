import React from 'react';
import { Upload, Plus } from 'lucide-react';
import { TopHeader } from '../layout/TopHeader';

interface HeaderProps {
  onCreateNew: () => void;
  onImport: () => void;
}

export function Header({ onCreateNew, onImport }: HeaderProps) {
  return (
    <TopHeader
      title="My Resumes"
      subtitle="Manage, edit, and optimize your resumes all in one place."
      actions={
        <>
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs font-bold text-[#18181B] hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Resume</span>
          </button>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-bold hover:bg-[#27272A] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </>
      }
    />
  );
}
