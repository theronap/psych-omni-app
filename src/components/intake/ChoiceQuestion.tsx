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
                ? 'border-white bg-white/10 text-white'
                : 'border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
