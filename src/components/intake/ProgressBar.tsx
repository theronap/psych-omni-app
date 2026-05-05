'use client';

interface Props {
  current: number;
  total: number;
  sectionTitle: string;
}

export function ProgressBar({ current, total, sectionTitle }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-stone-400 mb-2">
        <span>{sectionTitle}</span>
        <span>{current} of {total}</span>
      </div>
      <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
