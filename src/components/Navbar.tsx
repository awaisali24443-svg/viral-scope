import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, TrendingUp, Globe2, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#030303]/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#030303]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <div className="flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-105">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              ViralScope <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">AI</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation - Center */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link
            to="/global-trends"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
              location.pathname === '/global-trends' ? "text-white" : "text-slate-400"
            )}
          >
            <Globe2 className="w-4 h-4" />
            Global Trends
          </Link>
          <Link
            to="/trends"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
              location.pathname === '/trends' ? "text-white" : "text-slate-400"
            )}
          >
            <TrendingUp className="w-4 h-4" />
            Local Trends
          </Link>
        </div>

        {/* Desktop CTA & Mobile Menu Button - Right */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {location.pathname !== '/upload' && (
            <Link
              to="/upload"
              className="hidden md:flex rounded-full bg-white text-[#030303] px-5 py-2 text-sm font-bold transition-all hover:bg-slate-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Analyze Video
            </Link>
          )}
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2 -mr-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.05] bg-[#030303]/95 backdrop-blur-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/global-trends"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-4 rounded-xl text-base font-medium transition-colors",
                location.pathname === '/global-trends' ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Globe2 className="w-5 h-5" />
              Global Trends
            </Link>
            <Link
              to="/trends"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-4 rounded-xl text-base font-medium transition-colors",
                location.pathname === '/trends' ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <TrendingUp className="w-5 h-5" />
              Local Trends
            </Link>
            {location.pathname !== '/upload' && (
              <Link
                to="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 flex items-center justify-center w-full rounded-xl bg-white text-[#030303] px-5 py-3.5 text-base font-bold transition-all hover:bg-slate-200"
              >
                Analyze Video
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
