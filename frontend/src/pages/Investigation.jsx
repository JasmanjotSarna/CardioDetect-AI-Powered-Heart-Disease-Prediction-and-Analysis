import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  User,
  Heart,
  Sliders,
  FileText
} from 'lucide-react';
import { predictRisk } from '../api';
import ClinicalFeatureModal from '../components/ClinicalFeatureModal';
import CompactHeartWidget from '../components/CompactHeartWidget';
import { CLINICAL_FEATURES } from '../data/clinicalFeatures';

const DEFAULT_FORM = {
  Age: 54,
  Sex: 'M',
  ChestPainType: 'ASY',
  RestingBP: 130,
  Cholesterol: 240,
  FastingBS: 0,
  RestingECG: 'Normal',
  MaxHR: 145,
  ExerciseAngina: 'N',
  Oldpeak: 1.0,
  ST_Slope: 'Flat'
};

export default function Investigation({ onCaseLogged }) {
  const [formValues, setFormValues] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [report, setReport] = useState(null);
  const [activeModalFeature, setActiveModalFeature] = useState(null);
  const [activePreset, setActivePreset] = useState(null);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formValues.Age || formValues.Age < 18 || formValues.Age > 100) {
      newErrors.Age = 'Enter an age between 18 and 100 years.';
    }
    if (!formValues.RestingBP || formValues.RestingBP < 60 || formValues.RestingBP > 260) {
      newErrors.RestingBP = 'Resting BP must be between 60 and 260 mmHg.';
    }
    if (formValues.Cholesterol < 0 || formValues.Cholesterol > 700) {
      newErrors.Cholesterol = 'Cholesterol must be between 0 and 700 mg/dL.';
    }
    if (!formValues.MaxHR || formValues.MaxHR < 50 || formValues.MaxHR > 250) {
      newErrors.MaxHR = 'Maximum heart rate must be between 50 and 250 BPM.';
    }
    if (formValues.Oldpeak < -5 || formValues.Oldpeak > 10) {
      newErrors.Oldpeak = 'ST depression must be between -5.0 and 10.0 mm.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value
    }));
    setActivePreset(null);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Sample Presets
  const handleLoadPreset = (type) => {
    setActivePreset(type);
    if (type === 'healthy') {
      setFormValues({
        Age: 32,
        Sex: 'F',
        ChestPainType: 'ATA',
        RestingBP: 112,
        Cholesterol: 175,
        FastingBS: 0,
        RestingECG: 'Normal',
        MaxHR: 176,
        ExerciseAngina: 'N',
        Oldpeak: 0.0,
        ST_Slope: 'Up'
      });
    } else if (type === 'moderate') {
      setFormValues({
        Age: 52,
        Sex: 'M',
        ChestPainType: 'NAP',
        RestingBP: 136,
        Cholesterol: 238,
        FastingBS: 0,
        RestingECG: 'Normal',
        MaxHR: 142,
        ExerciseAngina: 'N',
        Oldpeak: 1.2,
        ST_Slope: 'Flat'
      });
    } else if (type === 'highRisk') {
      setFormValues({
        Age: 64,
        Sex: 'M',
        ChestPainType: 'ASY',
        RestingBP: 158,
        Cholesterol: 286,
        FastingBS: 1,
        RestingECG: 'ST',
        MaxHR: 114,
        ExerciseAngina: 'Y',
        Oldpeak: 2.6,
        ST_Slope: 'Flat'
      });
    }
    setErrors({});
  };

  const handleResetForm = () => {
    setFormValues(DEFAULT_FORM);
    setErrors({});
    setReport(null);
    setActivePreset(null);
  };

  // Submit Case
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || loading) return;

    setLoading(true);
    setReport(null);

    setLoadingStep('Validating clinical feature payload...');
    const t1 = setTimeout(() => {
      setLoadingStep('Projecting into 15D standardized feature space...');
    }, 400);
    const t2 = setTimeout(() => {
      setLoadingStep('Executing K-Nearest Neighbors voting (k=5)...');
    }, 800);

    try {
      const response = await predictRisk(formValues);
      clearTimeout(t1);
      clearTimeout(t2);

      setTimeout(() => {
        const caseRecord = {
          ...response,
          caseId: `CD-CASE-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          inputValues: { ...formValues }
        };
        setReport(caseRecord);
        if (onCaseLogged) {
          onCaseLogged(caseRecord);
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      setLoading(false);
      setErrors({ form: err.message || 'Analysis engine unreachable. Please check backend connection.' });
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[var(--bg-canvas)] text-[var(--text-main)] min-h-[calc(100vh-4rem)] transition-colors duration-200">
      <div className="site-container">
        
        {/* Page Header */}
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--coral-red-subtle)] text-[var(--coral-red)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Focused Clinical Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-[var(--text-main)] tracking-tight">
            Cardiovascular Investigation
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 leading-relaxed">
            Enter the 11 verified clinical indicators to evaluate cardiovascular risk classification. Click the 
            <span className="inline-flex items-center mx-1 text-[var(--accent-cyan)] font-medium">
              <Info className="w-3.5 h-3.5 inline mr-0.5" /> Info icon
            </span> 
            beside any field to inspect its medical purpose, dataset categories, and classification rationale.
          </p>
        </div>

        {/* Presets Toolbar */}
        <div className="mb-8 p-3.5 rounded-xl product-card flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-main)]">
            <Sparkles className="w-4 h-4 text-[var(--coral-red)]" />
            <span>Illustrative Case Scenarios:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadPreset('healthy')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activePreset === 'healthy'
                  ? 'bg-[var(--medical-green)] text-white'
                  : 'bg-[var(--medical-green-subtle)] text-[var(--medical-green)] border border-[var(--medical-green)]/30 hover:opacity-80'
              }`}
            >
              Scenario A: Low Risk Athlete
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('moderate')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activePreset === 'moderate'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:opacity-80'
              }`}
            >
              Scenario B: Moderate Vitals
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('highRisk')}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                activePreset === 'highRisk'
                  ? 'bg-[var(--coral-red)] text-white'
                  : 'bg-[var(--coral-red-subtle)] text-[var(--coral-red)] border border-[var(--coral-red)]/30 hover:opacity-80'
              }`}
            >
              Scenario C: Acute Ischemia
            </button>
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs px-2.5 py-1.5 rounded-md text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Global Form Error Banner */}
        {errors.form && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--coral-red-subtle)] border border-[var(--coral-red)]/40 text-[var(--coral-red)] text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Main Workspace Layout: Desktop Two-Column (7 cols / 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Clinical Input Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* SECTION 1 — Patient Profile */}
            <div className="product-card p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--coral-red-subtle)] text-[var(--coral-red)] flex items-center justify-center text-xs font-mono font-bold">
                    01
                  </div>
                  <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--text-main)]">
                    Patient Profile
                  </h2>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">Demographic Baseline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                      <span>Age</span>
                      <span className="input-unit-badge">Years</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveModalFeature('Age')}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="number"
                    value={formValues.Age}
                    onChange={(e) => handleInputChange('Age', parseInt(e.target.value) || '')}
                    className="form-input"
                    placeholder="e.g. 54"
                    min="18"
                    max="100"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    {CLINICAL_FEATURES.Age.shortHelp}
                  </p>
                  {errors.Age && <p className="text-[11px] text-[var(--coral-red)] mt-1">{errors.Age}</p>}
                </div>

                {/* Biological Sex (Segmented Control) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                      <span>Biological Sex</span>
                      <span className="input-unit-badge">M / F</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveModalFeature('Sex')}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange('Sex', 'M')}
                      className={`flex-1 segmented-btn text-center ${
                        formValues.Sex === 'M' ? 'segmented-btn-active' : 'segmented-btn-inactive'
                      }`}
                    >
                      Male (M)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('Sex', 'F')}
                      className={`flex-1 segmented-btn text-center ${
                        formValues.Sex === 'F' ? 'segmented-btn-active' : 'segmented-btn-inactive'
                      }`}
                    >
                      Female (F)
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                    {CLINICAL_FEATURES.Sex.shortHelp}
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2 — Cardiovascular Indicators */}
            <div className="product-card p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-cyan-subtle)] text-[var(--accent-cyan)] flex items-center justify-center text-xs font-mono font-bold">
                    02
                  </div>
                  <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--text-main)]">
                    Cardiovascular & Exercise Indicators
                  </h2>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">Vitals & Stress Markers</span>
              </div>

              {/* Chest Pain Type */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Chest Pain Type</span>
                    <span className="input-unit-badge">Pattern</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('ChestPainType')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={formValues.ChestPainType}
                  onChange={(e) => handleInputChange('ChestPainType', e.target.value)}
                  className="form-select"
                >
                  <option value="ASY">Asymptomatic (ASY) — Silent Ischemia / Typical Presentation</option>
                  <option value="NAP">Non-Anginal Pain (NAP) — Musculoskeletal / Non-cardiac</option>
                  <option value="ATA">Atypical Angina (ATA) — Partial Anginal Criteria</option>
                  <option value="TA">Typical Angina (TA) — Classic Exertional Discomfort</option>
                </select>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.ChestPainType.shortHelp}
                </p>
              </div>

              {/* Paired Slider & Numeric: Resting Blood Pressure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Resting Blood Pressure</span>
                    <span className="input-unit-badge">mmHg</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('RestingBP')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="1"
                    value={formValues.RestingBP}
                    onChange={(e) => handleInputChange('RestingBP', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={formValues.RestingBP}
                    onChange={(e) => handleInputChange('RestingBP', parseInt(e.target.value) || '')}
                    className="form-input w-24 text-center font-mono font-semibold"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {CLINICAL_FEATURES.RestingBP.shortHelp} Range: 80–200 mmHg.
                </p>
                {errors.RestingBP && <p className="text-[11px] text-[var(--coral-red)]">{errors.RestingBP}</p>}
              </div>

              {/* Serum Cholesterol */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Serum Cholesterol</span>
                    <span className="input-unit-badge">mg/dL</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('Cholesterol')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="number"
                  value={formValues.Cholesterol}
                  onChange={(e) => handleInputChange('Cholesterol', parseFloat(e.target.value) || 0)}
                  className="form-input font-mono"
                  placeholder="e.g. 240 (0 indicates missing baseline)"
                  min="0"
                  max="700"
                />
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.Cholesterol.shortHelp} (Median-imputed if 0).
                </p>
                {errors.Cholesterol && <p className="text-[11px] text-[var(--coral-red)] mt-1">{errors.Cholesterol}</p>}
              </div>

              {/* Fasting Blood Sugar (Segmented Control) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Fasting Blood Sugar</span>
                    <span className="input-unit-badge">120 mg/dL Threshold</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('FastingBS')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleInputChange('FastingBS', 0)}
                    className={`flex-1 segmented-btn text-center ${
                      formValues.FastingBS === 0 ? 'segmented-btn-active' : 'segmented-btn-inactive'
                    }`}
                  >
                    Normal (≤ 120 mg/dL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('FastingBS', 1)}
                    className={`flex-1 segmented-btn text-center ${
                      formValues.FastingBS === 1 ? 'segmented-btn-active' : 'segmented-btn-inactive'
                    }`}
                  >
                    Elevated (&gt; 120 mg/dL)
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.FastingBS.shortHelp}
                </p>
              </div>

              {/* Resting ECG */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Resting Electrocardiogram</span>
                    <span className="input-unit-badge">Conduction</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('RestingECG')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={formValues.RestingECG}
                  onChange={(e) => handleInputChange('RestingECG', e.target.value)}
                  className="form-select"
                >
                  <option value="Normal">Normal Tracing</option>
                  <option value="ST">ST-T Wave Abnormality (&gt; 0.05 mV)</option>
                  <option value="LVH">Left Ventricular Hypertrophy (LVH)</option>
                </select>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.RestingECG.shortHelp}
                </p>
              </div>

              {/* Paired Slider & Numeric: Maximum Heart Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Maximum Heart Rate Achieved</span>
                    <span className="input-unit-badge">BPM</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('MaxHR')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="1"
                    value={formValues.MaxHR}
                    onChange={(e) => handleInputChange('MaxHR', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={formValues.MaxHR}
                    onChange={(e) => handleInputChange('MaxHR', parseInt(e.target.value) || '')}
                    className="form-input w-24 text-center font-mono font-semibold"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {CLINICAL_FEATURES.MaxHR.shortHelp} Expected peak during Bruce stress test.
                </p>
                {errors.MaxHR && <p className="text-[11px] text-[var(--coral-red)]">{errors.MaxHR}</p>}
              </div>

              {/* Exercise-Induced Angina (Segmented Control) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Exercise-Induced Angina</span>
                    <span className="input-unit-badge">Exertional Symptom</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('ExerciseAngina')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleInputChange('ExerciseAngina', 'N')}
                    className={`flex-1 segmented-btn text-center ${
                      formValues.ExerciseAngina === 'N' ? 'segmented-btn-active' : 'segmented-btn-inactive'
                    }`}
                  >
                    No (Pain-Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('ExerciseAngina', 'Y')}
                    className={`flex-1 segmented-btn text-center ${
                      formValues.ExerciseAngina === 'Y' ? 'segmented-btn-active' : 'segmented-btn-inactive'
                    }`}
                  >
                    Yes (Angina Provoked)
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.ExerciseAngina.shortHelp}
                </p>
              </div>

              {/* Paired Slider & Numeric: ST Depression (Oldpeak) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>ST Depression (Oldpeak)</span>
                    <span className="input-unit-badge">mm</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('Oldpeak')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.1"
                    value={formValues.Oldpeak}
                    onChange={(e) => handleInputChange('Oldpeak', parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={formValues.Oldpeak}
                    onChange={(e) => handleInputChange('Oldpeak', parseFloat(e.target.value) || 0)}
                    className="form-input w-24 text-center font-mono font-semibold"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  {CLINICAL_FEATURES.Oldpeak.shortHelp} ST shift relative to rest.
                </p>
                {errors.Oldpeak && <p className="text-[11px] text-[var(--coral-red)]">{errors.Oldpeak}</p>}
              </div>

              {/* ST Slope */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1">
                    <span>Peak Exercise ST Slope</span>
                    <span className="input-unit-badge">Trajectory</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveModalFeature('ST_Slope')}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] p-0.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <select
                  value={formValues.ST_Slope}
                  onChange={(e) => handleInputChange('ST_Slope', e.target.value)}
                  className="form-select"
                >
                  <option value="Up">Upsloping (Up) — Normal Physiological Workload</option>
                  <option value="Flat">Flat (Flat) — High Ischemic Correlation</option>
                  <option value="Down">Downsloping (Down) — Severe CAD Multi-Vessel Pattern</option>
                </select>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  {CLINICAL_FEATURES.ST_Slope.shortHelp}
                </p>
              </div>
            </div>

            {/* Prominent Analyze CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm sm:text-base font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" />
                <span>{loading ? 'Evaluating Case Pipeline...' : 'Analyze Case'}</span>
              </button>
            </div>
          </form>

          {/* RIGHT: Secondary Area (5 cols) Contextual Guidance, Compact Heart, Live Summary & Report */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real-time Compact Heart Waveform Widget */}
            <CompactHeartWidget
              restingBP={formValues.RestingBP}
              maxHR={formValues.MaxHR}
              oldpeak={formValues.Oldpeak}
            />

            {/* Analysis Loading Animation */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="product-card p-6 text-center space-y-4"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--coral-red-subtle)] text-[var(--coral-red)] mx-auto flex items-center justify-center">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                
                {/* Thin Heartbeat SVG Stroke */}
                <div className="w-full h-8 flex items-center justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 200 32"
                    className="w-48 h-8 text-[var(--coral-red)] stroke-current fill-none"
                    style={{ strokeWidth: 1.75, strokeLinecap: 'round' }}
                  >
                    <line x1="0" y1="16" x2="200" y2="16" stroke="var(--border-subtle)" strokeWidth="1" />
                    <path
                      d="M 0,16 L 50,16 L 65,16 L 72,8 L 80,24 L 88,16 L 96,16 L 100,4 L 106,28 L 112,12 L 118,18 L 124,16 L 140,16 L 150,12 L 160,16 L 200,16"
                      className="ecg-animated-line"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-[var(--text-main)] text-base">
                    Executing K-Nearest Neighbors Pipeline
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
                    {loadingStep}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Interactive Results Case Report Card */}
            {report && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="product-card p-6 space-y-5 border-t-4"
                style={{
                  borderTopColor: report.is_high_risk ? 'var(--coral-red)' : 'var(--medical-green)'
                }}
              >
                {/* Report Header */}
                <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-main)]">
                        {report.caseId}
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)]">
                        Evaluated at {report.timestamp}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-[var(--text-main)] mt-1.5">
                      Case Evidence Report
                    </h3>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]"
                    title="Print clinical summary"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>

                {/* Classification Outcome & Probability Bar */}
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    report.is_high_risk
                      ? 'bg-[var(--coral-red-subtle)] border-[var(--coral-red)]/30'
                      : 'bg-[var(--medical-green-subtle)] border-[var(--medical-green)]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          report.is_high_risk
                            ? 'bg-[var(--coral-red)] text-white shadow-xs'
                            : 'bg-[var(--medical-green)] text-white shadow-xs'
                        }`}
                      >
                        {report.is_high_risk ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
                          Prediction Class
                        </div>
                        <div className="font-display font-bold text-lg text-[var(--text-main)]">
                          {report.is_high_risk ? 'Elevated Cardiac Risk' : 'Low Cardiac Risk'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-[var(--text-secondary)] font-mono">
                        Model Probability
                      </div>
                      <div
                        className={`font-mono font-bold text-lg ${
                          report.is_high_risk ? 'text-[var(--coral-red)]' : 'text-[var(--medical-green)]'
                        }`}
                      >
                        {report.risk_percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Probability Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-[var(--bg-surface)] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          report.is_high_risk ? 'bg-[var(--coral-red)]' : 'bg-[var(--medical-green)]'
                        }`}
                        style={{ width: `${Math.max(report.risk_percentage, 5)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                      <span>Low Risk (0%)</span>
                      <span>Elevated Risk (100%)</span>
                    </div>
                  </div>
                </div>

                {/* Clinical Finding Narrative */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                    Model Analysis Finding
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                    {report.status_description}
                  </p>
                </div>

                {/* Contributing Factors */}
                {report.contributing_factors && report.contributing_factors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                      Key Contributing Factors
                    </h4>
                    <ul className="space-y-1.5">
                      {report.contributing_factors.map((factor, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-[var(--text-main)] flex items-start gap-2 bg-[var(--bg-elevated)] p-2 rounded-md border border-[var(--border-subtle)]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral-red)] mt-1.5 shrink-0" />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submitted Inputs Summary Table */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                    Submitted Biomarkers
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-secondary)] block text-[10px]">Resting BP</span>
                      <span className="text-[var(--text-main)] font-semibold">{report.inputValues.RestingBP} mmHg</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-secondary)] block text-[10px]">Cholesterol</span>
                      <span className="text-[var(--text-main)] font-semibold">{report.inputValues.Cholesterol} mg/dL</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-secondary)] block text-[10px]">Max Heart Rate</span>
                      <span className="text-[var(--text-main)] font-semibold">{report.inputValues.MaxHR} BPM</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                      <span className="text-[var(--text-secondary)] block text-[10px]">ST Depression</span>
                      <span className="text-[var(--text-main)] font-semibold">{report.inputValues.Oldpeak} mm</span>
                    </div>
                  </div>
                </div>

                {/* Limitations & Educational Disclaimer */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-500">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Research Limitation:</strong> Experimental classification from 918 UCI records. Does not establish a clinical diagnosis. Must not be used for emergency treatment decisions.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="btn-secondary text-xs py-2 px-4 flex-1 justify-center"
                  >
                    Analyze Another Case
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-primary text-xs py-2 px-4 flex-1 justify-center"
                  >
                    Print Case Report
                  </button>
                </div>
              </motion.div>
            )}

            {/* Live Case Summary (Before Analysis Submission) */}
            {!report && !loading && (
              <div className="product-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <h3 className="font-display font-semibold text-base text-[var(--text-main)] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--accent-cyan)]" />
                    <span>Live Case Summary</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">Dynamic Inspector</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <span>Patient Profile</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.Age}y • {formValues.Sex === 'M' ? 'Male' : 'Female'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <span>Chest Pain Presentation</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.ChestPainType}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <span>Resting Blood Pressure</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.RestingBP} mmHg
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <span>Serum Cholesterol</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.Cholesterol} mg/dL
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    <span>Exercise Heart Rate Peak</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.MaxHR} BPM
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 text-[var(--text-secondary)]">
                    <span>Exercise-Induced Angina</span>
                    <span className="font-mono text-[var(--text-main)] font-medium">
                      {formValues.ExerciseAngina === 'Y' ? 'Yes (Anginal)' : 'No (Pain-Free)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[var(--text-secondary)] bg-[var(--bg-elevated)] p-3 rounded-lg border border-[var(--border-subtle)]">
                  Click <strong>Analyze Case</strong> to transmit these 11 parameters to the FastAPI backend running the K-Nearest Neighbors scikit-learn classifier.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Explanation Modal */}
      {activeModalFeature && (
        <ClinicalFeatureModal
          featureKey={activeModalFeature}
          onClose={() => setActiveModalFeature(null)}
        />
      )}
    </div>
  );
}
