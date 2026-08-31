import React from 'react';
import { Network, Database, Cpu, Activity, Map, Wind, Eye, Layers, Satellite } from 'lucide-react';

export default function Overview() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-8 pb-4">
          <h1 className="text-5xl font-black tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            Understanding <span className="text-red-500">Megh</span><span className="text-slate-100">Naad</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            A state-of-the-art multimodal AI framework for the early detection, tracking, and intensity forecasting of tropical cyclones in the North Indian Ocean basin.
          </p>
        </div>

        {/* Section 1: The Architecture */}
        <section className="glass-card p-8 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10"></div>
          
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
            <Network className="w-8 h-8 text-red-500" />
            Multimodal Architecture
          </h2>
          
          <p className="text-slate-300 mb-8 leading-relaxed">
            MeghNaad doesn't rely on a single stream of data. Like modern meteorological centers, it ingests multiple modalities of data simultaneously to build a comprehensive understanding of storm dynamics.
          </p>

          {/* Visualization Diagram */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-6 bg-black/40 rounded-xl border border-white/5">
            
            {/* Inputs */}
            <div className="flex flex-col gap-4 w-full lg:w-1/3">
              <div className="glass p-4 rounded-lg flex items-center gap-4 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <div className="p-3 bg-red-500/20 rounded-lg"><Satellite className="w-6 h-6 text-red-400" /></div>
                <div>
                  <h4 className="font-bold text-sm">INSAT-3D Imagery</h4>
                  <p className="text-[10px] text-slate-400">IR, Water Vapor, Visible bands</p>
                </div>
              </div>
              <div className="glass p-4 rounded-lg flex items-center gap-4 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <div className="p-3 bg-blue-500/20 rounded-lg"><Database className="w-6 h-6 text-blue-400" /></div>
                <div>
                  <h4 className="font-bold text-sm">ERA5 Reanalysis</h4>
                  <p className="text-[10px] text-slate-400">Pressure, Wind, SST grids</p>
                </div>
              </div>
              <div className="glass p-4 rounded-lg flex items-center gap-4 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                <div className="p-3 bg-yellow-500/20 rounded-lg"><Map className="w-6 h-6 text-yellow-400" /></div>
                <div>
                  <h4 className="font-bold text-sm">IBTrACS Data</h4>
                  <p className="text-[10px] text-slate-400">Historical geospatial tracks</p>
                </div>
              </div>
            </div>

            {/* AI Core */}
            <div className="flex items-center justify-center w-full lg:w-1/4 py-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full group-hover:bg-red-500/50 transition-all duration-500"></div>
                <div className="relative glass border-red-500/50 p-6 rounded-2xl flex flex-col items-center z-10 animate-pulse-slow">
                  <Cpu className="w-12 h-12 text-red-500 mb-2" />
                  <span className="font-black tracking-widest text-sm">PyTorch</span>
                  <span className="text-[10px] text-slate-400 uppercase">Ensemble Net</span>
                </div>
              </div>
            </div>

            {/* Outputs */}
            <div className="flex flex-col gap-4 w-full lg:w-1/3">
              <div className="glass p-4 rounded-lg flex items-center gap-4">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold">Detection & Classification</span>
              </div>
              <div className="glass p-4 rounded-lg flex items-center gap-4">
                <Wind className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-bold">Intensity Prediction (+24h)</span>
              </div>
              <div className="glass p-4 rounded-lg flex items-center gap-4">
                <Layers className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-bold">Trajectory Forecasting</span>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Maps and Points */}
        <section className="grid md:grid-cols-2 gap-8">
          
          <div className="glass-card p-8 rounded-2xl border border-slate-700/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
             <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <Map className="w-6 h-6 text-blue-400" />
                Understanding the Track Map
             </h2>
             <p className="text-slate-300 text-sm leading-relaxed mb-6">
                The globe visualizes the life cycle of the selected cyclone using high-resolution base layers and dynamically colored node markers.
             </p>
             <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                  <div>
                    <span className="font-bold text-slate-200">Depressions ({"<"}34 kt)</span>
                    <p className="text-slate-400 text-xs mt-1">Early stage formation marked in blue.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-orange-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                  <div>
                    <span className="font-bold text-slate-200">Severe Cyclonic Storms (48-89 kt)</span>
                    <p className="text-slate-400 text-xs mt-1">Yellow to Orange/Red markers indicate rapid intensification phases.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-black/20 p-3 rounded-lg">
                  <span className="w-3 h-3 rounded-full bg-fuchsia-500 mt-1 shrink-0 shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
                  <div>
                    <span className="font-bold text-slate-200">Super Cyclones (120+ kt)</span>
                    <p className="text-slate-400 text-xs mt-1">Fuchsia markers highlight the peak devastating intensity of the storm.</p>
                  </div>
                </li>
             </ul>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-slate-700/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
             <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-purple-400" />
                Forecast Cones & Predictions
             </h2>
             <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Predicting a cyclone's exact path is difficult. MeghNaad provides probabilistic models rather than deterministic guesses.
             </p>
             <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-red-400 mb-2">The Uncertainty Cone</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The faint red expanding circles on the map represent the model's spatial uncertainty. As the forecast hour extends (+6h to +24h), the cone widens, illustrating the increasing array of potential landfall scenarios.
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <h4 className="font-bold text-red-400 mb-2">Intensity Forecasting Chart</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The dual-axis chart in the dashboard tracks the inverse relationship between Central Pressure (hPa) and Sustained Wind Speed (Kt). As pressure drops, the system tightens and wind speeds spike.
                  </p>
                </div>
             </div>
          </div>
          
        </section>

      </div>
    </div>
  );
}
