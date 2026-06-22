'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ReportDisplay } from '@/components/report/ReportDisplay';
import EmailCaptureModal from '@/components/EmailCaptureModal';

interface StoredReport {
  content: string;
  createdAt: string;
  profile?: unknown;
  profileId?: string;
  sessionId?: string;
}

function ReportContent() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id');
  const [report, setReport] = useState<StoredReport | null>(null);
  const [error, setError] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration of browser-only localStorage on mount; must run in an effect to avoid an SSR hydration mismatch */
  useEffect(() => {
    if (!id) { setError(true); return; }
    const stored = localStorage.getItem(`report_${id}`);
    if (!stored) { setError(true); return; }
    try {
      const parsed = JSON.parse(stored);
      setReport(parsed);
      const emailAlreadySaved = localStorage.getItem('email_saved');
      if (!emailAlreadySaved) {
        setTimeout(() => setShowEmailModal(true), 3000);
      }
    } catch {
      setError(true);
    }
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleEmailSaved(email: string) {
    setEmailSaved(true);
    setShowEmailModal(false);
    localStorage.setItem('email_saved', email);
  }

  function handleEmailSkip() {
    setShowEmailModal(false);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-stone-500 mb-4">Report not found. It may have been cleared from your browser.</p>
          <a href="/intake" className="text-stone-900 underline text-sm">Take the analysis again</a>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showEmailModal && (
        <EmailCaptureModal onSaved={handleEmailSaved} onSkip={handleEmailSkip} />
      )}
      <ReportDisplay
        content={report.content}
        createdAt={report.createdAt}
        onGoToDashboard={() => router.push('/dashboard')}
        emailSaved={emailSaved}
      />
    </>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Loading...</div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
