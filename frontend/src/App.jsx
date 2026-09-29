import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import WelcomeScreen from './components/WelcomeScreen';
import Home from './pages/Home';
import Investigation from './pages/Investigation';
import Dashboard from './pages/Dashboard';
import Science from './pages/Science';
import About from './pages/About';

export default function App() {
  const [sessionCases, setSessionCases] = useState([]);
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      const alreadyWelcomed = sessionStorage.getItem('cardiodetect_welcome_shown');
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return !alreadyWelcomed && !prefersReduced;
    } catch {
      return false;
    }
  });

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    try {
      sessionStorage.setItem('cardiodetect_welcome_shown', 'true');
    } catch (e) {}
  };

  const handleCaseLogged = (newCase) => {
    setSessionCases((prev) => [newCase, ...prev]);
  };

  return (
    <ThemeProvider>
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      <BrowserRouter>
        <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col font-sans transition-colors duration-200">
          
          {/* Global Sticky Navigation Bar with Theme Toggle & Status */}
          <Navbar />

          {/* Main Page Routes */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/investigate"
                element={<Investigation onCaseLogged={handleCaseLogged} />}
              />
              <Route
                path="/insights"
                element={<Dashboard sessionCases={sessionCases} />}
              />
              <Route
                path="/dashboard"
                element={<Navigate to="/insights" replace />}
              />
              <Route path="/science" element={<Science />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Minimal Footer */}
          <footer className="no-print border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-8 px-4 sm:px-8 mt-auto text-xs text-[var(--text-secondary)] transition-colors duration-200">
            <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-[var(--text-main)]">CardioDetect</span>
                <span>•</span>
                <Link to="/investigate" className="hover:text-[var(--text-main)] transition-colors">Investigation</Link>
                <Link to="/insights" className="hover:text-[var(--text-main)] transition-colors">Model Insights</Link>
                <Link to="/science" className="hover:text-[var(--text-main)] transition-colors">Science</Link>
                <Link to="/about" className="hover:text-[var(--text-main)] transition-colors">About</Link>
              </div>

              <div className="text-center sm:text-right text-[var(--text-muted)]">
                Educational cardiovascular machine learning platform. Not a medical diagnostic tool.
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
