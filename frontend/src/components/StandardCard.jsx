import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, FileText, CheckCircle } from 'lucide-react';

export default function StandardCard({ standard, initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const isMandatory = standard.applicability && standard.applicability.toLowerCase().includes('mandatory');

  return (
    <div className={`gov-card overflow-hidden border bg-white ${
      isMandatory ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-slate-400'
    }`}>
      {/* Clickable Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex justify-between items-start gap-3 select-none"
      >
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded tracking-wide font-mono">
              {standard.is_number}
            </span>
            {standard.sector && (
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {standard.sector}
              </span>
            )}
            {standard.applicability && (
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                isMandatory
                  ? 'bg-orange-50 text-orange-700 border border-orange-200/50'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/50'
              }`}>
                {standard.applicability}
              </span>
            )}
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
            {standard.title}
          </h3>
          {standard.product_category && (
            <p className="text-[10px] text-slate-500 font-medium">
              Category: {standard.product_category}
            </p>
          )}
        </div>
        <div className="p-1 rounded bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 mt-0.5">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Sections */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/40 text-xs flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {/* Scope */}
            {standard.scope && (
              <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs">
                <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5 border-b border-slate-100 pb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Scope & Applicability
                </h4>
                <p className="text-slate-600 leading-relaxed select-text">{standard.scope}</p>
              </div>
            )}

            {/* Key Requirements */}
            {standard.key_requirements && (
              <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs">
                <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5 mb-1.5 border-b border-slate-100 pb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
                  Key Requirements
                </h4>
                <p className="text-slate-600 leading-relaxed select-text">{standard.key_requirements}</p>
              </div>
            )}
          </div>

          {/* Sources and Verifications */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-150 pt-3 text-[10px] text-slate-500 font-medium">
            <div className="flex gap-4">
              {standard.source_name && <span>Source: {standard.source_name}</span>}
              {standard.last_verified_at && <span>Last Verified: {standard.last_verified_at}</span>}
            </div>
            {standard.source_url && (
              <a
                href={standard.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-orange-600 font-bold flex items-center gap-1 hover:underline bg-white border border-slate-200 px-2.5 py-1 rounded"
              >
                <span>Official Standard Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
