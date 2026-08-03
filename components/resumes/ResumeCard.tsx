import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText, Clock, MoreVertical, Edit3, Copy, Trash2,
  Download, ExternalLink, Type, AlertTriangle, X, Check,
} from 'lucide-react';

export interface ResumeItem {
  id: string;
  title: string;
  isDefault?: boolean;
  updatedAgo: string;
  pages: number;
  modifiedDate: string;
  atsScore: number;
  status?: string;
  targetRole?: string;
  skills?: string[];
  companies?: string[];
  createdAt?: string;
  lastOpenedAt?: string;
}

interface ResumeCardProps {
  resume: ResumeItem;
  viewMode?: 'list' | 'grid';
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

/* ─── Small inline confirmation dialog ─── */
function DeleteDialog({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white border border-[#E4E4E7] rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#18181B]">Delete resume?</p>
            <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
              <span className="font-semibold text-[#18181B]">"{title}"</span> will be permanently
              deleted. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#71717A] hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Rename inline modal ─── */
function RenameDialog({
  currentTitle,
  onConfirm,
  onCancel,
}: {
  currentTitle: string;
  onConfirm: (t: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(currentTitle);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.select(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white border border-[#E4E4E7] rounded-2xl shadow-2xl p-6 space-y-4">
        <p className="text-sm font-bold text-[#18181B]">Rename Resume</p>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
            if (e.key === 'Escape') onCancel();
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E4E7] text-xs text-[#18181B] focus:outline-none focus:border-[#111827] transition-colors"
          placeholder="Resume name"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#71717A] hover:bg-zinc-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => value.trim() && onConfirm(value.trim())}
            disabled={!value.trim()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111827] hover:bg-[#27272A] text-white cursor-pointer disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main card ─── */
export function ResumeCard({
  resume,
  viewMode = 'list',
  onDelete,
  onDuplicate,
  onRename,
}: ResumeCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const scoreColor =
    resume.atsScore >= 85 ? '#15803D' : resume.atsScore >= 70 ? '#B45309' : '#B91C1C';

  const ATSGauge = ({ size = 10 }: { size?: number }) => (
    <div className={`relative w-${size} h-${size} flex items-center justify-center`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E4E4E7" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="15.5" fill="none"
          stroke={scoreColor} strokeWidth="3"
          strokeDasharray="97"
          strokeDashoffset={97 - (resume.atsScore / 100) * 97}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-[#18181B]" style={{ fontSize: size < 10 ? 9 : 12 }}>
        {resume.atsScore}
      </span>
    </div>
  );

  /* ─── Shared action menu JSX ─── */
  const ActionMenu = () => (
    <div ref={menuRef} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setShowMenu(p => !p)}
        className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 cursor-pointer transition-colors"
        title="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-10 w-48 bg-white border border-[#E4E4E7] rounded-xl shadow-xl z-40 p-1 space-y-0.5 text-xs font-medium text-[#18181B]">
          {/* Edit */}
          <Link
            href={`/editor/${resume.id}`}
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Edit</span>
          </Link>

          {/* Duplicate */}
          <button
            onClick={() => { onDuplicate(resume.id); setShowMenu(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Duplicate</span>
          </button>

          {/* Rename */}
          <button
            onClick={() => { setShowMenu(false); setShowRenameDialog(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Rename</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={() => setShowMenu(false)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Download PDF</span>
          </button>

          <div className="border-t border-[#E4E4E7] my-1" />

          {/* Delete */}
          <button
            onClick={() => { setShowMenu(false); setShowDeleteDialog(true); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 text-left transition-colors cursor-pointer font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );

  /* ─── Grid view ─── */
  if (viewMode === 'grid') {
    return (
      <>
        <div className="rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs space-y-0 relative group hover:border-[#111827] transition-all">
          <Link href={`/editor/${resume.id}`} className="block p-5 pb-3 space-y-4">
            {/* Thumbnail */}
            <div className="w-full h-40 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex flex-col justify-between p-4 overflow-hidden relative">
              <div className="space-y-1">
                <div className="h-2 w-1/2 bg-zinc-300 rounded-sm" />
                <div className="h-1.5 w-1/3 bg-zinc-200 rounded-sm" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-zinc-200 rounded-sm" />
                <div className="h-1.5 w-4/5 bg-zinc-200 rounded-sm" />
                <div className="h-1.5 w-3/4 bg-zinc-200 rounded-sm" />
              </div>
              <div className="absolute inset-0 bg-[#111827]/70 flex items-center justify-center text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                Open in Editor →
              </div>
            </div>

            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#18181B] truncate">{resume.title}</h3>
                <p className="text-[11px] text-[#71717A] mt-0.5">Updated {resume.updatedAgo}</p>
              </div>
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E4E4E7" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke={scoreColor} strokeWidth="3"
                    strokeDasharray="97" strokeDashoffset={97 - (resume.atsScore / 100) * 97} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#18181B]">{resume.atsScore}</span>
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-between text-[10px] text-[#71717A] px-5 py-3 border-t border-[#E4E4E7]">
            <span>📄 {resume.pages} page{resume.pages > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <span>{resume.modifiedDate}</span>
              <ActionMenu />
            </div>
          </div>
        </div>

        {showDeleteDialog && (
          <DeleteDialog
            title={resume.title}
            onConfirm={() => { onDelete(resume.id); setShowDeleteDialog(false); }}
            onCancel={() => setShowDeleteDialog(false)}
          />
        )}
        {showRenameDialog && (
          <RenameDialog
            currentTitle={resume.title}
            onConfirm={t => { onRename(resume.id, t); setShowRenameDialog(false); }}
            onCancel={() => setShowRenameDialog(false)}
          />
        )}
      </>
    );
  }

  /* ─── List view ─── */
  return (
    <>
      <div className="rounded-2xl bg-white border border-[#E4E4E7] shadow-2xs group hover:border-[#111827] transition-all relative">
        {/* Clickable area → opens editor */}
        <Link
          href={`/editor/${resume.id}`}
          className="p-4 pr-16 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer block"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-14 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-zinc-100 transition-colors">
              <FileText className="w-5 h-5 text-[#71717A]" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#18181B] truncate">{resume.title}</h3>
                {resume.isDefault && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 font-semibold text-[10px] shrink-0">
                    Default
                  </span>
                )}
                {resume.status && (
                  <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] shrink-0 ${
                    resume.status === 'Published'
                      ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                      : 'bg-zinc-100 border border-zinc-200 text-zinc-500'
                  }`}>
                    {resume.status}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#71717A]">Updated {resume.updatedAgo}</p>
              <div className="flex items-center gap-4 text-[11px] text-[#71717A] pt-0.5">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {resume.pages} page{resume.pages > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {resume.modifiedDate}
                </span>
              </div>
            </div>
          </div>

          {/* ATS Score */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E4E4E7" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke={scoreColor} strokeWidth="3"
                  strokeDasharray="97" strokeDashoffset={97 - (resume.atsScore / 100) * 97} strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold text-[#18181B]">{resume.atsScore}</span>
            </div>
            <span className="text-[10px] font-semibold text-[#71717A] hidden sm:inline">ATS Score</span>
          </div>
        </Link>

        {/* 3-dot menu — absolutely positioned, won't navigate */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onClick={e => e.stopPropagation()}
        >
          <ActionMenu />
        </div>
      </div>

      {showDeleteDialog && (
        <DeleteDialog
          title={resume.title}
          onConfirm={() => { onDelete(resume.id); setShowDeleteDialog(false); }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
      {showRenameDialog && (
        <RenameDialog
          currentTitle={resume.title}
          onConfirm={t => { onRename(resume.id, t); setShowRenameDialog(false); }}
          onCancel={() => setShowRenameDialog(false)}
        />
      )}
    </>
  );
}
