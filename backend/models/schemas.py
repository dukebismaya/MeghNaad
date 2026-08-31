from pydantic import BaseModel
from typing import List, Dict, Optional, Any

# ──────────────────────────────────────────────
# Existing Models (from main.py)
# ──────────────────────────────────────────────

class TrackPoint(BaseModel):
    lat: float
    lon: float
    timestamp: str
    wind_kts: Optional[float] = None
    pressure_hpa: Optional[float] = None

class ForecastPoint(BaseModel):
    lat: float
    lon: float
    hour: int
    timestamp: str
    confidence: float

class PINNValidation(BaseModel):
    coriolis_consistent: bool
    mass_conservation_loss: float
    momentum_residual: float
    energy_budget_balanced: bool

class CycloneInfo(BaseModel):
    cyclone_id: str
    name: str
    basin: str
    season: int
    status: str
    category: str
    dvorak_t_number: float
    max_wind_kts: float
    central_pressure_hpa: float
    eye_diameter_km: Optional[float]
    movement_dir: str
    movement_speed_kmh: float
    satellite: str
    last_updated: str

class CycloneTelemetry(BaseModel):
    info: CycloneInfo
    pinn: PINNValidation
    track: List[TrackPoint]
    forecast: List[ForecastPoint]

class ChartDataPoint(BaseModel):
    timestamp: str
    label: str
    actual_pressure: Optional[float] = None
    predicted_pressure: Optional[float] = None
    actual_wind: Optional[float] = None
    predicted_wind: Optional[float] = None

class XAIHeatmapMeta(BaseModel):
    model_name: str
    technique: str
    target_layer: str
    resolution_km: float
    satellite: str
    bands_used: List[str]
    activation_grid: List[List[float]]
    feature_importance: Dict[str, float]
    timestamp: str

class CycloneListItem(BaseModel):
    cyclone_id: str
    name: str
    basin: str
    season: int
    category: str
    max_wind_kts: float

# ──────────────────────────────────────────────
# New ML Contract Models
# ──────────────────────────────────────────────

class MLDetection(BaseModel):
    cyclone_detected: bool
    confidence: float

class MLClassification(BaseModel):
    category: str
    confidence: float

class MLCurrentState(BaseModel):
    latitude: float
    longitude: float
    wind_speed_kt: float
    central_pressure_hpa: float

class MLTrackPrediction(BaseModel):
    forecast_hour: int
    latitude: float
    longitude: float
    confidence: float

class MLIntensityPrediction(BaseModel):
    forecast_hour: int
    wind_speed_kt: float
    pressure_hpa: float

class MLDataSources(BaseModel):
    satellite: str
    environmental: str
    historical: str

class MLModelInfo(BaseModel):
    name: str
    version: str

class MLStatusResponse(BaseModel):
    model_loaded: bool
    model_name: str
    model_version: str
    data_sources: List[str]

class MLPredictResponse(BaseModel):
    detection: MLDetection
    classification: MLClassification
    current_state: MLCurrentState
    track_prediction: List[MLTrackPrediction]
    intensity_prediction: List[MLIntensityPrediction]
    data_sources: MLDataSources
    model: MLModelInfo
    is_demo: bool = False
