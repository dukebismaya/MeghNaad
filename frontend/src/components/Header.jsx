import React, { useState } from "react";
import { Tornado, Satellite, ShieldCheck, Radio, Search } from "lucide-react";

export default function Header({ apiStatus, mlStatus, onSearchChange, searchResults, onSelectCyclone }) {
  const isDemo = !mlStatus?.model_loaded || mlStatus?.is_demo;
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) onSearchChange(val);
    setShowDropdown(val.length > 0);
  };

  const handleSelect = (id) => {
    if (onSelectCyclone) onSelectCyclone(id);
    setQuery("");
    setShowDropdown(false);
  };


  return (
    <header className="glass border-b border-slate-800/60 px-6 py-3 flex items-center justify-between z-[1000] shrink-0 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Tornado className="w-6 h-6 text-red-500" />
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-red-500">Megh</span><span className="text-slate-100">Naad</span>
          </h1>
        </div>
        <div className="h-4 w-px bg-slate-700 mx-2 hidden md:block"></div>
        <span className="text-xs text-slate-400 hidden md:block tracking-widest uppercase font-bold">
          AI-Powered Tropical Cyclone Identification
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(query.length > 0)}
            className="block w-full pl-10 pr-3 py-1.5 border border-slate-700 rounded-md leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm transition-colors" 
            placeholder="Search for region, basin, or historical cyclone..." 
          />
          {showDropdown && searchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              {searchResults.map(c => (
                <div 
                  key={c.cyclone_id} 
                  className="px-4 py-2 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0"
                  onClick={() => handleSelect(c.cyclone_id)}
                >
                  <div className="font-bold text-slate-200">{c.name} ({c.season})</div>
                  <div className="text-xs text-slate-400">{c.category} • {c.basin}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* ML Model Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-2 border rounded-full px-3 py-1.5 font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)] ${isDemo ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor] ${isDemo ? 'bg-amber-400' : 'bg-red-500'}`} />
            {isDemo ? "MODEL STATUS: DEMO MODE" : "MODEL STATUS: CONNECTED"}
          </div>
        </div>

        {/* Data Sources Badge */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-red-500/20 rounded-full px-4 py-1.5 text-xs font-mono shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
          <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="text-gray-300 border-r border-red-900/50 pr-2 mr-1">INSAT-3D</span>
          <span className="text-gray-300 border-r border-red-900/50 pr-2 mr-1">ERA5</span>
          <span className="text-gray-300">IBTrACS</span>
        </div>
      </div>
    </header>
  );
}
