import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Sparkles, Play, Zap, TrendingUp, Clock } from 'lucide-react';
import { ViralReport } from '../types';

interface AnalysisPageProps {
  videoFile: File | null;
  setReport: (report: ViralReport) => void;
}

export default function AnalysisPage({ videoFile, setReport }: AnalysisPageProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isQueued, setIsQueued] = useState(false);
  const [queueTimeLeft, setQueueTimeLeft] = useState(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!videoFile) {
      navigate('/upload');
      return;
    }

    isMountedRef.current = true;
    let progressInterval: NodeJS.Timeout;
    let queueInterval: NodeJS.Timeout;

    const attemptAnalysis = async () => {
      try {
        const platform = sessionStorage.getItem('targetPlatform') || 'TikTok';
        const region = sessionStorage.getItem('targetRegion') || 'Global';

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('platform', platform);
        formData.append('region', region);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        // Handle Rate Limiting (Queue)
        if (response.status === 429) {
          setIsQueued(true);
          // Wait 60 seconds before retrying (polling for API reset)
          setQueueTimeLeft(60);
          
          queueInterval = setInterval(() => {
            if (isMountedRef.current) {
              setQueueTimeLeft((prev) => {
                if (prev <= 1) {
                  clearInterval(queueInterval);
                  // Don't set isQueued to false yet, keep them in the queue UI while it retries
                  attemptAnalysis(); // Retry
                  return 60; // Reset timer for the next potential failure
                }
                return prev - 1;
              });
            }
          }, 1000);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Analysis failed');
        }

        const data: ViralReport = await response.json();
        
        if (isMountedRef.current) {
          clearInterval(progressInterval);
          setIsQueued(false); // Success, remove queue state
          setProgress(100);
          setReport(data);
          setTimeout(() => {
            if (isMountedRef.current) navigate('/results');
          }, 800);
        }

      } catch (err: any) {
        console.error(err);
        if (isMountedRef.current) {
          clearInterval(progressInterval);
          setError(err.message || 'An unexpected error occurred during analysis.');
        }
      }
    };

    // Start fake progress
    progressInterval = setInterval(() => {
      if (isMountedRef.current && !isQueued) {
        setProgress(p => {
          if (p >= 90) return 90;
          return p + Math.random() * 8;
        });
      }
    }, 1000);

    attemptAnalysis();

    return () => {
      isMountedRef.current = false;
      if (progressInterval) clearInterval(progressInterval);
      if (queueInterval) clearInterval(queueInterval);
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative z-10">
      
      {isQueued && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 max-w-2xl w-full"
        >
          <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-amber-400 font-bold">High Traffic - You are in the queue</h3>
            <p className="text-amber-200/70 text-sm">Our AI is currently at capacity. Your analysis will automatically start in {queueTimeLeft} seconds. Please don't close this page.</p>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl w-full">
        
        {/* Left Side: Progress & Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-10">
            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" viewBox="0 0 100 100">
              <circle
                className="text-cyan-500 stroke-current transition-all duration-300 ease-out"
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
            <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 font-display">
            {isQueued ? "Waiting in queue..." : "Analyzing your video..."}
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Our AI is evaluating hook strength, emotional impact, and comparing against current trends.
          </p>

          <div className="space-y-5 text-sm text-slate-300 text-left bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] backdrop-blur-md relative overflow-hidden">
            {/* Scanning light effect */}
            {!isQueued && (
              <motion.div 
                animate={{ top: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent -z-10"
              />
            )}

            <div className="flex items-center gap-4">
              {progress > 10 ? <CheckCircle /> : <Loader2 className={isQueued ? "w-5 h-5 text-slate-600" : "w-5 h-5 animate-spin text-cyan-400"} />}
              <span className={progress > 10 ? "text-white font-medium" : isQueued ? "text-slate-500" : "text-cyan-300 animate-pulse"}>Extracting visual & audio features</span>
            </div>
            <div className="flex items-center gap-4">
              {progress > 40 ? <CheckCircle /> : progress > 10 ? <Loader2 className={isQueued ? "w-5 h-5 text-slate-600" : "w-5 h-5 animate-spin text-cyan-400"} /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
              <span className={progress > 40 ? "text-white font-medium" : progress > 10 ? (isQueued ? "text-slate-500" : "text-cyan-300 animate-pulse") : "text-slate-600"}>Analyzing first 3-second hook retention</span>
            </div>
            <div className="flex items-center gap-4">
              {progress > 70 ? <CheckCircle /> : progress > 40 ? <Loader2 className={isQueued ? "w-5 h-5 text-slate-600" : "w-5 h-5 animate-spin text-cyan-400"} /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
              <span className={progress > 70 ? "text-white font-medium" : progress > 40 ? (isQueued ? "text-slate-500" : "text-cyan-300 animate-pulse") : "text-slate-600"}>Comparing against 50,000+ viral patterns</span>
            </div>
            <div className="flex items-center gap-4">
              {progress >= 100 ? <CheckCircle /> : progress > 70 ? <Loader2 className={isQueued ? "w-5 h-5 text-slate-600" : "w-5 h-5 animate-spin text-cyan-400"} /> : <div className="w-5 h-5 rounded-full border-2 border-white/10" />}
              <span className={progress >= 100 ? "text-white font-medium" : progress > 70 ? (isQueued ? "text-slate-500" : "text-cyan-300 animate-pulse") : "text-slate-600"}>Generating actionable viral strategy</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Animated Mock UI */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md hidden md:block"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-10 animate-pulse"></div>
          <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div className="text-xs font-mono text-slate-500">live_analysis_feed</div>
            </div>

            {/* Mock Content */}
            <div className="flex flex-col gap-6 text-left">
              {/* Video Player Mock */}
              <div className="relative aspect-video bg-black rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/40 to-transparent"></div>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
                {/* Scanning Line */}
                {!isQueued && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10"
                  />
                )}
              </div>

              {/* Stats Mock */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-300">Hook Strength</span>
                    <span className="text-xl font-display font-bold text-cyan-400">
                      {Math.floor(progress)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-300">Trend Alignment</span>
                    <span className="text-xl font-display font-bold text-blue-400">
                      {Math.floor(progress * 0.85)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${progress * 0.85}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function CheckCircle() {
  return (
    <svg className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
