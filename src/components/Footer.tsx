import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#030303] py-12 mt-20 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">ViralScope AI</span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:contact@viralscope.ai" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Awais Codex. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Not affiliated with YouTube or Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}
