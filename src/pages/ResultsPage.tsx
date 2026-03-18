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
        backgroundColor: '#0a0a0a',
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
    if (percentage >= 0.8) return 'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]';
    if (percentage >= 0.5) return 'text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]';
    return 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.4)]';
  };

  const getScoreBg = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    if (percentage >= 0.5) return 'bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
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
            className="flex items-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#0a0a0a] hover:bg-cyan-400 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isDownloading ? 'Generating...' : 'Download Scorecard'}
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-white border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
          >
            Analyze Another Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Score & Key Metrics */}
        <div className="space-y-8 lg:col-span-1">
          
          <div ref={scorecardRef} className="space-y-8 bg-[#030303] p-1 rounded-[2rem]">
            {/* Viral Potential Score Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-[1.75rem] p-8 text-white relative overflow-hidden border border-white/[0.08] shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Flame className="w-40 h-40" />
              </div>
              <h2 className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                Viral Potential Score
              </h2>
              <div className="flex items-baseline gap-2 mt-4">
                <span className={cn("text-8xl font-black tracking-tighter font-display", getScoreColor(report.viralPotentialScore, 100))}>
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
              className="bg-white/[0.02] rounded-[1.75rem] p-8 border border-white/[0.05] space-y-8 backdrop-blur-xl"
            >
              <h3 className="font-bold text-white flex items-center gap-2 text-lg font-display">
                <Target className="w-5 h-5 text-cyan-400" />
                Core Metrics
              </h3>
              
              <ScoreBar label="Hook Strength" score={report.hookStrengthScore} max={10} colorClass={getScoreBg(report.hookStrengthScore)} />
              <ScoreBar label="Trend Similarity" score={report.trendSimilarityScore} max={10} colorClass={getScoreBg(report.trendSimilarityScore)} />
              <ScoreBar label="Visual Quality" score={report.visualQualityScore} max={10} colorClass={getScoreBg(report.visualQualityScore)} />
            </motion.div>
          </div>

        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Platform & Timing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl p-8 border border-cyan-500/20 flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between backdrop-blur-xl"
          >
            <div>
              <h3 className="text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">Best Platform</h3>
              <p className="text-3xl font-display font-bold text-white tracking-tight">{report.bestPlatform}</p>
            </div>
            <div className="hidden sm:block w-px h-16 bg-white/10" />
            <div>
              <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Best Posting Time
              </h3>
              <p className="text-3xl font-display text-white font-bold tracking-tight">{report.bestPostingTime}</p>
            </div>
          </motion.div>

          {/* Content Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] rounded-3xl p-8 lg:p-10 border border-white/[0.05] backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 font-display">Content Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider">
                  <Video className="w-4 h-4" /> Topic & Style
                </h4>
                <div className="space-y-6">
                  <div>
                    <span className="block text-xs text-slate-500 mb-2 uppercase tracking-wider">Detected Topic</span>
                    <span className="inline-block bg-white/[0.05] text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/[0.08]">
                      {report.videoTopic}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-2 uppercase tracking-wider">Editing Style</span>
                    <p className="text-base text-slate-300 leading-relaxed font-medium">{report.editingStyle}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">
                  <Smile className="w-4 h-4" /> Emotional Impact
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.detectedEmotions.map((emotion, idx) => (
                     <span key={idx} className="bg-blue-500/10 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium border border-blue-500/20">
                      {emotion}
                    </span>
                  ))}
                </div>

                <h4 className="flex items-center gap-2 text-sm font-bold text-indigo-400 mt-10 mb-4 uppercase tracking-wider">
                  <Globe2 className="w-4 h-4" /> Top Regions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.bestRegions.map((region, idx) => (
                    <span key={idx} className="bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium border border-indigo-500/20">
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
            className="bg-white/[0.02] rounded-3xl p-8 lg:p-10 border border-white/[0.05] backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-display">
              <Lightbulb className="w-7 h-7 text-cyan-400" />
              Optimization Strategy
            </h3>
            
            <div className="space-y-4">
              {report.improvementSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold border border-cyan-500/30">
                    {idx + 1}
                  </div>
                  <p className="text-slate-300 pt-1 text-base leading-relaxed font-medium">{suggestion}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-5 uppercase tracking-wider">
                <Hash className="w-4 h-4" /> Recommended Hashtags
              </h4>
              <div className="flex flex-wrap gap-3">
                {report.hashtagSuggestions.map((tag, idx) => (
                  <span key={idx} className="text-slate-300 font-medium hover:text-cyan-400 transition-colors cursor-pointer bg-white/[0.05] px-4 py-2 rounded-lg border border-white/[0.08]">
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
        <span className="text-base font-black text-white font-display">{score}<span className="text-slate-500 font-medium text-sm">/{max}</span></span>
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
