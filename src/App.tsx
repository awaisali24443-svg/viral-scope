import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import TrendsPage from './pages/TrendsPage';
import GlobalTrendsPage from './pages/GlobalTrendsPage';
import { ViralReport } from './types';
import Navbar from './components/Navbar';

export default function App() {
  const [report, setReport] = useState<ViralReport | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="relative">
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
        </Routes>
      </main>
    </div>
  );
}
