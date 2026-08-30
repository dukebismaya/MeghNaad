import React, { useState } from "react";
import { Satellite, Image as ImageIcon } from "lucide-react";

export default function SatellitePanel({ mlStatus }) {
  const [activeBand, setActiveBand] = useState("IR");
  const isDemo = !mlStatus?.model_loaded || mlStatus?.is_demo;

  const bands = [
    { id: "IR", label: "Infrared", available: true },
    { id: "WV", label: "Water Vapor", available: false },
    { id: "VIS", label: "Visible", available: false },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Satellite className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Satellite Analysis</h3>
      </div>

      <div className="flex gap-2 mb-4">
        {bands.map(band => (
          <button
            key={band.id}
            onClick={() => band.available && setActiveBand(band.id)}
            disabled={!band.available}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              activeBand === band.id 
                ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                : band.available 
                  ? "bg-black/40 border-white/10 text-gray-400 hover:bg-black/60" 
                  : "bg-black/20 border-transparent text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            {band.label}
          </button>
        ))}
      </div>

      <div className="aspect-video bg-black/60 rounded-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05),transparent_70%)]" />
        
        {isDemo ? (
          <div className="text-center z-10 p-4">
            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-500">IMAGE UNAVAILABLE</p>
            <p className="text-xs text-slate-600 mt-1">Satellite tile service not connected in DEMO mode</p>
          </div>
        ) : (
          <div className="text-center z-10 p-4">
            <p className="text-sm font-bold text-slate-300">INSAT-3D {activeBand}</p>
            <p className="text-xs text-slate-500 mt-1">Simulated Feed</p>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-slate-300 z-10">
          Source: INSAT-3D
        </div>
      </div>
    </div>
  );
}
