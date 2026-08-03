'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Check,
  ChevronRight,
  FileText,
  Briefcase,
  HelpCircle,
  ShieldAlert,
  Mail,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionType?: 'summary' | 'experience' | 'cover-letter' | 'interview' | 'general';
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: string;
  fullName?: string;
  currentSummary?: string;
  skills?: string[];
  onSummaryGenerated?: (text: string) => void;
  onCoverLetterOpen?: () => void;
}

export default function AIAssistantDrawer({
  isOpen,
  onClose,
  targetRole = 'Software Engineer',
  fullName = '',
  currentSummary = '',
  skills = [],
  onSummaryGenerated,
  onCoverLetterOpen,
}: AIAssistantDrawerProps) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedMessageId, setAppliedMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello ${fullName || 'there'}! I'm your AI Resume Coach. How can I help you optimize your resume for **${targetRole}** positions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const sendMessage = async (promptText: string, actionType: Message['actionType'] = 'general') => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userMsgId = 'usr-' + Date.now();
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Determine backend action
      let apiAction = 'generateSummary';
      let extraPayload: Record<string, string> = {
        title: targetRole,
        currentSummary: trimmed,
        skills: skills.join(', '),
      };

      if (actionType === 'experience') {
        apiAction = 'rewriteExperience';
        extraPayload = {
          position: targetRole,
          company: 'Target Role Company',
          description: trimmed,
        };
      }

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: apiAction,
          ...extraPayload,
        }),
      });

      if (!res.ok) throw new Error('AI Server response error');

      const data = await res.json();
      const botResponse: Message = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        content: data.result || 'I processed your request, but received no text output. Please try again!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: '⚠️ Unable to connect to AI Assistant. Please check your internet connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (type: Message['actionType']) => {
    switch (type) {
      case 'summary':
        sendMessage(
          `Draft a compelling, concise 3-sentence professional summary for a ${targetRole} possessing skills in ${skills.slice(0, 5).join(', ')}.`,
          'summary'
        );
        break;

      case 'experience':
        sendMessage(
          `Rewrite my work experience bullet points for a ${targetRole} role with strong action verbs and measurable metrics.`,
          'experience'
        );
        break;

      case 'cover-letter':
        if (onCoverLetterOpen) {
          onCoverLetterOpen();
        } else {
          sendMessage(
            `Generate a high-converting cover letter outline for a ${targetRole} position.`,
            'cover-letter'
          );
        }
        break;

      case 'interview':
        sendMessage(
          `Provide 5 top technical and behavioral interview questions for a ${targetRole} position, with recommended response strategies.`,
          'interview'
        );
        break;

      case 'general':
        sendMessage(
          `Analyze my target role of ${targetRole} and provide 3 key ATS optimization tips for my resume.`,
          'general'
        );
        break;
    }
  };

  const handleApplyContent = (msg: Message) => {
    if (onSummaryGenerated && msg.content) {
      onSummaryGenerated(msg.content);
      setAppliedMessageId(msg.id);
      setTimeout(() => setAppliedMessageId(null), 2500);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. What else can I help you with for your **${targetRole}** resume?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const parsed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <p
          key={idx}
          className="text-xs leading-relaxed min-h-[16px] my-0.5"
          dangerouslySetInnerHTML={{ __html: parsed }}
        />
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E4E4E7] animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E4E4E7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111827] flex items-center justify-center text-white shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-[#18181B]">AI Career Coach</h2>
                <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  ChatGPT Mode
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] truncate max-w-[200px]">Tailored for {targetRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF9]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-zinc-200 text-[#18181B]'
                    : 'bg-[#111827] text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 shadow-2xs space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-[#111827] text-white rounded-tr-xs'
                    : 'bg-white border border-[#E4E4E7] text-[#18181B] rounded-tl-xs'
                }`}
              >
                <div>{renderFormattedContent(msg.content)}</div>

                <div className={`flex items-center justify-between pt-1 text-[10px] ${
                  msg.role === 'user' ? 'text-zinc-400' : 'text-[#71717A]'
                }`}>
                  <span>{msg.timestamp}</span>

                  {/* Apply to Resume inline action button */}
                  {msg.role === 'assistant' && msg.content.length > 20 && (
                    <button
                      onClick={() => handleApplyContent(msg)}
                      className="ml-2 flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 transition-all cursor-pointer"
                    >
                      {appliedMessageId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Applied!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>Apply to Resume</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-[#111827] flex items-center justify-center text-white shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white border border-[#E4E4E7] rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span className="text-xs font-semibold text-[#71717A]">AI Coach is crafting response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-[#E4E4E7] bg-white space-y-2 shrink-0">
          <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider px-1">
            Prompt Suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSuggestionClick('summary')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-[11px] font-semibold text-[#18181B] transition-colors"
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              Improve Summary
            </button>
            <button
              onClick={() => handleSuggestionClick('experience')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-[11px] font-semibold text-[#18181B] transition-colors"
            >
              <Briefcase className="w-3 h-3 text-emerald-600" />
              Rewrite Experience
            </button>
            <button
              onClick={() => handleSuggestionClick('general')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-[11px] font-semibold text-[#18181B] transition-colors"
            >
              <ShieldAlert className="w-3 h-3 text-amber-600" />
              Optimize Resume
            </button>
            <button
              onClick={() => handleSuggestionClick('cover-letter')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-[11px] font-semibold text-[#18181B] transition-colors"
            >
              <Mail className="w-3 h-3 text-blue-600" />
              Cover Letter
            </button>
            <button
              onClick={() => handleSuggestionClick('interview')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E4E4E7] bg-[#FAFAF9] hover:bg-zinc-100 text-[11px] font-semibold text-[#18181B] transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-purple-600" />
              Interview Questions
            </button>
          </div>

          {/* ChatGPT Style Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputPrompt);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask AI anything about your resume..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7] text-xs font-medium text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent transition-all shadow-2xs"
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!inputPrompt.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
