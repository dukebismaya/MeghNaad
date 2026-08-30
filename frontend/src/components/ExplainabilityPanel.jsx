import React, { useRef, useEffect } from "react";
import { Layers } from "lucide-react";

function heatColor(v) {
  if (v < 0.25) return `rgba(30, 64, 175, ${0.3 + v * 2})`;
  if (v < 0.5) return `rgba(6, 182, 212, ${0.4 + v})`;
  if (v < 0.75) return `rgba(234, 179, 8, ${0.5 + v * 0.5})`;
  return `rgba(239, 68, 68, ${0.6 + v * 0.4})`;
}

export default function ExplainabilityPanel({ xaiData, mlData }) {
  const canvasRef = useRef(null);
  const isDemo = mlData?.is_demo;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !xaiData?.activation_grid) return;
    const ctx = canvas.getContext("2d");
    const grid = xaiData.activation_grid;
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    const cell = size / grid.length;

    // Draw heatmap
    grid.forEach((row, i) => {
      row.forEach((val, j) => {
        ctx.fillStyle = heatColor(val);
        ctx.fillRect(j * cell, i * cell, cell, cell);
      });
    });

    // Add blur and eye marker
    ctx.filter = "blur(6px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";

    const cx = size / 2;
    const cy = size / 2 - cell * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fill();

  }, [xaiData]);

  if (!xaiData) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-violet-400" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Model Explainability</h3>
      </div>
      
      {isDemo ? (
        <div className="aspect-square bg-slate-950 flex flex-col items-center justify-center border border-slate-800 rounded-lg text-slate-500 text-sm">
          <Layers className="w-8 h-8 mb-2 opacity-50" />
          <p>Awaiting model inference</p>
          <p className="text-xs mt-1">XAI unavailable in DEMO MODE</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-slate-300">
              Grad-CAM
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Highlighted regions indicate INSAT-3D image features contributing most strongly to the model prediction.
          </p>
        </div>
      )}
    </div>
  );
}
