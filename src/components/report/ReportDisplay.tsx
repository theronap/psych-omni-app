'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Props {
  content: string;
  createdAt: string;
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

export function ReportDisplay({ content, createdAt }: Props) {
  const sections = useMemo(() => parseReport(content), [content]);
  const date = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="border-b border-neutral-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Home
          </Link>
          <span className="text-neutral-600 text-xs">{date}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 border-b border-neutral-800">
        <div className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-widest">Your Analysis</div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Deep Personality Report</h1>
        <p className="text-neutral-400 text-lg leading-relaxed max-w-xl">
          A comprehensive psychological profile built from your responses. This is not a personality type — it is a map of how you actually work.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 border-b border-neutral-800">
        <p className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-widest">Contents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((s, i) => (
            <a key={i} href={`#section-${i}`} className="text-neutral-400 hover:text-white text-sm transition-colors py-1">
              <span className="text-neutral-700 font-mono mr-2">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-20 pb-32">
        {sections.map((s, i) => (
          <div key={i} id={`section-${i}`} className="scroll-mt-10">
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

      <div className="border-t border-neutral-800 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-neutral-600 text-sm mb-6">Want to go deeper?</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors"
          >
            Explore add-on modules
          </Link>
        </div>
      </div>
    </div>
  );
}
