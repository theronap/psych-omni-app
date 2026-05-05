'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReportDisplay } from '@/components/report/ReportDisplay';

interface StoredReport {
  content: string;
  createdAt: string;
}

function ReportContent() {
  const params = useSearchParams();
  const id = params.get('id');
  const [report, setReport] = useState<StoredReport | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); return; }
    const stored = localStorage.getItem(`report_${id}`);
    if (!stored) { setError(true); return; }
    try {
      setReport(JSON.parse(stored));
    } catch {
      setError(true);
    }
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
        <div>
          <p className="text-neutral-400 mb-4">Report not found.</p>
          <a href="/intake" className="text-white underline text-sm">Take the analysis</a>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    );
  }

  return <ReportDisplay content={report.content} createdAt={report.createdAt} />;
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
