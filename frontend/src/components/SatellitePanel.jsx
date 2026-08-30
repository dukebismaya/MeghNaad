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
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Satellite className="w-5 h-5 text-cyan-400" />
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
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400" 
                : band.available 
                  ? "bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800" 
                  : "bg-slate-900 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            {band.label}
          </button>
        ))}
      </div>

      <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)]" />
        
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
