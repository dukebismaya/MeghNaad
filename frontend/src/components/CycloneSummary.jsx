import React from "react";
import { AlertTriangle, Wind, Gauge, Activity, Navigation, Crosshair, CheckCircle2 } from "lucide-react";

export default function CycloneSummary({ mlData, activeCyclone }) {
  if (!mlData) return <div className="p-4 text-slate-500">Waiting for model data...</div>;

  const { detection, classification, current_state } = mlData;
  const isDemo = mlData.is_demo;

  const categoryColor = (cat) => {
    if (cat.includes("Super")) return "text-fuchsia-400";
    if (cat.includes("Extremely")) return "text-red-400";
    if (cat.includes("Very Severe")) return "text-orange-400";
    if (cat.includes("Severe")) return "text-amber-400";
    return "text-yellow-400";
  };

  const categoryBg = (cat) => {
    if (cat.includes("Super")) return "bg-fuchsia-500/15 border-fuchsia-500/30";
    if (cat.includes("Extremely")) return "bg-red-500/15 border-red-500/30";
    if (cat.includes("Very Severe")) return "bg-orange-500/15 border-orange-500/30";
    if (cat.includes("Severe")) return "bg-amber-500/15 border-amber-500/30";
    return "bg-yellow-500/15 border-yellow-500/30";
  };

  return (
    <div className="space-y-4">
      {isDemo && (
        <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 text-center">
          <p className="text-amber-400 font-bold text-sm tracking-widest">DEMO MODE</p>
          <p className="text-amber-500/70 text-xs">Simulated values for demonstration</p>
        </div>
      )}

      {/* Main Alert Card */}
      <div className={`rounded-xl border p-5 ${categoryBg(classification.category)} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-3 opacity-20">
          <AlertTriangle className="w-24 h-24" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <AlertTriangle className={`w-8 h-8 mt-1 shrink-0 ${categoryColor(classification.category)}`} />
          <div>
            <h2 className="text-sm font-bold text-slate-400 tracking-wider">ACTIVE SYSTEM</h2>
            <p className={`text-xl font-black mt-1 uppercase ${categoryColor(classification.category)}`}>
              {classification.category}
            </p>
            {activeCyclone && (
              <p className="text-sm font-semibold text-slate-100 mt-1">
                Cyclone {activeCyclone.info.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* Wind Speed */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <Wind className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Wind Speed</p>
          <p className="text-2xl font-black font-mono text-white mt-1 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {current_state.wind_speed_kt} <span className="text-xs text-gray-500 font-sans">kt</span>
          </p>
        </div>

        {/* Central Pressure */}
        <div className="glass-card p-4 flex flex-col items-center justify-center">
          <Gauge className="w-5 h-5 text-amber-400 mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Central Pressure</p>
          <p className="text-2xl font-black font-mono text-white mt-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
            {current_state.central_pressure_hpa} <span className="text-xs text-gray-500 font-sans">hPa</span>
          </p>
        </div>
        
        {/* Current Location */}
        <div className="glass-card p-4 flex flex-col items-center justify-center col-span-2">
          <Crosshair className="w-5 h-5 text-red-500 mb-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Current Location</p>
          <p className="text-lg font-black font-mono text-white mt-1">
            {current_state.latitude.toFixed(2)}° N, {current_state.longitude.toFixed(2)}° E
          </p>
        </div>
      </div>

      {/* Confidence Indicators */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-red-500"/> Model Confidence</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-300">Detection Confidence</span>
              <span className="font-mono font-bold text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{(detection.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full relative" style={{ width: `${detection.confidence * 100}%` }}>
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-gray-300">Classification Confidence</span>
              <span className="font-mono font-bold text-red-400 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]">{(classification.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-2 rounded-full relative" style={{ width: `${classification.confidence * 100}%` }}>
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
