import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ViralScope <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/upload"
            className="rounded-full bg-white/10 border border-white/10 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:scale-105"
          >
            Analyze Video
          </Link>
        </div>
      </div>
    </nav>
  );
}
