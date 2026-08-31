import React, { useState, useEffect, useRef } from "react";
import { Satellite, Image as ImageIcon } from "lucide-react";

export default function SatellitePanel({ mlData, mlStatus }) {
  const [activeBand, setActiveBand] = useState("IR");
  const canvasRef = useRef(null);

  const bands = [
    { id: "IR", label: "Infrared", available: true },
    { id: "WV", label: "Water Vapor", available: true },
    { id: "VIS", label: "Visible", available: true },
  ];

  useEffect(() => {
    if (!canvasRef.current || !mlData || !mlData.current_state) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    
    // Base wind to determine intensity of cloud rendering
    const wind = mlData.current_state.wind_speed_kt || 40;
    const intensity = Math.min(Math.max(wind / 120, 0.2), 1.0);
    const radius = 80 + (intensity * 40);
    
    // Animation state
    let animationFrameId;
    let rotationAngle = 0;
    // Rotation speed based on wind intensity (faster for stronger storms)
    const rotationSpeed = 0.005 + (intensity * 0.02);
    
    // Pre-calculate spiral particles so they don't jump around
    const particles = [];
    for (let i = 0; i < 2000; i++) {
      particles.push({
        a: Math.random() * Math.PI * 2,
        rBase: Math.random(),
        sizeVar: Math.random()
      });
    }

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Background based on band
      if (activeBand === "VIS") {
        ctx.fillStyle = "#1e3a8a"; // Ocean blue
      } else if (activeBand === "WV") {
        ctx.fillStyle = "#0f172a"; // Dark space/ocean
      } else {
        ctx.fillStyle = "#0f172a"; // IR default
      }
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw spiral bands
      ctx.save();
      ctx.translate(cx, cy);
      // Rotate the entire storm over time
      ctx.rotate(rotationAngle);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let r = p.rBase * radius * 1.5;
        
        // Water vapor has wider, less defined bands
        if (activeBand === "WV") r *= 1.2;
        
        // Calculate spiral offset
        const spiralAngle = p.a - (r / 20); 
        
        const x = Math.cos(spiralAngle) * r;
        const y = Math.sin(spiralAngle) * r;
        
        // Distance from center
        const d = Math.sqrt(x*x + y*y);
        
        // Eye
        if (d < 15 && intensity > 0.6 && activeBand !== "WV") continue;
        if (d < 10 && intensity > 0.8 && activeBand === "WV") continue; // Smaller eye in WV
        
        // Eye wall (high intensity)
        let alpha = 0.1;
        let colorR = 200, colorG = 200, colorB = 200;
        
        if (d >= 15 && d < 35 && intensity > 0.5) {
          alpha = 0.5 * intensity;
          colorR = 255; colorG = 255; colorB = 255;
        } else if (d >= 35) {
          alpha = (1 - (d / (radius * (activeBand === "WV" ? 1.8 : 1.5)))) * 0.3 * intensity;
          colorR = 220; colorG = 220; colorB = 220;
        }
        
        // Color tweaks per band
        if (activeBand === "WV") {
          colorR = 150; colorG = 180; colorB = 220; // Bluish/grayish vapor
          alpha *= 0.8; // More translucent
        }
        
        if (alpha <= 0) continue;
        
        ctx.beginPath();
        ctx.arc(x, y, p.sizeVar * 3 + (activeBand === "WV" ? 3 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${alpha})`;
        ctx.fill();
      }
      
      ctx.restore();
      
      // Apply blur to make it look like clouds
      ctx.filter = activeBand === "WV" ? "blur(4px)" : "blur(2px)";
      ctx.drawImage(canvas, 0, 0); // This line is technically drawing the canvas onto itself which accumulates blur, but with clearRect it's fine for simple FX
      ctx.filter = "none";
      
      // Advance rotation
      rotationAngle -= rotationSpeed; // Cyclones rotate counter-clockwise in Northern Hemisphere
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mlData, activeBand]);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Satellite className="w-5 h-5 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Satellite Analysis</h3>
      </div>

      <div className="flex gap-2 mb-4">
        {bands.map(band => (
          <button
            key={band.id}
            onClick={() => band.available && setActiveBand(band.id)}
            disabled={!band.available}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              activeBand === band.id 
                ? "bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                : band.available 
                  ? "bg-black/40 border-white/10 text-gray-400 hover:bg-black/60" 
                  : "bg-black/20 border-transparent text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            {band.label}
          </button>
        ))}
      </div>

      <div className="aspect-video bg-black/60 rounded-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
        {mlData && mlData.current_state ? (
          <canvas ref={canvasRef} width={400} height={225} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center z-10 p-4">
            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-500">IMAGE UNAVAILABLE</p>
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono text-slate-300 z-10">
          Source: INSAT-3D {activeBand} (Synthetic)
        </div>
      </div>
    </div>
  );
}
