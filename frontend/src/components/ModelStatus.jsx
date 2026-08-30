import React from "react";
import { Cpu, CheckCircle2, XCircle } from "lucide-react";

export default function ModelStatus({ mlStatus }) {
  if (!mlStatus) return null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Model Info</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Architecture</p>
            <p className="text-sm font-bold text-gray-200">{mlStatus.model_name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Version</p>
            <p className="text-sm font-mono font-bold text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">{mlStatus.model_version}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Capabilities</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Cyclone Detection
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Classification
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Track Prediction
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Intensity Prediction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
