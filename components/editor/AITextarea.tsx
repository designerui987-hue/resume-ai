import React, { forwardRef, useRef, useState, useEffect } from 'react';
import { Loader2, Sparkles, RefreshCw, Scissors, Maximize2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const AITextarea = forwardRef<HTMLTextAreaElement, AITextareaProps>((props, ref) => {
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  
  const setRefs = (node: HTMLTextAreaElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const [hasSelection, setHasSelection] = useState(false);
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const checkSelection = () => {
    const el = localRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end && end - start > 0) {
      setSelectionRange({ start, end });
      setHasSelection(true);
    } else {
      setHasSelection(false);
    }
  };

  const handleEnhance = async (type: string) => {
    const el = localRef.current;
    if (!el) return;

    const { start, end } = selectionRange;
    const fullText = el.value;
    const selectedText = fullText.substring(start, end);

    if (!selectedText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enhanceText', text: selectedText, enhancementType: type }),
      });
      const data = await response.json();
      
      if (data.result) {
        const newText = fullText.substring(0, start) + data.result + fullText.substring(end);
        
        el.value = newText;
        const event = new Event('input', { bubbles: true });
        el.dispatchEvent(event);
        
        setHasSelection(false);
      }
    } catch (err) {
      console.error("AI Enhancement failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (localRef.current && !localRef.current.contains(e.target as Node) && !(e.target as Element).closest('.ai-toolbar')) {
        setHasSelection(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter out any custom classes that might clash with our default styling
  // if needed, but here we just merge. We only replace the textarea with AITextarea.
  const { className, ...restProps } = props;

  return (
    <div className="relative group/textarea w-full">
      {hasSelection && (
        <div className="ai-toolbar absolute -top-12 left-0 right-0 flex justify-center z-10 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-[#18181B] text-white p-1 rounded-xl shadow-xl flex items-center gap-1 border border-zinc-800">
            {isLoading ? (
              <div className="px-4 py-2 flex items-center gap-2 text-sm text-zinc-300">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is writing...</span>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleEnhance('improve'); }} className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs px-2.5 transition-colors cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Improve
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleEnhance('rewrite'); }} className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs px-2.5 transition-colors cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Rewrite
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleEnhance('shorten'); }} className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs px-2.5 transition-colors cursor-pointer">
                  <Scissors className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Shorten
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleEnhance('expand'); }} className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs px-2.5 transition-colors cursor-pointer">
                  <Maximize2 className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Expand
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => { e.preventDefault(); handleEnhance('ats'); }} className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs px-2.5 transition-colors cursor-pointer">
                  <Target className="w-3.5 h-3.5 mr-1.5 text-rose-400" /> ATS
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      <textarea
        {...restProps}
        ref={setRefs}
        onMouseUp={(e) => {
          checkSelection();
          if (props.onMouseUp) props.onMouseUp(e);
        }}
        onKeyUp={(e) => {
          checkSelection();
          if (props.onKeyUp) props.onKeyUp(e);
        }}
        onChange={(e) => {
          checkSelection();
          if (props.onChange) props.onChange(e);
        }}
        className={className || "w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-shadow"}
      />
    </div>
  );
});
AITextarea.displayName = 'AITextarea';

export default AITextarea;
