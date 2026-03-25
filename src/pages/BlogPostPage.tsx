import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, User, ArrowLeft, Loader2, AlertCircle, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Article } from '../types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          }
          throw new Error('Failed to fetch article');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const headings = useMemo(() => {
    if (!article?.content) return [];
    const regex = /^(##|###) (.*$)/gim;
    const matches = Array.from(article.content.matchAll(regex));
    return matches.map(match => ({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
    }));
  }, [article?.content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center max-w-lg w-full">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{error || 'Article not found'}</h2>
          <p className="text-slate-300 mb-6">The article you are looking for might have been removed or is temporarily unavailable.</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium transition-colors"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <article className="flex-1 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <header className="mb-12 border-b border-white/[0.05] pb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display mb-6 leading-tight">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-slate-300">{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{formatDate(article.publishDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{article.readingTime}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.keywords.map((keyword, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-medium text-cyan-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </header>

              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-img:rounded-2xl prose-img:shadow-2xl prose-strong:text-white prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
                <ReactMarkdown
                  components={{
                    h2: ({ node, ...props }) => {
                      const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
                      return <h2 id={id} className="scroll-mt-24" {...props} />;
                    },
                    h3: ({ node, ...props }) => {
                      const id = props.children?.toString().toLowerCase().replace(/[^\w]+/g, '-');
                      return <h3 id={id} className="scroll-mt-24" {...props} />;
                    },
                    a: ({ node, href, children, ...props }) => {
                      if (href?.startsWith('/')) {
                        return <Link to={href} {...props}>{children}</Link>;
                      }
                      return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                    }
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.02] p-8 rounded-3xl">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">Ready to go viral?</h3>
                  <p className="text-slate-400">Use our AI to analyze your video and get a custom strategy.</p>
                </div>
                <Link
                  to="/upload"
                  className="whitespace-nowrap rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 text-base font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  Analyze Your Video
                </Link>
              </div>
            </motion.div>
          </article>

          {/* Sticky Table of Contents */}
          {headings.length > 0 && (
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <List className="w-4 h-4 text-cyan-400" />
                  Table of Contents
                </h3>
                <nav className="space-y-1">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      className={`block text-sm py-1.5 transition-colors ${
                        activeId === heading.id
                          ? 'text-cyan-400 font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
