import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function LoadingSkeleton({ type = 'chat' }) {
  if (type === 'chat') {
    return (
      <div className="flex items-start gap-3 animate-pulse">
        <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-slate-500 shrink-0">
          <ShieldCheck className="w-4 h-4 text-orange-500" />
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs max-w-sm flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-xs text-slate-500 font-medium pl-1 select-none">
            BIS-SAARTHI is analyzing your question...
          </span>
        </div>
      </div>
    );
  }

  // Otherwise, list card loading states
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
            <div className="h-3.5 bg-slate-100 rounded w-16"></div>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3.5 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between">
            <div className="h-3 bg-slate-100 rounded w-28"></div>
            <div className="h-3.5 bg-slate-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
