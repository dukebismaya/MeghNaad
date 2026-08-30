import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { _GlobeView, MapView } from "@deck.gl/core";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import { Layers, Globe, Map } from "lucide-react";

const ESRI_DARK = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";

export default function CycloneMap({ mlData, historicalData }) {
  const [is3D, setIs3D] = useState(true);

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
    data: ESRI_DARK,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;
      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
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
    getColor: [244, 63, 94, 200], // rose-500
    getWidth: 20000,
    widthMinPixels: 2,
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

  return (
    <div className="h-full w-full relative group">
      <DeckGL
        views={is3D ? new _GlobeView({ id: "globe", resolution: 10 }) : new MapView({ id: "map" })}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[tileLayer, historicalPathLayer, predictedPathLayer, uncertaintyCircles, currentLocationMarker]}
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
          <Layers className="w-3 h-3 text-red-500 drop-shadow-[0_0_5px_currentColor]" /> Map Layers
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked readOnly className="accent-red-500 rounded bg-slate-900 border-slate-700" /> Base Map
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked readOnly className="accent-red-500 rounded bg-slate-900 border-slate-700" /> Cyclone Track
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input type="checkbox" checked readOnly className="accent-red-500 rounded bg-slate-900 border-slate-700" /> Forecast Cone
          </label>
        </div>
      </div>
    </div>
  );
}
