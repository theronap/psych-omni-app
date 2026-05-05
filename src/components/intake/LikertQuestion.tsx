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
        <p className="text-xl text-stone-900 leading-relaxed">{question.text}</p>
        {question.subtext && (
          <p className="text-stone-500 mt-2 text-sm">{question.subtext}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={clsx(
                'flex-1 h-11 rounded-full border text-sm font-medium transition-all',
                value === n
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-900 bg-white'
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-stone-400 px-1">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      </div>
    </div>
  );
}
