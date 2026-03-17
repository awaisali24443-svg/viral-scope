import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe2, Clock, Hash, Youtube, Eye, AlertCircle, Loader2, 
  MapPin, Users, Target, Sparkles, BarChart3, PieChart as PieChartIcon, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';
import { GlobalTrendsData } from '../types';
import { cn } from '../lib/utils';
import AdSlot from '../components/AdSlot';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

export default function GlobalTrendsPage() {
  const [data, setData] = useState<GlobalTrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/global-trends');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch global trends');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalTrends();

    // Auto-refresh every 60 minutes
    const interval = setInterval(() => {
      fetchGlobalTrends();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatViews = (views: number | string) => {
    const num = typeof views === 'string' ? parseInt(views, 10) : views;
    if (isNaN(num)) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Global Trends</h3>
          <p className="text-slate-300 max-w-lg">{error}</p>
          <button 
            onClick={fetchGlobalTrends}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] relative z-10">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Aggregating global data & generating AI insights...</p>
        <p className="text-slate-500 text-sm mt-2">This may take a few moments as we analyze multiple regions.</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
            <Globe2 className="w-10 h-10 text-cyan-400" />
            Global Trends Intelligence
          </h1>
          <p className="mt-2 text-lg text-slate-400">Worldwide YouTube data aggregated and analyzed by AI.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 backdrop-blur-md">
          <Clock className="w-5 h-5 text-slate-400" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Last Updated</span>
            <span className="text-sm text-white font-medium">{formatDate(data.lastUpdated)}</span>
          </div>
        </div>
      </div>

      {/* AdSense Leaderboard Slot */}
      <div className="mb-10 max-w-4xl mx-auto">
        <AdSlot format="leaderboard" />
      </div>

      <div className="space-y-8">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-cyan-500/30 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Youtube className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Videos Analyzed</p>
              <h3 className="text-3xl font-bold text-white">{data.totalVideosAnalyzed}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-blue-500/20 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-blue-500/40 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Activity className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Top Category</p>
              <h3 className="text-2xl font-bold text-white">{data.topCategory}</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-blue-500/30 transition-colors"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Hash className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Top Keyword</p>
              <h3 className="text-2xl font-bold text-white">#{data.topKeyword}</h3>
            </div>
          </motion.div>
        </div>

        {/* AI Insights Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1a1a24] to-[#0f0f13] border border-cyan-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.1)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Sparkles className="w-48 h-48" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Gemini AI Insights
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Likely Cities</span>
                </div>
                <p className="text-white font-medium">{data.aiInsights.likelyCities.join(', ')}</p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Audience Type</span>
                </div>
                <p className="text-white font-medium">{data.aiInsights.audienceType}</p>
              </div>
              
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Cultural Targeting</span>
                </div>
                <p className="text-white font-medium">{data.aiInsights.culturalTargeting}</p>
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Trend Analysis</h3>
              <ul className="space-y-4">
                {data.aiInsights.trendInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">{insight}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 font-display">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Top Categories by Global Score
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#1e1e28', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]}>
                    {data.categoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Region Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 font-display">
              <PieChartIcon className="w-5 h-5 text-blue-400" />
              Region Contribution
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.regionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.regionChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e1e28', border: '1px solid #ffffff10', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {data.regionChartData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Global Hashtags */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 font-display">
            <Hash className="w-5 h-5 text-blue-400" />
            Global Trending Hashtags
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.topTags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-[#1a1a24] border border-white/5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* AdSense Responsive Slot */}
        <div className="w-full h-[150px]">
          <AdSlot format="responsive" />
        </div>

        {/* Global Trending Videos Grid */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
            <Globe2 className="w-6 h-6 text-cyan-400" />
            Top Global Videos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.videos.map((video, idx) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * Math.min(idx, 10) }}
                className="group bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    {formatViews(video.views)}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-cyan-500/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                    Score: {video.globalScore}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md">
                      {video.category}
                    </span>
                    <div className="flex gap-1">
                      {video.regionsAppeared.slice(0, 3).map(r => (
                        <span key={r} className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-slate-300 rounded">
                          {r}
                        </span>
                      ))}
                      {video.regionsAppeared.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-slate-300 rounded">
                          +{video.regionsAppeared.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="text-white font-bold leading-snug line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors">
                    {video.title}
                  </h4>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium truncate pr-4">
                      {video.channelName}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
