import React from "react";
import { Database, CheckCircle2, XCircle } from "lucide-react";

export default function DataSources({ mlStatus }) {
  if (!mlStatus) return null;

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Data Sources</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
          <div>
            <p className="text-sm font-bold text-gray-200">INSAT-3D</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Satellite imagery</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> <span className="text-red-400 font-bold">AVAILABLE</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
          <div>
            <p className="text-sm font-bold text-gray-200">ERA5</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Environmental grid</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> <span className="text-red-400 font-bold">CONNECTED</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 shadow-inner">
          <div>
            <p className="text-sm font-bold text-gray-200">IBTrACS</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Historical tracks</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" /> <span className="text-red-400 font-bold">CONNECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
