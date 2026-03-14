import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ViralReport } from '../types';
import { 
  Flame, 
  Target, 
  Eye, 
  TrendingUp, 
  Clock, 
  Globe2, 
  Lightbulb, 
  Hash,
  Video,
  Smile
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ResultsPageProps {
  report: ViralReport | null;
}

export default function ResultsPage({ report }: ResultsPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!report) {
      navigate('/upload');
    }
  }, [report, navigate]);

  if (!report) return null;

  const getScoreColor = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'text-emerald-500';
    if (percentage >= 0.5) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number, max: number = 10) => {
    const percentage = score / max;
    if (percentage >= 0.8) return 'bg-emerald-500';
    if (percentage >= 0.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Viral Strategy Report</h1>
          <p className="mt-2 text-slate-500">AI-generated analysis and optimization plan.</p>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
        >
          Analyze Another Video
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Score & Key Metrics */}
        <div className="space-y-8 lg:col-span-1">
          {/* Viral Potential Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Flame className="w-32 h-32" />
            </div>
            <h2 className="text-slate-400 font-medium mb-2">Viral Potential Score</h2>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-7xl font-bold tracking-tighter", getScoreColor(report.viralPotentialScore, 100))}>
                {report.viralPotentialScore}
              </span>
              <span className="text-xl text-slate-500">/100</span>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Based on hook strength, emotional impact, and current trend alignment.
            </p>
          </motion.div>

          {/* Sub-scores */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6"
          >
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
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
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6"
          >
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Best Platform</h3>
              <p className="text-xl font-bold text-slate-900">{report.bestPlatform}</p>
            </div>
            <div className="h-px bg-slate-100" />
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Best Posting Time
              </h3>
              <p className="text-slate-900 font-medium">{report.bestPostingTime}</p>
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
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">Content Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                  <Video className="w-4 h-4" /> Topic & Style
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">Detected Topic</span>
                    <span className="inline-block bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium">
                      {report.videoTopic}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400 mb-1">Editing Style</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{report.editingStyle}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                  <Smile className="w-4 h-4" /> Emotional Impact
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.detectedEmotions.map((emotion, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                      {emotion}
                    </span>
                  ))}
                </div>

                <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mt-6 mb-3 uppercase tracking-wider">
                  <Globe2 className="w-4 h-4" /> Top Regions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {report.bestRegions.map((region, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-100">
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
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-amber-500" />
              Optimization Strategy
            </h3>
            
            <div className="space-y-4">
              {report.improvementSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700">{suggestion}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                <Hash className="w-4 h-4" /> Recommended Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {report.hashtagSuggestions.map((tag, idx) => (
                  <span key={idx} className="text-slate-600 font-medium hover:text-indigo-600 transition-colors cursor-pointer">
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
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score}<span className="text-slate-400 font-normal">/{max}</span></span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
