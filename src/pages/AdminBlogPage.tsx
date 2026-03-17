import { useState } from 'react';
import { motion } from 'motion/react';
import { PenTool, Loader2, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminBlogPage() {
  const [topic, setTopic] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; slug?: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, adminSecret }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate article');
      }

      setResult({
        success: true,
        message: `Successfully generated: "${data.title}"`,
        slug: data.slug
      });
      setTopic('');
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'An unexpected error occurred'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin: Generate Blog | ViralScope AI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-md"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
              <PenTool className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display">AI Content Generator</h1>
              <p className="text-slate-400 text-sm">Generate SEO-optimized blog articles using Gemini 3.1 Pro</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="adminSecret" className="block text-sm font-medium text-slate-300 mb-2">
                Admin Secret Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="adminSecret"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  placeholder="Enter the ADMIN_SECRET"
                  className="w-full bg-[#030303] border border-white/[0.1] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  required
                  disabled={isGenerating}
                />
              </div>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
                Article Topic or Keyword
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to go viral on YouTube Shorts in 2026"
                className="w-full bg-[#030303] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
                disabled={isGenerating}
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Article (This takes ~15-30s)...
                </>
              ) : (
                <>
                  <PenTool className="w-5 h-5" />
                  Generate & Publish Article
                </>
              )}
            </button>
          </form>

          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                result.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
            >
              {result.success ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.slug && (
                  <a 
                    href={`/blog/${result.slug}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm underline mt-1 inline-block hover:text-emerald-300"
                  >
                    View Published Article &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
