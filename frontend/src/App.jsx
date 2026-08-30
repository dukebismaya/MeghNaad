import { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Circle,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  Wind,
  Gauge,
  Activity,
  Satellite,
  ShieldCheck,
  Eye,
  Clock,
  Layers,
  X,
  Radio,
  ChevronRight,
  Crosshair,
  Thermometer,
  TrendingDown,
  Zap,
  Radar,
} from "lucide-react";

// ═══════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════

const API_BASE = "http://localhost:8000";
const CARTO_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

// ═══════════════════════════════════════════
// Fallback mock data (used when API unavailable)
// ═══════════════════════════════════════════

const MOCK_CYCLONES = [
  {
    info: {
      cyclone_id: "ARB-02-2024",
      name: "Biparjoy",
      basin: "Arabian Sea (North Indian Ocean)",
      season: 2024,
      status: "active",
      category: "Extremely Severe Cyclonic Storm (ESCS)",
      dvorak_t_number: 5.5,
      max_wind_kts: 115,
      central_pressure_hpa: 940,
      eye_diameter_km: 35,
      movement_dir: "NNW",
      movement_speed_kmh: 14,
      satellite: "INSAT-3DS",
      last_updated: "2024-06-15T06:00:00+0530",
    },
    pinn: {
      coriolis_consistent: true,
      mass_conservation_loss: 0.0024,
      momentum_residual: 0.0031,
      energy_budget_balanced: true,
    },
    track: [
      { lat: 13.2, lon: 67.5, timestamp: "2024-06-12T06:00:00+0530", wind_kts: 45, pressure_hpa: 998 },
      { lat: 14.0, lon: 67.0, timestamp: "2024-06-12T18:00:00+0530", wind_kts: 55, pressure_hpa: 992 },
      { lat: 15.1, lon: 66.3, timestamp: "2024-06-13T06:00:00+0530", wind_kts: 70, pressure_hpa: 980 },
      { lat: 16.5, lon: 65.8, timestamp: "2024-06-13T18:00:00+0530", wind_kts: 85, pressure_hpa: 968 },
      { lat: 17.8, lon: 65.2, timestamp: "2024-06-14T06:00:00+0530", wind_kts: 100, pressure_hpa: 954 },
      { lat: 19.0, lon: 64.8, timestamp: "2024-06-14T18:00:00+0530", wind_kts: 110, pressure_hpa: 944 },
      { lat: 20.2, lon: 64.5, timestamp: "2024-06-15T06:00:00+0530", wind_kts: 115, pressure_hpa: 940 },
    ],
    forecast: [
      { lat: 21.0, lon: 64.0, hour: 12, timestamp: "2024-06-15T18:00:00+0530", confidence: 0.92 },
      { lat: 22.1, lon: 63.3, hour: 24, timestamp: "2024-06-16T06:00:00+0530", confidence: 0.84 },
      { lat: 23.5, lon: 62.5, hour: 48, timestamp: "2024-06-17T06:00:00+0530", confidence: 0.68 },
    ],
  },
  {
    info: {
      cyclone_id: "BOB-01-2024",
      name: "Mocha",
      basin: "Bay of Bengal (North Indian Ocean)",
      season: 2024,
      status: "active",
      category: "Super Cyclonic Storm (SuCS)",
      dvorak_t_number: 6.5,
      max_wind_kts: 130,
      central_pressure_hpa: 928,
      eye_diameter_km: 28,
      movement_dir: "NNE",
      movement_speed_kmh: 18,
      satellite: "INSAT-3DS",
      last_updated: "2024-06-15T00:00:00+0530",
    },
    pinn: {
      coriolis_consistent: true,
      mass_conservation_loss: 0.0018,
      momentum_residual: 0.0027,
      energy_budget_balanced: true,
    },
    track: [
      { lat: 10.5, lon: 88.0, timestamp: "2024-06-12T00:00:00+0530", wind_kts: 40, pressure_hpa: 1000 },
      { lat: 11.8, lon: 87.5, timestamp: "2024-06-12T12:00:00+0530", wind_kts: 55, pressure_hpa: 994 },
      { lat: 13.0, lon: 87.0, timestamp: "2024-06-13T00:00:00+0530", wind_kts: 75, pressure_hpa: 976 },
      { lat: 14.5, lon: 86.2, timestamp: "2024-06-13T12:00:00+0530", wind_kts: 90, pressure_hpa: 960 },
      { lat: 16.0, lon: 85.8, timestamp: "2024-06-14T00:00:00+0530", wind_kts: 105, pressure_hpa: 948 },
      { lat: 17.5, lon: 85.0, timestamp: "2024-06-14T12:00:00+0530", wind_kts: 120, pressure_hpa: 936 },
      { lat: 18.8, lon: 84.5, timestamp: "2024-06-15T00:00:00+0530", wind_kts: 130, pressure_hpa: 928 },
    ],
    forecast: [
      { lat: 19.8, lon: 84.0, hour: 12, timestamp: "2024-06-15T12:00:00+0530", confidence: 0.89 },
      { lat: 20.5, lon: 83.5, hour: 24, timestamp: "2024-06-16T00:00:00+0530", confidence: 0.77 },
      { lat: 21.2, lon: 82.8, hour: 48, timestamp: "2024-06-17T00:00:00+0530", confidence: 0.58 },
    ],
  },
];

const MOCK_CHART = [
  { label: "-72h", actual_pressure: 998, predicted_pressure: 999.5, actual_wind: 45, predicted_wind: 43 },
  { label: "-60h", actual_pressure: 992, predicted_pressure: 993.5, actual_wind: 55, predicted_wind: 53 },
  { label: "-48h", actual_pressure: 980, predicted_pressure: 981.5, actual_wind: 70, predicted_wind: 68 },
  { label: "-36h", actual_pressure: 968, predicted_pressure: 969.5, actual_wind: 85, predicted_wind: 83 },
  { label: "-24h", actual_pressure: 954, predicted_pressure: 955.5, actual_wind: 100, predicted_wind: 98 },
  { label: "-12h", actual_pressure: 944, predicted_pressure: 944.8, actual_wind: 110, predicted_wind: 109 },
  { label: "T₀ (Now)", actual_pressure: 940, predicted_pressure: 940.8, actual_wind: 115, predicted_wind: 114 },
  { label: "+12h", actual_pressure: null, predicted_pressure: 934, actual_wind: null, predicted_wind: 120 },
  { label: "+24h", actual_pressure: null, predicted_pressure: 928, actual_wind: null, predicted_wind: 125 },
  { label: "+48h", actual_pressure: null, predicted_pressure: 920, actual_wind: null, predicted_wind: 130 },
];

const MOCK_XAI = {
  model_name: "MeghNaad-CycloneNet-v1",
  technique: "Grad-CAM",
  target_layer: "conv5_block3",
  resolution_km: 1.0,
  satellite: "INSAT-3DS",
  bands_used: ["TIR1 (10.8 µm)", "TIR2 (12.0 µm)", "SWIR (1.625 µm)", "WV (6.7 µm)", "VIS (0.65 µm)"],
  activation_grid: [
    [0.12, 0.18, 0.25, 0.30, 0.35, 0.28, 0.20, 0.10],
    [0.15, 0.30, 0.55, 0.70, 0.72, 0.60, 0.35, 0.12],
    [0.22, 0.58, 0.82, 0.95, 0.97, 0.85, 0.55, 0.18],
    [0.28, 0.65, 0.90, 1.00, 0.98, 0.88, 0.60, 0.22],
    [0.25, 0.60, 0.88, 0.98, 0.96, 0.82, 0.52, 0.20],
    [0.18, 0.45, 0.72, 0.85, 0.80, 0.65, 0.40, 0.15],
    [0.10, 0.28, 0.48, 0.60, 0.55, 0.42, 0.25, 0.10],
    [0.05, 0.12, 0.22, 0.30, 0.28, 0.20, 0.12, 0.05],
  ],
  feature_importance: {
    eye_wall_gradient: 0.34,
    cloud_top_temperature: 0.27,
    spiral_band_curvature: 0.18,
    outflow_symmetry: 0.12,
    warm_core_anomaly: 0.09,
  },
};

// ═══════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════

function categoryColor(cat) {
  if (cat.includes("Super")) return "text-fuchsia-400";
  if (cat.includes("Extremely")) return "text-red-400";
  if (cat.includes("Very Severe")) return "text-orange-400";
  if (cat.includes("Severe")) return "text-amber-400";
  return "text-yellow-400";
}

function categoryBg(cat) {
  if (cat.includes("Super")) return "bg-fuchsia-500/15 border-fuchsia-500/30";
  if (cat.includes("Extremely")) return "bg-red-500/15 border-red-500/30";
  if (cat.includes("Very Severe")) return "bg-orange-500/15 border-orange-500/30";
  if (cat.includes("Severe")) return "bg-amber-500/15 border-amber-500/30";
  return "bg-yellow-500/15 border-yellow-500/30";
}

function confidenceColor(c) {
  if (c >= 0.85) return "text-emerald-400";
  if (c >= 0.7) return "text-amber-400";
  return "text-red-400";
}

function heatColor(v) {
  // 0 → deep blue, 0.5 → cyan/green, 1.0 → bright red
  if (v < 0.25) return `rgba(30, 64, 175, ${0.3 + v * 2})`;
  if (v < 0.5) return `rgba(6, 182, 212, ${0.4 + v})`;
  if (v < 0.75) return `rgba(234, 179, 8, ${0.5 + v * 0.5})`;
  return `rgba(239, 68, 68, ${0.6 + v * 0.4})`;
}

function createEyeIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="cyclone-eye-marker">
        <div class="eye-ring-2"></div>
        <div class="eye-ring"></div>
        <div class="eye-core"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// ═══════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════

/** Recenter map when selected cyclone changes */
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

/** Grad-CAM heatmap canvas renderer */
function GradCamCanvas({ grid }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid) return;
    const ctx = canvas.getContext("2d");
    const size = 224;
    canvas.width = size;
    canvas.height = size;
    const cell = size / grid.length;

    // Draw heatmap cells
    grid.forEach((row, i) => {
      row.forEach((val, j) => {
        ctx.fillStyle = heatColor(val);
        ctx.fillRect(j * cell, i * cell, cell, cell);
      });
    });

    // Gaussian blur for smooth look
    ctx.filter = "blur(6px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";

    // Overlay eye marker
    const cx = size / 2;
    const cy = size / 2 - cell * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();
  }, [grid]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg border border-slate-700/50"
      style={{ imageRendering: "auto" }}
    />
  );
}

/** Custom chart tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg border border-slate-700/50 px-3 py-2 text-xs">
      <p className="font-semibold text-slate-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value != null ? p.value.toFixed(1) : "—"}{" "}
          {p.dataKey.includes("pressure") ? "hPa" : "kts"}
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// Main App
// ═══════════════════════════════════════════

export default function App() {
  // ── State ──
  const [cyclones, setCyclones] = useState(MOCK_CYCLONES);
  const [chartData, setChartData] = useState(MOCK_CHART);
  const [xaiData, setXaiData] = useState(MOCK_XAI);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showGradCam, setShowGradCam] = useState(false);
  const [apiStatus, setApiStatus] = useState("connecting"); // "online" | "offline" | "connecting"

  // ── Fetch from API ──
  useEffect(() => {
    async function fetchData() {
      try {
        const [activeRes, chartRes, xaiRes] = await Promise.all([
          fetch(`${API_BASE}/api/cyclone/active`),
          fetch(`${API_BASE}/api/cyclone/forecast-chart`),
          fetch(`${API_BASE}/api/cyclone/xai-heatmap`),
        ]);
        if (activeRes.ok) setCyclones(await activeRes.json());
        if (chartRes.ok) setChartData(await chartRes.json());
        if (xaiRes.ok) setXaiData(await xaiRes.json());
        setApiStatus("online");
      } catch {
        setApiStatus("offline");
        // Keep mock data
      }
    }
    fetchData();
  }, []);

  // ── Derived ──
  const cyclone = cyclones[selectedIdx];
  const { info, pinn, track, forecast } = cyclone;
  const currentPos = track[track.length - 1];
  const trackCoords = track.map((p) => [p.lat, p.lon]);
  const forecastCoords = [
    [currentPos.lat, currentPos.lon],
    ...forecast.map((p) => [p.lat, p.lon]),
  ];
  const mapCenter = [currentPos.lat, currentPos.lon];

  // ═════════════════
  // RENDER
  // ═════════════════
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* ── HEADER BAR ── */}
      <header className="glass border-b border-slate-800/60 px-5 py-2.5 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radar className="w-6 h-6 text-cyan-400" />
            <h1 className="text-base font-bold tracking-tight">
              <span className="text-cyan-400">INSAT-3DS</span>{" "}
              <span className="text-slate-100">AI Cyclone Tracker</span>
            </h1>
          </div>
          <span className="text-[10px] font-mono bg-slate-800/60 text-slate-500 px-2 py-0.5 rounded-full">
            v0.1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* MOSDAC API Status */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/40 rounded-full px-3 py-1">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">MOSDAC</span>
              <span
                className={`w-2 h-2 rounded-full animate-glow-pulse ${
                  apiStatus === "online"
                    ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                    : apiStatus === "connecting"
                    ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"
                    : "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]"
                }`}
              />
              <span
                className={
                  apiStatus === "online"
                    ? "text-emerald-400"
                    : apiStatus === "connecting"
                    ? "text-amber-400"
                    : "text-red-400"
                }
              >
                {apiStatus === "online" ? "LIVE" : apiStatus === "connecting" ? "SYNC" : "OFFLINE"}
              </span>
            </div>
          </div>

          {/* PINN Validation Badge */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/40 rounded-full px-3 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">PINN</span>
            <span
              className={
                pinn.coriolis_consistent && pinn.energy_budget_balanced
                  ? "text-emerald-400"
                  : "text-amber-400"
              }
            >
              {pinn.coriolis_consistent && pinn.energy_budget_balanced
                ? "VALID"
                : "WARN"}
            </span>
          </div>

          {/* Satellite badge */}
          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/40 rounded-full px-3 py-1 text-xs">
            <Radio className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-slate-400">SAT</span>
            <span className="text-violet-400 font-mono">3DS</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ────────────────────────────────
            LEFT SIDEBAR
        ──────────────────────────────── */}
        <aside className="w-[420px] shrink-0 border-r border-slate-800/60 bg-slate-950 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">

            {/* Cyclone Selector Tabs */}
            <div className="flex gap-2">
              {cyclones.map((c, i) => (
                <button
                  key={c.info.cyclone_id}
                  onClick={() => setSelectedIdx(i)}
                  className={`flex-1 text-xs font-semibold px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedIdx === i
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                      : "bg-slate-900/50 border-slate-800/50 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
                  }`}
                >
                  <span className="block truncate">{c.info.name}</span>
                  <span className="block text-[10px] font-mono mt-0.5 opacity-70">
                    {c.info.cyclone_id}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Risk Alert Card ── */}
            <div
              className={`rounded-xl border p-4 ${categoryBg(info.category)}`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 mt-0.5 shrink-0 ${categoryColor(
                    info.category
                  )}`}
                />
                <div>
                  <h2 className="text-sm font-bold text-slate-100">
                    Cyclone {info.name}
                  </h2>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${categoryColor(
                      info.category
                    )}`}
                  >
                    {info.category}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {info.basin} • Moving {info.movement_dir} at{" "}
                    {info.movement_speed_kmh} km/h
                  </p>
                </div>
              </div>
            </div>

            {/* ── Key Metrics ── */}
            <div className="grid grid-cols-3 gap-2">
              {/* Dvorak T-Number */}
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3 text-center">
                <Eye className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Dvorak T#
                </p>
                <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                  T{info.dvorak_t_number}
                </p>
              </div>

              {/* Max Wind */}
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3 text-center">
                <Wind className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Max Wind
                </p>
                <p className="text-xl font-bold font-mono text-red-400 mt-0.5">
                  {info.max_wind_kts}
                  <span className="text-xs text-slate-500 ml-0.5">kts</span>
                </p>
              </div>

              {/* Central Pressure */}
              <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3 text-center">
                <Gauge className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Pressure
                </p>
                <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                  {info.central_pressure_hpa}
                  <span className="text-xs text-slate-500 ml-0.5">hPa</span>
                </p>
              </div>
            </div>

            {/* ── PINN Physics Card ── */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Physics Validation (PINN)
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-500">Coriolis</span>
                  <span
                    className={
                      pinn.coriolis_consistent
                        ? "text-emerald-400 font-semibold"
                        : "text-red-400 font-semibold"
                    }
                  >
                    {pinn.coriolis_consistent ? "✓ Consistent" : "✗ Fail"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-500">Energy</span>
                  <span
                    className={
                      pinn.energy_budget_balanced
                        ? "text-emerald-400 font-semibold"
                        : "text-red-400 font-semibold"
                    }
                  >
                    {pinn.energy_budget_balanced ? "✓ Balanced" : "✗ Fail"}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-500">Mass Loss</span>
                  <span className="text-slate-200 font-mono">
                    {pinn.mass_conservation_loss.toFixed(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-800/40 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-500">Momentum</span>
                  <span className="text-slate-200 font-mono">
                    {pinn.momentum_residual.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Pressure Chart ── */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Pressure Intensity (hPa)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={{ stroke: "#1e293b" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 10", "dataMax + 5"]}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    x="T₀ (Now)"
                    stroke="#475569"
                    strokeDasharray="4 4"
                    label={{
                      value: "Now",
                      fill: "#94a3b8",
                      fontSize: 10,
                      position: "top",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual_pressure"
                    name="Observed"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#38bdf8" }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_pressure"
                    name="AI Predicted"
                    stroke="#f472b6"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 3, fill: "#f472b6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-sky-400 rounded-full inline-block" />
                  <span className="text-slate-400">Observed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-pink-400 rounded-full inline-block border-dashed" />
                  <span className="text-slate-400">AI Predicted</span>
                </span>
              </div>
            </div>

            {/* ── XAI Grad-CAM Toggle ── */}
            <button
              onClick={() => setShowGradCam((v) => !v)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                showGradCam
                  ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                  : "bg-slate-900/60 border-slate-800/50 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers
                  className={`w-4 h-4 ${
                    showGradCam ? "text-violet-400" : "text-slate-500"
                  }`}
                />
                <span className="text-xs font-semibold">
                  XAI Grad-CAM Cloud Heatmap
                </span>
              </div>
              <div
                className={`w-9 h-5 rounded-full flex items-center transition-all duration-200 px-0.5 ${
                  showGradCam ? "bg-violet-500 justify-end" : "bg-slate-700 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </button>

            {/* ── Forecast Timeline ── */}
            <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Forecast Trajectory
                </h3>
              </div>
              <div className="space-y-2">
                {forecast.map((f) => (
                  <div
                    key={f.hour}
                    className="flex items-center gap-3 bg-slate-800/40 rounded-lg px-3 py-2.5"
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center gap-0.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full border-2 ${
                          f.confidence >= 0.85
                            ? "border-emerald-400 bg-emerald-400/30"
                            : f.confidence >= 0.7
                            ? "border-amber-400 bg-amber-400/30"
                            : "border-red-400 bg-red-400/30"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          +{f.hour}h Forecast
                        </span>
                        <span
                          className={`text-[10px] font-mono font-semibold ${confidenceColor(
                            f.confidence
                          )}`}
                        >
                          {(f.confidence * 100).toFixed(0)}% conf
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {f.lat.toFixed(1)}°N, {f.lon.toFixed(1)}°E
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Meta Footer ── */}
            <div className="text-[10px] text-slate-600 text-center pt-2 pb-4">
              <p>
                Last updated:{" "}
                <span className="font-mono text-slate-500">
                  {info.last_updated}
                </span>
              </p>
              <p className="mt-0.5">
                Satellite: {info.satellite} • Season {info.season}
              </p>
            </div>
          </div>
        </aside>

        {/* ────────────────────────────────
            MAP PANEL
        ──────────────────────────────── */}
        <main className="flex-1 relative">
          <MapContainer
            center={[16, 76]}
            zoom={5}
            zoomControl={true}
            className="h-full w-full"
          >
            <TileLayer url={CARTO_DARK} attribution={CARTO_ATTR} />

            <MapRecenter center={mapCenter} zoom={6} />

            {/* Render all cyclones on map */}
            {cyclones.map((c, idx) => {
              const t = c.track;
              const f = c.forecast;
              const curr = t[t.length - 1];
              const tCoords = t.map((p) => [p.lat, p.lon]);
              const fCoords = [
                [curr.lat, curr.lon],
                ...f.map((p) => [p.lat, p.lon]),
              ];
              const isSelected = idx === selectedIdx;
              const opacity = isSelected ? 1 : 0.4;

              return (
                <div key={c.info.cyclone_id}>
                  {/* Historical track — dashed line */}
                  <Polyline
                    positions={tCoords}
                    pathOptions={{
                      color: "#38bdf8",
                      weight: isSelected ? 2.5 : 1.5,
                      dashArray: "8 6",
                      opacity,
                    }}
                  />

                  {/* Forecast track — solid red line */}
                  <Polyline
                    positions={fCoords}
                    pathOptions={{
                      color: "#ef4444",
                      weight: isSelected ? 3 : 1.5,
                      opacity,
                    }}
                  />

                  {/* Forecast point markers */}
                  {f.map((fp) => (
                    <Circle
                      key={`${c.info.cyclone_id}-f${fp.hour}`}
                      center={[fp.lat, fp.lon]}
                      radius={15000}
                      pathOptions={{
                        color: "#ef4444",
                        fillColor: "#ef4444",
                        fillOpacity: 0.2 * opacity,
                        weight: 1,
                        opacity: 0.5 * opacity,
                      }}
                    />
                  ))}

                  {/* Wind radius circle */}
                  <Circle
                    center={[curr.lat, curr.lon]}
                    radius={c.info.eye_diameter_km ? c.info.eye_diameter_km * 3000 : 80000}
                    pathOptions={{
                      color: "#ef4444",
                      fillColor: "#ef4444",
                      fillOpacity: 0.08 * opacity,
                      weight: isSelected ? 1.5 : 0.8,
                      opacity: 0.4 * opacity,
                      dashArray: "4 4",
                    }}
                  />

                  {/* Eye marker */}
                  <Marker
                    position={[curr.lat, curr.lon]}
                    icon={createEyeIcon()}
                    eventHandlers={{
                      click: () => setSelectedIdx(idx),
                    }}
                  >
                    <Popup className="dark-popup">
                      <div className="text-xs font-sans">
                        <p className="font-bold text-sm">
                          {c.info.name}
                        </p>
                        <p className="text-slate-600">
                          {c.info.category}
                        </p>
                        <p className="mt-1">
                          Wind: {c.info.max_wind_kts} kts • Pressure:{" "}
                          {c.info.central_pressure_hpa} hPa
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </div>
              );
            })}
          </MapContainer>

          {/* ── Map Overlay: Cyclone Name Tag ── */}
          <div className="absolute top-4 left-4 z-[1000] glass border border-slate-700/40 rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <Crosshair className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-sm font-bold text-slate-100">
                  {info.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentPos.lat.toFixed(1)}°N, {currentPos.lon.toFixed(1)}°E •{" "}
                  T{info.dvorak_t_number}
                </p>
              </div>
            </div>
          </div>

          {/* ── Map Overlay: Live Metrics ── */}
          <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            <div className="glass border border-slate-700/40 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <Wind className="w-3.5 h-3.5 text-red-400" />
              <span className="font-mono font-bold text-red-400">
                {info.max_wind_kts}
              </span>
              <span className="text-slate-500">kts</span>
            </div>
            <div className="glass border border-slate-700/40 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
              <Gauge className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-amber-400">
                {info.central_pressure_hpa}
              </span>
              <span className="text-slate-500">hPa</span>
            </div>
          </div>

          {/* ── Grad-CAM PiP Overlay ── */}
          {showGradCam && xaiData && (
            <div className="absolute bottom-6 right-6 z-[1000] w-[320px] glass border border-violet-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-300">
                    Grad-CAM Attention Map
                  </span>
                </div>
                <button
                  onClick={() => setShowGradCam(false)}
                  className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Heatmap Canvas */}
              <div className="p-3">
                <GradCamCanvas grid={xaiData.activation_grid} />
              </div>

              {/* Feature Importance */}
              <div className="px-4 pb-3 space-y-1.5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Feature Importance
                </p>
                {Object.entries(xaiData.feature_importance).map(
                  ([key, val]) => (
                    <div key={key} className="flex items-center gap-2 text-[10px]">
                      <span className="text-slate-400 w-[130px] truncate">
                        {key.replace(/_/g, " ")}
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${val * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-500 font-mono w-8 text-right">
                        {(val * 100).toFixed(0)}%
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* Meta */}
              <div className="px-4 py-2 border-t border-slate-700/40 flex items-center justify-between text-[9px] text-slate-600">
                <span>
                  {xaiData.model_name} • {xaiData.target_layer}
                </span>
                <span>{xaiData.resolution_km} km res</span>
              </div>

              {/* Satellite Bands */}
              <div className="px-4 pb-3 flex flex-wrap gap-1">
                {xaiData.bands_used.map((b) => (
                  <span
                    key={b}
                    className="text-[9px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded-md font-mono"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
