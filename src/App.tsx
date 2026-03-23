import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import TrendsPage from './pages/TrendsPage';
import GlobalTrendsPage from './pages/GlobalTrendsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminBlogPage from './pages/AdminBlogPage';
import { ViralReport } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomePopup from './components/WelcomePopup';

export default function App() {
  const [report, setReport] = useState<ViralReport | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <HelmetProvider>
      <WelcomePopup />
      <div className="min-h-screen bg-[#030303] text-slate-50 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative flex flex-col">
        {/* Global Background Grid */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Awais Codex Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 border-b border-cyan-500/20 py-2 px-4 text-center text-sm font-medium text-cyan-100 backdrop-blur-md">
            🚀 Welcome to ViralScope! Proudly developed and powered by <span className="font-bold text-white">Awais Codex</span>.
          </div>
          
          <Navbar />
          <main className="flex-grow relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/upload" 
              element={<UploadPage setVideoFile={setVideoFile} />} 
            />
            <Route 
              path="/analyze" 
              element={<AnalysisPage videoFile={videoFile} setReport={setReport} />} 
            />
            <Route 
              path="/results" 
              element={<ResultsPage report={report} />} 
            />
            <Route 
              path="/trends" 
              element={<TrendsPage />} 
            />
            <Route 
              path="/global-trends" 
              element={<GlobalTrendsPage />} 
            />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </HelmetProvider>
  );
}
