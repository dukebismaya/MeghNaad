# MeghNaad - AI-Powered Tropical Cyclone Identification

MeghNaad is a state-of-the-art multimodal AI framework for the early detection, tracking, and intensity forecasting of tropical cyclones in the North Indian Ocean basin. 

The project consists of a Python FastAPI backend (which serves the machine learning models and parses IBTrACS datasets) and a React (Vite) frontend with WebGL-powered 3D mapping capabilities.

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+ recommended)
- **Python** (v3.9+ recommended)
- **Git**

## Setup & Running the Application

This project is divided into two distinct services that must be run simultaneously: the `backend` and the `frontend`.

### 1. Start the Backend (FastAPI / PyTorch)

The backend handles the AI inference and data parsing.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   python -m uvicorn main:app --port 8001
   ```
The backend should now be running locally on `http://localhost:8001`.

### 2. Start the Frontend (React / Vite)

The frontend contains the interactive mapping dashboard and UI.

1. Open a **new** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend should now be running locally, typically on `http://localhost:5173`. 

Open `http://localhost:5173` in your web browser to view the MeghNaad dashboard!

---

## Hidden Presentation Notes
If you are preparing to present this project, you can navigate to `http://localhost:5173/learn` (this link is hidden from the main navigation) to access the internal knowledge base, terminology guide, and expected Q&A cross-questions.
