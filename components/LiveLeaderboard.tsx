import type { FC } from "react";

type LeaderboardEntry = {
  id: string;
  name: string;
  score: number;
  streak?: number;
  isYou?: boolean;
};

type LiveLeaderboardProps = {
  entries: LeaderboardEntry[];
  highlightCount?: number;
  title?: string;
};

const highlightClasses = [
  "from-amber-400/80 via-orange-500/70 to-rose-500/80",
  "from-emerald-400/80 via-teal-500/70 to-sky-500/80",
  "from-indigo-400/80 via-blue-500/70 to-violet-500/80"
];

const LiveLeaderboard: FC<LiveLeaderboardProps> = ({ entries, highlightCount = 3, title = "Classement en direct" }) => {
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          temps réel
        </span>
      </div>
      <ol className="flex flex-col gap-3">
        {sortedEntries.map((entry, index) => {
          const isHighlighted = index < highlightCount;
          const gradient = highlightClasses[index] ?? "from-slate-700 to-slate-900";
          const baseClasses = entry.isYou
            ? "border-primary/80 bg-primary/10"
            : "border-white/10 bg-white/5";

          return (
            <li
              key={entry.id}
              className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm shadow-lg shadow-black/10 transition ${baseClasses}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-semibold text-white shadow-lg shadow-primary/20 ${
                    isHighlighted ? gradient : "from-slate-600/80 via-slate-700/70 to-slate-800/80"
                  }`}
                  aria-hidden="true"
                >
                  #{index + 1}
                </span>
                <div className="flex flex-col">
                  <span className={`font-semibold ${entry.isYou ? "text-primary" : "text-white"}`}>{entry.name}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {entry.isYou ? "Vous" : entry.streak ? `${entry.streak} réponses correctes` : "Participant"}
                  </span>
                </div>
              </div>
              <span className="text-base font-semibold text-white">{entry.score} pts</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export type { LeaderboardEntry };
export default LiveLeaderboard;
