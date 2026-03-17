import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Globe2, Clock, Hash, Youtube, Eye, AlertCircle, Loader2
} from 'lucide-react';
import { TrendsData } from '../types';
import { cn } from '../lib/utils';

const REGIONS = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'PK', name: 'Pakistan' },
];

export default function TrendsPage() {
  const [region, setRegion] = useState('US');
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (selectedRegion: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/trends?region=${selectedRegion}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch trends');
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
    fetchTrends(region);

    // Auto-refresh every 60 minutes
    const interval = setInterval(() => {
      fetchTrends(region);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [region]);

  const formatViews = (views: string) => {
    const num = parseInt(views, 10);
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3 font-display">
            <TrendingUp className="w-10 h-10 text-cyan-400" />
            Local Trends
          </h1>
          <p className="mt-2 text-lg text-slate-400">Real-time trending content by region.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-full px-4 py-2 backdrop-blur-md">
          <Globe2 className="w-5 h-5 text-slate-400" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer appearance-none pr-4"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code} className="bg-[#1a1a24] text-white">
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Trends</h3>
          <p className="text-slate-300 max-w-lg">{error}</p>
          <button 
            onClick={() => fetchTrends(region)}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : loading && !data ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-400 font-medium animate-pulse">Fetching live trends...</p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Top Trending Category</p>
                <h3 className="text-3xl font-bold text-white">{data.topCategory}</h3>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex items-center gap-6 backdrop-blur-md hover:border-white/10 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                <h3 className="text-2xl font-bold text-white">{formatDate(data.lastUpdated)}</h3>
                <p className="text-xs text-slate-500 mt-1">Auto-refreshes every 60 minutes</p>
              </div>
            </motion.div>
          </div>

          {/* Top Hashtags */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 font-display">
              <Hash className="w-5 h-5 text-cyan-400" />
              Trending Keywords & Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.topTags.length > 0 ? (
                data.topTags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-[#1a1a24] border border-white/5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 italic">No tags found in current trending videos.</p>
              )}
            </div>
          </motion.div>

          {/* Trending Videos Grid */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Top Videos in {REGIONS.find(r => r.code === region)?.name}
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
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white/5 text-slate-300 rounded-md">
                        {video.category}
                      </span>
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
      ) : null}
    </div>
  );
}
