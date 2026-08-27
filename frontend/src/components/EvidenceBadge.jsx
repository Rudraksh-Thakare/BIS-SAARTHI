import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function EvidenceBadge({ status }) {
  switch (status) {
    case 'supported':
      return (
        <span 
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-xs"
          title="Answer is supported by database references."
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>✓ Supported by retrieved evidence</span>
        </span>
      );

    case 'potentially_relevant':
      return (
        <span 
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-1 rounded-full shadow-xs"
          title="Verify relevance to your specific product version."
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>! Potentially relevant — verify applicability</span>
        </span>
      );

    case 'insufficient_evidence':
    default:
      return (
        <span 
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/80 px-2.5 py-1 rounded-full shadow-xs"
          title="No strong reference matching this query was found in the database."
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>i Insufficient verified evidence</span>
        </span>
      );
  }
}
