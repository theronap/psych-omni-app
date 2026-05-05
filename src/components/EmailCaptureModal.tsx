'use client';

import { useState } from 'react';

interface Props {
  onSaved: (email: string) => void;
  onSkip: () => void;
}

export default function EmailCaptureModal({ onSaved, onSkip }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    setStatus('saving');
    setErrorMsg('');
    try {
      const res = await fetch('/api/user/save-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      onSaved(email);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Your report is still saved on this device.');
    }
  }

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-8 shadow-xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Save Your Report</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Don't lose this.</h2>
          <p className="text-stone-500 leading-relaxed">
            Your report exists on this device right now. Enter your email and we'll make sure you can access it from anywhere — and notify you when your 12 add-on modules are ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full bg-accent text-white font-semibold rounded-xl py-3 hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving...' : 'Save My Report'}
          </button>
        </form>

        <button
          onClick={onSkip}
          className="w-full mt-3 text-stone-400 hover:text-stone-600 text-sm py-2 transition-colors"
        >
          Skip for now — I understand I may lose access if I clear my browser
        </button>
      </div>
    </div>
  );
}
