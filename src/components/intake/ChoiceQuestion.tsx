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
      <p className="text-xl text-white leading-relaxed">{question.text}</p>
      <div className="space-y-3">
        {question.options?.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              'w-full text-left p-4 rounded-xl border transition-all text-sm leading-relaxed',
              value === opt.value
                ? 'border-amber-400 bg-amber-400/10 text-amber-100'
                : 'border-stone-700 text-stone-300 hover:border-stone-500 hover:text-stone-100'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
