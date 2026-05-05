'use client';

import { Question } from '@/types';
import clsx from 'clsx';

interface Props {
  question: Question;
  value: string | undefined;
  onChange: (val: string) => void;
}

export function ChoiceQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <p className="text-xl text-stone-900 leading-relaxed">{question.text}</p>
      <div className="space-y-3">
        {question.options?.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'w-full text-left p-4 rounded-xl border transition-all text-sm leading-relaxed',
              value === opt.value
                ? 'border-amber-400 bg-amber-50 text-stone-900'
                : 'border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900 bg-white'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
