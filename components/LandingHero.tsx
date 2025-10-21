"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

export default function LandingHero() {
  const router = useRouter();
  const {
    quizzes,
    startQuiz,
    hasOngoingSession,
    hasStarted,
    isQuizComplete,
    currentQuiz
  } = useQuiz();

  const orderedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => (a.level ?? Number.MAX_SAFE_INTEGER) - (b.level ?? Number.MAX_SAFE_INTEGER));
  }, [quizzes]);

  if (orderedQuizzes.length === 0) {
    return null;
  }

  const totalQuestionCount = useMemo(() => {
    return orderedQuizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
  }, [orderedQuizzes]);

  const totalDurationMinutes = useMemo(() => {
    const totalSeconds = orderedQuizzes.reduce((sum, quiz) => sum + (quiz.duration ?? 0), 0);
    if (totalSeconds === 0) return 0;
    return Math.round(totalSeconds / 60);
  }, [orderedQuizzes]);

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

  const progressPercentage = orderedQuizzes.length === 0 ? 0 : Math.round((completedLevels / orderedQuizzes.length) * 100);

  const handleStart = (quizId: string) => {
    startQuiz(quizId);
    router.push("/quiz");
  };

  const handlePrimaryAction = () => {
    if (hasOngoingSession) {
      router.push("/quiz");
      return;
    }

    if (recommendedQuiz) {
      handleStart(recommendedQuiz.id);
    }
  };

  const heroSubtitle = recommendedQuiz
    ? `Choisissez un point de départ, progressez à votre rythme et créez vos propres sessions pour engager votre audience.`
    : "Concevez et lancez des quiz modernes en quelques clics pour dynamiser vos formations.";

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-96 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20 md:py-24">
        <div className="grid items-center gap-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col gap-8">
            <span className="inline-flex max-w-max items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/90 shadow-sm shadow-primary/30">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Fabric learning studio
            </span>
            <div className="space-y-4 text-balance">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Master Microsoft Fabric with guided quiz levels
              </h1>
              <p className="text-lg leading-relaxed text-slate-200 sm:text-xl">{heroSubtitle}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {hasOngoingSession ? "Continue training" : `Start ${recommendedQuiz?.title ?? "your training"}`}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <Link
                href="#quiz-catalog"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-slate-100 transition hover:border-primary/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Browse all quizzes
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-6 py-3 text-base font-semibold text-primary-light transition hover:border-primary hover:bg-primary/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Construire un quiz
              </Link>
            </div>
            <dl className="grid gap-4 text-left text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-400">Question bank</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{totalQuestionCount} questions</dd>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-400">Learning path</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{orderedQuizzes.length} levels</dd>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-400">Total prep time</dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  {totalDurationMinutes ? `${totalDurationMinutes} min` : "Flexible"}
                </dd>
              </div>
            </dl>
          </div>
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/30 to-slate-800/40 p-8 shadow-2xl shadow-primary/20 backdrop-blur">
            <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-6">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Your Fabric journey</h2>
                  <p className="text-sm text-slate-300">Track your momentum across each difficulty tier.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                  {progressPercentage}% complete
                </span>
              </header>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="presentation">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden="true"
                />
              </div>
              <ol className="space-y-4" aria-label="Microsoft Fabric quiz levels">
                {orderedQuizzes.map((quiz, index) => {
                  const displayLevel = quiz.level ?? index + 1;
                  const isComplete = completedLevels >= displayLevel;
                  const isActive = hasOngoingSession && currentQuiz?.id === quiz.id;
                  const isRecommended = recommendedQuiz?.id === quiz.id && !isActive && !isComplete;
                  return (
                    <li
                      key={quiz.id}
                      className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
                    >
                      <span
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          isComplete
                            ? "bg-emerald-500/20 text-emerald-200"
                            : isActive
                              ? "bg-primary/20 text-primary"
                              : isRecommended
                                ? "bg-amber-400/20 text-amber-200"
                                : "bg-slate-700/60 text-slate-300"
                        }`}
                        aria-hidden="true"
                      >
                        {displayLevel}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">
                          {quiz.title}
                          <span className="ml-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-200">
                            {quiz.difficulty ?? "custom"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-300">{quiz.focusArea ?? "Quiz personnalisé"}</p>
                        {isRecommended ? (
                          <p className="text-xs font-medium text-amber-200">Recommended next</p>
                        ) : null}
                        {isActive ? (
                          <p className="text-xs font-medium text-primary">In progress</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="text-xs leading-relaxed text-slate-400">
                QuizzyQuizz est une plateforme indépendante inspirée de l&apos;expérience Kahoot. Enchaînez les quiz existants ou
                créez vos propres scénarios pour former, animer ou évaluer vos équipes.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
