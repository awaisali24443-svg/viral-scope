import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, TrendingUp, Zap, BarChart3, Play } from 'lucide-react';
import AdSlot from '../components/AdSlot';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/10 blur-[120px] animate-float" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-float-delayed" />
      </div>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-40 lg:pb-48">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* AdSense Leaderboard Slot */}
            <div className="mb-12 max-w-3xl mx-auto">
              <AdSlot format="leaderboard" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-sm font-medium text-indigo-300 mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.1)] hover:bg-white/[0.05] transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
              Gemini 3.1 Pro Powered
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8 font-display drop-shadow-2xl">
              Predict Your Video's <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 drop-shadow-sm">
                Viral Potential
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
              Upload your video and let our advanced AI analyze its hook strength, emotional impact, and trend similarity to generate a comprehensive viral strategy report.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/upload"
                className="group flex items-center justify-center gap-2 rounded-full bg-white text-[#030303] px-8 py-4 text-lg font-bold transition-all hover:bg-slate-200 hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                <Upload className="h-5 w-5" />
                Analyze Your Video
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-[#030303] py-24 sm:py-32 border-t border-white/[0.05]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-sm font-bold leading-7 text-indigo-400 uppercase tracking-widest font-display">Deep Analysis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl font-display">
              Everything you need to go viral
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Our AI evaluates multiple dimensions of your content to provide actionable insights tailored for TikTok, YouTube Shorts, and Instagram Reels.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="group flex flex-col items-start bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                <div className="rounded-xl bg-indigo-500/10 p-3 ring-1 ring-indigo-500/20 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl font-display">Hook Strength</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  We analyze the crucial first 3 seconds of your video to determine if it has the power to stop the scroll and capture attention.
                </dd>
              </div>
              <div className="group flex flex-col items-start bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] hover:border-fuchsia-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.1)]">
                <div className="rounded-xl bg-fuchsia-500/10 p-3 ring-1 ring-fuchsia-500/20 mb-4 group-hover:bg-fuchsia-500/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-fuchsia-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl font-display">Trend Similarity</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Compare your content against real-time trending signals to see if you're riding the wave of current social media algorithms.
                </dd>
              </div>
              <div className="group flex flex-col items-start bg-white/[0.02] border border-white/[0.05] p-8 rounded-3xl hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20 mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl font-display">Actionable Strategy</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Get a detailed report with specific improvement suggestions, optimal posting times, and the best platform for your specific video.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
