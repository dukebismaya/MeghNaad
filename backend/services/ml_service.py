from typing import Dict, Any
from models.schemas import (
    MLPredictResponse,
    MLDetection,
    MLClassification,
    MLCurrentState,
    MLTrackPrediction,
    MLIntensityPrediction,
    MLDataSources,
    MLModelInfo,
    MLStatusResponse
)

def get_ml_status() -> MLStatusResponse:
    """
    Returns the current status of the ML model.
    Currently returns a hardcoded demo status.
    """
    return MLStatusResponse(
        model_loaded=False, # Set to False to indicate Demo Mode
        model_name="Multimodal Cyclone Prediction Model",
        model_version="v1",
        data_sources=[
            "INSAT-3D",
            "ERA5",
            "IBTrACS"
        ]
    )

def predict_cyclone(input_data: Dict[str, Any]) -> MLPredictResponse:
    """
    Simulates a multimodal ML prediction for a cyclone.
    This is the DEMO ADAPTER. Once the real model is ready, 
    this function will be replaced with actual inference logic.
    """
    return MLPredictResponse(
        detection=MLDetection(
            cyclone_detected=True,
            confidence=0.94
        ),
        classification=MLClassification(
            category="Severe Cyclonic Storm",
            confidence=0.91
        ),
        current_state=MLCurrentState(
            latitude=15.2,
            longitude=87.4,
            wind_speed_kt=102.0,
            central_pressure_hpa=956.0
        ),
        track_prediction=[
            MLTrackPrediction(forecast_hour=6, latitude=15.4, longitude=87.1, confidence=0.92),
            MLTrackPrediction(forecast_hour=12, latitude=15.7, longitude=86.8, confidence=0.88),
            MLTrackPrediction(forecast_hour=24, latitude=16.2, longitude=86.2, confidence=0.81),
            MLTrackPrediction(forecast_hour=48, latitude=17.0, longitude=85.1, confidence=0.70)
        ],
        intensity_prediction=[
            MLIntensityPrediction(forecast_hour=6, wind_speed_kt=104.0, pressure_hpa=953.0),
            MLIntensityPrediction(forecast_hour=12, wind_speed_kt=106.0, pressure_hpa=950.0),
            MLIntensityPrediction(forecast_hour=24, wind_speed_kt=112.0, pressure_hpa=942.0),
            MLIntensityPrediction(forecast_hour=48, wind_speed_kt=120.0, pressure_hpa=930.0)
        ],
        data_sources=MLDataSources(
            satellite="INSAT-3D",
            environmental="ERA5",
            historical="IBTrACS"
        ),
        model=MLModelInfo(
            name="Multimodal Cyclone Prediction Model",
            version="v1"
        ),
        is_demo=True # Crucial flag to inform UI this is a demo fallback
    )
