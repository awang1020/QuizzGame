"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

const iconStyles = [
  "from-sky-400/80 via-blue-500/70 to-indigo-500/80",
  "from-emerald-400/80 via-green-500/70 to-teal-500/80",
  "from-amber-400/80 via-orange-500/70 to-rose-500/80"
];

function DifficultyIcon({ index }: { index: number }) {
  const gradient = iconStyles[index % iconStyles.length];

  return (
    <span
      aria-hidden="true"
      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="m9 18 6-6-6-6" />
        <path d="M5 5h4v4H5z" />
      </svg>
    </span>
  );
}

function formatDuration(seconds?: number) {
  if (!seconds) return "Self-paced";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export default function QuizSelection() {
  const router = useRouter();
  const { quizzes, startQuiz, currentQuiz, hasOngoingSession, isQuizComplete, hasStarted } = useQuiz();

  const orderedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => a.level - b.level);
  }, [quizzes]);

  if (orderedQuizzes.length === 0) {
    return null;
  }

  const currentIndex = useMemo(() => {
    if (!currentQuiz) return -1;
    return orderedQuizzes.findIndex((quiz) => quiz.id === currentQuiz.id);
  }, [currentQuiz, orderedQuizzes]);

  const recommendedQuiz = useMemo(() => {
    if (orderedQuizzes.length === 0) return undefined;
    if (!hasStarted) {
      return orderedQuizzes[0];
    }

    const fallbackQuiz = orderedQuizzes[Math.max(0, currentIndex)] ?? orderedQuizzes[0];

    if (hasOngoingSession) {
      return currentQuiz ?? fallbackQuiz;
    }

    if (isQuizComplete) {
      const nextQuiz = orderedQuizzes[Math.min(currentIndex + 1, orderedQuizzes.length - 1)];
      return nextQuiz ?? fallbackQuiz;
    }

    return fallbackQuiz;
  }, [currentIndex, currentQuiz, hasOngoingSession, hasStarted, isQuizComplete, orderedQuizzes]);

  const completedLevels = useMemo(() => {
    if (!hasStarted) return 0;
    if (currentIndex < 0) return 0;
    if (hasOngoingSession) return currentIndex;
    return Math.min(orderedQuizzes.length, currentIndex + (isQuizComplete ? 1 : 0));
  }, [currentIndex, hasOngoingSession, hasStarted, isQuizComplete, orderedQuizzes.length]);

  const progressPercentage = Math.round((completedLevels / orderedQuizzes.length) * 100);

  const handleStart = (quizId: string) => {
    startQuiz(quizId);
    router.push("/quiz");
  };

  return (
    <section id="quiz-catalog" className="w-full px-6 pb-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light md:self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Choose your quiz level
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Training designed for every stage</h2>
            <p className="text-base text-slate-300 sm:text-lg">
              Begin with the fundamentals, then advance through governance, workloads, and enterprise rollouts. Each level builds
              on the last with adaptive feedback and rich analytics.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200 shadow-lg shadow-primary/10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <svg viewBox="0 0 48 48" className="h-full w-full text-primary" aria-hidden="true">
                  <circle cx="24" cy="24" r="20" className="fill-primary/20" />
                  <path d="M16 28.5 21.5 33l11-17" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Level progress</p>
                <p>{completedLevels} of {orderedQuizzes.length} levels completed</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="presentation">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs text-slate-400 md:self-end">{progressPercentage}% complete</span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3" role="list">
          {orderedQuizzes.map((quiz, index) => {
            const durationLabel = formatDuration(quiz.duration);
            const questionCount = quiz.questions.length;
            const isRecommended = recommendedQuiz?.id === quiz.id;
            const isActive = hasOngoingSession && currentQuiz?.id === quiz.id;
            const isComplete = completedLevels >= quiz.level;

            return (
              <article
                key={quiz.id}
                role="listitem"
                className={`group flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:bg-white/10 focus-within:-translate-y-1 focus-within:border-primary/60 focus-within:bg-white/10 ${
                  isActive ? "ring-2 ring-primary/70" : ""
                }`}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <DifficultyIcon index={index} />
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Level {quiz.level}
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-100">
                          {quiz.difficulty}
                        </span>
                      </span>
                      {isRecommended ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
                          Recommended for you
                        </span>
                      ) : null}
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                          In progress
                        </span>
                      ) : null}
                      {isComplete && !isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                          Completed
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{quiz.title}</h3>
                    <p className="text-sm text-slate-300">{quiz.description}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Focus area</p>
                    <p className="mt-2 text-sm text-slate-200">{quiz.focusArea}</p>
                    <p className="mt-3 text-xs text-slate-400">{quiz.recommendedFor}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <dl className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M8 8h8" />
                        <path d="M8 12h4" />
                      </svg>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Questions</dt>
                        <dd className="font-semibold text-white">{questionCount}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 15" />
                      </svg>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Estimated time</dt>
                        <dd className="font-semibold text-white">{durationLabel}</dd>
                      </div>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => handleStart(quiz.id)}
                    aria-label={`Start the ${quiz.title} quiz`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {isActive ? "Resume quiz" : "Start quiz"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
