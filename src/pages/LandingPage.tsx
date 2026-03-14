import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Upload, TrendingUp, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Predict Your Video's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Viral Potential</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              Upload your video and let our advanced AI analyze its hook strength, emotional impact, and trend similarity to generate a comprehensive viral strategy report.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/upload"
                className="group flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"
              >
                <Upload className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                Analyze Your Video
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Deep Analysis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to go viral
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our AI evaluates multiple dimensions of your content to provide actionable insights tailored for TikTok, YouTube Shorts, and Instagram Reels.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="rounded-xl bg-indigo-100 p-3 ring-1 ring-indigo-200">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <dt className="mt-4 font-semibold text-slate-900 text-xl">Hook Strength</dt>
                <dd className="mt-2 leading-7 text-slate-600">
                  We analyze the crucial first 3 seconds of your video to determine if it has the power to stop the scroll and capture attention.
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-xl bg-violet-100 p-3 ring-1 ring-violet-200">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                </div>
                <dt className="mt-4 font-semibold text-slate-900 text-xl">Trend Similarity</dt>
                <dd className="mt-2 leading-7 text-slate-600">
                  Compare your content against real-time trending signals to see if you're riding the wave of current social media algorithms.
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-xl bg-emerald-100 p-3 ring-1 ring-emerald-200">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <dt className="mt-4 font-semibold text-slate-900 text-xl">Actionable Strategy</dt>
                <dd className="mt-2 leading-7 text-slate-600">
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
