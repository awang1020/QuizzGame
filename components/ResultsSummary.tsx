"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { useUser } from "@/context/UserContext";

export default function ResultsSummary() {
  const router = useRouter();
  const { currentQuiz, responses, score, totalQuestions, resetQuiz, startQuiz } = useQuiz();
  const { recordQuizCompletion } = useUser();
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    if (!currentQuiz) return;
    if (hasRecordedRef.current) return;

    recordQuizCompletion(currentQuiz.id, score, totalQuestions);
    hasRecordedRef.current = true;
  }, [currentQuiz, recordQuizCompletion, score, totalQuestions]);

  const handleRetry = () => {
    resetQuiz();
    startQuiz(currentQuiz.id);
    router.push("/quiz");
  };

  const handleBackHome = () => {
    resetQuiz();
    router.push("/");
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/40 p-10 text-center shadow-2xl shadow-primary/20">
        <p className="text-sm uppercase tracking-wide text-primary-light">You completed</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{currentQuiz.title}</h1>
        <p className="mt-4 text-lg text-slate-300">{currentQuiz.description}</p>
        <div className="mt-8 grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Final score</span>
          <p className="text-5xl font-extrabold text-primary">
            {score} / {totalQuestions}
          </p>
          <p className="text-sm text-slate-400">
            That&apos;s {(totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100))}% accuracy.
          </p>
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleRetry}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            Retry quiz
          </button>
          <button
            onClick={handleBackHome}
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white"
          >
            Back to landing
          </button>
        </div>
      </div>
      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold text-white">Question breakdown</h2>
        <div className="grid gap-4">
          {currentQuiz.questions.map((question) => {
            const response = responses[question.id];
            const isCorrect = response?.isCorrect;
            return (
              <article
                key={question.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">{question.prompt}</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      isCorrect ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                  {question.options.map((option) => {
                    const isSelected = response?.selectedOptionIds.includes(option.id);
                    const isCorrectOption = option.isCorrect;
                    return (
                      <li
                        key={option.id}
                        className={`rounded-lg border px-4 py-3 ${
                          isCorrectOption
                            ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-100"
                            : isSelected
                              ? "border-rose-400/50 bg-rose-400/10 text-rose-100"
                              : "border-white/10"
                        }`}
                      >
                        {option.text}
                        {isCorrectOption && <span className="ml-2 text-xs uppercase text-emerald-200">Correct</span>}
                        {isSelected && !isCorrectOption && (
                          <span className="ml-2 text-xs uppercase text-rose-200">Your choice</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-sm text-slate-400">{question.explanation}</p>
              </article>
            );
          })}
        </div>
        <p className="text-sm text-slate-400">
          Looking to build more quizzes?{" "}
          <Link href="/" className="font-semibold text-primary-light">
            Duplicate this quiz structure
          </Link>{" "}
          and add new data in <code className="font-mono text-xs">data/quizzes.ts</code>.
        </p>
      </section>
    </div>
  );
}
