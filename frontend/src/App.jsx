import { useState, useEffect } from "react";
import Header from "./components/Header";
import CycloneSummary from "./components/CycloneSummary";
import CycloneMap from "./components/CycloneMap";
import ForecastPanel from "./components/ForecastPanel";
import IntensityChart from "./components/IntensityChart";
import ExplainabilityPanel from "./components/ExplainabilityPanel";
import ModelStatus from "./components/ModelStatus";
import DataSources from "./components/DataSources";
import SatellitePanel from "./components/SatellitePanel";

import { 
  getActiveCyclones, 
  getXaiHeatmap, 
  getMlStatus, 
  predictCyclone 
} from "./services/api";

export default function App() {
  const [activeCyclones, setActiveCyclones] = useState([]);
  const [selectedCycloneIdx, setSelectedCycloneIdx] = useState(0);
  const [xaiData, setXaiData] = useState(null);
  const [mlStatus, setMlStatus] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        // 1. Fetch ML Status
        const status = await getMlStatus().catch(() => null);
        setMlStatus(status || { is_demo: true, model_loaded: false, model_name: "Demo", model_version: "v0" });

        // 2. Fetch Active Cyclones (Historical / Legacy Endpoint)
        const cyclones = await getActiveCyclones().catch(() => []);
        setActiveCyclones(cyclones);

        // 3. Fetch XAI Metadata
        const xai = await getXaiHeatmap().catch(() => null);
        setXaiData(xai);

        // 4. Request ML Prediction (Using dummy input for now)
        const prediction = await predictCyclone({ dummy_input: "test" }).catch(() => null);
        setMlPrediction(prediction);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Unable to connect to inference service.");
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-sans">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold tracking-widest uppercase animate-pulse">Loading Cyclone Intelligence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-red-400 font-sans p-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl max-w-md">
          <p className="text-xl font-bold tracking-wider mb-2">SYSTEM ERROR</p>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  const currentLegacyCyclone = activeCyclones[selectedCycloneIdx];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Header apiStatus="online" mlStatus={mlStatus || mlPrediction} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[400px] shrink-0 border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-y-auto custom-scrollbar p-5 z-10 shadow-2xl">
          <CycloneSummary mlData={mlPrediction} activeCyclone={currentLegacyCyclone} />
          <div className="mt-6 flex-1 min-h-[300px]">
            <IntensityChart mlData={mlPrediction} historicalData={currentLegacyCyclone?.track} />
          </div>
        </aside>

        {/* Main Map */}
        <main className="flex-1 relative z-0">
          <CycloneMap mlData={mlPrediction} historicalData={currentLegacyCyclone?.track} />
        </main>

        {/* Right Sidebar */}
        <aside className="w-[420px] shrink-0 border-l border-slate-800/60 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-y-auto custom-scrollbar p-5 z-10 shadow-2xl">
          <ForecastPanel mlData={mlPrediction} />
          <SatellitePanel mlStatus={mlStatus || mlPrediction} />
          <div className="my-4">
            <ExplainabilityPanel xaiData={xaiData} mlData={mlPrediction} />
          </div>
          <DataSources mlStatus={mlStatus} />
          <ModelStatus mlStatus={mlStatus || mlPrediction} />
        </aside>
      </div>
    </div>
  );
}
