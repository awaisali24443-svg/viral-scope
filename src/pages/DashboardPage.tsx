import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, FileText, Calendar, Globe2, TrendingUp, ExternalLink, Trash2, Share2, Loader2, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface SavedReport {
  id: string;
  type: 'video' | 'thumbnail';
  videoTopic?: string;
  viralPotentialScore?: number;
  bestPlatform?: string;
  ctrScore?: number;
  reportData: string;
  createdAt: any;
  isPublic: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportToDelete, setReportToDelete] = useState<{ id: string, type: 'video' | 'thumbnail' } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'thumbnail'>('video');

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchReports = async () => {
      try {
        // Fetch Video Reports
        const videoQ = query(
          collection(db, 'reports'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const videoSnapshot = await getDocs(videoQ);
        const fetchedVideos: SavedReport[] = [];
        videoSnapshot.forEach((doc) => {
          fetchedVideos.push({ id: doc.id, type: 'video', ...doc.data() } as SavedReport);
        });

        // Fetch Thumbnail Reports
        const thumbQ = query(
          collection(db, 'thumbnailReports'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const thumbSnapshot = await getDocs(thumbQ);
        const fetchedThumbs: SavedReport[] = [];
        thumbSnapshot.forEach((doc) => {
          fetchedThumbs.push({ id: doc.id, type: 'thumbnail', ...doc.data() } as SavedReport);
        });

        const allReports = [...fetchedVideos, ...fetchedThumbs].sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        setReports(allReports);
      } catch (err: any) {
        handleFirestoreError(err, OperationType.LIST, 'reports/thumbnailReports');
        setError(err.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user, navigate]);

  const confirmDelete = async () => {
    if (!reportToDelete) return;
    try {
      const collectionName = reportToDelete.type === 'video' ? 'reports' : 'thumbnailReports';
      await deleteDoc(doc(db, collectionName, reportToDelete.id));
      setReports(reports.filter(r => r.id !== reportToDelete.id));
      setReportToDelete(null);
      showToast('success', 'Report deleted successfully.');
    } catch (err) {
      const collectionName = reportToDelete.type === 'video' ? 'reports' : 'thumbnailReports';
      handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${reportToDelete.id}`);
      showToast('error', 'Failed to delete report.');
      setReportToDelete(null);
    }
  };

  const handleDeleteClick = (id: string, type: 'video' | 'thumbnail') => {
    setReportToDelete({ id, type });
  };

  const togglePublicStatus = async (id: string, currentStatus: boolean, type: 'video' | 'thumbnail') => {
    try {
      const collectionName = type === 'video' ? 'reports' : 'thumbnailReports';
      await updateDoc(doc(db, collectionName, id), {
        isPublic: !currentStatus
      });
      setReports(reports.map(r => r.id === id ? { ...r, isPublic: !currentStatus } : r));
      showToast('success', `Report is now ${!currentStatus ? 'public' : 'private'}.`);
    } catch (err) {
      const collectionName = type === 'video' ? 'reports' : 'thumbnailReports';
      handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${id}`);
      showToast('error', 'Failed to update sharing status.');
    }
  };

  const handleShare = (id: string, type: 'video' | 'thumbnail') => {
    const url = type === 'video' ? `${window.location.origin}/shared/${id}` : `${window.location.origin}/shared-thumbnail/${id}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const filteredReports = reports.filter(r => r.type === activeTab);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-2">Delete Report</h3>
            <p className="text-slate-400 mb-6">Are you sure you want to delete this report? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
            Your Dashboard
          </h1>
          <p className="text-slate-400">Manage your saved viral analysis reports.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/thumbnail-analyzer"
            className="rounded-full bg-white/10 text-white px-6 py-3 font-bold transition-all hover:bg-white/20"
          >
            New Thumbnail
          </Link>
          <Link
            to="/upload"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            New Video
          </Link>
        </div>
      </div>

      <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'video' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Video Analyses
        </button>
        <button
          onClick={() => setActiveTab('thumbnail')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'thumbnail' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Thumbnail Analyses
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl mb-8 border border-rose-500/20">
          {error}
        </div>
      )}

      {filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No {activeTab} reports yet</h3>
          <p className="text-slate-400 mb-6">Analyze your first {activeTab} to see the report here.</p>
          <Link
            to={activeTab === 'video' ? "/upload" : "/thumbnail-analyzer"}
            className="inline-block rounded-full bg-white text-[#030303] px-6 py-2 font-bold transition-all hover:bg-slate-200"
          >
            Analyze {activeTab === 'video' ? 'Video' : 'Thumbnail'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 hover:bg-white/[0.04] transition-colors relative group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  {report.type === 'video' ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      {report.viralPotentialScore}/100
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3 h-3" />
                      CTR: {report.ctrScore}/10
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteClick(report.id, report.type)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 flex-grow">
                {report.type === 'video' ? report.videoTopic : 'Thumbnail Analysis'}
              </h3>

              <div className="space-y-2 mb-6 text-sm text-slate-400">
                {report.type === 'video' && (
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4" />
                    <span>Platform: {report.bestPlatform}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Unknown Date'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                {report.type === 'video' ? (
                  <Link
                    to={`/shared/${report.id}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
                  >
                    View Full Report <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-slate-500 text-sm">View in Dashboard</span>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePublicStatus(report.id, report.isPublic, report.type)}
                    className={`text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                      report.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {report.isPublic ? 'Public' : 'Private'}
                  </button>
                  {report.isPublic && report.type === 'video' && (
                    <button
                      onClick={() => handleShare(report.id, report.type)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
