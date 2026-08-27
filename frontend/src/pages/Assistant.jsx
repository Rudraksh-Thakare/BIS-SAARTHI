import React, { useRef, useEffect } from 'react';
import { Send, ArrowRight, Info, Landmark, Lightbulb } from 'lucide-react';
import ModeSelector from '../components/ModeSelector';
import EvidenceBadge from '../components/EvidenceBadge';
import SourceCard from '../components/SourceCard';
import StandardCard from '../components/StandardCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Assistant({
  userMode,
  setUserMode,
  setActiveTab,
  messages,
  loading,
  query,
  setQuery,
  handleQuerySubmit,
  suggestions
}) {
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const focusInput = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSuggestionClick = (text) => {
    handleQuerySubmit(null, text);
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      {/* 1. HERO LANDING SECTION (Only show if chat is empty or contains only the welcome message) */}
      {messages.length <= 1 && (
        <section className="text-center py-8 md:py-12 max-w-3xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-250 text-[11px] font-semibold text-slate-700 mb-2">
            <Landmark className="w-3.5 h-3.5 text-orange-500" />
            <span>Official Standards Information Assistant</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Find the right Indian Standard.<br />
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-orange-600 bg-clip-text text-transparent">
              Understand it with confidence.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mt-2">
            Ask questions in natural language and discover relevant BIS standards, requirements and services.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              onClick={focusInput}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              Ask BIS-SAARTHI
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold text-sm px-6 py-2.5 rounded-lg transition shadow-xs cursor-pointer"
            >
              Explore Standards
            </button>
          </div>
        </section>
      )}

      {/* 2. MODE SELECTION COMPONENT */}
      {messages.length <= 1 && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs max-w-4xl w-full mx-auto">
          <ModeSelector userMode={userMode} setUserMode={setUserMode} />
        </section>
      )}

      {/* 3. MAIN ASSISTANT PORTAL SCREEN */}
      <section className="max-w-4xl w-full mx-auto flex-1 flex flex-col min-h-[450px]">
        {/* Chat Console container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm relative">
          
          {/* Console Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <h2 className="font-bold text-sm text-slate-800 tracking-wide">
                BIS-SAARTHI AI Standards Assistant
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Grounded in your BIS knowledge base
            </span>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 max-h-[500px]">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              
              if (isUser) {
                return (
                  <div key={idx} className="flex justify-end items-end gap-2">
                    <div className="bg-slate-900 text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm max-w-[85%] shadow-xs select-text">
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              }

              // Else: Assistant Response
              const hasInsufficientEvidence = msg.evidence_status === 'insufficient_evidence';
              const hasError = !!msg.isError;
              const hasStandards = msg.matched_standards && msg.matched_standards.length > 0;
              const hasSources = msg.sources && msg.sources.length > 0;
              const hasActions = msg.next_actions && msg.next_actions.length > 0;

              return (
                <div key={idx} className="flex flex-col gap-3 items-start w-full">
                  {/* Status Badge (if supported or potentially relevant) */}
                  {!hasError && msg.evidence_status && (
                    <div className="flex flex-wrap items-center gap-2 select-none">
                      <EvidenceBadge status={msg.evidence_status} />
                    </div>
                  )}

                  {/* Bubble Container */}
                  <div className="w-full bg-white border border-slate-200 rounded-2xl rounded-tl-none p-5 shadow-xs flex flex-col gap-5 select-text">
                    
                    {/* A. ANSWER */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block select-none">
                        Answer
                      </span>
                      <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap select-text font-medium">
                        {msg.content}
                      </div>
                    </div>

                    {/* B. RELEVANT STANDARD */}
                    {!hasInsufficientEvidence && !hasError && hasStandards && (
                      <div className="space-y-2 border-t border-slate-105 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block select-none">
                          Relevant Standard
                        </span>
                        <div className="space-y-3">
                          {msg.matched_standards.map((std, sidx) => (
                            <StandardCard key={std.id || sidx} standard={std} initialExpanded={true} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* C. KEY INFORMATION */}
                    {!hasInsufficientEvidence && !hasError && hasStandards && msg.matched_standards.some(s => s.key_requirements) && (
                      <div className="space-y-2 border-t border-slate-105 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block select-none">
                          Key Information
                        </span>
                        <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 leading-relaxed font-medium">
                          {msg.matched_standards.map((std, sidx) => {
                            if (!std.key_requirements) return null;
                            return (
                              <li key={sidx} className="select-text">
                                <strong className="text-slate-800 font-bold">{std.is_number}: </strong>
                                {std.key_requirements}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* D. FALLBACK STATE (If insufficient evidence) */}
                    {(hasInsufficientEvidence || hasError) && (
                      <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-xl flex items-start gap-3 select-none">
                        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Information not found
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            I couldn't find enough verified BIS information in our knowledge base to answer this reliably.
                          </p>
                          <div className="text-[11px] text-slate-400 font-semibold mt-2">
                            Try asking about:
                          </div>
                          <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-0.5 mt-0.5">
                            <li>A specific product (e.g. "packaged drinking water", "electric irons")</li>
                            <li>An IS number (e.g. "IS 302", "IS 694")</li>
                            <li>A BIS service (e.g. "ISI mark licensing", "hallmark verification")</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* E. SOURCES */}
                    {!hasInsufficientEvidence && !hasError && hasSources && (
                      <div className="space-y-2 border-t border-slate-105 pt-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block select-none">
                          Sources
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.sources.map((src, sidx) => (
                            <SourceCard key={src.id || sidx} source={src} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* F. NEXT ACTIONS */}
                    {!hasError && hasActions && (
                      <div className="space-y-2 border-t border-slate-105 pt-4 select-none">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                          Next Actions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {msg.next_actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              onClick={() => handleSuggestionClick(act)}
                              className="text-left text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-350 px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 group"
                            >
                              <span>{act}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Subtle typing indicator skeleton */}
            {loading && <LoadingSkeleton type="chat" />}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Search/Input console */}
          <div className="p-4 border-t border-slate-150 bg-slate-50/50 select-none">
            <form onSubmit={handleQuerySubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                placeholder={
                  userMode === 'industry' 
                    ? "Search by IS number, product or compliance query (e.g. IS 694, electric iron)..." 
                    : "Ask about hallmarks, complaint rules, or check certified brands..."
                }
                className="flex-1 bg-white border border-slate-200 focus:border-slate-800 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400 text-slate-800 outline-none transition shadow-xs focus:ring-1 focus:ring-slate-900/5"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-5 rounded-xl shadow-xs active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask Assistant</span>
              </button>
            </form>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mt-2.5 text-[10px] text-slate-400 px-1 font-medium">
              <span>This assistant is grounded in verified standards. Please verify applicability to your specific product version.</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SUGGESTED QUESTIONS (Shown at the bottom of the screen) */}
      <section className="max-w-4xl w-full mx-auto px-4 mt-2">
        <div className="flex items-center gap-2 text-slate-850 mb-3">
          <Lightbulb className="w-4 h-4 text-orange-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Suggested Questions
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions[userMode].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(sug.text)}
              className="text-left text-xs bg-white border border-slate-200/80 hover:border-slate-800 hover:bg-slate-50/50 text-slate-700 hover:text-slate-900 p-3 rounded-xl transition duration-150 flex items-center gap-3 group shadow-xs cursor-pointer select-none"
            >
              <div className="bg-slate-50 group-hover:bg-white p-1 rounded-md border border-slate-150 group-hover:border-slate-200">
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="font-semibold">{sug.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
