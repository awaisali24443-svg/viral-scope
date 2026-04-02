import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UploadCloud, Video, X, Link as LinkIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadPageProps {
  setVideoFile: (file: File | null) => void;
}

export default function UploadPage({ setVideoFile }: UploadPageProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'link'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [file, setLocalFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [region, setRegion] = useState('North America');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (validTypes.includes(selectedFile.type)) {
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError('File size exceeds 15MB limit.');
        return;
      }
      setLocalFile(selectedFile);
    } else {
      setError('Please upload a valid video file (MP4, MOV, WEBM).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'upload' && file) {
      setVideoFile(file);
      sessionStorage.setItem('targetPlatform', platform);
      sessionStorage.setItem('targetRegion', region);
      sessionStorage.removeItem('videoUrl');
      navigate('/analyze');
    } else if (activeTab === 'link' && videoUrl) {
      if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be') && !videoUrl.includes('tiktok.com')) {
        setError('Please enter a valid YouTube or TikTok URL.');
        return;
      }
      setVideoFile(null); // Clear file
      sessionStorage.setItem('videoUrl', videoUrl);
      sessionStorage.setItem('targetPlatform', platform);
      sessionStorage.setItem('targetRegion', region);
      navigate('/analyze');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] rounded-3xl shadow-2xl border border-white/[0.05] overflow-hidden backdrop-blur-xl"
      >
        <div className="p-8 border-b border-white/[0.05]">
          <h1 className="text-3xl font-bold text-white font-display">Analyze Video</h1>
          <p className="mt-2 text-slate-400">Upload your content or paste a link to get a comprehensive viral strategy report.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Tabs */}
          <div className="flex p-1 bg-white/[0.05] rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setError(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                activeTab === 'upload' ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <UploadCloud className="w-4 h-4" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('link'); setError(null); }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                activeTab === 'link' ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <LinkIcon className="w-4 h-4" />
              Paste Link
            </button>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3">
              <X className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Input Area */}
          <div>
            {activeTab === 'upload' ? (
              <>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Video File</label>
                {!file ? (
                  <div
                    className={cn(
                      "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden group",
                      dragActive ? "border-cyan-500 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.2)]" : "border-white/20 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/40"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />
                    <UploadCloud className={cn("w-14 h-14 mb-4 transition-transform group-hover:scale-110 group-hover:-translate-y-1", dragActive ? "text-cyan-400" : "text-slate-400")} />
                    <p className="mb-2 text-base text-slate-300">
                      <span className="font-bold text-cyan-400">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-slate-500">MP4, MOV, WEBM (Max 15MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocalFile(null)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <label className="block text-sm font-semibold text-slate-300 mb-3">Video Link</label>
                <input
                  type="url"
                  placeholder="Paste YouTube or TikTok link here..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium transition-colors"
                  required={activeTab === 'link'}
                />
                <p className="mt-2 text-sm text-slate-500">We will extract the video metadata and analyze it.</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Selection */}
            <div>
              <label htmlFor="platform" className="block text-sm font-semibold text-slate-300 mb-2">
                Target Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 appearance-none font-medium transition-colors"
              >
                <option value="TikTok">TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube (Long Form)">YouTube (Long Form)</option>
              </select>
            </div>

            {/* Region Selection */}
            <div>
              <label htmlFor="region" className="block text-sm font-semibold text-slate-300 mb-2">
                Target Audience Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 appearance-none font-medium transition-colors"
              >
                <option value="North America">North America</option>
                <option value="South Asia">South Asia</option>
                <option value="Europe">Europe</option>
                <option value="Latin America">Latin America</option>
                <option value="Middle East">Middle East</option>
                <option value="Southeast Asia">Southeast Asia</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={activeTab === 'upload' ? !file : !videoUrl}
              className="w-full rounded-xl bg-white text-black px-4 py-4 text-center text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start AI Analysis
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
