import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, Sparkles, Play, Zap, TrendingUp, Clock } from 'lucide-react';
import { ViralReport } from '../types';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

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
  const { user } = useAuth();

  useEffect(() => {
    const videoUrl = sessionStorage.getItem('videoUrl');
    if (!videoFile && !videoUrl) {
      navigate('/upload');
      return;
    }

    isMountedRef.current = true;
    let progressInterval: NodeJS.Timeout;
    let queueInterval: NodeJS.Timeout;

    const attemptAnalysis = async (retryCount = 0) => {
      try {
        const platform = sessionStorage.getItem('targetPlatform') || 'TikTok';
        const region = sessionStorage.getItem('targetRegion') || 'Global';

        let response;

        if (videoFile) {
          const formData = new FormData();
          formData.append('video', videoFile);
          formData.append('platform', platform);
          formData.append('region', region);

          response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData,
          });
        } else if (videoUrl) {
          response = await fetch('/api/analyze-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl, platform, region }),
          });
        } else {
          throw new Error('No video source provided.');
        }

        // Handle Rate Limiting (Queue)
        if (response.status === 429) {
          const errorData = await response.json().catch(() => ({}));
          
          // If it's our IP rate limiter, fail immediately
          if (errorData.error && errorData.error.includes('Too many videos')) {
            throw new Error(errorData.error);
          }

          // If we've retried too many times, fail
          if (retryCount >= 2) {
            throw new Error(errorData.error || 'AI API is currently overloaded or out of quota. Please try again later.');
          }

          setIsQueued(true);
          // Wait 60 seconds before retrying (polling for API reset)
          setQueueTimeLeft(60);
          
          queueInterval = setInterval(() => {
            if (isMountedRef.current) {
              setQueueTimeLeft((prev) => {
                if (prev <= 1) {
                  clearInterval(queueInterval);
                  // Don't set isQueued to false yet, keep them in the queue UI while it retries
                  attemptAnalysis(retryCount + 1); // Retry
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
        
        // Save to Firestore if user is logged in
        if (user) {
          try {
            const reportRef = await addDoc(collection(db, 'reports'), {
              userId: user.uid,
              videoTopic: data.videoTopic || 'Unknown Topic',
              viralPotentialScore: data.viralPotentialScore || 0,
              bestPlatform: data.bestPlatform || platform,
              reportData: JSON.stringify(data),
              createdAt: serverTimestamp(),
              isPublic: false
            });
            // Add the reportId to the data so we can use it later (e.g., for sharing)
            data.id = reportRef.id;
          } catch (dbError) {
            handleFirestoreError(dbError, OperationType.CREATE, 'reports');
          }
        }

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
  }, [videoFile, navigate, setReport, user]);

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

      <div className="flex flex-col items-center justify-center gap-8 max-w-6xl w-full">
        
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-3 font-display flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            {isQueued ? "Waiting in queue..." : "Analyzing your video..."}
          </h2>
          <p className="text-slate-400 text-lg">
            Our AI is evaluating hook strength, emotional impact, and comparing against current trends.
          </p>
        </div>

        {/* Skeleton Layout Mimicking ResultsPage */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-60 pointer-events-none">
          {/* Left Column Skeleton */}
          <div className="space-y-8 lg:col-span-1">
            <div className="space-y-8 bg-[#030303] p-1 rounded-[2rem]">
              {/* Main Score Skeleton */}
              <div className="bg-white/[0.02] rounded-[1.75rem] p-8 border border-white/[0.05] relative overflow-hidden h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="w-32 h-4 bg-white/10 rounded-full mb-8" />
                <div className="w-48 h-24 bg-white/10 rounded-2xl mb-6" />
                <div className="w-full h-3 bg-white/10 rounded-full mb-2" />
                <div className="w-2/3 h-3 bg-white/10 rounded-full" />
              </div>

              {/* Sub-scores Skeleton */}
              <div className="bg-white/[0.02] rounded-[1.75rem] p-8 border border-white/[0.05] space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="w-32 h-5 bg-white/10 rounded-full mb-6" />
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="w-24 h-3 bg-white/10 rounded-full" />
                      <div className="w-8 h-3 bg-white/10 rounded-full" />
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full">
                      <div className="w-1/2 h-full bg-white/10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-8 lg:col-span-2">
            {/* Platform & Timing Skeleton */}
            <div className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.05] flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between relative overflow-hidden h-32">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="space-y-3">
                <div className="w-24 h-3 bg-white/10 rounded-full" />
                <div className="w-40 h-8 bg-white/10 rounded-xl" />
              </div>
              <div className="hidden sm:block w-px h-16 bg-white/10" />
              <div className="space-y-3">
                <div className="w-32 h-3 bg-white/10 rounded-full" />
                <div className="w-48 h-8 bg-white/10 rounded-xl" />
              </div>
            </div>

            {/* Content Analysis Skeleton */}
            <div className="bg-white/[0.02] rounded-3xl p-8 lg:p-10 border border-white/[0.05] relative overflow-hidden h-72">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              <div className="w-48 h-6 bg-white/10 rounded-full mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="w-32 h-4 bg-white/10 rounded-full" />
                  <div className="w-24 h-8 bg-white/10 rounded-xl" />
                  <div className="w-full h-20 bg-white/10 rounded-xl" />
                </div>
                <div className="space-y-6">
                  <div className="w-32 h-4 bg-white/10 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-20 h-8 bg-white/10 rounded-xl" />
                    <div className="w-24 h-8 bg-white/10 rounded-xl" />
                  </div>
                  <div className="w-32 h-4 bg-white/10 rounded-full mt-8" />
                  <div className="flex gap-2">
                    <div className="w-24 h-8 bg-white/10 rounded-xl" />
                    <div className="w-28 h-8 bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
