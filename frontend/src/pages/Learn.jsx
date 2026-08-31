import React from 'react';
import { BookOpen, HelpCircle, Code, ShieldQuestion, BrainCircuit, Activity, Database, Network, Globe2, Layers, Crosshair } from 'lucide-react';

export default function Learn() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto space-y-12 pb-16">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-8 mt-4">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl font-black tracking-tight text-white">MeghNaad: The Complete Knowledge Base</h1>
          </div>
          <p className="text-lg text-slate-400 leading-relaxed">
            This is the master internal documentation for <strong>Team Sentinels</strong>. It contains an exhaustive breakdown of the MeghNaad architecture, the AI/ML cores, our data pipeline, and a comprehensive defense guide for potential counter-questions from hackathon judges.
          </p>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Globe2 className="w-6 h-6 text-emerald-500" /> 1. Executive Summary & Core Mission
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="leading-relaxed text-slate-300">
              <strong>MeghNaad</strong> is an end-to-end, AI-driven meteorological dashboard designed for the North Indian Ocean basin. 
              Historically, predicting cyclone trajectories and intensities relies on massive, slow supercomputers running numerical weather prediction (NWP) models. 
              MeghNaad leverages <strong>Deep Learning (CNNs + LSTMs)</strong> to process multimodal satellite and environmental data in milliseconds, providing disaster management agencies with real-time, probabilistic forecasts (Uncertainty Cones) and clear IMD-standard classifications.
            </p>
          </div>
        </section>

        {/* Section 2: Technical Architecture */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Network className="w-6 h-6 text-blue-500" /> 2. System Architecture & Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Frontend */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><Layers className="w-4 h-4"/> Frontend (Client Layer)</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><strong className="text-white">React.js & Vite:</strong> For instantaneous component rendering and lightning-fast build times.</li>
                <li><strong className="text-white">Deck.gl & MapLibre:</strong> WebGL-accelerated mapping. Allows us to render hundreds of thousands of spatial data points (like the forecast cone and tracks) at 60 FPS without crashing the browser.</li>
                <li><strong className="text-white">TailwindCSS:</strong> For the custom, premium "Glassmorphism" design system, making the dashboard look like a modern command center.</li>
                <li><strong className="text-white">React Router:</strong> Enables seamless client-side routing between the Dashboard and the Overview pages.</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
              <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2"><Database className="w-4 h-4"/> Backend (API Layer)</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><strong className="text-white">FastAPI (Python):</strong> An asynchronous, high-performance web framework. Crucial because ML inference operations are blocking; FastAPI's async nature keeps the API responsive.</li>
                <li><strong className="text-white">Uvicorn:</strong> ASGI web server used to run FastAPI in production.</li>
                <li><strong className="text-white">Pandas & NumPy:</strong> Used for rapid parsing and pre-processing of the massive IBTrACS historical CSV dataset before it's sent to the frontend.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Section 3: The AI Core */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <BrainCircuit className="w-6 h-6 text-purple-500" /> 3. The PyTorch Machine Learning Core
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-6">
            <p className="text-sm text-slate-300">
              Our AI engine doesn't just look at one number; it fuses three distinct modalities of data to make its predictions. We built two bespoke neural network architectures:
            </p>

            <div className="border-l-2 border-purple-500 pl-4">
              <h4 className="font-bold text-white text-lg">Model A: MultiModalCycloneNet (Intensity & Classification)</h4>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                A hybrid architecture. It uses a <strong>Convolutional Neural Network (CNN)</strong> to extract spatial features from satellite imagery (the storm's eye, cloud banding), and a <strong>Multi-Layer Perceptron (MLP)</strong> to process numerical ERA5 environmental data (Pressure, SST, Lat/Lon). These two embeddings are concatenated and passed through dense layers to output the cyclone's IMD classification.
              </p>
            </div>

            <div className="border-l-2 border-orange-500 pl-4">
              <h4 className="font-bold text-white text-lg">Model B: CycloneTrajectoryLSTM (Track Forecasting)</h4>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                A <strong>Long Short-Term Memory (LSTM)</strong> sequence-to-sequence network. It takes the last 4 time-steps (T-24h to T-0h) of the storm's coordinates, pressure, and wind speed. Because LSTMs have "memory," the model inherently understands momentum and physics, predicting the next 4 steps (T+6h to T+24h) to generate the trajectory and the Uncertainty Cone.
              </p>
            </div>
            
            <div className="bg-black/30 p-4 rounded-lg">
              <h4 className="font-bold text-rose-400 text-sm mb-2">Data Sources Used:</h4>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><strong>INSAT-3D:</strong> Indian geostationary satellite providing Infrared (IR) and Water Vapor (WV) imagery. (Synthesized in the UI for the demo).</li>
                <li><strong>ERA5:</strong> European reanalysis data providing grid metrics like Sea Surface Temperature (SST) and Mean Sea Level Pressure (MSLP).</li>
                <li><strong>IBTrACS:</strong> The global ground-truth archive of historical cyclone tracks used to train the LSTM.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: IMD Classification Standards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Activity className="w-6 h-6 text-yellow-500" /> 4. IMD Classification Logic
          </h2>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <p className="text-sm text-slate-300 mb-4">
              MeghNaad strictly adheres to the official <strong>India Meteorological Department (IMD)</strong> standards for the North Indian Ocean. The backend dynamically categorizes the storm based on the maximum sustained wind speed (in knots):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900 p-3 rounded border border-blue-900"><strong className="text-blue-400">Depression</strong><br/>&lt; 28 knots</div>
              <div className="bg-slate-900 p-3 rounded border border-cyan-900"><strong className="text-cyan-400">Deep Depression</strong><br/>28 - 33 knots</div>
              <div className="bg-slate-900 p-3 rounded border border-yellow-900"><strong className="text-yellow-400">Cyclonic Storm</strong><br/>34 - 47 knots</div>
              <div className="bg-slate-900 p-3 rounded border border-orange-900"><strong className="text-orange-400">Severe Cyclonic Storm</strong><br/>48 - 63 knots</div>
              <div className="bg-slate-900 p-3 rounded border border-red-900"><strong className="text-red-400">Very Severe Cyclonic Storm</strong><br/>64 - 89 knots</div>
              <div className="bg-slate-900 p-3 rounded border border-fuchsia-900"><strong className="text-fuchsia-400">Super Cyclonic Storm</strong><br/>&ge; 90 knots</div>
            </div>
          </div>
        </section>

        {/* Section 5: The Ultimate Defense (Q&A) */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3 text-white border-b border-slate-800 pb-4">
            <ShieldQuestion className="w-8 h-8 text-rose-500" /> 5. The Ultimate Defense (Judge Q&A)
          </h2>
          <p className="text-slate-400">Memorize these answers. If a judge tries to poke holes in the project, these are the technically rigorous counter-arguments.</p>
          
          <div className="space-y-6">
            
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q1: Why use Deep Learning instead of traditional physics/NWP models?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Traditional Numerical Weather Prediction (NWP) models require supercomputers solving complex Navier-Stokes fluid dynamics equations, taking hours to run. Our AI approach is a <em>surrogate model</em>. We train the AI on the historical outputs of the ocean/atmosphere. Once trained, inference (predicting the track) takes milliseconds on a standard GPU. It democratizes advanced forecasting, providing immediate alerts during critical rapid-intensification phases.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q2: How do you handle missing or corrupt satellite data?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Because our model is <strong>Multimodal</strong>, it is robust against single-point failure. If the INSAT-3D visual feed is obscured or missing, the ERA5 numerical grids (Pressure, SST) and the historical IBTrACS LSTM memory ensure the prediction doesn't fail. The CNN handles imagery, but the MLP and LSTM rely on telemetry.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q3: Are you actually connected to ISRO MOSDAC live right now?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> We have MOSDAC API access, but for the scope of this hackathon demo, we are running a simulation using historical IBTrACS ground-truth data. Government APIs provide data in massive HDF5 binary files that require offline batch processing. Our production architecture involves a backend Cron job that downloads the HDF5s every 30 minutes, parses the arrays via Python `h5py`, and feeds them into the PyTorch model. For the frontend demo today, we procedurally generate the visual satellite feed based on exact historical telemetry to prove the UI's capability.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q4: Why did you use Deck.gl instead of standard Leaflet or Google Maps?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Performance and WebGL rendering. Standard DOM-based mapping libraries (like Leaflet) choke when rendering thousands of data points. Deck.gl leverages the GPU, allowing us to render massive datasets—like the expanding probabilistic Uncertainty Cone, 3D scatter plots, and complex historical tracks—at 60 Frames Per Second smoothly.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q5: What is the "Uncertainty Cone" and how is it calculated mathematically?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Forecasting the atmosphere is probabilistic, not deterministic. Our LSTM outputs a specific coordinate track, but the Uncertainty Cone represents the historical margin of error at +6, +12, +18, and +24 hours. The radii of the circles expand linearly over time because the further into the future you predict, the wider the variance of possible landfalls becomes. It prevents disaster agencies from focusing on a single "thin line" and ignoring surrounding danger zones.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q6: What is XAI (Explainable AI) and why is it necessary?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Neural networks are famously "black boxes." In disaster management, officials won't trust an AI unless they know *why* it made a decision. We implemented XAI using techniques like <strong>Grad-CAM</strong> (Gradient-weighted Class Activation Mapping). It generates a heatmap over the satellite imagery, proving to the meteorologist that the AI correctly identified the cyclone's "eye" or "spiral bands," rather than triggering off a random artifact in the ocean.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q7: How scalable is this? What if 10,000 citizens check the dashboard during a super cyclone?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Highly scalable. The architecture decouples the heavy AI inference from the web serving. The PyTorch model runs on the backend, computes the forecast once every few hours, and caches the JSON result. When 10,000 users load the React dashboard, they are just querying a lightweight, cached JSON file from the FastAPI server, bypassing the expensive PyTorch GPU inference completely.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 shadow-lg">
              <h4 className="font-bold text-rose-400 text-lg mb-2">Q8: How does the model confidence work? Why does it fluctuate?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>A:</strong> Our backend calculates confidence dynamically by blending the raw PyTorch Softmax logits with a meteorological heuristic. A loosely formed, 30-knot depression is inherently chaotic and harder to classify, so the model reports ~60-70% confidence. But when a 110-knot Super Cyclone with a massive pressure drop and clear eye forms, the thermodynamic parameters become extremely explicit, pushing the model's confidence to 95%+.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
