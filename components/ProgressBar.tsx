"use client";

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
        <span>Question {current} of {total}</span>
        <span>{percentage}% complete</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
