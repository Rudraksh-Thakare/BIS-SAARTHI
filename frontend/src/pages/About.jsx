import React from 'react';
import { Info, Users, Settings, ShieldCheck, Landmark } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Page Header */}
      <section className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Info className="w-6 h-6 text-slate-800" />
          <span>About BIS-SAARTHI</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-semibold">
          Your assistant for discovering and understanding Indian Standards and BIS information.
        </p>
      </section>

      {/* Grid of Key Product Aspects */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WHAT IS BIS-SAARTHI? */}
        <div className="gov-card p-5 space-y-3 bg-white">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-800">
              <Landmark className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              What is BIS-SAARTHI?
            </h3>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed font-medium select-text">
            BIS-SAARTHI is an AI-powered assistant that helps users discover and understand relevant Indian Standards and BIS information using natural-language questions.
          </p>
        </div>

        {/* WHO IS IT FOR? */}
        <div className="gov-card p-5 space-y-3 bg-white">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-800">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              Who is it for?
            </h3>
          </div>
          <p className="text-xs text-slate-650 leading-relaxed font-medium select-text">
            Manufacturers, businesses, compliance teams, and consumers seeking information about Indian Standards and BIS services.
          </p>
        </div>

        {/* HOW DOES IT WORK? */}
        <div className="gov-card p-5 space-y-3 md:col-span-2 bg-white">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-800">
              <Settings className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              How does it work?
            </h3>
          </div>
          
          <p className="text-xs text-slate-650 font-medium select-text mb-2">
            The assistant processes queries through a multi-step grounding pipeline:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-center text-xs select-none">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">1</div>
              <span className="font-bold text-slate-900 block text-xs">Ask a question</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Input your query in natural language.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">2</div>
              <span className="font-bold text-slate-900 block text-xs">Retrieve info</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Relevant documentation is fetched from the knowledge base.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">3</div>
              <span className="font-bold text-slate-900 block text-xs">Check evidence</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Retrieval quality is verified to prevent unsupported claims.</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2 text-xs">4</div>
              <span className="font-bold text-slate-900 block text-xs">Grounded response</span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">A response is compiled based solely on verified facts.</span>
            </div>
          </div>
        </div>

        {/* WHY IS IT TRUSTWORTHY? */}
        <div className="gov-card p-5 space-y-3 md:col-span-2 bg-white">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-800">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              Why is it trustworthy?
            </h3>
          </div>
          
          <p className="text-xs text-slate-650 font-medium select-text leading-relaxed">
            Responses are based on retrieved information from the application's BIS knowledge base, with evidence-aware handling when sufficient information is not available. This prevents unverified advice from being displayed.
          </p>
        </div>

      </section>
    </div>
  );
}
