import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeScreen({ onComplete }) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Sequence timing: total ~1.8 seconds
    const timer1 = setTimeout(() => setStep(2), 350);  // Step 2: Draw ECG line
    const timer2 = setTimeout(() => setStep(3), 900);  // Step 3: Pulse mark accent
    const timer3 = setTimeout(() => setStep(4), 1300); // Step 4: Tagline reveal
    const timer4 = setTimeout(() => {
      setStep(5);
      setTimeout(onComplete, 400); // Step 5: Smooth exit into content
    }, 1800);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {step < 5 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] select-none"
        >
          {/* Skip Action */}
          <button
            onClick={onComplete}
            className="absolute top-6 right-6 text-xs font-mono tracking-widest text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors uppercase px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800"
          >
            Skip Intro [Esc]
          </button>

          <div className="w-full max-w-md px-8 flex flex-col items-center text-center">
            {/* Step 1 & 4: Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                CARDIODETECT
              </span>
            </motion.div>

            {/* Step 2 & 3: Thin ECG Heartbeat Line */}
            <div className="w-full h-12 flex items-center justify-center my-4 overflow-hidden relative">
              <svg
                viewBox="0 0 300 48"
                className="w-full h-12 text-rose-500 stroke-current fill-none"
                style={{ strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* Reference Baseline */}
                <line
                  x1="0"
                  y1="24"
                  x2="300"
                  y2="24"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1"
                />

                {/* Animated ECG Heartbeat Wave */}
                <motion.path
                  d="M 0,24 L 75,24 L 95,24 L 105,16 L 115,32 L 125,24 L 140,24 L 146,8 L 154,42 L 162,18 L 170,26 L 178,24 L 195,24 L 205,20 L 215,24 L 300,24"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: step >= 2 ? 1 : 0,
                    opacity: step >= 2 ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />

                {/* Step 3: Pulse Accent Marker */}
                {step >= 3 && (
                  <motion.circle
                    cx="150"
                    cy="24"
                    r="4"
                    className="fill-rose-500"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  />
                )}
              </svg>
            </div>

            {/* Step 4: Tagline Reveal */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{
                opacity: step >= 4 ? 1 : 0,
                y: step >= 4 ? 0 : 6,
              }}
              transition={{ duration: 0.35 }}
              className="text-xs sm:text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400 font-sans"
            >
              Every heartbeat leaves a clue.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
