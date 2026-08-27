import React, { useState } from 'react';
import { FileText, BookOpen, ExternalLink, ChevronDown, ChevronUp, Clock, Hash } from 'lucide-react';

export default function SourceCard({ source }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely extract fields and hide if N/A or empty
  const docNumber = source.is_number && source.is_number !== 'N/A' ? source.is_number : null;
  const docTitle = source.title && source.title !== 'N/A' ? source.title : null;
  const docType = source.document_type && source.document_type !== 'N/A' ? source.document_type : null;
  const sectionName = source.section_name && source.section_name !== 'N/A' ? source.section_name : null;
  const pageNum = source.page_number && source.page_number !== 'N/A' ? source.page_number : null;
  const content = source.content && source.content !== 'N/A' ? source.content : null;
  const lastVerified = source.last_verified_at && source.last_verified_at !== 'N/A' ? source.last_verified_at : null;
  const url = source.source_url && source.source_url !== 'N/A' ? source.source_url : null;

  return (
    <div className={`gov-card overflow-hidden border border-slate-200/80 bg-white ${isExpanded ? 'ring-1 ring-slate-400 bg-slate-50/10' : ''}`}>
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex justify-between items-start gap-3 select-none"
      >
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {docNumber && (
              <span className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded tracking-wide font-mono">
                {docNumber}
              </span>
            )}
            {docType && (
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                {docType}
              </span>
            )}
          </div>
          {docTitle && (
            <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
              {docTitle}
            </h4>
          )}
        </div>
        <div className="p-1 rounded bg-slate-50 border border-slate-250 text-slate-500 hover:text-slate-700">
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/40 text-xs flex flex-col gap-3">
          {/* Section & Page Metadata */}
          <div className="flex flex-wrap gap-4 text-[10px] font-semibold text-slate-500 mt-2">
            {sectionName && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-slate-400" />
                {sectionName}
              </span>
            )}
            {pageNum && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" />
                Page {pageNum}
              </span>
            )}
            {lastVerified && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Verified: {lastVerified}
              </span>
            )}
          </div>

          {/* Snippet text */}
          {content && (
            <p className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/60 select-text">
              "{content}"
            </p>
          )}

          {/* Source Link */}
          {url && (
            <div className="flex justify-end pt-1">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-orange-600 font-bold flex items-center gap-1 hover:underline text-[10px] bg-white border border-slate-200 px-2 py-1 rounded"
              >
                <span>View Source Standard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
