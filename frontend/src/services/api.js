const API_BASE = "http://localhost:8001";

export async function getActiveCyclones() {
  const response = await fetch(`${API_BASE}/api/cyclone/active`);
  if (!response.ok) throw new Error("Failed to fetch active cyclones");
  return response.json();
}

export async function getForecastChart() {
  const response = await fetch(`${API_BASE}/api/cyclone/forecast-chart`);
  if (!response.ok) throw new Error("Failed to fetch forecast chart data");
  return response.json();
}

export async function getXaiHeatmap() {
  const response = await fetch(`${API_BASE}/api/cyclone/xai-heatmap`);
  if (!response.ok) throw new Error("Failed to fetch XAI heatmap data");
  return response.json();
}

export async function getMlStatus() {
  const response = await fetch(`${API_BASE}/api/ml/status`);
  if (!response.ok) throw new Error("Failed to fetch ML model status");
  return response.json();
}

export async function predictCyclone(inputData) {
  const response = await fetch(`${API_BASE}/api/ml/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  });
  if (!response.ok) throw new Error("Failed to get ML prediction");
  return response.json();
}
