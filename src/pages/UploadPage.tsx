import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UploadCloud, Video, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface UploadPageProps {
  setVideoFile: (file: File | null) => void;
}

export default function UploadPage({ setVideoFile }: UploadPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setLocalFile] = useState<File | null>(null);
  const [platform, setPlatform] = useState('TikTok');
  const [region, setRegion] = useState('North America');
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
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (validTypes.includes(selectedFile.type)) {
      if (selectedFile.size > 15 * 1024 * 1024) {
        alert('File size exceeds 15MB limit.');
        return;
      }
      setLocalFile(selectedFile);
    } else {
      alert('Please upload a valid video file (MP4, MOV, WEBM).');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      setVideoFile(file);
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
        className="bg-[#0A0A0B] rounded-3xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-xl"
      >
        <div className="p-8 border-b border-white/5">
          <h1 className="text-3xl font-bold text-white">Upload Video</h1>
          <p className="mt-2 text-slate-400">Upload your content to get a comprehensive viral strategy report.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">Video File</label>
            {!file ? (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden group",
                  dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
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
                <UploadCloud className={cn("w-14 h-14 mb-4 transition-transform group-hover:scale-110 group-hover:-translate-y-1", dragActive ? "text-indigo-400" : "text-slate-400")} />
                <p className="mb-2 text-base text-slate-300">
                  <span className="font-bold text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-slate-500">MP4, MOV, WEBM (Max 15MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
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
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none font-medium"
              >
                <option value="TikTok">TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Instagram Reels">Instagram Reels</option>
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
                className="w-full rounded-xl border border-white/10 bg-[#111113] px-4 py-3.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none font-medium"
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
              disabled={!file}
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
