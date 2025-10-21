"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

const iconGradients = [
  "from-sky-400/80 via-blue-500/70 to-indigo-500/80",
  "from-emerald-400/80 via-green-500/70 to-teal-500/80",
  "from-amber-400/80 via-orange-500/70 to-rose-500/80",
  "from-purple-400/80 via-violet-500/70 to-fuchsia-500/80"
];

function QuizGlyph({ index }: { index: number }) {
  const gradient = iconGradients[index % iconGradients.length];

  return (
    <span
      aria-hidden="true"
      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/20`}
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
        <path d="M6 3h12a2 2 0 0 1 2 2v12l-4-3-4 3-4-3-4 3V5a2 2 0 0 1 2-2z" />
        <path d="M10 9h4" />
        <path d="M10 13h2" />
      </svg>
    </span>
  );
}

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `~${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export default function QuizSelection() {
  const router = useRouter();
  const { quizzes, startQuiz } = useQuiz();

  const quizMeta = useMemo(() => {
    return quizzes.map((quiz, index) => ({
      quiz,
      index,
      durationLabel: formatDuration(quiz.duration),
      questionCount: quiz.questions.length
    }));
  }, [quizzes]);

  if (quizMeta.length === 0) {
    return null;
  }

  const handleStart = (quizId: string) => {
    startQuiz(quizId);
    router.push("/quiz");
  };

  return (
    <section className="w-full px-6 pb-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-3 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-light">Your learning path</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Choose your quiz level</h2>
          <p className="text-base text-slate-300">
            Pick the quiz that matches your goals and jump in. Each assessment comes with instant feedback and a detailed
            results summary when you finish.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {quizMeta.map(({ quiz, index, durationLabel, questionCount }) => (
            <article
              key={quiz.id}
              className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/5 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:bg-white/10 focus-within:-translate-y-1 focus-within:border-primary/60 focus-within:bg-white/10"
            >
              <div className="flex flex-col gap-5">
                <QuizGlyph index={index} />
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-white">{quiz.title}</h3>
                  <p className="text-sm text-slate-300">{quiz.description}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <dl className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-primary/80" aria-hidden="true" />
                    <dt className="font-semibold uppercase tracking-wide text-slate-200">Questions</dt>
                    <dd className="font-medium text-slate-100">{questionCount}</dd>
                  </div>
                  {durationLabel ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-primary/80" aria-hidden="true" />
                      <dt className="font-semibold uppercase tracking-wide text-slate-200">Time</dt>
                      <dd className="font-medium text-slate-100">{durationLabel}</dd>
                    </div>
                  ) : null}
                </dl>
                <button
                  type="button"
                  onClick={() => handleStart(quiz.id)}
                  aria-label={`Start the ${quiz.title} quiz`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition group-hover:bg-primary-dark hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Start quiz
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
          ))}
        </div>
      </div>
    </section>
  );
}
