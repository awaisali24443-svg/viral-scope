import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function ThumbnailAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-thumbnail', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze thumbnail');
      }

      const data = await response.json();
      setResult(data);

      if (user) {
        try {
          await addDoc(collection(db, 'thumbnailReports'), {
            userId: user.uid,
            ctrScore: data.ctrScore || 0,
            reportData: JSON.stringify(data),
            createdAt: serverTimestamp(),
            isPublic: false
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, 'thumbnailReports');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-white mb-4 flex items-center justify-center gap-3">
          <ImageIcon className="w-10 h-10 text-cyan-400" />
          Thumbnail Analyzer
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload your YouTube or TikTok thumbnail to get AI-powered feedback on click-through rate potential, visual clarity, and emotional appeal.
        </p>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-xl">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:bg-white/[0.02] transition-colors relative group">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="bg-cyan-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Upload Thumbnail</h3>
            <p className="text-slate-400">Drag and drop or click to browse (JPG, PNG, WebP up to 5MB)</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
              <img src={previewUrl} alt="Thumbnail preview" className="max-w-full max-h-full object-contain" />
              <button
                onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md transition-colors"
              >
                Change Image
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl flex items-center gap-3 border border-rose-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {!result && (
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-bold text-white hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Analyze Thumbnail
                    </>
                  )}
                </button>
              </div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#111111] to-[#0a0a0a] rounded-2xl p-8 border border-white/[0.08] shadow-2xl space-y-8"
              >
                <div className="text-center">
                  <h3 className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Estimated CTR Potential</h3>
                  <div className="text-6xl font-black tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    {result.ctrScore}/10
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Strengths</h4>
                    <ul className="space-y-2">
                      {result.strengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-green-400 mt-1">✓</span> {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Areas for Improvement</h4>
                    <ul className="space-y-2">
                      {result.improvements.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-amber-400 mt-1">!</span> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
