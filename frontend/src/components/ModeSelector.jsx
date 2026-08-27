import React from 'react';
import { Briefcase, UserRound, CheckCircle2 } from 'lucide-react';

export default function ModeSelector({ userMode, setUserMode }) {
  return (
    <div className="w-full py-4">
      <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
        How can we help you?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto px-4">
        {/* Industry Card */}
        <button
          type="button"
          onClick={() => setUserMode('industry')}
          className={`relative text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            userMode === 'industry'
              ? 'bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900/10'
              : 'bg-white border-slate-200/80 hover:border-slate-350 hover:bg-slate-50/50'
          }`}
        >
          {userMode === 'industry' && (
            <div className="absolute top-3 right-3 text-slate-900">
              <CheckCircle2 className="w-5 h-5 fill-slate-900 text-white" />
            </div>
          )}
          <div className="flex gap-4">
            <div className={`p-3 rounded-lg ${
              userMode === 'industry' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 uppercase tracking-wide">
                Industry
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                For manufacturers, businesses and compliance teams
              </p>
            </div>
          </div>
        </button>

        {/* Consumer Card */}
        <button
          type="button"
          onClick={() => setUserMode('consumer')}
          className={`relative text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
            userMode === 'consumer'
              ? 'bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900/10'
              : 'bg-white border-slate-200/80 hover:border-slate-350 hover:bg-slate-50/50'
          }`}
        >
          {userMode === 'consumer' && (
            <div className="absolute top-3 right-3 text-slate-900">
              <CheckCircle2 className="w-5 h-5 fill-slate-900 text-white" />
            </div>
          )}
          <div className="flex gap-4">
            <div className={`p-3 rounded-lg ${
              userMode === 'consumer' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              <UserRound className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 uppercase tracking-wide">
                Consumer
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                For consumers seeking BIS information and guidance
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
