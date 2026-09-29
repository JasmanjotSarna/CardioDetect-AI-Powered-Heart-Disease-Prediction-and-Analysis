import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Activity,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BarChart3,
  Sliders,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import HeroHeartVisualizer from '../components/HeroHeartVisualizer';
import BackgroundBeams from '../components/ui/BackgroundBeams';
import BentoGrid from '../components/ui/BentoGrid';
import CardSpotlight from '../components/ui/CardSpotlight';
import BorderBeam from '../components/ui/BorderBeam';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="bg-[var(--bg-canvas)] text-[var(--text-main)] min-h-screen transition-colors duration-200">
      
      {/* =========================================================================
          HERO SECTION (Two-column with Aceternity BackgroundBeams & Interactive Visualizer)
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-[var(--border-subtle)] overflow-hidden">
        {/* Aceternity Style Background Beams & Mesh */}
        <BackgroundBeams />

        <div className="site-container relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          >
            {/* Left Column: Typography, Eyebrow, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Eyebrow */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--coral-red-subtle)] border border-[var(--coral-red)]/20 text-[var(--coral-red)] text-xs font-semibold uppercase tracking-wider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral-red)]" />
                <span>AI-POWERED CARDIOVASCULAR RESEARCH</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl font-display font-bold text-[var(--text-main)] tracking-tight leading-[1.08]"
              >
                Every heartbeat <br />
                <span className="text-[var(--coral-red)]">leaves a clue.</span>
              </motion.h1>

              {/* Supporting Copy */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed"
              >
                Explore cardiovascular health indicators through an interactive machine-learning experience. Examine clinical features, understand the K-Nearest Neighbors model, and explore the statistical patterns behind its predictions.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/investigate" className="btn-primary text-sm py-3 px-6 shadow-sm">
                  <span>Start an Investigation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/science" className="btn-secondary text-sm py-3 px-6">
                  <span>Explore the Science</span>
                </Link>
              </motion.div>

              {/* Verified Metrics Metadata Strip */}
              <motion.div
                variants={itemVariants}
                className="pt-6 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-4 max-w-lg"
              >
                <div>
                  <div className="font-mono font-bold text-lg sm:text-xl text-[var(--text-main)]">
                    86.41%
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
                    Test Accuracy
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-lg sm:text-xl text-[var(--coral-red)]">
                    0.9269
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
                    ROC-AUC Score
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-lg sm:text-xl text-[var(--accent-cyan)]">
                    918 Cases
                  </div>
                  <div className="text-[11px] sm:text-xs text-[var(--text-secondary)]">
                    Cohort Dataset
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Custom Interactive Heart Visualizer with BorderBeam */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 flex justify-center"
            >
              <HeroHeartVisualizer />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          PRODUCT OVERVIEW — 3 CLEAR STAGES (With CardSpotlight)
          ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)]">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="step-indicator">WORKFLOW ARCHITECTURE</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-main)] mt-2">
              From clinical indicators to statistical evidence.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              Three streamlined phases connecting raw vitals with machine learning decision boundaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 01 */}
            <CardSpotlight className="space-y-3" spotlightColor="rgba(255, 82, 103, 0.08)">
              <span className="font-mono font-bold text-[var(--coral-red)] text-sm">
                01 — Enter clinical indicators
              </span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                Patient Vitals & Stress Testing
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Provide age, sex, chest pain presentation, resting blood pressure, cholesterol, and post-exercise ECG stress test measurements.
              </p>
            </CardSpotlight>

            {/* Step 02 */}
            <CardSpotlight className="space-y-3" spotlightColor="rgba(69, 217, 232, 0.08)">
              <span className="font-mono font-bold text-[var(--accent-cyan)] text-sm">
                02 — Explore the model's analysis
              </span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                K-Nearest Neighbors Inference
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                The scikit-learn pipeline normalizes features with StandardScaler and computes Euclidean distance across the 15-dimensional space to identify the 5 closest clinical profiles.
              </p>
            </CardSpotlight>

            {/* Step 03 */}
            <CardSpotlight className="space-y-3" spotlightColor="rgba(72, 213, 151, 0.08)">
              <span className="font-mono font-bold text-[var(--medical-green)] text-sm">
                03 — Review the result & limitations
              </span>
              <h3 className="font-display font-semibold text-lg text-[var(--text-main)]">
                Evidence Synthesis & Findings
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Inspect predicted risk level, probability estimate, primary contributing biomarkers, and research-use guidelines with clear educational boundaries.
              </p>
            </CardSpotlight>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAGIC UI & ACETERNITY BENTO GRID FEATURES
          ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)]">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="step-indicator">PLATFORM CAPABILITIES</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-main)] mt-2">
              Engineered for Clinical & Educational Rigor
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
              Explore the key capabilities powering the CardioDetect investigation system.
            </p>
          </div>

          <BentoGrid />
        </div>
      </section>

      {/* =========================================================================
          VERIFIED MODEL PERFORMANCE SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-subtle)]">
        <div className="site-container">
          <div className="product-card p-8 sm:p-10 bg-[var(--bg-elevated)]/60 relative overflow-hidden">
            <BorderBeam size={280} duration={12} colorFrom="#48D597" colorTo="#45D9E8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <span className="step-indicator">AUTHENTIC MODEL BENCHMARK</span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-main)]">
                  Evaluated on 184 Independent Test Patients
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  Trained on an 80/20 stratified split of 918 patients across 5 renowned cardiovascular research centers. The model achieves an 86.41% accuracy score and 0.9269 area under the ROC curve.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--text-main)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--medical-green)]" />
                    <span>86.41% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--text-main)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--accent-cyan)]" />
                    <span>0.9269 ROC-AUC</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[var(--text-main)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--coral-red)]" />
                    <span>k=5 Neighbors</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link to="/insights" className="btn-secondary text-sm py-3 px-6 w-full lg:w-auto text-center">
                  <span>View Model Insights</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA & RESEARCH-USE DISCLAIMER
          ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="site-container-narrow text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-main)]">
            Ready to explore cardiovascular data?
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto">
            Open the investigation workspace to explore how clinical features guide machine learning predictions.
          </p>
          <div className="pt-2">
            <Link to="/investigate" className="btn-primary text-sm py-3.5 px-8 shadow-sm">
              <span>Start an Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8 text-xs text-[var(--text-muted)] max-w-md mx-auto">
            Educational and research demonstration platform. Not a certified clinical diagnostic device. Consult a cardiologist for personal medical decisions.
          </div>
        </div>
      </section>
    </div>
  );
}
