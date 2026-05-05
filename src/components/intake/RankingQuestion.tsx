'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/types';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  question: Question;
  value: string[] | undefined;
  onChange: (val: string[]) => void;
}

export function RankingQuestion({ question, value, onChange }: Props) {
  const [items, setItems] = useState<string[]>(value || question.items || []);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    if (!value) onChange(items);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragStart = (index: number) => setDragging(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOver(index);
  };

  const handleDrop = (index: number) => {
    if (dragging === null) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(index, 0, moved);
    setItems(next);
    onChange(next);
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-white leading-relaxed">{question.text}</p>
        <p className="text-neutral-400 text-sm mt-2">Drag to reorder — most important at the top.</p>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => { setDragging(null); setDragOver(null); }}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all select-none',
              dragOver === i ? 'border-white bg-white/10' : 'border-neutral-700 bg-neutral-900'
            )}
          >
            <span className="text-neutral-500 text-sm font-mono w-5 shrink-0">{i + 1}</span>
            <GripVertical size={16} className="text-neutral-600 shrink-0" />
            <span className="text-neutral-200 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
