import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white font-display">Terms of Service</h1>
      </div>
      
      <div className="prose prose-invert prose-blue max-w-none bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">1. Acceptance of Terms</h2>
        <p className="text-slate-300 mb-4">
          By accessing or using ViralScope AI ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">2. Use License</h2>
        <p className="text-slate-300 mb-4">
          Permission is granted to temporarily use the materials (information or software) on ViralScope AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
          <li>Modify or copy the materials;</li>
          <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>Attempt to decompile or reverse engineer any software contained on ViralScope AI's website;</li>
          <li>Remove any copyright or other proprietary notations from the materials; or</li>
          <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">3. Disclaimer</h2>
        <p className="text-slate-300 mb-4">
          The materials on ViralScope AI's website are provided on an 'as is' basis. ViralScope AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        <p className="text-slate-300 mb-4">
          Further, ViralScope AI does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">4. Limitations</h2>
        <p className="text-slate-300 mb-4">
          In no event shall ViralScope AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ViralScope AI's website, even if ViralScope AI or a ViralScope AI authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">5. Revisions and Errata</h2>
        <p className="text-slate-300 mb-4">
          The materials appearing on ViralScope AI's website could include technical, typographical, or photographic errors. ViralScope AI does not warrant that any of the materials on its website are accurate, complete, or current. ViralScope AI may make changes to the materials contained on its website at any time without notice.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">6. Links</h2>
        <p className="text-slate-300 mb-4">
          ViralScope AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by ViralScope AI of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">7. Governing Law</h2>
        <p className="text-slate-300 mb-4">
          These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </div>
    </div>
  );
}
