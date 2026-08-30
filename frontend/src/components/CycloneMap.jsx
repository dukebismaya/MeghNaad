import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Circle, useMap } from "react-leaflet";

const CARTO_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTR = '&copy; <a href="https://carto.com/">CARTO</a>';

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function CycloneMap({ mlData, historicalData }) {
  if (!mlData || !mlData.current_state) return <div className="h-full w-full bg-slate-950"></div>;

  const currentLat = mlData.current_state.latitude;
  const currentLon = mlData.current_state.longitude;
  const center = [currentLat, currentLon];
  
  // Prepare Track
  const histCoords = historicalData?.map(p => [p.lat, p.lon]) || [];
  if (histCoords.length > 0) {
    histCoords.push(center);
  }

  const predCoords = [center, ...mlData.track_prediction.map(p => [p.latitude, p.longitude])];

  return (
    <div className="h-full w-full relative group">
      <MapContainer center={center} zoom={5} zoomControl={true} className="h-full w-full z-0">
        <TileLayer url={CARTO_DARK} attribution={CARTO_ATTR} />
        <MapRecenter center={center} zoom={5} />

        {/* Historical Track */}
        {histCoords.length > 0 && (
          <Polyline positions={histCoords} pathOptions={{ color: "#38bdf8", weight: 2, dashArray: "4 6", opacity: 0.7 }} />
        )}

        {/* Predicted Track */}
        <Polyline positions={predCoords} pathOptions={{ color: "#ef4444", weight: 3, opacity: 0.9 }} />

        {/* Forecast Points Uncertainty Circles */}
        {mlData.track_prediction.map(fp => (
          <Circle
            key={fp.forecast_hour}
            center={[fp.latitude, fp.longitude]}
            radius={20000 + (fp.forecast_hour * 500)} // Uncertainty grows with time
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.15, weight: 1, opacity: 0.5 }}
          />
        ))}

        {/* Current Location Highlight */}
        <Circle
          center={center}
          radius={40000} // Wind radius approx
          pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.2, weight: 2, opacity: 0.8 }}
        />
        <Circle
          center={center}
          radius={5000} // Eye
          pathOptions={{ color: "#fff", fillColor: "#fff", fillOpacity: 1, weight: 1 }}
        />
      </MapContainer>
      
      {/* Map Layers Control Overlay */}
      <div className="absolute top-4 right-4 z-[400] glass p-4 rounded-xl border border-slate-700/50 shadow-2xl opacity-80 group-hover:opacity-100 transition-opacity">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Map Layers</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked readOnly className="accent-cyan-500 rounded bg-slate-900 border-slate-700" /> Base Map
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked readOnly className="accent-cyan-500 rounded bg-slate-900 border-slate-700" /> Cyclone Track
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked readOnly className="accent-cyan-500 rounded bg-slate-900 border-slate-700" /> Forecast Cone
          </label>
        </div>
      </div>
    </div>
  );
}
