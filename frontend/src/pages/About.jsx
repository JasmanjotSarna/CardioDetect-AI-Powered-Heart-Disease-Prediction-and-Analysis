import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Cpu,
  ShieldCheck,
  Code,
  User,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Terminal,
  Globe
} from 'lucide-react';

export default function About() {
  return (
    <div className="py-8 sm:py-16 bg-[var(--bg-canvas)] text-[var(--text-main)] min-h-screen transition-colors duration-200">
      <div className="site-container-narrow space-y-12 sm:space-y-16">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--coral-red-subtle)] text-[var(--coral-red)] text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Platform Background</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-[var(--text-main)] tracking-tight">
            About CardioDetect
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Every heartbeat leaves a clue. CardioDetect is an experimental cardiovascular health research and educational platform exploring machine-learning-assisted classification using clinical indicators.
          </p>
        </div>

        {/* Section 1: What CardioDetect is & Why Built */}
        <section className="product-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <BookOpen className="w-4 h-4 text-[var(--coral-red)]" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              What CardioDetect Is & Why It Was Built
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
            Cardiovascular diseases remain the leading cause of global mortality. While machine learning offers immense promise for early stratification, algorithmic decisions in healthcare are frequently obscured behind black-box architectures or opaque probability scores.
          </p>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            CardioDetect was built with a transparent objective: provide full visibility into every stage of the diagnostic machine learning pipeline—from raw resting vitals and median imputation to Euclidean coordinate distances and majority-rule neighbor voting.
          </p>
        </section>

        {/* Section 2: Creator Profile */}
        <section className="product-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <User className="w-4 h-4 text-[var(--accent-cyan)]" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              Creator & Lead Engineer
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--coral-red)] to-amber-500 text-white flex items-center justify-center font-display font-bold text-2xl shadow-md shrink-0">
              JS
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-[var(--text-main)]">
                Jasmanjot Singh Sarna
              </h3>
              <p className="text-xs text-[var(--coral-red)] font-medium">
                Machine Learning Engineer & Full-Stack Developer
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed pt-1">
                Specializing in production ML architectures, clean healthcare interfaces, and end-to-end data pipeline integration using Python, Scikit-Learn, FastAPI, and React.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://linkedin.com/in/jasmanjot-singh-sarna"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href="https://github.com/jasman-sarna"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Verified Technology Stack */}
        <section className="product-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <Terminal className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              Verified Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="font-semibold text-[var(--text-main)] block mb-0.5">Frontend Client</span>
              <p className="text-[var(--text-secondary)]">
                React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons. Dual-theme design system with anti-flash script.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="font-semibold text-[var(--text-main)] block mb-0.5">API Server</span>
              <p className="text-[var(--text-secondary)]">
                FastAPI, Uvicorn asynchronous server, Pydantic type validation schemas with strict boundary constraints.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="font-semibold text-[var(--text-main)] block mb-0.5">Machine Learning Engine</span>
              <p className="text-[var(--text-secondary)]">
                Python 3.12, Scikit-Learn Pipeline, ColumnTransformer, SimpleImputer, StandardScaler, OneHotEncoder, KNeighborsClassifier.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="font-semibold text-[var(--text-main)] block mb-0.5">Dataset Source</span>
              <p className="text-[var(--text-secondary)]">
                Consolidated UCI Heart Disease Dataset (Cleveland, Hungary, Switzerland, Long Beach V.A.) comprising 918 patient records.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Responsible AI & Disclaimers */}
        <section className="product-card p-6 sm:p-8 space-y-4 border-amber-500/30">
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h2 className="font-display font-bold text-lg text-[var(--text-main)]">
              Responsible AI Statement & Research Limitations
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              CardioDetect is strictly an educational research platform. Machine learning models trained on retrospective observational data inherit historical biases, confounding clinical practices, and demographic skews.
            </p>
            <p>
              <strong>Not Medical Advice:</strong> No output, probability score, or risk level produced by CardioDetect constitutes a medical diagnosis or treatment plan. Individuals with cardiovascular symptoms must seek immediate consultation with a qualified medical professional.
            </p>
          </div>
        </section>

        {/* Next Steps CTA */}
        <div className="text-center pt-4">
          <Link to="/investigate" className="btn-primary text-sm py-3 px-6 shadow-sm">
            <span>Open Investigation Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
