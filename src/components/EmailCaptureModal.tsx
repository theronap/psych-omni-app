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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Save Your Report</div>
          <h2 className="text-2xl font-bold text-white mb-3">Don't lose this.</h2>
          <p className="text-neutral-400 leading-relaxed">
            Your report exists on this device right now. Enter your email and we'll make sure you can access it from anywhere — and notify you when your 12 add-on modules are ready.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            autoFocus
          />
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving...' : 'Save My Report'}
          </button>
        </form>

        <button
          onClick={onSkip}
          className="w-full mt-3 text-neutral-500 hover:text-neutral-300 text-sm py-2 transition-colors"
        >
          Skip for now — I understand I may lose access if I clear my browser
        </button>
      </div>
    </div>
  );
}
