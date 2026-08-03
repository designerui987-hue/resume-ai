'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FullResumeFormValues } from '@/types/resume';
import ResumePreview, { TemplateType } from './ResumePreview';
import { ZoomIn, ZoomOut, Maximize, Minimize, Monitor, Printer } from 'lucide-react';

interface PreviewPaneProps {
  data: FullResumeFormValues;
  template: TemplateType;
  onSectionClick: (section: string) => void;
}

export default function PreviewPane({ data, template, onSectionClick }: PreviewPaneProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'print'>('desktop');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((p) => Math.min(200, p + 10));
  const handleZoomOut = () => setZoomLevel((p) => Math.max(30, p - 10));
  const handleZoomReset = () => setZoomLevel(100);

  const handleWheelZoom = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    }
  };

  const handleFitWidth = () => {
    if (containerRef.current && documentRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const docWidth = 794; // A4 width at 96dpi approx
      const padding = 48; // 24px padding on each side
      const scale = ((containerWidth - padding) / docWidth) * 100;
      setZoomLevel(Math.min(Math.max(Math.floor(scale), 30), 200));
    }
  };

  const handleFitPage = () => {
    if (containerRef.current && documentRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const docHeight = 1122; // A4 height approx
      const padding = 48;
      const scale = ((containerHeight - padding) / docHeight) * 100;
      setZoomLevel(Math.min(Math.max(Math.floor(scale), 30), 200));
    }
  };

  return (
    <section className="hidden lg:flex flex-col bg-[#F4F4F5] overflow-hidden shrink-0 w-full h-full">
      <div className="h-14 bg-white border-b border-[#E4E4E7] px-4 flex items-center justify-between shrink-0 select-none">
        
        {/* Left Controls - Modes */}
        <div className="flex items-center gap-1 bg-[#FAFAF9] p-1 rounded-lg border border-[#E4E4E7]">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              previewMode === 'desktop' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E4E4E7]' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            title="Desktop Mode (Continuous)"
          >
            <Monitor className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            onClick={() => setPreviewMode('print')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              previewMode === 'print' ? 'bg-white text-[#18181B] shadow-2xs border border-[#E4E4E7]' : 'text-[#71717A] hover:text-[#18181B]'
            }`}
            title="Print Mode (A4 Fixed)"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>

        {/* Right Controls - Zoom */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-[11px] text-[#71717A] bg-[#FAFAF9] p-1 rounded-lg border border-[#E4E4E7]">
            <button onClick={handleFitWidth} className="hover:bg-zinc-200 p-1 rounded transition-colors" title="Fit Width">
              <Maximize className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleFitPage} className="hover:bg-zinc-200 p-1 rounded transition-colors" title="Fit Page">
              <Minimize className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-3.5 bg-[#E4E4E7] mx-0.5" />
            
            <button onClick={handleZoomOut} className="hover:bg-zinc-200 p-1 rounded transition-colors" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleZoomReset} className="font-bold px-2 text-[#18181B] hover:bg-zinc-200 rounded py-1 transition-colors min-w-[48px]" title="Reset Zoom">
              {zoomLevel}%
            </button>
            <button onClick={handleZoomIn} className="hover:bg-zinc-200 p-1 rounded transition-colors" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-6 flex justify-center items-start select-none relative"
        onWheel={handleWheelZoom}
      >
        <div
          ref={documentRef}
          className={`transition-all duration-150 ease-out origin-top shadow-xl rounded-md bg-white border border-[#E4E4E7] overflow-hidden ${
            previewMode === 'print' ? 'h-[1122px]' : 'min-h-[1122px]'
          }`}
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            width: '794px',
            marginBottom: `${(zoomLevel / 100) * 1122 - 1122 + 48}px` // Compensate for scale causing scroll issues
          }}
        >
          <div key={template} className="animate-in fade-in zoom-in-95 duration-300">
            <ResumePreview data={data} template={template} onSectionClick={onSectionClick} />
          </div>
        </div>
      </div>
    </section>
  );
}
