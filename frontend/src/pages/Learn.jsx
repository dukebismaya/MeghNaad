import React from 'react';
import { BookOpen, HelpCircle, Code, ShieldQuestion, BrainCircuit } from 'lucide-react';

export default function Learn() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-950 text-slate-200">
      <div className="max-w-4xl mx-auto space-y-12 pb-16">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">MeghNaad: Internal Knowledge Base</h1>
          </div>
          <p className="text-slate-400">
            This hidden document is for team preparation. It covers the architecture, technologies used, key terminologies, and potential Q&A from judges.
          </p>
        </div>

        {/* Section 1: Project Summary & Tech Stack */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Code className="w-6 h-6 text-emerald-500" /> What We Built & Tech Stack
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="mb-4 leading-relaxed">
              <strong>MeghNaad</strong> is an AI-powered, multimodal tropical cyclone tracking and forecasting dashboard. It ingests multiple streams of meteorological data (Satellite imagery, Environmental sensors, Historical tracks) to predict cyclone intensity and future trajectory in the North Indian Ocean.
            </p>
            <h3 className="font-bold text-slate-300 mt-6 mb-3">Tech Stack:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <li className="bg-slate-900 p-3 rounded border border-slate-800">
                <span className="text-blue-400 font-bold">Frontend (UI/UX)</span>
                <p className="text-slate-400 mt-1">React, Vite, TailwindCSS (for glassmorphism UI), Lucide React (Icons).</p>
              </li>
              <li className="bg-slate-900 p-3 rounded border border-slate-800">
                <span className="text-orange-400 font-bold">Frontend (Mapping)</span>
                <p className="text-slate-400 mt-1">Deck.gl (high-performance WebGL mapping), MapLibre, ESRI Satellite Layers.</p>
              </li>
              <li className="bg-slate-900 p-3 rounded border border-slate-800">
                <span className="text-green-400 font-bold">Backend</span>
                <p className="text-slate-400 mt-1">FastAPI (Python) for rapid API serving, Uvicorn, Pandas (for IBTrACS data parsing).</p>
              </li>
              <li className="bg-slate-900 p-3 rounded border border-slate-800">
                <span className="text-red-400 font-bold">Machine Learning Core</span>
                <p className="text-slate-400 mt-1">PyTorch, Torchvision (MultiModalCycloneNet, CycloneTrajectoryLSTM).</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Data Sources */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BrainCircuit className="w-6 h-6 text-purple-500" /> Data Sources & Multimodal ML
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4 text-sm leading-relaxed">
            <p>Our PyTorch model is "Multimodal", meaning it doesn't just look at one type of data. It fuses three major datasets:</p>
            
            <div className="border-l-2 border-slate-700 pl-4 py-2">
              <h4 className="font-bold text-red-400 text-base">1. INSAT-3D (Satellite Imagery)</h4>
              <p className="text-slate-400 mt-1">India's geostationary weather satellite. We use Infrared (IR), Water Vapor (WV), and Visible (VIS) bands to see cloud structure and the storm's "eye". (Note: We use synthetic canvas generation on the frontend to visualize this telemetry dynamically).</p>
            </div>
            
            <div className="border-l-2 border-slate-700 pl-4 py-2">
              <h4 className="font-bold text-blue-400 text-base">2. ERA5 (Environmental Grids)</h4>
              <p className="text-slate-400 mt-1">ECMWF's atmospheric reanalysis dataset. This gives our model numeric grid data like Sea Surface Temperature (SST), Mean Sea Level Pressure (MSLP), and wind vectors.</p>
            </div>

            <div className="border-l-2 border-slate-700 pl-4 py-2">
              <h4 className="font-bold text-yellow-400 text-base">3. IBTrACS (Historical Tracks)</h4>
              <p className="text-slate-400 mt-1">The International Best Track Archive. This is our ground truth dataset (CSV in the backend). It provides historical Lat/Lon, wind speed, and pressure for every past cyclone to train the trajectory LSTM.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Terminologies */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BookOpen className="w-6 h-6 text-amber-500" /> Key Terminologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-white">MSLP (Mean Sea Level Pressure)</span>
              <p className="text-xs text-slate-400 mt-1">Measured in hPa (hectopascals). Lower pressure = stronger cyclone. A super cyclone can drop below 920 hPa.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-white">SST (Sea Surface Temperature)</span>
              <p className="text-xs text-slate-400 mt-1">Cyclones need warm water ({" > "}26.5°C or 299K) to fuel their thermodynamic engines.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-white">Knot (kt)</span>
              <p className="text-xs text-slate-400 mt-1">Nautical miles per hour. 1 knot ≈ 1.15 mph. Super cyclones exceed 120 kt.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-white">XAI (Explainable AI)</span>
              <p className="text-xs text-slate-400 mt-1">Heatmaps (like Grad-CAM) showing which part of the satellite image the AI looked at to make its decision.</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <span className="font-bold text-white">LSTM</span>
              <p className="text-xs text-slate-400 mt-1">Long Short-Term Memory. A type of neural network perfect for predicting sequences and time-series (like a storm's track).</p>
            </div>
          </div>
        </section>

        {/* Section 4: Cross Questions & Q&A */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <ShieldQuestion className="w-6 h-6 text-rose-500" /> Defense & Expected Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-400 mb-2">Q: Why did you use PyTorch instead of just scikit-learn?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Scikit-learn is great for tabular data, but our project requires fusing images (INSAT-3D) with sequential grid data (ERA5). PyTorch allows us to build custom architectures like our <span className="text-white font-mono text-xs">MultiModalCycloneNet</span> (a CNN combined with an MLP) and use LSTMs for the temporal track forecasting.
              </p>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-400 mb-2">Q: How do you handle the lack of real-time satellite imagery for the demo?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Real-time INSAT-3D feeds are extremely heavy and require proprietary ISRO access. To demonstrate our system's capabilities, we use the <strong>IBTrACS</strong> dataset as our telemetry ground truth, and we synthetically generate procedural satellite imagery on the frontend (using HTML5 Canvas) based on the exact wind speed and pressure metrics of the historical storms.
              </p>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-400 mb-2">Q: What is the red cone on the map?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> It's the <em>Uncertainty Cone</em>. Our LSTM predicts the most likely track (+6h, +12h, +18h, +24h), but atmospheric prediction isn't deterministic. The expanding red circles represent the probabilistic margin of error. As time extends, uncertainty increases, which is standard practice at centers like the IMD and NHC.
              </p>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-400 mb-2">Q: How is the Model Confidence calculated?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> The model generates raw categorical logits. We apply a Softmax function to calculate the mathematical probability. However, to account for real-world atmospheric volatility, we blend this raw neural net confidence with a meteorological heuristic (wind intensity factor). A well-defined 100-knot storm guarantees higher detection confidence than a forming 30-knot depression.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
