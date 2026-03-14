import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Sparkles } from 'lucide-react';
import { ViralReport } from '../types';

interface AnalysisPageProps {
  videoFile: File | null;
  setReport: (report: ViralReport) => void;
}

export default function AnalysisPage({ videoFile, setReport }: AnalysisPageProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoFile) {
      navigate('/upload');
      return;
    }

    const analyzeVideo = async () => {
      try {
        const platform = sessionStorage.getItem('targetPlatform') || 'TikTok';
        const region = sessionStorage.getItem('targetRegion') || 'Global';

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('platform', platform);
        formData.append('region', region);

        // Simulate progress while waiting for the real API
        const progressInterval = setInterval(() => {
          setProgress(p => {
            if (p >= 90) return 90; // Hold at 90% until done
            return p + Math.random() * 10;
          });
        }, 1000);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Analysis failed');
        }

        const data: ViralReport = await response.json();
        setReport(data);
        
        // Small delay to show 100% before navigating
        setTimeout(() => {
          navigate('/results');
        }, 500);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred during analysis.');
      }
    };

    analyzeVideo();
  }, [videoFile, navigate, setReport]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md text-center border border-red-100">
          <h2 className="text-xl font-bold mb-2">Analysis Failed</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-indigo-600 stroke-current transition-all duration-300 ease-out"
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              r="48"
              cx="50"
              cy="50"
              strokeDasharray="301.59"
              strokeDashoffset={301.59 - (progress / 100) * 301.59}
            />
          </svg>
          <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your video...</h2>
        <p className="text-slate-500 mb-8">
          Our AI is evaluating hook strength, emotional impact, and comparing against current trends.
        </p>

        <div className="space-y-3 text-sm text-slate-600 text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            {progress > 10 ? <CheckCircle /> : <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
            <span className={progress > 10 ? "text-slate-900" : ""}>Extracting visual features</span>
          </div>
          <div className="flex items-center gap-3">
            {progress > 40 ? <CheckCircle /> : progress > 10 ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
            <span className={progress > 40 ? "text-slate-900" : progress > 10 ? "" : "text-slate-400"}>Analyzing emotional signals</span>
          </div>
          <div className="flex items-center gap-3">
            {progress > 70 ? <CheckCircle /> : progress > 40 ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
            <span className={progress > 70 ? "text-slate-900" : progress > 40 ? "" : "text-slate-400"}>Comparing with regional trends</span>
          </div>
          <div className="flex items-center gap-3">
            {progress >= 100 ? <CheckCircle /> : progress > 70 ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
            <span className={progress >= 100 ? "text-slate-900" : progress > 70 ? "" : "text-slate-400"}>Generating viral strategy</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle() {
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
