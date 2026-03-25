import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ViralReport } from '../types';
import ResultsPage from './ResultsPage';
import { Loader2, AlertCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function SharedReportPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ViralReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'reports', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.isPublic) {
            const parsedReport = JSON.parse(data.reportData) as ViralReport;
            setReport(parsedReport);
          } else {
            setError("This report is private or does not exist.");
          }
        } else {
          setError("Report not found.");
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `reports/${id}`);
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose-500/10 text-rose-400 p-8 rounded-3xl max-w-md text-center border border-rose-500/20 backdrop-blur-sm">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-400" />
          <h2 className="text-2xl font-bold mb-3">Report Unavailable</h2>
          <p className="mb-8 text-rose-300/80">{error}</p>
          <Link
            to="/"
            className="bg-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-600 transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-cyan-500/10 border-b border-cyan-500/20 py-2 text-center text-sm text-cyan-400 font-medium">
        You are viewing a shared ViralScope report.
      </div>
      <ResultsPage report={report} isSharedView={true} />
    </div>
  );
}
