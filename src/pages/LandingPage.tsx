import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, TrendingUp, Zap, BarChart3, Play } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-40 lg:pb-48">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Gemini 3.1 Pro Powered
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8">
              Predict Your Video's <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
                Viral Potential
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Upload your video and let our advanced AI analyze its hook strength, emotional impact, and trend similarity to generate a comprehensive viral strategy report.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/upload"
                className="group flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-4 text-lg font-bold transition-all hover:bg-slate-200 hover:scale-105"
              >
                <Upload className="h-5 w-5" />
                Analyze Your Video
              </Link>
              <a
                href="#features"
                className="group flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                <Play className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                How it works
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative bg-[#0A0A0B] py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-sm font-bold leading-7 text-indigo-400 uppercase tracking-widest">Deep Analysis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Everything you need to go viral
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Our AI evaluates multiple dimensions of your content to provide actionable insights tailored for TikTok, YouTube Shorts, and Instagram Reels.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="rounded-xl bg-indigo-500/20 p-3 ring-1 ring-indigo-500/30 mb-4">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl">Hook Strength</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  We analyze the crucial first 3 seconds of your video to determine if it has the power to stop the scroll and capture attention.
                </dd>
              </div>
              <div className="flex flex-col items-start bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="rounded-xl bg-fuchsia-500/20 p-3 ring-1 ring-fuchsia-500/30 mb-4">
                  <TrendingUp className="h-6 w-6 text-fuchsia-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl">Trend Similarity</dt>
                <dd className="mt-2 leading-7 text-slate-400">
                  Compare your content against real-time trending signals to see if you're riding the wave of current social media algorithms.
                </dd>
              </div>
              <div className="flex flex-col items-start bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="rounded-xl bg-emerald-500/20 p-3 ring-1 ring-emerald-500/30 mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
                <dt className="mt-4 font-bold text-white text-xl">Actionable Strategy</dt>
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
