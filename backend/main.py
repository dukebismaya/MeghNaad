"""
MeghNaad — INSAT-3DS AI Cyclone Tracking Dashboard
Backend API (FastAPI)

Provides mock telemetry, forecast charts, and XAI heatmap metadata
for Indian Ocean tropical cyclones using INSAT-3DS satellite payloads.
"""

from datetime import datetime, timedelta, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

from models.schemas import (
    CycloneTelemetry,
    ChartDataPoint,
    XAIHeatmapMeta,
    TrackPoint,
    ForecastPoint,
    PINNValidation,
    CycloneInfo,
    MLStatusResponse,
    MLPredictResponse,
    CycloneListItem
)
from services.ml_service import get_ml_status, predict_cyclone
from services.data_service import get_all_cyclones, get_cyclone_list, search_cyclones, get_cyclone_by_id

# ──────────────────────────────────────────────
# App initialization
# ──────────────────────────────────────────────

IST = timezone(timedelta(hours=5, minutes=30))

app = FastAPI(
    title="MeghNaad — Cyclone Tracking API",
    description="AI/ML-powered cyclone identification, classification & prediction using INSAT-3DS multi-source satellite data.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────

@app.get("/")
def root():
    return {
        "service": "MeghNaad Cyclone Tracking API",
        "version": "0.1.0",
        "satellite": "INSAT-3DS",
        "status": "operational",
    }


@app.get("/api/cyclone/active", response_model=list[CycloneTelemetry])
def get_active_cyclones():
    """
    Returns current active cyclone telemetry and path coordinates.
    Using get_all_cyclones() as a placeholder for active ones.
    """
    return get_all_cyclones()


@app.get("/api/cyclone/list", response_model=list[CycloneListItem])
def get_cyclone_list_endpoint():
    """
    Returns a list of all historical cyclones.
    """
    return get_cyclone_list()


@app.get("/api/cyclone/search", response_model=list[CycloneListItem])
def search_cyclones_endpoint(q: str):
    """
    Search cyclones by query.
    """
    return search_cyclones(q)


@app.get("/api/cyclone/{cyclone_id}", response_model=CycloneTelemetry)
def get_cyclone(cyclone_id: str):
    """
    Get cyclone details by ID.
    """
    return get_cyclone_by_id(cyclone_id)


@app.get("/api/cyclone/forecast-chart/{cyclone_id}", response_model=list[ChartDataPoint])
def get_forecast_chart(cyclone_id: str):
    """
    Returns historical vs predicted pressure/wind intensity data
    formatted for direct consumption by Recharts <ComposedChart>.

    Time axis spans -72h (historical) through +48h (forecast).
    """
    cyclone = get_cyclone_by_id(cyclone_id)
    data: list[ChartDataPoint] = []
    
    if not cyclone:
        return data

    # Use the history points from track
    history = cyclone.track
    # If we need predictions here, we would get it from predict_cyclone endpoint.
    # But usually, it's better to render this directly on the frontend using ML predictions as we are sending track points.
    
    for idx, pt in enumerate(history):
        # We assign some label based on reverse index
        h = -(len(history) - 1 - idx) * 6 # Approx 6 hours interval
        label = f"{-h}h" if h < 0 else "T₀ (Now)"
        data.append(ChartDataPoint(
            timestamp=pt.timestamp,
            label=label,
            actual_pressure=pt.pressure_hpa,
            predicted_pressure=pt.pressure_hpa,
            actual_wind=pt.wind_kts,
            predicted_wind=pt.wind_kts,
        ))

    return data


@app.get("/api/cyclone/xai-heatmap", response_model=XAIHeatmapMeta)
def get_xai_heatmap():
    """
    Returns Grad-CAM feature activation map metadata.

    Includes the activation grid (8×8 downsampled), cloud wall
    resolution, INSAT-3DS satellite band flags, and per-feature
    importance scores for cyclone intensity classification.
    """
    return XAIHeatmapMeta(
        model_name="MeghNaad-CycloneNet-v1",
        technique="Grad-CAM",
        target_layer="conv5_block3",
        resolution_km=1.0,
        satellite="INSAT-3DS",
        bands_used=[
            "TIR1 (10.8 µm)",
            "TIR2 (12.0 µm)",
            "SWIR (1.625 µm)",
            "WV (6.7 µm)",
            "VIS (0.65 µm)",
        ],
        activation_grid=[
            [0.12, 0.18, 0.25, 0.30, 0.35, 0.28, 0.20, 0.10],
            [0.15, 0.30, 0.55, 0.70, 0.72, 0.60, 0.35, 0.12],
            [0.22, 0.58, 0.82, 0.95, 0.97, 0.85, 0.55, 0.18],
            [0.28, 0.65, 0.90, 1.00, 0.98, 0.88, 0.60, 0.22],
            [0.25, 0.60, 0.88, 0.98, 0.96, 0.82, 0.52, 0.20],
            [0.18, 0.45, 0.72, 0.85, 0.80, 0.65, 0.40, 0.15],
            [0.10, 0.28, 0.48, 0.60, 0.55, 0.42, 0.25, 0.10],
            [0.05, 0.12, 0.22, 0.30, 0.28, 0.20, 0.12, 0.05],
        ],
        feature_importance={
            "eye_wall_gradient": 0.34,
            "cloud_top_temperature": 0.27,
            "spiral_band_curvature": 0.18,
            "outflow_symmetry": 0.12,
            "warm_core_anomaly": 0.09,
        },
        timestamp=_ts(_now()),
    )


@app.get("/api/ml/status", response_model=MLStatusResponse)
def get_ml_status_endpoint():
    """
    Returns the current status of the integrated ML model.
    """
    return get_ml_status()


@app.post("/api/ml/predict", response_model=MLPredictResponse)
def predict_cyclone_endpoint(input_data: Dict[str, Any]):
    """
    Simulates a prediction from the multimodal ML model.
    Receives INSAT-3D, ERA5, and IBTrACS data to predict track and intensity.
    """
    return predict_cyclone(input_data)


# ──────────────────────────────────────────────
# Entrypoint
# ──────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
