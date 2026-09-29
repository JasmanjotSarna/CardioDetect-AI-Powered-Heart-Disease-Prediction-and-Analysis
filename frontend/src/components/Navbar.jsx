import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight, Activity, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchHealth } from '../api';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetchHealth();
        if (isMounted) {
          if (res && res.status === 'healthy' && res.model_loaded) {
            setBackendStatus('online');
          } else {
            setBackendStatus('offline');
          }
        }
      } catch {
        if (isMounted) setBackendStatus('offline');
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // verify every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Investigation', path: '/investigate' },
    { name: 'Model Insights', path: '/insights' },
    { name: 'Science', path: '/science' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-canvas)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="site-container h-16 flex items-center justify-between">
        
        {/* Left: Custom ECG-inspired Logo + Product Descriptor */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--coral-red-subtle)] border border-[var(--coral-red)]/30 flex items-center justify-center text-[var(--coral-red)] shadow-xs group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
              <path d="M 2,12 L 6,12 L 8,7 L 11,17 L 14,9 L 16,14 L 18,12 L 22,12" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-tight text-[var(--text-main)] leading-tight">
              CardioDetect
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase">
              Cardiovascular Research Lab
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs lg:text-sm font-medium px-3.5 py-1.5 rounded-md transition-all ${
                  isActive
                    ? 'text-[var(--coral-red)] bg-[var(--coral-red-subtle)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right: Theme Toggle + Verified Backend Status + CTA */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Subtle Backend Connection Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono"
            title={
              backendStatus === 'online'
                ? 'ML Model Engine Online (FastAPI + KNN)'
                : backendStatus === 'checking'
                ? 'Verifying API status...'
                : 'Backend Offline'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'online'
                  ? 'bg-[var(--medical-green)] shadow-xs shadow-emerald-500/50'
                  : backendStatus === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-[var(--coral-red)]'
              }`}
            />
            <span className="text-[var(--text-secondary)] text-[10px]">
              {backendStatus === 'online'
                ? 'Model Connected'
                : backendStatus === 'checking'
                ? 'Connecting...'
                : 'Offline'}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Primary CTA */}
          <Link to="/investigate" className="btn-primary text-xs py-2 px-4 shadow-sm">
            <span>Start Investigation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="theme-toggle-btn"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--bg-elevated)] text-xs font-mono mb-2">
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' ? 'bg-[var(--medical-green)]' : 'bg-[var(--coral-red)]'
              }`}
            />
            <span className="text-[var(--text-secondary)]">
              Backend Status: {backendStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'text-[var(--coral-red)] bg-[var(--coral-red-subtle)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <Link
              to="/investigate"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full justify-center text-xs py-2.5 mt-1"
            >
              <span>Start Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
