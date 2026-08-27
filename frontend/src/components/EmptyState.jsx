import React from 'react';
import { Search } from 'lucide-react';

export default function EmptyState({ message = "No records found", description = "Try adjusting your filters or search terms." }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-12 border border-dashed border-slate-200 bg-white rounded-xl max-w-md mx-auto">
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-full text-slate-400 mb-3">
        <Search className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-sm text-slate-800 tracking-wide">
        {message}
      </h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
