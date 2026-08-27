import React from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import StandardCard from '../components/StandardCard';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Standards({
  selectedSector,
  setSelectedSector,
  browseStandards,
  loadingBrowse,
  searchFilter,
  setSearchFilter
}) {
  // Client-side text filter on standards data returned from backend
  const filteredStandards = browseStandards.filter((std) => {
    const term = searchFilter.toLowerCase().trim();
    if (!term) return true;

    return (
      (std.is_number && std.is_number.toLowerCase().includes(term)) ||
      (std.title && std.title.toLowerCase().includes(term)) ||
      (std.product_category && std.product_category.toLowerCase().includes(term)) ||
      (std.scope && std.scope.toLowerCase().includes(term))
    );
  });

  const sectorsList = [
    { id: 'all', label: 'All Sectors' },
    { id: 'electrical safety', label: 'Electrical Safety' },
    { id: 'packaged food', label: 'Packaged Food' },
    { id: 'textiles', label: 'Textiles' },
    { id: 'construction', label: 'Construction' },
    { id: 'other', label: 'Other Sectors' }
  ];

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Page Header */}
      <section className="border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-slate-800" />
          <span>Explore Indian Standards</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Search and browse verified Bureau of Indian Standards (BIS) publications and technical scopes.
        </p>
      </section>

      {/* Search & Filter Controls */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Search text input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by IS number, product or topic..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 focus:border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs outline-none placeholder-slate-400 text-slate-800 transition"
          />
        </div>

        {/* Info count */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-slate-500 font-medium px-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing {filteredStandards.length} standards</span>
        </div>
      </section>

      {/* Sector filter tabs */}
      <section className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
        {sectorsList.map((sector) => {
          const isActive = selectedSector === sector.id;
          return (
            <button
              key={sector.id}
              onClick={() => setSelectedSector(sector.id)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                isActive
                  ? 'bg-slate-950 border-slate-950 text-white shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-900'
              }`}
            >
              {sector.label}
            </button>
          );
        })}
      </section>

      {/* Results grid */}
      <section className="flex-1">
        {loadingBrowse ? (
          <LoadingSkeleton type="list" />
        ) : filteredStandards.length === 0 ? (
          <EmptyState
            message="No standards found"
            description={
              selectedSector !== 'all' && browseStandards.length === 0
                ? `No standards have been seeded yet for sector "${selectedSector}". Try switching to All Sectors.`
                : "Verify spelling or standard code. Try searching by generic term like 'cable', 'switch', or 'water'."
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filteredStandards.map((std) => (
              <StandardCard key={std.id} standard={std} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
