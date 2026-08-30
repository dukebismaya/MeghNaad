import React from "react";
import { Radar, Satellite, ShieldCheck, Radio } from "lucide-react";

export default function Header({ apiStatus, mlStatus }) {
  const isDemo = !mlStatus?.model_loaded || mlStatus?.is_demo;

  return (
    <header className="glass border-b border-slate-800/60 px-6 py-3 flex items-center justify-between z-[1000] shrink-0 relative">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Radar className="w-6 h-6 text-cyan-400" />
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-cyan-400">INSAT-3D</span>{" "}
            <span className="text-slate-100">CYCLONE INTELLIGENCE</span>
          </h1>
        </div>
        <div className="h-4 w-px bg-slate-700 mx-2 hidden md:block"></div>
        <span className="text-xs text-slate-400 hidden md:block tracking-widest uppercase">
          AI-Powered Tropical Cyclone Identification & Forecasting
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* ML Model Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 border rounded-full px-3 py-1.5 font-bold ${isDemo ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isDemo ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {isDemo ? "MODEL STATUS: DEMO MODE" : "MODEL STATUS: CONNECTED"}
          </div>
        </div>

        {/* Data Sources Badge */}
        <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/40 rounded-full px-4 py-1.5 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-300 border-r border-slate-700 pr-2 mr-1">INSAT-3D</span>
          <span className="text-slate-300 border-r border-slate-700 pr-2 mr-1">ERA5</span>
          <span className="text-slate-300">IBTrACS</span>
        </div>
      </div>
    </header>
  );
}
