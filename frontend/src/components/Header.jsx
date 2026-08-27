import React from 'react';
import { ShieldCheck, Briefcase, User } from 'lucide-react';

export default function Header({ userMode, setUserMode, onTriggerSeeding, isSeeding }) {
  const isDevMode = typeof window !== 'undefined' && window.location.search.includes('dev=true');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Subtle national tricolor top border for institutional identity */}
      <div className="h-1 w-full flex">
        <div className="bg-orange-500 w-1/3"></div>
        <div className="bg-white w-1/3"></div>
        <div className="bg-emerald-600 w-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand details */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-2 rounded-lg shadow-sm">
            <ShieldCheck className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                BIS-SAARTHI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Indian Standards Assistant
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {/* Mode Switcher */}
          <div className="bg-slate-50 border border-slate-200/85 p-0.5 rounded-lg flex items-center shadow-inner">
            <button 
              onClick={() => { setUserMode('industry'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${userMode === 'industry' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Switch to Industry Portal for compliance and standards"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Industry
            </button>
            <button 
              onClick={() => { setUserMode('consumer'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition ${userMode === 'consumer' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Switch to Consumer Portal for safety markings and guidance"
            >
              <User className="w-3.5 h-3.5" />
              Consumer
            </button>
          </div>

          {/* Dev-only Database seeding button */}
          {isDevMode && (
            <button 
              onClick={onTriggerSeeding}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-650 hover:text-slate-900 bg-white border border-slate-250 rounded-lg hover:bg-slate-50 transition shadow-sm disabled:opacity-50"
            >
              Seed Database
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
