"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LiveLeaderboard, { type LeaderboardEntry } from "@/components/LiveLeaderboard";
import Podium from "@/components/Podium";
import { quizzes } from "@/data/quizzes";

const QUESTION_DURATION = 30;
const BASE_POINTS = 100;
const SPEED_FACTOR = 2;

type FeedbackState = "correct" | "incorrect" | "timeout" | null;

function formatTime(seconds: number) {
  return seconds.toString().padStart(2, "0");
}

export default function ParticipantSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quiz");
  const quiz = useMemo(() => quizzes.find((item) => item.id === quizId), [quizId]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);

  const currentQuestion = quiz?.questions[questionIndex];

  const correctOptionIds = useMemo(() => {
    if (!currentQuestion) return [] as string[];
    return currentQuestion.options.filter((option) => option.isCorrect).map((option) => option.id).sort();
  }, [currentQuestion]);

  const initialLeaderboard = useMemo<LeaderboardEntry[]>(
    () => [
      { id: "you", name: "Vous", score: 0, streak: 0, isYou: true },
      { id: "maya", name: "Maya T.", score: 140, streak: 2 },
      { id: "alex", name: "Alex R.", score: 120, streak: 1 },
      { id: "sven", name: "Sven L.", score: 100, streak: 1 },
      { id: "hana", name: "Hana P.", score: 80, streak: 0 }
    ],
    [quiz?.id]
  );

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  const finalizeAnswer = useCallback(
    (selection: string[], mode: "manual" | "timeout") => {
      if (!quiz || !currentQuestion) {
        return;
      }

      const normalizedSelection = [...selection].sort();
      const isCorrect =
        normalizedSelection.length === correctOptionIds.length &&
        normalizedSelection.every((value, index) => value === correctOptionIds[index]);

      const computedPoints = mode === "timeout" ? 0 : isCorrect ? BASE_POINTS + timeLeft * SPEED_FACTOR : 0;

      setSelectedOptionIds(normalizedSelection);
      setFeedback(mode === "timeout" ? "timeout" : isCorrect ? "correct" : "incorrect");
      setIsLocked(true);
      setLastPoints(computedPoints);

      setLeaderboard((entries) =>
        entries.map((entry) => {
          if (!entry.isYou) {
            return entry;
          }
          return {
            ...entry,
            score: entry.score + computedPoints,
            streak: isCorrect ? (entry.streak ?? 0) + 1 : 0
          };
        })
      );
    },
    [correctOptionIds, currentQuestion, quiz, timeLeft]
  );

  useEffect(() => {
    setLeaderboard(initialLeaderboard);
    setQuestionIndex(0);
    setTimeLeft(QUESTION_DURATION);
    setSelectedOptionIds([]);
    setFeedback(null);
    setIsLocked(false);
    setShowResults(false);
    setLastPoints(0);
  }, [initialLeaderboard]);

  useEffect(() => {
    if (!quiz) {
      return;
    }

    if (!currentQuestion) {
      setShowResults(true);
    }
  }, [currentQuestion, quiz]);

  useEffect(() => {
    if (!quiz || showResults || isLocked || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [quiz, showResults, isLocked, timeLeft]);

  useEffect(() => {
    if (!quiz || showResults || isLocked) {
      return;
    }

    const interval = window.setInterval(() => {
      setLeaderboard((entries) =>
        entries.map((entry) => {
          if (entry.isYou) {
            return entry;
          }
          const shouldGain = Math.random() > 0.55;
          if (!shouldGain) {
            return entry;
          }
          const bonus = 20 + Math.round(Math.random() * 60);
          return { ...entry, score: entry.score + bonus, streak: (entry.streak ?? 0) + 1 };
        })
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, [quiz, showResults, isLocked, questionIndex]);

  useEffect(() => {
    if (!quiz || showResults || isLocked || timeLeft > 0) {
      return;
    }

    finalizeAnswer([], "timeout");
  }, [quiz, showResults, isLocked, timeLeft, finalizeAnswer]);

  const handleOptionToggle = (optionId: string) => {
    if (!currentQuestion || isLocked) {
      return;
    }

    if (currentQuestion.type === "multiple") {
      setSelectedOptionIds((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        }
        return [...prev, optionId];
      });
      return;
    }

    finalizeAnswer([optionId], "manual");
  };

  const handleSubmitMultiple = () => {
    if (!currentQuestion || isLocked || currentQuestion.type !== "multiple") {
      return;
    }

    finalizeAnswer(selectedOptionIds, "manual");
  };

  const handleNextStep = () => {
    if (!quiz) {
      return;
    }

    const isLastQuestion = questionIndex >= quiz.questions.length - 1;

    if (isLastQuestion) {
      setShowResults(true);
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 120);
      return;
    }

    setQuestionIndex((value) => value + 1);
    setTimeLeft(QUESTION_DURATION);
    setSelectedOptionIds([]);
    setFeedback(null);
    setIsLocked(false);
    setLastPoints(0);
  };

  if (!quiz) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl font-semibold text-white">Session introuvable</h1>
        <p className="text-slate-300">
          Impossible de récupérer ce quiz. Vérifiez le lien ou le code PIN, puis revenez à la page de participation.
        </p>
        <button
          type="button"
          onClick={() => router.push("/participate")}
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-primary/90"
        >
          Retour à la participation
        </button>
      </main>
    );
  }

  if (showResults) {
    const podiumEntries = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 3);

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-3 text-center">
          <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
            Résultats
          </span>
          <h1 className="text-4xl font-semibold text-white">Podium de la session {quiz.title}</h1>
          <p className="text-base text-slate-300">
            Félicitations aux participants ! Classement final basé sur la précision et la rapidité des réponses.
          </p>
        </header>
        <Podium entries={podiumEntries} />
        <LiveLeaderboard entries={leaderboard} title="Classement final" />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-primary hover:bg-primary/10"
          >
            Retourner à l&apos;accueil
          </button>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  const requiresSubmission = currentQuestion.type === "multiple";
  const isSelected = (optionId: string) => selectedOptionIds.includes(optionId);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">
          Session en direct
        </span>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-white">{quiz.title}</h1>
            <p className="text-sm text-slate-300">Question {questionIndex + 1} sur {quiz.questions.length}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Temps restant</span>
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? "text-rose-300" : "text-white"}`}>{formatTime(timeLeft)}s</span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-primary/10">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-light">Question en direct</span>
            <h2 className="text-2xl font-semibold text-white">{currentQuestion.prompt}</h2>
          </div>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => {
              const isOptionSelected = isSelected(option.id);
              const isCorrectOption = feedback && correctOptionIds.includes(option.id);
              const isIncorrectSelection = feedback && isOptionSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleOptionToggle(option.id)}
                  disabled={isLocked && !requiresSubmission}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left text-base transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    isOptionSelected
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-primary/50 hover:bg-primary/10"
                  } ${
                    isCorrectOption ? "ring-2 ring-emerald-400/80" : ""
                  } ${
                    isIncorrectSelection ? "border-rose-400/80 bg-rose-500/10" : ""
                  }`}
                >
                  <span className="flex-1 text-left">{option.text}</span>
                  {isOptionSelected ? (
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-primary/20 text-sm font-semibold text-primary">
                      ✔
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {requiresSubmission ? (
            <button
              type="button"
              disabled={isLocked || selectedOptionIds.length === 0}
              onClick={handleSubmitMultiple}
              className={`mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                isLocked || selectedOptionIds.length === 0
                  ? "cursor-not-allowed bg-white/10 text-slate-400"
                  : "bg-primary text-slate-950 hover:bg-primary/90"
              }`}
            >
              Valider la sélection
            </button>
          ) : null}

          {feedback ? (
            <div
              className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-sm ${
                feedback === "correct"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                  : feedback === "timeout"
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-100"
              }`}
            >
              <p className="text-base font-semibold">
                {feedback === "correct"
                  ? "Bonne réponse !"
                  : feedback === "timeout"
                  ? "Temps écoulé"
                  : "Réponse incorrecte"}
              </p>
              <p className="text-sm text-white/80">
                {feedback === "correct"
                  ? `+${lastPoints} points ajoutés à votre score.`
                  : feedback === "timeout"
                  ? "Vous n'avez pas validé votre réponse dans le temps imparti."
                  : "Gardez le rythme, la prochaine question vous attend !"}
              </p>
              <p className="text-sm text-slate-200">Explication : {currentQuestion.explanation}</p>
            </div>
          ) : null}

          {isLocked ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-primary/90"
              >
                {questionIndex >= quiz.questions.length - 1 ? "Voir le podium" : "Question suivante"}
              </button>
            </div>
          ) : null}
        </section>

        <div className="flex flex-col gap-6">
          <LiveLeaderboard entries={leaderboard} />
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-xl shadow-primary/10">
            <h3 className="text-base font-semibold text-white">Règles de score</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>+{BASE_POINTS} points par bonne réponse.</li>
              <li>Bonus de rapidité : {SPEED_FACTOR} points par seconde restante.</li>
              <li>Pas de pénalité, mais soyez rapides pour rester en tête du classement.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
