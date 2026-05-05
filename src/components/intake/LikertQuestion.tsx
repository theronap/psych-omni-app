'use client';

import { Question } from '@/types';
import clsx from 'clsx';

interface Props {
  question: Question;
  value: number | undefined;
  onChange: (val: number) => void;
}

export function LikertQuestion({ question, value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-white leading-relaxed">{question.text}</p>
        {question.subtext && (
          <p className="text-neutral-400 mt-2 text-sm">{question.subtext}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={clsx(
                'flex-1 h-12 rounded-lg border text-sm font-medium transition-all',
                value === n
                  ? 'bg-white text-black border-white'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-neutral-500 px-1">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </div>
    </div>
  );
}
