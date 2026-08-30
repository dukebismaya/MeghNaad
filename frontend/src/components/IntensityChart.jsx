import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingDown } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black/80 border border-white/10 p-3 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs">
      <p className="font-bold text-gray-200 mb-2 border-b border-white/10 pb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="flex justify-between gap-4 py-0.5">
          <span>{p.name}:</span>
          <span className="font-mono font-bold">
            {p.value != null ? p.value.toFixed(1) : "—"} {p.dataKey.includes("pressure") ? "hPa" : "kts"}
          </span>
        </p>
      ))}
    </div>
  );
};

export default function IntensityChart({ mlData, historicalData }) {
  if (!mlData) return null;

  // We construct unified chart data combining historical data and ML predictions
  const chartData = [];
  
  if (historicalData && historicalData.length > 0) {
    historicalData.forEach(point => {
      // Assuming point has label like "-72h", actual_pressure, actual_wind
      if (point.actual_pressure || point.actual_wind) {
        chartData.push({
          label: point.label,
          actual_pressure: point.actual_pressure,
          actual_wind: point.actual_wind,
          predicted_pressure: null,
          predicted_wind: null
        });
      }
    });
  }

  // Add "Now" point from ML Current State
  chartData.push({
    label: "Now",
    actual_pressure: mlData.current_state.central_pressure_hpa,
    actual_wind: mlData.current_state.wind_speed_kt,
    predicted_pressure: mlData.current_state.central_pressure_hpa,
    predicted_wind: mlData.current_state.wind_speed_kt
  });

  // Add predictions
  mlData.intensity_prediction.forEach(pred => {
    chartData.push({
      label: `+${pred.forecast_hour}h`,
      actual_pressure: null,
      actual_wind: null,
      predicted_pressure: pred.pressure_hpa,
      predicted_wind: pred.wind_speed_kt
    });
  });

  return (
    <div className="glass-card p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 shrink-0">
        <TrendingDown className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Intensity Forecast</h3>
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="label" 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              axisLine={{ stroke: "#334155" }} 
              tickLine={false} 
            />
            <YAxis 
              yAxisId="pressure"
              domain={["dataMin - 15", "dataMax + 10"]} 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              orientation="left"
            />
            <YAxis 
              yAxisId="wind"
              domain={["dataMin - 10", "dataMax + 20"]} 
              tick={{ fill: "#64748b", fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Now" stroke="#475569" strokeDasharray="4 4" yAxisId="pressure" />
            
            {/* Pressure Lines */}
            <Line yAxisId="pressure" type="monotone" dataKey="actual_pressure" name="Obs. Pressure" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3, fill: "#f43f5e" }} connectNulls={false} />
            <Line yAxisId="pressure" type="monotone" dataKey="predicted_pressure" name="Pred. Pressure" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#f43f5e" }} />
            
            {/* Wind Lines */}
            <Line yAxisId="wind" type="monotone" dataKey="actual_wind" name="Obs. Wind" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} connectNulls={false} />
            <Line yAxisId="wind" type="monotone" dataKey="predicted_wind" name="Pred. Wind" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3, fill: "#ef4444" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-3 text-[10px] uppercase tracking-wider shrink-0">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-rose-500 inline-block" /> Pressure (hPa)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Wind (kt)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-500 inline-block" /> Observed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-500 inline-block border-dashed border-b" /> Predicted</span>
      </div>
    </div>
  );
}
