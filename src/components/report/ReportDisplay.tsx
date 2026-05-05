'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  content: string;
  createdAt: string;
  onGoToDashboard?: () => void;
  emailSaved?: boolean;
}

interface ParsedSection {
  title: string;
  body: string;
}

function parseReport(content: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  for (const line of content.split('\n')) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, '').trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

export function ReportDisplay({ content, createdAt, onGoToDashboard, emailSaved }: Props) {
  const sections = useMemo(() => parseReport(content), [content]);
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="border-b border-stone-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm">
            <ArrowLeft size={16} /> Home
          </Link>
          <span className="text-stone-400 text-xs">{date}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 border-b border-stone-200">
        <div className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">Your Analysis</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-stone-900">Deep Personality Report</h1>
        <p className="text-stone-500 text-lg leading-relaxed max-w-xl">
          A comprehensive psychological profile built from your responses. This is not a personality type — it is a map of how you actually work.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 border-b border-stone-200">
        <p className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">Contents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((s, i) => (
            <a key={i} href={`#section-${i}`} className="text-stone-500 hover:text-stone-900 text-sm transition-colors py-1">
              <span className="text-stone-300 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-20 pb-32">
        {sections.map((s, i) => (
          <div key={i} id={`section-${i}`} className="scroll-mt-10">
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

      <div className="border-t border-stone-200 px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-mono text-stone-400 mb-4 uppercase tracking-widest">What's Next</div>
          <h3 className="text-2xl font-bold text-stone-900 mb-3">12 more lenses on who you are.</h3>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Your Shadow Self, Cognitive Bias Scanner, Emotional Trigger Blueprint, and 9 more — all generated instantly from the same profile.
          </p>
          {onGoToDashboard ? (
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-8 py-4 rounded-full font-semibold hover:bg-amber-300 transition-colors"
            >
              Explore Your Modules →
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-amber-400 text-stone-950 px-8 py-4 rounded-full font-semibold hover:bg-amber-300 transition-colors"
            >
              Explore Your Modules →
            </Link>
          )}
          {emailSaved && (
            <p className="text-stone-400 text-sm mt-4">Your report is saved. You can come back to it anytime.</p>
          )}
        </div>
      </div>
    </div>
  );
}
