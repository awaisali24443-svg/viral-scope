import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Article } from '../types';
import { Helmet } from 'react-helmet-async';

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>ViralScope AI Blog - YouTube & TikTok Growth Strategies</title>
        <meta name="description" content="Learn how to go viral on YouTube, TikTok, and Instagram Reels. Read our latest AI-generated strategies and insights." />
      </Helmet>
      
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3 font-display mb-4">
            <BookOpen className="w-10 h-10 text-cyan-400" />
            Viral Content Strategies
          </h1>
          <p className="text-lg text-slate-400">
            Discover the latest insights, tips, and strategies to grow your audience and go viral on social media.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium animate-pulse">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center flex flex-col items-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Blog</h3>
            <p className="text-slate-300">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl backdrop-blur-md">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No articles yet</h3>
            <p className="text-slate-400">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, idx) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
              >
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.publishDate)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTime}
                    </div>
                  </div>
                  
                  <Link to={`/blog/${article.slug}`} className="block group-hover:text-cyan-300 transition-colors">
                    <h2 className="text-2xl font-bold text-white mb-3 line-clamp-2 font-display">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <p className="text-slate-400 line-clamp-3 mb-6 flex-grow">
                    {article.metaDescription}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">By {article.author}</span>
                    <Link 
                      to={`/blog/${article.slug}`}
                      className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                    >
                      Read Article &rarr;
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
