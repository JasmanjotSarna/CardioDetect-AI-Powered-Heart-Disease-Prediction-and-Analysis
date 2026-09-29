import os
import warnings
warnings.filterwarnings("ignore")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib

app = FastAPI(
    title="CardioSense AI — Heart Disease Prediction Engine",
    description="Production Machine Learning Pipeline with FastAPI & Scikit-Learn",
    version="2.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the trained Pipeline
pipeline_path = os.path.join(BASE_DIR, "heart_disease_pipeline.pkl")
try:
    pipeline = joblib.load(pipeline_path)
    print("Loaded heart_disease_pipeline.pkl successfully.")
except Exception as e:
    pipeline = None
    print(f"Error loading pipeline: {e}")

class PatientVitals(BaseModel):
    Age: int = Field(default=54, ge=18, le=100)
    Sex: str = Field(default="M")
    ChestPainType: str = Field(default="ASY")
    RestingBP: float = Field(default=135.0, ge=50, le=250)
    Cholesterol: float = Field(default=240.0, ge=50, le=600)
    FastingBS: int = Field(default=0, ge=0, le=1)
    RestingECG: str = Field(default="Normal")
    MaxHR: int = Field(default=145, ge=60, le=220)
    ExerciseAngina: str = Field(default="N")
    Oldpeak: float = Field(default=1.2, ge=0.0, le=10.0)
    ST_Slope: str = Field(default="Flat")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "Scikit-Learn Pipeline" if pipeline is not None else "Standalone Model",
        "model_loaded": pipeline is not None or fallback_model is not None,
        "algorithm": "K-Nearest Neighbors (k=5)",
        "accuracy": "86.41%",
        "roc_auc": "92.69%"
    }

@app.get("/api/metrics")
def get_metrics():
    return {
        "model_name": "K-Nearest Neighbors Classifier",
        "neighbors": 5,
        "dataset_size": 918,
        "train_samples": 734,
        "test_samples": 184,
        "accuracy": 0.8641,
        "precision": 0.8812,
        "recall": 0.8725,
        "f1_score": 0.8768,
        "roc_auc": 0.9269,
        "confusion_matrix": {
            "true_negative": 70,
            "false_positive": 12,
            "false_negative": 13,
            "true_positive": 89
        },
        "preprocessing": [
            "Median Imputation for numerical zeros (RestingBP, Cholesterol)",
            "StandardScaler normalization on 6 numerical features",
            "One-Hot Encoding on 5 categorical features (handle_unknown='ignore')",
            "Stratified 80/20 Train-Test split"
        ]
    }

@app.get("/api/roc-curve")
def get_roc_curve():
    # Return genuine test-set ROC curve data points
    return {
        "auc": 0.9269,
        "algorithm": "K-Nearest Neighbors (k=5)",
        "points": [
            {"fpr": 0.0, "tpr": 0.0, "baseline": 0.0},
            {"fpr": 0.037, "tpr": 0.471, "baseline": 0.037},
            {"fpr": 0.085, "tpr": 0.765, "baseline": 0.085},
            {"fpr": 0.146, "tpr": 0.873, "baseline": 0.146},
            {"fpr": 0.244, "tpr": 0.961, "baseline": 0.244},
            {"fpr": 0.427, "tpr": 0.990, "baseline": 0.427},
            {"fpr": 1.0, "tpr": 1.0, "baseline": 1.0}
        ]
    }

@app.get("/api/presets")
def get_presets():
    return {
        "healthy": {
            "name": "Healthy Baseline (Athletic / Normal)",
            "data": {
                "Age": 28,
                "Sex": "F",
                "ChestPainType": "ATA",
                "RestingBP": 115,
                "Cholesterol": 180,
                "FastingBS": 0,
                "RestingECG": "Normal",
                "MaxHR": 178,
                "ExerciseAngina": "N",
                "Oldpeak": 0.0,
                "ST_Slope": "Up"
            }
        },
        "moderate": {
            "name": "Moderate Risk (Stage 1 HTN / Elevated Vitals)",
            "data": {
                "Age": 54,
                "Sex": "M",
                "ChestPainType": "NAP",
                "RestingBP": 138,
                "Cholesterol": 245,
                "FastingBS": 0,
                "RestingECG": "Normal",
                "MaxHR": 142,
                "ExerciseAngina": "N",
                "Oldpeak": 1.2,
                "ST_Slope": "Flat"
            }
        },
        "highRisk": {
            "name": "High Risk (Clinical Watchlist / Ischemia)",
            "data": {
                "Age": 64,
                "Sex": "M",
                "ChestPainType": "ASY",
                "RestingBP": 160,
                "Cholesterol": 288,
                "FastingBS": 1,
                "RestingECG": "ST",
                "MaxHR": 115,
                "ExerciseAngina": "Y",
                "Oldpeak": 2.8,
                "ST_Slope": "Flat"
            }
        }
    }

@app.post("/api/predict")
def predict_risk(vitals: PatientVitals):
    data = vitals.model_dump()
    
    # Input DataFrame for the Scikit-Learn Pipeline
    input_df = pd.DataFrame([{
        "Age": data["Age"],
        "Sex": data["Sex"],
        "ChestPainType": data["ChestPainType"],
        "RestingBP": data["RestingBP"],
        "Cholesterol": data["Cholesterol"],
        "FastingBS": data["FastingBS"],
        "RestingECG": data["RestingECG"],
        "MaxHR": data["MaxHR"],
        "ExerciseAngina": data["ExerciseAngina"],
        "Oldpeak": data["Oldpeak"],
        "ST_Slope": data["ST_Slope"]
    }])

    if pipeline is None:
        raise HTTPException(status_code=500, detail="Model pipeline is not loaded.")

    pred = int(pipeline.predict(input_df)[0])
    probabilities = pipeline.predict_proba(input_df)[0]
    prob_high_risk = float(probabilities[1]) if len(probabilities) > 1 else float(pred)

    risk_percentage = round(prob_high_risk * 100, 1)

    if risk_percentage >= 70:
        level = "High Risk"
        badge_color = "crimson"
        status_desc = "Clinical vitals align strongly with coronary artery disease patterns. Immediate medical review suggested."
    elif risk_percentage >= 40:
        level = "Moderate Risk"
        badge_color = "amber"
        status_desc = "Borderline physiological markers detected. Lifestyle and dietary interventions recommended."
    else:
        level = "Low Risk"
        badge_color = "emerald"
        status_desc = "Biomarkers are within healthy ranges with minimal indication of ischemic cardiac disease."

    # Clinical contributing factors breakdown
    factors = []
    recommendations = []

    if data['RestingBP'] >= 140:
        factors.append(f"Stage 2 Hypertension (Resting BP: {data['RestingBP']} mmHg)")
        recommendations.append("Consider DASH dietary protocol and discuss antihypertensive therapy with a physician.")
    elif data['RestingBP'] >= 130:
        factors.append(f"Stage 1 Hypertension (Resting BP: {data['RestingBP']} mmHg)")
        recommendations.append("Monitor blood pressure twice daily and reduce dietary sodium intake.")

    if data['Cholesterol'] >= 240:
        factors.append(f"High Cholesterol (Serum: {data['Cholesterol']} mg/dL)")
        recommendations.append("Order a comprehensive lipid profile (LDL/HDL/Triglycerides) and evaluate statin eligibility.")
    elif data['Cholesterol'] >= 200:
        factors.append(f"Borderline High Cholesterol ({data['Cholesterol']} mg/dL)")
        recommendations.append("Increase soluble fiber and omega-3 fatty acids in daily nutrition.")

    if data['Oldpeak'] >= 2.0:
        factors.append(f"Pronounced ST Depression (Oldpeak: {data['Oldpeak']})")
        recommendations.append("Recommend formal stress echocardiography or nuclear myocardial perfusion imaging.")
    elif data['Oldpeak'] >= 1.0:
        factors.append(f"Mild ST Depression (Oldpeak: {data['Oldpeak']})")

    if data['ExerciseAngina'] == 'Y':
        factors.append("Exercise-Induced Angina (Exertional Chest Tightness)")
        recommendations.append("Limit strenuous anaerobic workouts until cardiology clearance is obtained.")

    if data['FastingBS'] == 1:
        factors.append("Fasting Hyperglycemia (> 120 mg/dL)")
        recommendations.append("Check HbA1c to screen for insulin resistance or type 2 diabetes mellitus.")

    if data['ST_Slope'] == 'Flat':
        factors.append("Flat ST Slope (Exercise Electrocardiographic Abnormality)")
    elif data['ST_Slope'] == 'Down':
        factors.append("Downsloping ST Slope (Elevated Ischemia Indicator)")

    if data['MaxHR'] < 120 and data['Age'] < 65:
        factors.append(f"Sub-optimal Peak Heart Rate ({data['MaxHR']} bpm)")

    if not recommendations:
        recommendations.append("Maintain routine aerobic exercise (150 min/week) and annual preventative checkups.")
        recommendations.append("Continue balanced Mediterranean-style cardioprotective diet.")

    return {
        "prediction": pred,
        "is_high_risk": pred == 1,
        "risk_level": level,
        "risk_percentage": risk_percentage,
        "badge_color": badge_color,
        "status_description": status_desc,
        "contributing_factors": factors,
        "recommendations": recommendations,
        "patient_summary": {
            "age": data['Age'],
            "sex": "Male" if data['Sex'] == "M" else "Female",
            "chest_pain": data['ChestPainType'],
            "resting_bp": data['RestingBP'],
            "cholesterol": data['Cholesterol'],
            "max_hr": data['MaxHR']
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
