import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { _GlobeView, MapView } from "@deck.gl/core";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { Layers, Globe, Map } from "lucide-react";

const ESRI_SATELLITE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_DARK = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

export default function CycloneMap({ mlData, historicalData }) {
  const [is3D, setIs3D] = useState(true);
  const [showBaseMap, setShowBaseMap] = useState(true);
  const [showTrack, setShowTrack] = useState(true);
  const [showForecast, setShowForecast] = useState(true);
  const [mapStyle, setMapStyle] = useState('satellite'); // 'satellite' or 'dark'

  if (!mlData || !mlData.current_state) return <div className="h-full w-full bg-slate-950"></div>;

  const currentLat = mlData.current_state.latitude;
  const currentLon = mlData.current_state.longitude;
  
  const INITIAL_VIEW_STATE = {
    longitude: currentLon,
    latitude: currentLat,
    zoom: 3.5,
    pitch: is3D ? 45 : 0,
    bearing: 0
  };

  // Base map layer using tiles mapped onto the globe or map
  const tileLayer = new TileLayer({
    id: "tile-layer",
    data: mapStyle === 'satellite' ? ESRI_SATELLITE : ESRI_DARK,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]],
        opacity: mapStyle === 'satellite' ? 0.7 : 1.0 // Slightly dim satellite for better contrast with overlays
      });
    }
  });

  // Track data preparation
  const histCoords = historicalData?.map(p => [p.lon, p.lat]) || [];
  if (histCoords.length > 0) {
    histCoords.push([currentLon, currentLat]);
  }
  
  const predCoords = [[currentLon, currentLat], ...mlData.track_prediction.map(p => [p.longitude, p.latitude])];

  const historicalPathLayer = new PathLayer({
    id: 'historical-path',
    data: [{ path: histCoords }],
    getPath: d => d.path,
    getColor: [200, 200, 200, 150], // Light gray for the track line itself
    getWidth: 10000,
    widthMinPixels: 1.5,
  });

  const getWindColor = (windKts) => {
    if (!windKts) return [200, 200, 200, 200];
    if (windKts < 34) return [59, 130, 246, 255];   // Blue - Depression
    if (windKts < 48) return [234, 179, 8, 255];    // Yellow - CS
    if (windKts < 64) return [249, 115, 22, 255];   // Orange - SCS
    if (windKts < 90) return [239, 68, 68, 255];    // Red - VSCS
    if (windKts < 120) return [244, 63, 94, 255];   // Rose - ESCS
    return [217, 70, 239, 255];                     // Fuchsia - Super
  };

  const historicalPointsLayer = new ScatterplotLayer({
    id: 'historical-points',
    data: historicalData || [],
    getPosition: d => [d.lon, d.lat],
    getFillColor: d => getWindColor(d.wind_kts),
    getRadius: 15000,
    radiusMinPixels: 3,
    stroked: true,
    getLineColor: [0, 0, 0, 200],
    getLineWidth: 2000,
    lineWidthMinPixels: 1
  });

  const predictedPathLayer = new PathLayer({
    id: 'predicted-path',
    data: [{ path: predCoords }],
    getPath: d => d.path,
    getColor: [239, 68, 68, 255], // red-500
    getWidth: 25000,
    widthMinPixels: 3
  });

  const uncertaintyCircles = new ScatterplotLayer({
    id: 'uncertainty-circles',
    data: mlData.track_prediction,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: [239, 68, 68, 20], 
    getLineColor: [239, 68, 68, 120],
    getLineWidth: 2000,
    lineWidthMinPixels: 1,
    getRadius: d => 20000 + (d.forecast_hour * 500),
    stroked: true,
    filled: true
  });

  const currentLocationMarker = new ScatterplotLayer({
    id: 'current-location',
    data: [{ position: [currentLon, currentLat] }],
    getPosition: d => d.position,
    getFillColor: [239, 68, 68, 150],
    getRadius: 30000,
    stroked: true,
    getLineColor: [255, 255, 255, 255],
    getLineWidth: 3000,
    lineWidthMinPixels: 2
  });

  const activeLayers = [
    showBaseMap && tileLayer, 
    showTrack && historicalPathLayer, 
    showTrack && historicalPointsLayer,
    showForecast && predictedPathLayer, 
    showForecast && uncertaintyCircles, 
    currentLocationMarker
  ].filter(Boolean);

  return (
    <div className="h-full w-full relative group">
      <DeckGL
        views={is3D ? new _GlobeView({ id: "globe", resolution: 10 }) : new MapView({ id: "map" })}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={activeLayers}
        style={{ backgroundColor: '#020617' }} // space background
        getCursor={() => 'crosshair'}
      />
      
      {/* 2D/3D Toggle Control Overlay */}
      <div className="absolute top-4 right-4 z-[400] glass-card p-1.5 rounded-xl flex gap-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <button 
          onClick={() => setIs3D(false)}
          className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-bold transition-colors ${!is3D ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-gray-400 border border-transparent hover:text-gray-200 hover:bg-white/5'}`}
        >
          <Map className="w-3.5 h-3.5" /> 2D
        </button>
        <button 
          onClick={() => setIs3D(true)}
          className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-xs font-bold transition-colors ${is3D ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-gray-400 border border-transparent hover:text-gray-200 hover:bg-white/5'}`}
        >
          <Globe className="w-3.5 h-3.5" /> 3D
        </button>
      </div>

      {/* Map Layers Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-card p-4 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Layers className="w-3 h-3 text-red-500 drop-shadow-[0_0_5px_currentColor]" /> Map Controls
        </h4>
        <div className="space-y-2 mb-3 pb-3 border-b border-slate-700/50">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showBaseMap} onChange={() => setShowBaseMap(!showBaseMap)} className="accent-red-500 rounded bg-slate-900 border-slate-700 cursor-pointer" /> Base Map
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showTrack} onChange={() => setShowTrack(!showTrack)} className="accent-red-500 rounded bg-slate-900 border-slate-700 cursor-pointer" /> Historical Track
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white">
            <input type="checkbox" checked={showForecast} onChange={() => setShowForecast(!showForecast)} className="accent-red-500 rounded bg-slate-900 border-slate-700 cursor-pointer" /> Forecast Cone
          </label>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setMapStyle('satellite')}
             className={`flex-1 text-[10px] py-1 px-2 rounded font-bold ${mapStyle === 'satellite' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
           >
             SATELLITE
           </button>
           <button 
             onClick={() => setMapStyle('dark')}
             className={`flex-1 text-[10px] py-1 px-2 rounded font-bold ${mapStyle === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}`}
           >
             DARK
           </button>
        </div>
      </div>
    </div>
  );
}
