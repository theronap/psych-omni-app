'use client';

import { Section, Answers } from '@/types';
import { LikertQuestion } from './LikertQuestion';
import { ChoiceQuestion } from './ChoiceQuestion';
import { RankingQuestion } from './RankingQuestion';
import { OpenEndedQuestion } from './OpenEndedQuestion';

interface Props {
  section: Section;
  answers: Answers;
  onAnswer: (questionId: string, value: string | number | string[]) => void;
}

export function SectionView({ section, answers, onAnswer }: Props) {
  return (
    <div className="space-y-16">
      {section.questions.map(q => (
        <div key={q.id}>
          {q.type === 'likert' && (
            <LikertQuestion
              question={q}
              value={answers[q.id] as number | undefined}
              onChange={val => onAnswer(q.id, val)}
            />
          )}
          {q.type === 'choice' && (
            <ChoiceQuestion
              question={q}
              value={answers[q.id] as string | undefined}
              onChange={val => onAnswer(q.id, val)}
            />
          )}
          {q.type === 'ranking' && (
            <RankingQuestion
              question={q}
              value={answers[q.id] as string[] | undefined}
              onChange={val => onAnswer(q.id, val)}
            />
          )}
          {q.type === 'text' && (
            <OpenEndedQuestion
              question={q}
              value={answers[q.id] as string | undefined}
              onChange={val => onAnswer(q.id, val)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
