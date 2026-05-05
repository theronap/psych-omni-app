'use client';

import { Question } from '@/types';

interface Props {
  question: Question;
  value: string | undefined;
  onChange: (val: string) => void;
}

export function OpenEndedQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-white leading-relaxed">{question.text}</p>
        {question.subtext && (
          <p className="text-stone-400 text-sm mt-2">{question.subtext}</p>
        )}
      </div>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Write here..."
        rows={8}
        className="w-full bg-stone-900 border border-stone-700 rounded-xl p-4 text-stone-50 placeholder-stone-600 focus:outline-none focus:border-amber-400 resize-none text-sm leading-relaxed"
      />
      <p className="text-stone-600 text-xs">{(value || '').length} characters</p>
    </div>
  );
}
