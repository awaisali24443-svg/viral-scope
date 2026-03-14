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
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB limit.');
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
      // Store preferences in sessionStorage to use in AnalysisPage
      sessionStorage.setItem('targetPlatform', platform);
      sessionStorage.setItem('targetRegion', region);
      navigate('/analyze');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Upload Video for Analysis</h1>
          <p className="mt-2 text-slate-500">Upload your content to get a comprehensive viral strategy report.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Video File</label>
            {!file ? (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
                  dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
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
                <UploadCloud className={cn("w-12 h-12 mb-4", dragActive ? "text-indigo-500" : "text-slate-400")} />
                <p className="mb-2 text-sm text-slate-600">
                  <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">MP4, MOV, WEBM (Max 50MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLocalFile(null)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Selection */}
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-slate-700 mb-2">
                Target Platform
              </label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="TikTok">TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Instagram Reels">Instagram Reels</option>
              </select>
            </div>

            {/* Region Selection */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-slate-700 mb-2">
                Target Audience Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={!file}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Start AI Analysis
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
