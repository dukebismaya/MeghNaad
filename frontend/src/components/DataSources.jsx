import React from "react";
import { Database, CheckCircle2, XCircle } from "lucide-react";

export default function DataSources({ mlStatus }) {
  if (!mlStatus) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Data Sources</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div>
            <p className="text-sm font-bold text-slate-200">INSAT-3D</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Satellite imagery</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">AVAILABLE</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div>
            <p className="text-sm font-bold text-slate-200">ERA5</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Environmental grid</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">CONNECTED</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
          <div>
            <p className="text-sm font-bold text-slate-200">IBTrACS</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Historical tracks</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">CONNECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
