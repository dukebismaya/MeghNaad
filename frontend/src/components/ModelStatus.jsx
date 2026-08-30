import React from "react";
import { Server, CheckCircle2, XCircle } from "lucide-react";

export default function ModelStatus({ mlStatus }) {
  if (!mlStatus) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Model Information</h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Name</p>
            <p className="text-sm font-bold text-slate-200">{mlStatus.model_name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Version</p>
            <p className="text-sm font-mono text-cyan-400">{mlStatus.model_version}</p>
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
