import { Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Shield className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold text-white font-display">Privacy Policy</h1>
      </div>
      
      <div className="prose prose-invert prose-indigo max-w-none bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md">
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">1. Information We Collect</h2>
        <p className="text-slate-300 mb-4">
          ViralScope AI ("we", "our", or "us") operates as an analytics tool. When you use our service, we may collect information about the videos you analyze, including YouTube URLs and public metadata. We do not require account creation for basic usage, meaning we do not collect personally identifiable information (PII) like your name or email address unless you explicitly provide it (e.g., by contacting support).
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">2. How We Use Your Information</h2>
        <p className="text-slate-300 mb-4">
          The data we process is used strictly to provide our AI-driven analysis services. We use the YouTube Data API to fetch public information about videos and trends. We do not store your personal search history permanently, nor do we sell your data to third parties.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">3. Third-Party Services & Advertising</h2>
        <p className="text-slate-300 mb-4">
          We use third-party services, including Google Analytics and Google AdSense, to monitor site traffic and display advertisements. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website and other websites to provide targeted advertising based on your browsing activities and interests.
        </p>
        <ul className="list-disc pl-6 text-slate-300 mb-4 space-y-2">
          <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
          <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
          <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Ads Settings</a>.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">4. YouTube API Services</h2>
        <p className="text-slate-300 mb-4">
          Our application uses YouTube API Services. By using our application, you are agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google Privacy Policy</a>.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8 mb-4 font-display">5. Contact Us</h2>
        <p className="text-slate-300 mb-4">
          If you have any questions about this Privacy Policy, please contact us at contact@viralscope.ai.
        </p>
      </div>
    </div>
  );
}
