"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useQuiz } from "@/context/QuizContext";

export default function ResultsSummary() {
  const router = useRouter();
  const {
    currentQuiz,
    responses,
    score,
    totalQuestions,
    totalAvailablePoints,
    resetQuiz,
    startQuiz,
    shareSettings,
    setQuizVisibility,
    getShareLink,
    sessionDurationSeconds,
    averageQuestionTimeSeconds,
    isQuizComplete
  } = useQuiz();
  const [copied, setCopied] = useState(false);

  const answeredQuestions = useMemo(() => Object.keys(responses).length, [responses]);
  const shareConfig = shareSettings[currentQuiz.id] ?? { isPublic: false };
  const isPublic = shareConfig.isPublic;
  const shareLink = getShareLink(currentQuiz.id);

  const handleRetry = () => {
    resetQuiz();
    const started = startQuiz(currentQuiz.id);
    if (started) {
      router.push("/quiz");
    }
  };

  const handleBackHome = () => {
    resetQuiz();
    router.push("/");
  };

  const handleToggleVisibility = () => {
    setQuizVisibility(currentQuiz.id, !isPublic);
    if (isPublic) {
      setCopied(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = shareLink;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy quiz share link", error);
    }
  };

  if (!isQuizComplete || answeredQuestions === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-white">Finish the quiz to view your results</h1>
        <p className="text-sm text-slate-300">
          Answer each question to unlock the full summary, explanations, and analytics for your attempt.
        </p>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
        >
          Return to quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/40 p-10 text-center shadow-2xl shadow-primary/20">
        <p className="text-sm uppercase tracking-wide text-primary-light">You completed</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{currentQuiz.title}</h1>
        <p className="mt-4 text-lg text-slate-300">{currentQuiz.description}</p>
        <div className="mt-8 grid gap-3">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-300">Final score</span>
          <p className="text-5xl font-extrabold text-primary">
            {score} / {totalAvailablePoints}
          </p>
          <p className="text-sm text-slate-400">
            That&apos;s {totalAvailablePoints === 0 ? 0 : Math.round((score / totalAvailablePoints) * 100)}% accuracy across {totalQuestions}
            {" "}
            question{totalQuestions === 1 ? "" : "s"}.
          </p>
        </div>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Temps total</dt>
            <dd className="mt-2 text-lg font-semibold text-white">{formatSeconds(sessionDurationSeconds)}</dd>
            <p className="mt-1 text-xs text-slate-400">Durée cumulée pour l&apos;ensemble du quiz.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Temps moyen / question</dt>
            <dd className="mt-2 text-lg font-semibold text-white">{formatSeconds(averageQuestionTimeSeconds)}</dd>
            <p className="mt-1 text-xs text-slate-400">Basé sur le temps passé avant chaque soumission.</p>
          </div>
        </dl>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            Retry quiz
          </button>
          <button
            type="button"
            onClick={handleBackHome}
            className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white"
          >
            Back to landing
          </button>
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Share &amp; collaborate</p>
              <p className="text-sm text-slate-300">
                {isPublic ? "Public — share the link below to invite teammates" : "Private — only visible to you until you share it"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleVisibility}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                isPublic
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                  : "border-white/20 bg-white/10 text-slate-200"
              }`}
            >
              {isPublic ? "Public" : "Private"}
            </button>
          </div>
          {isPublic && shareLink ? (
            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="flex-1 truncate rounded-lg bg-slate-950/60 px-3 py-2 text-left text-xs font-medium text-slate-200" title={shareLink}>
                  {shareLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-primary/60 hover:text-white"
                >
                  {copied ? "Copied" : "Copy link"}
                  <span aria-hidden>🔗</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">Anyone with this link can access the quiz and track their own progress.</p>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-400">Flip the visibility to public to generate an invite link for collaborators.</p>
          )}
        </div>
      </div>

      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold text-white">Question breakdown</h2>
        <div className="grid gap-4">
          {currentQuiz.questions.map((question, index) => {
            const response = responses[question.id];
            const isCorrect = response?.isCorrect ?? false;
            return (
              <article key={question.id} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-black/10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Question {index + 1}</p>
                    <h3 className="text-lg font-semibold text-white">{question.prompt}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      isCorrect ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {response?.earnedPoints ?? 0} / {question.points ?? 1} pts
                  </span>
                  {response?.timedOut ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-rose-500/10 px-3 py-1 text-rose-200">
                      Timed out
                    </span>
                  ) : null}
                  {question.timeLimit ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      ⏱ {question.timeLimit}s limit
                    </span>
                  ) : null}
                </div>
                {question.type === "open" ? (
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Your answer</p>
                      <p className="mt-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-slate-200">
                        {response?.freeformText ? response.freeformText : "No response provided"}
                      </p>
                    </div>
                    {question.answer ? (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Expected answer</p>
                        <p className="mt-1 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-emerald-100">
                          {question.answer}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                    {question.options.map((option) => {
                      const isSelected = response?.selectedOptionIds.includes(option.id) ?? false;
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
                          {isCorrectOption ? <span className="ml-2 text-xs uppercase text-emerald-200">Correct</span> : null}
                          {isSelected && !isCorrectOption ? (
                            <span className="ml-2 text-xs uppercase text-rose-200">Your choice</span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <p className="mt-4 text-sm text-slate-400">{question.explanation}</p>
              </article>
            );
          })}
        </div>
        <p className="text-sm text-slate-400">
          Ready to design your own experience? Head to the{" "}
          <Link href="/studio" className="font-semibold text-primary-light">
            Quiz Studio
          </Link>{" "}
          to build, duplicate, and share interactive quizzes tailored to your audience.
        </p>
      </section>
      <AnalyticsDashboard />
    </div>
  );
}

function formatSeconds(value: number | null) {
  if (value === null || !Number.isFinite(value) || value < 0) {
    return "—";
  }
  if (value >= 60) {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);
    return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
  }
  return `${value.toFixed(1)} s`;
}
