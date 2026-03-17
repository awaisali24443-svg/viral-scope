import { cn } from '../lib/utils';

interface AdSlotProps {
  className?: string;
  format?: 'leaderboard' | 'rectangle' | 'responsive';
}

export default function AdSlot({ className, format = 'responsive' }: AdSlotProps) {
  // In the future, you will replace this inner div with the Google AdSense <ins> tag
  // Example:
  // <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-XXXXXX" data-ad-slot="XXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
  
  return (
    <div 
      className={cn(
        "w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)] border border-white/[0.05] rounded-2xl flex flex-col items-center justify-center text-slate-500 overflow-hidden relative group transition-colors hover:border-white/10",
        format === 'leaderboard' && "h-[90px] max-w-[728px] mx-auto",
        format === 'rectangle' && "h-[250px] w-[300px] mx-auto",
        format === 'responsive' && "min-h-[100px] h-full",
        className
      )}
    >
      <span className="text-xs font-medium uppercase tracking-widest opacity-40 group-hover:opacity-80 transition-opacity font-display">
        Advertisement Space
      </span>
      <span className="text-[10px] opacity-30 mt-1 font-mono">
        (AdSense Ready)
      </span>
    </div>
  );
}
