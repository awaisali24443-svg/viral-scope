import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, X } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the welcome popup
    const hasVisited = localStorage.getItem('awais_codex_welcomed');
    
    if (!hasVisited) {
      // Add a slight delay for a better user experience
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Save to localStorage so it doesn't show again
    localStorage.setItem('awais_codex_welcomed', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0a0a0a] p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <Rocket className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            
            <h2 className="mb-2 text-center text-2xl font-bold text-white">
              Pakhair Raghlay! <br/>
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ViralScope</span>
            </h2>
            
            <p className="mb-6 text-center text-slate-300 leading-relaxed">
              Proudly developed in Shabqadar, KPK by <strong className="text-white">Awais Codex</strong>. 
              We're thrilled to have you here. Get ready to analyze, optimize, and skyrocket your viral journey in Pakistan and beyond!
            </p>
            
            <button
              onClick={handleClose}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-[0.98]"
            >
              Let's Get Started 🚀
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
