import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Database,
  ShieldAlert,
  Layers,
  Sparkles,
  Sliders,
  Maximize2
} from 'lucide-react';
import InteractiveKNNPlot from '../components/InteractiveKNNPlot';

const PIPELINE_STAGES = [
  {
    id: 1,
    num: '01',
    name: 'Input Feature Vector',
    subtitle: '11 Raw Patient Health Measurements',
    summary: 'Ingests patient demographic, resting vitals, and post-exercise ECG indicators.',
    description: 'Patient parameters are validated against boundary constraints (e.g. Age 18–100, RestingBP 60–260 mmHg) before ingestion by the ColumnTransformer.',
    transformation: 'Raw Payload: {Age: 54, Sex: "M", ChestPainType: "ASY", RestingBP: 130, Cholesterol: 240, ...}',
    rationale: 'Clinical boundaries prevent nonsensical physiological entries from contaminating distance calculations.'
  },
  {
    id: 2,
    num: '02',
    name: 'Missing-Value Imputation',
    subtitle: 'SimpleImputer(missing_values=0, strategy="median")',
    summary: 'Substitutes unrecorded zero entries in continuous biomarkers.',
    description: 'In the UCI dataset, several cases have RestingBP=0 or Cholesterol=0 reflecting unrecorded values. The pipeline replaces zeros with the median of training instances (RestingBP: 130 mmHg, Cholesterol: 223 mg/dL).',
    transformation: 'Zero Replacement: RestingBP: 0 -> 130 mmHg | Cholesterol: 0 -> 223 mg/dL',
    rationale: 'Physiological zeros are biological impossibilities. Median imputation preserves distribution medians without leaking test distributions.'
  },
  {
    id: 3,
    num: '03',
    name: 'Numerical Feature Scaling',
    subtitle: 'StandardScaler(with_mean=True, with_std=True)',
    summary: 'Standardizes continuous measurements to zero mean and unit variance.',
    description: 'Computes z = (x - μ) / σ for each of the 6 numeric indicators (Age, RestingBP, Cholesterol, FastingBS, MaxHR, Oldpeak).',
    transformation: 'Transformation: Cholesterol 240 mg/dL -> z = +0.28 | MaxHR 145 BPM -> z = -0.19',
    rationale: 'Euclidean distance squares absolute coordinate discrepancies. Without scaling, cholesterol (range 0–600) would completely overpower ST depression (range 0–6 mm).'
  },
  {
    id: 4,
    num: '04',
    name: 'Categorical Feature Encoding',
    subtitle: 'OneHotEncoder(handle_unknown="ignore", sparse_output=False)',
    summary: 'Expands non-ordinal categories into orthogonal binary coordinates.',
    description: 'Sex (2 categories), ChestPainType (4 categories), RestingECG (3 categories), ExerciseAngina (2 categories), and ST_Slope (3 categories) are transformed into orthogonal binary flags.',
    transformation: 'Categorical Expansion: ChestPainType "ASY" -> [1, 0, 0, 0] | ST_Slope "Flat" -> [0, 1, 0]',
    rationale: 'Prevents false mathematical ordering (e.g. implying ASY > ATA > TA) by ensuring every category is equidistant in Euclidean space.'
  },
  {
    id: 5,
    num: '05',
    name: 'K-Nearest Neighbors Classification',
    subtitle: 'KNeighborsClassifier(n_neighbors=5, metric="minkowski", p=2)',
    summary: 'Projects query vector into 15D space and queries 5 closest training instances.',
    description: 'Computes Euclidean distances to all 734 training vectors. The 5 closest neighbors cast equal votes. If ≥3 neighbors exhibit coronary heart disease, the query is assigned the positive risk class.',
    transformation: 'Distance Formulation: d(p, q) = √( Σ [z_pi - z_qi]² ) for i = 1..15',
    rationale: 'Non-parametric flexibility allows the model to fit complex, multi-modal biomarker clusters without assuming a linear separation hyperplane.'
  },
  {
    id: 6,
    num: '06',
    name: 'Model Output & Probability Synthesis',
    subtitle: 'Binary Classification & Majority Voting Confidence',
    summary: 'Synthesizes predicted class, confidence percentage, and biomarker evidence.',
    description: 'The probability score represents the fraction of the k=5 nearest neighbors sharing the predicted class (e.g. 4/5 = 80%). This is paired with contributing factors and clinical recommendations.',
    transformation: 'Output: Class 1 (Elevated Risk) with 80% KNN Neighbor Agreement',
    rationale: 'Provides transparent heuristic probability reflecting local case clustering rather than an opaque black-box verdict.'
  }
];

export default function Science() {
  const [selectedStage, setSelectedStage] = useState(1);

  return (
    <div className="py-8 sm:py-16 bg-[var(--bg-canvas)] text-[var(--text-main)] min-h-screen transition-colors duration-200">
      <div className="site-container-narrow space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-cyan-subtle)] text-[var(--accent-cyan)] text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Machine Learning Science</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-[var(--text-main)] tracking-tight">
            Inside the Model
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            CardioDetect uses an automated scikit-learn pipeline to transform 11 patient features into an interpretable 15-dimensional coordinate space. Below is the interactive architecture and mathematics behind its decisions.
          </p>
        </div>

        {/* SECTION 1 — INTERACTIVE KNN POINT VISUALIZATION */}
        <section className="space-y-4">
          <div className="space-y-1">
            <span className="step-indicator">INTERACTIVE DEMONSTRATOR</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)]">
              How K-Nearest Neighbors Works
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Click anywhere on the feature plane below to relocate a patient query vector. Observe how the 5 nearest neighbors form a majority voting circle to decide the predicted risk class.
            </p>
          </div>

          <InteractiveKNNPlot />
        </section>

        {/* SECTION 2 — 6-STAGE INTERACTIVE PREPROCESSING PIPELINE */}
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="step-indicator">SCIKIT-LEARN PIPELINE</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[var(--text-main)]">
              The 6 Transformation Stages
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Click any stage below to inspect its exact mathematical transformation, Python implementation, and diagnostic rationale.
            </p>
          </div>

          <div className="space-y-2">
            {PIPELINE_STAGES.map((stage) => {
              const isSelected = selectedStage === stage.id;
              return (
                <div key={stage.id} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--bg-surface)]">
                  <button
                    onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isSelected ? 'bg-[var(--coral-red)] text-white' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                      }`}>
                        {stage.num}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                          {stage.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] font-mono">
                          {stage.subtitle}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/40 space-y-4"
                      >
                        <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
                          {stage.description}
                        </p>

                        <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-cyan)] font-semibold">
                            Data Transformation Sample
                          </span>
                          <p className="text-xs font-mono text-[var(--text-main)]">
                            {stage.transformation}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--coral-red)] font-semibold block mb-1">
                            Why This Step Exists
                          </span>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {stage.rationale}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 — MATHEMATICAL EXPLANATIONS */}
        <section className="product-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <Calculator className="w-4 h-4 text-[var(--accent-cyan)]" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              Mathematical Foundations & Why Scaling Matters
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              In multi-dimensional Euclidean geometry, the distance between patient vector <strong>p</strong> and training vector <strong>q</strong> across all 15 coordinates is defined as:
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-center space-y-1">
              <span className="font-mono text-sm sm:text-base font-bold text-[var(--coral-red)]">
                d(p, q) = √( Σ [z_pi - z_qi]² ) &nbsp; for i = 1 to 15
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Where z_i represents each z-score normalized continuous coordinate or binary one-hot encoded coordinate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <h4 className="font-semibold text-[var(--text-main)] text-xs mb-1">
                  Why k=5 Was Selected
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  An odd number of neighbors eliminates the risk of 50/50 tie votes in binary classification. k=5 provides optimal balance between high sensitivity to local clusters and noise resilience.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
                <h4 className="font-semibold text-[var(--text-main)] text-xs mb-1">
                  Fairness via Standardization
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  Because Euclidean distance squares discrepancies, raw cholesterol (up to 600 mg/dL) would dominate ST depression (0.0 to 4.0 mm) by a factor of 10,000 without StandardScaler.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — DATASET LIMITATIONS */}
        <section className="product-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <Database className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              Dataset Provenance & Known Biases
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              The model was trained on the consolidated <strong>UCI Heart Disease Dataset</strong> consisting of 918 patient observations collected across 5 medical centers (Cleveland Clinic, Hungarian Institute of Cardiology, University Hospital of Zurich, University Hospital of Basel, and V.A. Medical Center Long Beach).
            </p>

            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-500 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Research Caution:</strong> The historical cohort consists of 79% male participants and reflects observational clinical testing from the 1980s. Predictions illustrate machine learning principles and must never substitute for standard of care medical diagnosis.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
