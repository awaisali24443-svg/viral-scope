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

    let isMounted = true;
    let progressInterval: NodeJS.Timeout;

    const analyzeVideo = async () => {
      try {
        const platform = sessionStorage.getItem('targetPlatform') || 'TikTok';
        const region = sessionStorage.getItem('targetRegion') || 'Global';

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('platform', platform);
        formData.append('region', region);

        progressInterval = setInterval(() => {
          if (isMounted) {
            setProgress(p => {
              if (p >= 90) return 90;
              return p + Math.random() * 10;
            });
          }
        }, 1000);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);
        if (isMounted) setProgress(100);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Analysis failed');
        }

        const data: ViralReport = await response.json();
        
        if (isMounted) {
          setReport(data);
          setTimeout(() => {
            if (isMounted) navigate('/results');
          }, 800);
        }

      } catch (err: any) {
        console.error(err);
        if (isMounted) {
          clearInterval(progressInterval);
          setError(err.message || 'An unexpected error occurred during analysis.');
        }
      }
    };

    analyzeVideo();

    return () => {
      isMounted = false;
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [videoFile, navigate, setReport]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose-500/10 text-rose-400 p-8 rounded-3xl max-w-md text-center border border-rose-500/20 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-3">Analysis Failed</h2>
          <p className="mb-8 text-rose-300/80">{error}</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-10">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" viewBox="0 0 100 100">
            <circle
              className="text-indigo-500 stroke-current transition-all duration-300 ease-out"
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
          <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3 font-display">Analyzing your video...</h2>
        <p className="text-slate-400 mb-10 text-lg">
          Our AI is evaluating hook strength, emotional impact, and comparing against current trends.
        </p>

        <div className="space-y-4 text-sm text-slate-300 text-left bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] backdrop-blur-md">
          <div className="flex items-center gap-4">
            {progress > 10 ? <CheckCircle /> : <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />}
            <span className={progress > 10 ? "text-white font-medium" : ""}>Extracting visual features</span>
          </div>
          <div className="flex items-center gap-4">
            {progress > 40 ? <CheckCircle /> : progress > 10 ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
            <span className={progress > 40 ? "text-white font-medium" : progress > 10 ? "" : "text-slate-600"}>Analyzing emotional signals</span>
          </div>
          <div className="flex items-center gap-4">
            {progress > 70 ? <CheckCircle /> : progress > 40 ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
            <span className={progress > 70 ? "text-white font-medium" : progress > 40 ? "" : "text-slate-600"}>Comparing with regional trends</span>
          </div>
          <div className="flex items-center gap-4">
            {progress >= 100 ? <CheckCircle /> : progress > 70 ? <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
            <span className={progress >= 100 ? "text-white font-medium" : progress > 70 ? "" : "text-slate-600"}>Generating viral strategy</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle() {
  return (
    <svg className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
