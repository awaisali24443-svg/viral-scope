import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import { ViralReport } from './types';
import Navbar from './components/Navbar';

export default function App() {
  const [report, setReport] = useState<ViralReport | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main>
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
        </Routes>
      </main>
    </div>
  );
}
