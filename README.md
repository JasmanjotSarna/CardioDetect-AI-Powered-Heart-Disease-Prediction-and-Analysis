# ❤️ CardioDetect — AI Cardiovascular Research Lab

### *Every heartbeat leaves a clue.*

**CardioDetect** is a futuristic, minimal, and premium medical technology research platform that explores heart disease classification using clinical indicators and machine learning.

The application combines a Scikit-Learn classification pipeline (K-Nearest Neighbors, `k=5`), a FastAPI backend, and an interactive React 19 frontend with dual-theme capabilities, authentic data visualizations, and in-depth clinical feature explanations.

> **Medical Disclaimer:** CardioDetect is an experimental educational research platform. Its predictions are statistical machine learning outputs and are **not** clinically validated diagnostic decisions. It must not be used for emergency treatment or personal medical diagnoses. Always consult a board-certified physician or cardiologist.

---

## ✨ System Highlights & Architecture

### 🎨 Visual Identity & Dual-Theme Engine
- **Dark Mode (Default):** Deep midnight navy canvas (`#080D18`), structured surfaces (`#101827`, `#151F31`), primary soft white typography (`#F3F6FC`), secondary slate (`#9AA9BF`), cyan technical accents (`#45D9E8`), medical green (`#48D597`), and coral red (`#FF5267`).
- **Light Mode:** Soft off-white canvas (`#F5F8FC`), pure white surfaces (`#FFFFFF`), charcoal text (`#172338`), and matching medical accents.
- **Theme Persistence:** Synced with `localStorage`, listens to OS preference on initial visit, and features an anti-flash `<head>` script.

### 💓 Animations & Interactive Visualizations
1. **Welcome Loading Experience:** 1.8-second introductory SVG ECG heartbeat line stroke sequence, revealing *"CARDIODETECT — Every heartbeat leaves a clue"* before transitioning into the application. (Includes `Skip [Esc]` and reduced-motion fallback).
2. **Hero Cardiovascular Visualizer:** Custom anatomical vector heart composition on a medical coordinate grid with pointer-reactive parallax, continuous ECG trace, and pulsating conduction nodes.
3. **Investigation Workspace:**
   - Grouped into *Patient Profile* and *Cardiovascular & Exercise Indicators*.
   - Paired sliders and numeric inputs for continuous vitals (Resting BP, MaxHR, Oldpeak).
   - Clean segmented controls for binary parameters (Sex, Fasting Blood Sugar, Exercise Angina).
   - Real-time `CompactHeartWidget` reflecting vitals rhythm feedback.
   - Comprehensive `ClinicalFeatureModal` info popovers for **all 11 inputs** explaining measurement purpose, normal ranges, and ML rationale.
   - Live case summary table updating dynamically before submission.
   - Multi-stage animated heartbeat loading during real backend inference.
4. **Interactive Case Report:** Real prediction outcome (*Low Risk* vs *Elevated Risk*), KNN probability bar, contributing factors, recommendations, and printable summary.
5. **Model Insights / Dashboard:**
   - Real Recharts ROC curve (`AUC = 0.9269`).
   - Authentic 184-sample holdout test-set Confusion Matrix (70 TN, 12 FP, 13 FN, 89 TP).
   - Session investigation records log with clear empty state.
6. **Science Page ("Inside the Model"):**
   - **Interactive 2D Feature Space Plot:** Click anywhere to position a patient query vector, adjust `k` (k=3, 5, 7), and watch nearest neighbors cast votes in real-time.
   - 6 detailed pipeline stages with code and mathematical transformations.

---

## 🧰 Technology Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Python 3.12, FastAPI, Uvicorn (ASGI) |
| **Machine Learning** | Scikit-Learn (`KNeighborsClassifier(k=5)`, `Pipeline`, `ColumnTransformer`, `StandardScaler`, `OneHotEncoder`, `SimpleImputer`) |
| **Data Processing** | Pandas, NumPy |
| **Model Artifact** | `heart_disease_pipeline.pkl` |

---

## 🚀 Local Setup & Quickstart

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (Virtual environment `.venv` recommended)

### 1. Start the FastAPI Backend
```bash
# From project root
.\.venv\Scripts\python.exe -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```
*Backend health check available at:* `http://localhost:8000/api/health`  
*Interactive Swagger docs:* `http://localhost:8000/docs`

### 2. Start the React Frontend
```bash
# From the frontend/ directory
cd frontend
npm install
npm run dev
```
*Frontend will launch at:* `http://localhost:5173`

### 3. Production Build Validation
```bash
cd frontend
npm run build
```

---

## 📡 Backend API Contracts

### `GET /api/health`
Returns model pipeline status, algorithm parameters, and verified accuracy.

### `GET /api/metrics`
Returns verified test-set accuracy (86.41%), ROC-AUC (0.9269), precision (88.12%), recall (87.25%), and confusion matrix counts.

### `GET /api/roc-curve`
Returns authentic true positive and false positive rate coordinates from model testing.

### `GET /api/presets`
Returns verified case scenarios for healthy baseline, moderate vitals, and acute ischemia cases.

### `POST /api/predict`
Accepts the 11 patient features in JSON format:
```json
{
  "Age": 54,
  "Sex": "M",
  "ChestPainType": "ASY",
  "RestingBP": 130,
  "Cholesterol": 240,
  "FastingBS": 0,
  "RestingECG": "Normal",
  "MaxHR": 145,
  "ExerciseAngina": "N",
  "Oldpeak": 1.0,
  "ST_Slope": "Flat"
}
```
Returns classification outcome, probability percentage, clinical description, contributing biomarkers, and recommended actions.
