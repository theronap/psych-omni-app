'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MODULE_DEFINITIONS } from '@/lib/modules/definitions';
import { ReportDisplay } from '@/components/report/ReportDisplay';

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

  useEffect(() => {
    const raw = localStorage.getItem(`module_${moduleId}`);
    if (!raw) { setError(true); return; }
    try {
      setReport(JSON.parse(raw));
    } catch {
      setError(true);
    }
  }, [moduleId]);

  if (!def) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
        <div>
          <p className="text-neutral-400 mb-4">Module not found.</p>
          <Link href="/dashboard" className="text-white underline text-sm">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <div className="text-3xl mb-4">{def.icon}</div>
        <h2 className="text-2xl font-bold text-white mb-3">{def.name}</h2>
        <p className="text-neutral-400 mb-8 max-w-sm">This module hasn't been generated yet.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
        >
          Go to Dashboard
        </button>
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

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Module header bar */}
      <div className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-lg">{def.icon}</span>
            <span className="text-neutral-400 text-sm">{def.name}</span>
          </div>
        </div>
      </div>

      {/* Reuse the ReportDisplay layout but with module title/subtitle */}
      <div className="max-w-3xl mx-auto px-6 py-16 border-b border-neutral-800">
        <div className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-widest">Module Report</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">{def.name}</h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">{def.description}</p>
      </div>

      {/* Report sections — reuse parse logic inline */}
      <ModuleReportBody content={report.content} />

      {/* Footer */}
      <div className="border-t border-neutral-800 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-neutral-500 text-sm mb-6">Explore another lens</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
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
      {/* TOC */}
      <div className="max-w-3xl mx-auto px-6 py-10 border-b border-neutral-800">
        <p className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-widest">Contents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((s, i) => (
            <a key={i} href={`#ms-${i}`} className="text-neutral-400 hover:text-white text-sm transition-colors py-1">
              <span className="text-neutral-700 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-20 pb-16">
        {sections.map((s, i) => (
          <div key={i} id={`ms-${i}`} className="scroll-mt-10">
            <div className="mb-8">
              <div className="text-xs font-mono text-neutral-600 mb-2 uppercase tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">{s.title}</h2>
            </div>
            <div className="space-y-6">
              {s.body.trim().split('\n\n').filter(Boolean).map((para, j) => (
                <p key={j} className="text-neutral-300 leading-relaxed text-base sm:text-lg">
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
