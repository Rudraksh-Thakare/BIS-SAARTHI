import React from 'react';
import { MessageSquare, BookOpen, Layers, Info, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'browse', label: 'Standards Explorer', icon: BookOpen },
    { id: 'services', label: 'BIS Services', icon: Layers },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 min-h-screen border-r border-slate-800 shrink-0">
        {/* Brand/Logo Section */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-wider uppercase text-slate-100">
              BIS-SAARTHI
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Indian Standards Assistant
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Professional Help Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 flex flex-col gap-1.5 select-none">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <HelpCircle className="w-4 h-4 text-orange-500" />
            <span>Need Help?</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Explore verified Indian Standards and BIS services details.
          </p>
          <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden mt-1.5 flex">
            <div className="bg-orange-500 w-1/3"></div>
            <div className="bg-white w-1/3"></div>
            <div className="bg-emerald-600 w-1/3"></div>
          </div>
        </div>
      </aside>

      {/* Mobile Responsive Navigation Bar (Sticky Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 flex justify-around items-center py-2 px-1 shadow-lg">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all cursor-pointer ${
                isActive ? 'text-orange-500 font-bold' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-wide font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
