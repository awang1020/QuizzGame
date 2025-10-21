"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

export default function LandingHero() {
  const router = useRouter();
  const { quizzes, startQuiz, hasOngoingSession, isRestored } = useQuiz();
  const featuredQuiz = quizzes[0];
  const totalQuestionCount = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);

  if (!featuredQuiz) {
    return null;
  }

  const handleStart = () => {
    startQuiz(featuredQuiz.id);
    router.push("/quiz");
  };

  const handleContinue = () => {
    router.push("/quiz");
  };

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 text-center md:text-left">
      <div className="flex flex-col gap-6">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary md:mx-0">
          Master new skills faster
        </span>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Interactive quizzes crafted for modern learning teams
        </h1>
        <p className="text-lg text-slate-300 sm:text-xl">
          QuizzyQuizz helps you launch engaging assessments with instant feedback, rich analytics,
          and effortless authoring—then lets learners choose the challenge that fits their goals.
        </p>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          {isRestored && hasOngoingSession ? (
            <>
              <button
                onClick={handleContinue}
                className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 md:w-auto"
              >
                Continue where you left off
              </button>
              <button
                onClick={handleStart}
                className="w-full rounded-lg border border-white/10 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-primary hover:text-white md:w-auto"
              >
                Start over
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark md:w-auto"
            >
              Start the featured quiz
            </button>
          )}
          <Link
            href="#how-it-works"
            className="text-base font-semibold text-slate-200 transition hover:text-white"
          >
            Learn how it works →
          </Link>
        </div>
        <p className="text-sm text-slate-400">
          Prefer a different challenge? Explore the quiz catalog below and jump straight into the topic that matters most.
        </p>
      </div>
      <div
        id="how-it-works"
        className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-primary/5 backdrop-blur"
      >
        <h2 className="text-2xl font-semibold text-white">What&apos;s inside these quizzes?</h2>
        <ul className="grid gap-3 text-left text-slate-300">
          <li>
            <strong className="text-white">{totalQuestionCount} curated questions</strong> spanning multiple skill levels
            and specialties.
          </li>
          <li>
            Adaptive feedback after every answer so learners know exactly what to improve next.
          </li>
          <li>
            Built-in progress tracking and a beautiful results summary.
          </li>
        </ul>
      </div>
    </section>
  );
}
