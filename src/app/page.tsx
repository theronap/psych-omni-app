import Link from 'next/link';
import { ArrowRight, Brain, Zap, Eye, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-neutral-900 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Psych</span>
          <Link href="/intake" className="text-sm text-neutral-400 hover:text-white transition-colors">
            Start analysis →
          </Link>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-neutral-500 mb-6 uppercase tracking-widest">
            Deep Personality Analysis
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8">
            Understand yourself<br />
            <span className="text-neutral-500">like never before.</span>
          </h1>
          <p className="text-xl text-neutral-400 leading-relaxed mb-10 max-w-xl">
            A 40-minute psychological intake — built on 15 validated frameworks — generates a comprehensive report that maps who you actually are, not who you think you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              href="/intake"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-neutral-100 transition-colors text-base"
            >
              Take the Analysis <ArrowRight size={18} />
            </Link>
            <p className="text-neutral-600 text-sm">Free during beta · ~40 minutes</p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-neutral-500 mb-12 uppercase tracking-widest">What the report covers</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Brain, title: 'Who You Are', desc: 'Core personality mapped across 5 dimensions. Your dominant traits in behavioral terms.' },
              { icon: Zap, title: 'Your Superpowers', desc: 'Genuine signature strengths — not flattery, but where you actually have an edge.' },
              { icon: Target, title: 'Your Kryptonite', desc: 'The specific patterns that cost you — named honestly and tied to your actual data.' },
              { icon: Eye, title: 'Your Blind Spots', desc: 'What others see about you that you cannot see yourself.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border border-neutral-800 rounded-2xl">
                <Icon size={24} className="text-neutral-400 mb-4" />
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-neutral-500 mb-12 uppercase tracking-widest">Report sections</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            {[
              'Who You Are', 'How You Think', 'How You Connect',
              'Your Superpowers', 'Your Kryptonite', 'Hidden Patterns',
              "What's Driving You", 'Your Blind Spots', 'A Note on Your Shadow',
              'Where to Go From Here',
            ].map((s, i) => (
              <div key={s} className="flex items-center gap-4 py-4 border-b border-neutral-900">
                <span className="text-neutral-700 font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-neutral-300 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-20 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-neutral-500 mb-6 uppercase tracking-widest">Built on</p>
          <div className="flex flex-wrap gap-3">
            {[
              'Big Five / OCEAN', 'Attachment Theory', 'Enneagram',
              'Jungian Functions', 'Internal Family Systems', 'CBT Cognitive Distortions',
              'Self-Determination Theory', 'VIA Character Strengths',
              'Thomas-Kilmann Conflict Model', 'Schwartz Value Theory',
            ].map(f => (
              <span key={f} className="px-4 py-2 border border-neutral-800 rounded-full text-neutral-400 text-xs">
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-900 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Tell us a little about yourself.
          </h2>
          <p className="text-neutral-400 text-lg mb-10 max-w-lg mx-auto">
            We will tell you something unsettlingly accurate.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-neutral-100 transition-colors text-base"
          >
            Start Your Analysis <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-neutral-900 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-neutral-600 text-xs">
          <span>Psych · Deep Personality Analysis</span>
          <span>Beta</span>
        </div>
      </footer>
    </div>
  );
}
