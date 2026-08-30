import React from "react";
import { Clock, ChevronRight } from "lucide-react";

export default function ForecastPanel({ mlData }) {
  if (!mlData || !mlData.track_prediction) return null;

  const confidenceColor = (c) => {
    if (c >= 0.85) return "border-emerald-400 bg-emerald-400/20";
    if (c >= 0.7) return "border-amber-400 bg-amber-400/20";
    return "border-red-400 bg-red-400/20";
  };

  const textColor = (c) => {
    if (c >= 0.85) return "text-emerald-400";
    if (c >= 0.7) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="glass-card p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-red-500" />
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Track Forecast</h3>
      </div>
      <div className="space-y-3">
        {mlData.track_prediction.map((f, idx) => (
          <div key={idx} className="flex items-center gap-4 bg-black/40 border border-white/5 rounded-lg p-3 hover:bg-black/60 transition-colors shadow-inner">
            {/* Timeline dot */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full border-2 ${confidenceColor(f.confidence)}`} />
              {idx < mlData.track_prediction.length - 1 && (
                <div className="w-px h-6 bg-slate-800" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-200">
                  +{f.forecast_hour}h Forecast
                </span>
                <span className={`text-xs font-mono font-bold ${textColor(f.confidence)} drop-shadow-[0_0_5px_currentColor]`}>
                  {(f.confidence * 100).toFixed(0)}% conf
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {f.latitude.toFixed(2)}° N, {f.longitude.toFixed(2)}° E
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
