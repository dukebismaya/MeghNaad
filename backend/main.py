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
    MLPredictResponse
)
from services.ml_service import get_ml_status, predict_cyclone

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
# Mock telemetry generators
# ──────────────────────────────────────────────

def _now() -> datetime:
    return datetime(2024, 6, 15, 6, 0, 0, tzinfo=IST)


def _ts(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S%z")


def _build_biparjoy() -> CycloneTelemetry:
    """Cyclone Biparjoy — Arabian Sea ESCS, June 2023 analogue."""
    base = _now()

    track = [
        TrackPoint(lat=13.2, lon=67.5, timestamp=_ts(base - timedelta(hours=72)), wind_kts=45, pressure_hpa=998),
        TrackPoint(lat=14.0, lon=67.0, timestamp=_ts(base - timedelta(hours=60)), wind_kts=55, pressure_hpa=992),
        TrackPoint(lat=15.1, lon=66.3, timestamp=_ts(base - timedelta(hours=48)), wind_kts=70, pressure_hpa=980),
        TrackPoint(lat=16.5, lon=65.8, timestamp=_ts(base - timedelta(hours=36)), wind_kts=85, pressure_hpa=968),
        TrackPoint(lat=17.8, lon=65.2, timestamp=_ts(base - timedelta(hours=24)), wind_kts=100, pressure_hpa=954),
        TrackPoint(lat=19.0, lon=64.8, timestamp=_ts(base - timedelta(hours=12)), wind_kts=110, pressure_hpa=944),
        TrackPoint(lat=20.2, lon=64.5, timestamp=_ts(base), wind_kts=115, pressure_hpa=940),
    ]

    forecast = [
        ForecastPoint(lat=21.0, lon=64.0, hour=12, timestamp=_ts(base + timedelta(hours=12)), confidence=0.92),
        ForecastPoint(lat=22.1, lon=63.3, hour=24, timestamp=_ts(base + timedelta(hours=24)), confidence=0.84),
        ForecastPoint(lat=23.5, lon=62.5, hour=48, timestamp=_ts(base + timedelta(hours=48)), confidence=0.68),
    ]

    return CycloneTelemetry(
        info=CycloneInfo(
            cyclone_id="ARB-02-2024",
            name="Biparjoy",
            basin="Arabian Sea (North Indian Ocean)",
            season=2024,
            status="active",
            category="Extremely Severe Cyclonic Storm (ESCS)",
            dvorak_t_number=5.5,
            max_wind_kts=115,
            central_pressure_hpa=940,
            eye_diameter_km=35,
            movement_dir="NNW",
            movement_speed_kmh=14,
            satellite="INSAT-3DS",
            last_updated=_ts(base),
        ),
        pinn=PINNValidation(
            coriolis_consistent=True,
            mass_conservation_loss=0.0024,
            momentum_residual=0.0031,
            energy_budget_balanced=True,
        ),
        track=track,
        forecast=forecast,
    )


def _build_mocha() -> CycloneTelemetry:
    """Cyclone Mocha — Bay of Bengal ESCS, May 2023 analogue."""
    base = _now() - timedelta(hours=6)

    track = [
        TrackPoint(lat=10.5, lon=88.0, timestamp=_ts(base - timedelta(hours=72)), wind_kts=40, pressure_hpa=1000),
        TrackPoint(lat=11.8, lon=87.5, timestamp=_ts(base - timedelta(hours=60)), wind_kts=55, pressure_hpa=994),
        TrackPoint(lat=13.0, lon=87.0, timestamp=_ts(base - timedelta(hours=48)), wind_kts=75, pressure_hpa=976),
        TrackPoint(lat=14.5, lon=86.2, timestamp=_ts(base - timedelta(hours=36)), wind_kts=90, pressure_hpa=960),
        TrackPoint(lat=16.0, lon=85.8, timestamp=_ts(base - timedelta(hours=24)), wind_kts=105, pressure_hpa=948),
        TrackPoint(lat=17.5, lon=85.0, timestamp=_ts(base - timedelta(hours=12)), wind_kts=120, pressure_hpa=936),
        TrackPoint(lat=18.8, lon=84.5, timestamp=_ts(base), wind_kts=130, pressure_hpa=928),
    ]

    forecast = [
        ForecastPoint(lat=19.8, lon=84.0, hour=12, timestamp=_ts(base + timedelta(hours=12)), confidence=0.89),
        ForecastPoint(lat=20.5, lon=83.5, hour=24, timestamp=_ts(base + timedelta(hours=24)), confidence=0.77),
        ForecastPoint(lat=21.2, lon=82.8, hour=48, timestamp=_ts(base + timedelta(hours=48)), confidence=0.58),
    ]

    return CycloneTelemetry(
        info=CycloneInfo(
            cyclone_id="BOB-01-2024",
            name="Mocha",
            basin="Bay of Bengal (North Indian Ocean)",
            season=2024,
            status="active",
            category="Super Cyclonic Storm (SuCS)",
            dvorak_t_number=6.5,
            max_wind_kts=130,
            central_pressure_hpa=928,
            eye_diameter_km=28,
            movement_dir="NNE",
            movement_speed_kmh=18,
            satellite="INSAT-3DS",
            last_updated=_ts(base),
        ),
        pinn=PINNValidation(
            coriolis_consistent=True,
            mass_conservation_loss=0.0018,
            momentum_residual=0.0027,
            energy_budget_balanced=True,
        ),
        track=track,
        forecast=forecast,
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

    Each entry includes basic cyclone info, PINN physics validation,
    historical track points, and 12h/24h/48h forecast positions.
    """
    return [_build_biparjoy(), _build_mocha()]


@app.get("/api/cyclone/forecast-chart", response_model=list[ChartDataPoint])
def get_forecast_chart():
    """
    Returns historical vs predicted pressure/wind intensity data
    formatted for direct consumption by Recharts <ComposedChart>.

    Time axis spans -72h (historical) through +48h (forecast).
    """
    base = _now()
    data: list[ChartDataPoint] = []

    # Historical data points (actual values known)
    historical = [
        (-72, 998, 45),
        (-60, 992, 55),
        (-48, 980, 70),
        (-36, 968, 85),
        (-24, 954, 100),
        (-12, 944, 110),
        (0,   940, 115),
    ]
    for h, pressure, wind in historical:
        dt = base + timedelta(hours=h)
        data.append(ChartDataPoint(
            timestamp=_ts(dt),
            label=f"{'T' if h == 0 else ''}{h:+d}h" if h != 0 else "T₀ (Now)",
            actual_pressure=pressure,
            predicted_pressure=pressure + (1.5 if h <= -24 else 0.8),
            actual_wind=wind,
            predicted_wind=wind - (2 if h <= -24 else 1),
        ))

    # Forecast-only data points (no actuals yet)
    forecasts = [
        (12,  934, 120),
        (24,  928, 125),
        (48,  920, 130),
    ]
    for h, pressure, wind in forecasts:
        dt = base + timedelta(hours=h)
        data.append(ChartDataPoint(
            timestamp=_ts(dt),
            label=f"+{h}h",
            actual_pressure=None,
            predicted_pressure=pressure,
            actual_wind=None,
            predicted_wind=wind,
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
