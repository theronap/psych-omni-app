'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MODULE_DEFINITIONS } from '@/lib/modules/definitions';

interface StoredModuleReport {
  moduleId: string;
  content: string;
  createdAt: string;
}

export default function ModuleReportPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const [report, setReport] = useState<StoredModuleReport | null>(null);
  const [error, setError] = useState(false);

  const def = MODULE_DEFINITIONS[moduleId];

  /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration of browser-only localStorage on mount; must run in an effect to avoid an SSR hydration mismatch */
  useEffect(() => {
    const raw = localStorage.getItem(`module_${moduleId}`);
    if (!raw) { setError(true); return; }
    try {
      setReport(JSON.parse(raw));
    } catch {
      setError(true);
    }
  }, [moduleId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!def) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-stone-500 mb-4">Module not found.</p>
          <Link href="/dashboard" className="text-stone-900 underline text-sm">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center text-center px-6">
        <div className="text-3xl mb-4">{def.icon}</div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3">{def.name}</h2>
        <p className="text-stone-500 mb-8 max-w-sm">This module hasn&apos;t been generated yet.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-accent text-white px-6 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors"
        >
          Go to Dashboard
        </button>
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
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Module header bar */}
      <div className="border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">{def.icon}</span>
            <span className="text-stone-500 text-sm">{def.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 border-b border-stone-200">
        <div className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">Module Report</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-stone-900">{def.name}</h1>
        <p className="text-stone-500 text-lg leading-relaxed max-w-xl">{def.description}</p>
      </div>

      <ModuleReportBody content={report.content} />

      <div className="border-t border-stone-200 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-stone-400 text-sm mb-6">Explore another lens</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ModuleReportBody({ content }: { content: string }) {
  const sections: { title: string; body: string }[] = [];
  let current: { title: string; body: string } | null = null;
  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, '').trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-10 border-b border-stone-200">
        <p className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">Contents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((s, i) => (
            <a key={i} href={`#ms-${i}`} className="text-stone-500 hover:text-stone-900 text-sm transition-colors py-1">
              <span className="text-stone-300 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-20 pb-16">
        {sections.map((s, i) => (
          <div key={i} id={`ms-${i}`} className="scroll-mt-10">
            <div className="mb-8">
              <div className="text-xs font-mono text-stone-300 mb-2 uppercase tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">{s.title}</h2>
            </div>
            <div className="space-y-6">
              {s.body.trim().split('\n\n').filter(Boolean).map((para, j) => (
                <p key={j} className="text-stone-600 leading-relaxed text-base sm:text-lg">
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
