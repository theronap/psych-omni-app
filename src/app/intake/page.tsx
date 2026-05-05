'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sections } from '@/lib/questions';
import { Answers } from '@/types';
import { SectionView } from '@/components/intake/SectionView';
import { ProgressBar } from '@/components/intake/ProgressBar';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function IntakePage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const section = sections[currentSection];
  const isLast = currentSection === sections.length - 1;

  const handleAnswer = useCallback((id: string, val: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }, []);

  const handleNext = async () => {
    if (isLast) {
      await handleSubmit();
    } else {
      setCurrentSection(c => c + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentSection(c => Math.max(0, c - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (!res.ok) throw new Error('Submission failed');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');

      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const metaMatch = fullText.match(/<!--META:([\s\S]+?):META-->/);
      let profile = null;
      let reportContent = fullText;
      if (metaMatch) {
        try { profile = JSON.parse(metaMatch[1]).__profile__; } catch { /* ignore */ }
        reportContent = fullText.replace(/\n\n<!--META:[\s\S]+?:META-->/, '');
      }

      const reportId = crypto.randomUUID();
      localStorage.setItem(`report_${reportId}`, JSON.stringify({
        id: reportId,
        content: reportContent,
        profile,
        createdAt: new Date().toISOString(),
      }));
      router.push(`/report?id=${reportId}`);
    } catch {
      setError('Something went wrong generating your report. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <Loader2 className="animate-spin text-white mb-6" size={40} />
        <h2 className="text-2xl font-semibold text-white mb-3">Analyzing your profile...</h2>
        <p className="text-neutral-400 max-w-sm">
          Building your psychological analysis. This takes about 60 seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-black/90 backdrop-blur border-b border-neutral-900 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <ProgressBar
            current={currentSection + 1}
            total={sections.length}
            sectionTitle={section.title}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-40">
        <div className="mb-12">
          <div className="text-xs font-mono text-neutral-500 mb-3 uppercase tracking-widest">
            Section {currentSection + 1} of {sections.length}
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">{section.title}</h1>
          <p className="text-neutral-400 leading-relaxed">{section.subtitle}</p>
        </div>

        <SectionView section={section} answers={answers} onAnswer={handleAnswer} />

        {error && (
          <div className="mt-8 p-4 bg-red-950 border border-red-800 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-neutral-900 px-6 py-5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentSection === 0}
            className="flex items-center gap-2 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-neutral-100 transition-colors"
          >
            {isLast ? 'Generate My Report' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
