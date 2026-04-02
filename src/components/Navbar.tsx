import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, TrendingUp, Globe2, Menu, X, LayoutDashboard, Image as ImageIcon, LogIn, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#030303]/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#030303]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Left */}
        <div className="flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 shadow-[0_0_20px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] group-hover:bg-white/[0.05] transition-all duration-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7L12 20L20 7" stroke="url(#v-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L12 2" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 4L19 2" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 4L5 2" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="v-grad" x1="4" y1="7" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                Viral<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Scope</span>
              </span>
            </div>
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
            to="/thumbnail-analyzer"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
              location.pathname === '/thumbnail-analyzer' ? "text-white" : "text-slate-400"
            )}
          >
            <ImageIcon className="w-4 h-4" />
            Thumbnails
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                location.pathname === '/dashboard' ? "text-white" : "text-slate-400"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop CTA & Mobile Menu Button - Right */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {user ? (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); logout(); }}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); login(); }}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}

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
              to="/thumbnail-analyzer"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-4 rounded-xl text-base font-medium transition-colors",
                location.pathname === '/thumbnail-analyzer' ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <ImageIcon className="w-5 h-5" />
              Thumbnail Analyzer
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-4 rounded-xl text-base font-medium transition-colors",
                  location.pathname === '/dashboard' ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}
            
            <div className="pt-4 border-t border-white/10">
              {user ? (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); logout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-4 w-full rounded-xl text-base font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); login(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-4 w-full rounded-xl text-base font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </button>
              )}
            </div>

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
