# Current Architecture

## Backend
Currently, the backend consists of a single monolithic file:
- `backend/main.py`: Contains the FastAPI application, Pydantic schemas, and hardcoded mock data generators (`_build_biparjoy`, `_build_mocha`). The endpoints serve fake PINN validation, XAI Grad-CAM arrays, and hardcoded forecast data as if they were real.

## Frontend
The frontend is built with React, Vite, and Tailwind CSS.
- `frontend/src/App.jsx`: A nearly 1000-line monolithic file containing all UI components, state management, API fetching logic, mock data fallbacks, chart rendering, and Leaflet map setup.
- `frontend/src/index.css`: Custom Leaflet overrides and some animations alongside Tailwind initialization.

---

# Planned Changes

## Backend Refactor
We will split the monolithic backend into a layered architecture:
- `backend/main.py`: Will retain only the FastAPI application setup and routing.
- `backend/models/schemas.py`: Will house all Pydantic models, including the new strict ML contract schemas.
- `backend/services/ml_service.py`: A new abstraction layer for the multimodal ML pipeline. It will provide `predict_cyclone()` which, for now, will serve a transparent DEMO response, acting as a clean adapter for when the real model is integrated.

## API Contract (Real ML integration)
We will introduce new endpoints specifically for the real ML model integration:
- `GET /api/ml/status`
- `POST /api/ml/predict`
These endpoints will return schemas structured around the SIH problem statement (Detection, Classification, Track Prediction, Intensity Prediction, Explainability).

## Frontend Refactor
We will componentize the frontend for maintainability and scalability:
- `frontend/src/services/api.js`: Centralized API service.
- `frontend/src/components/`:
  - `Header.jsx`
  - `CycloneSummary.jsx` (Left sidebar)
  - `CycloneMap.jsx` (Leaflet wrapper with layers)
  - `LayerControl.jsx` (Map controls)
  - `ForecastPanel.jsx` & `IntensityChart.jsx` (Analytics)
  - `SatellitePanel.jsx` & `ExplainabilityPanel.jsx` (Right side panels)
  - `ModelStatus.jsx` & `DataSources.jsx`
- The UI will be redesigned to remove misleading fake AI claims, instead showing a transparent "DEMO MODE" when disconnected from a real ML model. The visual style will be a restrained, professional dark geospatial command-and-control dashboard.
