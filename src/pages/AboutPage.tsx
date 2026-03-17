import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <Info className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white font-display">About Us</h1>
      </div>
      
      <div className="prose prose-invert prose-blue max-w-none bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <p className="text-slate-300 text-lg leading-relaxed mb-6">
          Welcome to ViralScope AI, the ultimate tool for content creators, marketers, and data analysts to understand what makes videos go viral on YouTube.
        </p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">Our Mission</h2>
        <p className="text-slate-300 mb-4">
          Our mission is to democratize access to advanced video analytics. We believe that understanding the algorithm shouldn't require a PhD in data science. By leveraging the power of Artificial Intelligence (specifically Google's Gemini models) and the YouTube Data API, we transform raw metrics into actionable insights.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">What We Do</h2>
        <p className="text-slate-300 mb-4">
          ViralScope AI provides three core services:
        </p>
        <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
          <li><strong>Deep Video Analysis:</strong> Paste any YouTube URL, and our AI will break down its title, description, tags, and engagement metrics to tell you exactly why it succeeded.</li>
          <li><strong>Local Trends:</strong> Discover what's trending in your specific country right now, categorized by niche.</li>
          <li><strong>Global Intelligence:</strong> A worldwide dashboard that aggregates trends across multiple major regions to identify macro-shifts in content consumption.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">The Technology</h2>
        <p className="text-slate-300 mb-4">
          Built with modern web technologies including React, Tailwind CSS, and Node.js, ViralScope AI is designed for speed and reliability. Our backend seamlessly integrates with the YouTube Data API v3 to fetch real-time statistics, while our AI engine processes this data to generate human-readable reports.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">Contact</h2>
        <p className="text-slate-300 mb-4">
          We are constantly evolving and adding new features. If you have feedback, feature requests, or business inquiries, please reach out to us at contact@viralscope.ai.
        </p>
      </div>
    </div>
  );
}
