import type { FC } from "react";
import type { LeaderboardEntry } from "./LiveLeaderboard";

type PodiumProps = {
  entries: LeaderboardEntry[];
};

const columnStyles = [
  "h-52 bg-gradient-to-t from-amber-500/20 via-amber-400/30 to-amber-200/40",
  "h-44 bg-gradient-to-t from-slate-500/20 via-slate-400/30 to-slate-200/40",
  "h-40 bg-gradient-to-t from-rose-500/20 via-rose-400/30 to-rose-200/40"
];

const Podium: FC<PodiumProps> = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }

  const [first, second, third] = entries;

  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/10">
      <header className="text-center">
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
          Podium final
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-white">Bravo aux champions de la session !</h2>
      </header>
      <div className="grid grid-cols-3 items-end gap-4 text-center text-white">
        {second ? (
          <div className="flex flex-col items-center gap-4">
            <div className={`flex w-full max-w-[180px] flex-col justify-end rounded-3xl border border-white/10 ${columnStyles[1]} p-4`}> 
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">#2</span>
              <span className="text-xl font-semibold text-white">{second.name}</span>
              <span className="text-sm text-slate-200">{second.score} pts</span>
            </div>
          </div>
        ) : (
          <div />
        )}
        {first ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-8 w-8">
                <path d="m9 17 3-10 3 10" />
                <path d="M4 17h16" />
              </svg>
            </div>
            <div className={`flex w-full max-w-[200px] flex-col justify-end rounded-3xl border border-primary/50 bg-gradient-to-t from-primary/20 via-primary/20 to-primary/60 p-5 shadow-lg shadow-primary/30`}>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">#1</span>
              <span className="text-2xl font-semibold text-white">{first.name}</span>
              <span className="text-base text-white/90">{first.score} pts</span>
            </div>
          </div>
        ) : null}
        {third ? (
          <div className="flex flex-col items-center gap-4">
            <div className={`flex w-full max-w-[160px] flex-col justify-end rounded-3xl border border-white/10 ${columnStyles[2]} p-4`}>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">#3</span>
              <span className="text-xl font-semibold text-white">{third.name}</span>
              <span className="text-sm text-slate-200">{third.score} pts</span>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>
    </section>
  );
};

export default Podium;
