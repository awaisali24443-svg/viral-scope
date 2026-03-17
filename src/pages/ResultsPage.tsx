import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { ViralReport } from '../types';
import { 
  Flame, Target, Clock, Globe2, Lightbulb, Hash, Video, Smile, Download, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultsPageProps {
  report: ViralReport | null;
}

export default function ResultsPage({ report }: ResultsPageProps) {
  const navigate = useNavigate();
  const scorecardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!report) {
      navigate('/upload');
    }
  }, [report, navigate]);

  if (!report) return null;

  const handleDownload = async () => {
    if (!scorecardRef.current) return;
    
    try {
      setIsDownloading(true);
      const canvas = await html2canvas(scorecardRef.current, {
        backgroundColor: '#0f0f13',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `viral-scorecard-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Failed to generate scorecard image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]';
    if (percentage >= 0.5) return 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]';
    return 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]';
  };

  const getScoreBg = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
    if (percentage >= 0.5) return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]';
    return 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-display">Viral Strategy Report</h1>
          <p className="mt-2 text-lg text-slate-400">AI-generated analysis and optimization plan.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Generating...' : 'Download Scorecard'}
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white border border-white/10 hover:bg-white/20 transition-all hover:scale-105"
          >
            Analyze Another Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Score & Key Metrics */}
        <div className="space-y-8 lg:col-span-1" ref={scorecardRef}>
          {/* Viral Potential Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f13] rounded-3xl p-8 text-white relative overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Flame className="w-40 h-40" />
            </div>
            <h2 className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Viral Potential Score</h2>
            <div className="flex items-baseline gap-2 mt-4">
              <span className={cn("text-8xl font-black tracking-tighter", getScoreColor(report.viralPotentialScore, 100))}>
                {report.viralPotentialScore}
              </span>
              <span className="text-2xl text-slate-500 font-bold">/100</span>
            </div>
            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              Based on hook strength, emotional impact, and current trend alignment.
            </p>
          </motion.div>

          {/* Sub-scores */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.05] space-y-8 backdrop-blur-md"
          >
            <h3 className="font-bold text-white flex items-center gap-2 text-lg font-display">
              <Target className="w-5 h-5 text-indigo-400" />
              Core Metrics
            </h3>
            
            <ScoreBar label="Hook Strength" score={report.hookStrengthScore} max={10} colorClass={getScoreBg(report.hookStrengthScore)} />
            <ScoreBar label="Trend Similarity" score={report.trendSimilarityScore} max={10} colorClass={getScoreBg(report.trendSimilarityScore)} />
            <ScoreBar label="Visual Quality" score={report.visualQualityScore} max={10} colorClass={getScoreBg(report.visualQualityScore)} />
          </motion.div>

          {/* Platform & Timing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.05] space-y-6 backdrop-blur-md"
          >
            <div>
              <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Best Platform</h3>
              <p className="text-2xl font-bold text-white">{report.bestPlatform}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Best Posting Time
              </h3>
              <p className="text-lg text-white font-medium">{report.bestPostingTime}</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="space-y-8 lg:col-span-2">
          {/* Content Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] rounded-3xl p-8 lg:p-10 border border-white/[0.05] backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-white mb-8 font-display">Content Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-400 mb-4 uppercase tracking-wider">
                  <Video className="w-4 h-4" /> Topic & Style
                </h4>
                <div className="space-y-6">
                  <div>
                    <span className="block text-xs text-slate-500 mb-2 uppercase tracking-wider">Detected Topic</span>
                    <span className="inline-block bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/5">
                      {report.videoTopic}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-2 uppercase tracking-wider">Editing Style</span>
                    <p className="text-base text-slate-300 leading-relaxed">{report.editingStyle}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-fuchsia-400 mb-4 uppercase tracking-wider">
                  <Smile className="w-4 h-4" /> Emotional Impact
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.detectedEmotions.map((emotion, idx) => (
                     <span key={idx} className="bg-fuchsia-500/10 text-fuchsia-300 px-4 py-2 rounded-xl text-sm font-semibold border border-fuchsia-500/20">
                      {emotion}
                    </span>
                  ))}
                </div>

                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 mt-10 mb-4 uppercase tracking-wider">
                  <Globe2 className="w-4 h-4" /> Top Regions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.bestRegions.map((region, idx) => (
                    <span key={idx} className="bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold border border-emerald-500/20">
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] rounded-3xl p-8 lg:p-10 border border-white/[0.05] backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-display">
              <Lightbulb className="w-7 h-7 text-amber-400" />
              Optimization Strategy
            </h3>
            
            <div className="space-y-5">
              {report.improvementSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold border border-amber-500/30">
                    {idx + 1}
                  </div>
                  <p className="text-slate-300 pt-1 text-base leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-5 uppercase tracking-wider">
                <Hash className="w-4 h-4" /> Recommended Hashtags
              </h4>
              <div className="flex flex-wrap gap-3">
                {report.hashtagSuggestions.map((tag, idx) => (
                  <span key={idx} className="text-slate-300 font-medium hover:text-indigo-400 transition-colors cursor-pointer bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, colorClass }: { label: string, score: number, max: number, colorClass: string }) {
  const percentage = (score / max) * 100;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-bold text-slate-300">{label}</span>
        <span className="text-base font-black text-white">{score}<span className="text-slate-500 font-medium text-sm">/{max}</span></span>
      </div>
      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
