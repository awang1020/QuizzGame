"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MediaResource, QuestionType } from "@/context/QuizContext";
import { useQuiz } from "@/context/QuizContext";

type Props = {
  questionId: string;
  onAnswered: (isLastQuestion: boolean) => void;
};

const TRUE_FALSE_FALLBACK = [
  { id: "true", text: "True", isCorrect: true },
  { id: "false", text: "False", isCorrect: false }
];

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes <= 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
};

export default function QuestionCard({ questionId, onAnswered }: Props) {
  const {
    currentQuiz,
    currentQuestionIndex,
    responses,
    submitAnswer,
    goToNextQuestion,
    totalQuestions,
    recordQuestionDuration
  } = useQuiz();
  const question = currentQuiz.questions.find((item) => item.id === questionId);
  const storedResponse = responses[questionId];
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(storedResponse?.selectedOptionIds ?? []);
  const [openAnswer, setOpenAnswer] = useState<string>(storedResponse?.freeformText ?? "");
  const [feedback, setFeedback] = useState<string | null>(storedResponse ? getFeedback(storedResponse) : null);
  const [remainingTime, setRemainingTime] = useState<number | null>(question?.timeLimit ?? null);
  const startTimestampRef = useRef<number | null>(null);

  const hasSubmitted = Boolean(storedResponse);

  const computeElapsedSeconds = useCallback(() => {
    if (question?.timeLimit && remainingTime !== null) {
      return Math.max(0, question.timeLimit - remainingTime);
    }
    if (startTimestampRef.current) {
      return Math.max(0, Math.round((Date.now() - startTimestampRef.current) / 1000));
    }
    return 0;
  }, [question?.timeLimit, remainingTime]);

  const handleTimeExpired = useCallback(() => {
    if (!question || hasSubmitted) return;
    const elapsedSeconds = computeElapsedSeconds();
    const response = submitAnswer(question.id, {
      selectedOptionIds: question.type === "open" ? [] : selectedOptionIds,
      freeformText: question.type === "open" ? openAnswer.trim() : undefined,
      timedOut: true,
      timeTakenSeconds: elapsedSeconds
    });
    if (response) {
      setFeedback("Time's up! Review the explanation and try again later.");
    }
  }, [computeElapsedSeconds, hasSubmitted, openAnswer, question, selectedOptionIds, submitAnswer]);

  useEffect(() => {
    setSelectedOptionIds(storedResponse?.selectedOptionIds ?? []);
    setOpenAnswer(storedResponse?.freeformText ?? "");
    setFeedback(storedResponse ? getFeedback(storedResponse) : null);
    setRemainingTime(question?.timeLimit ?? null);
    startTimestampRef.current = Date.now();
  }, [question?.timeLimit, questionId, storedResponse]);

  useEffect(() => {
    if (!question?.timeLimit || hasSubmitted) {
      return;
    }

    setRemainingTime(question.timeLimit);
    startTimestampRef.current = Date.now();

    const interval = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          window.clearInterval(interval);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [handleTimeExpired, hasSubmitted, question?.timeLimit]);

  if (!question) {
    return null;
  }

  const choiceOptions = useMemo(() => {
    if (question.type === "true_false" && question.options.length === 0) {
      return TRUE_FALSE_FALLBACK;
    }
    return question.options;
  }, [question]);

  const handleSelection = (optionId: string) => {
    if (isSingleChoice(question.type)) {
      setSelectedOptionIds([optionId]);
      return;
    }

    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  const handleSubmit = () => {
    if (question.type === "open") {
      if (!openAnswer.trim()) return;
      const elapsedSeconds = computeElapsedSeconds();
      const response = submitAnswer(question.id, {
        freeformText: openAnswer.trim(),
        timeTakenSeconds: elapsedSeconds
      });
      if (!response) return;
      setFeedback(getFeedback(response));
      return;
    }

    if (selectedOptionIds.length === 0) return;
    const elapsedSeconds = computeElapsedSeconds();
    const response = submitAnswer(question.id, { selectedOptionIds, timeTakenSeconds: elapsedSeconds });
    if (!response) return;
    setFeedback(getFeedback(response));
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    if (isLastQuestion) {
      onAnswered(true);
      return;
    }

    setSelectedOptionIds([]);
    setOpenAnswer("");
    setFeedback(null);
    goToNextQuestion();
    onAnswered(false);
  };

  const response = responses[question.id];

  return (
    <div className="grid gap-6 rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-xl shadow-primary/10">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">
              Question {currentQuestionIndex + 1}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{question.prompt}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-primary-light">
              {question.points ?? 1} point{(question.points ?? 1) > 1 ? "s" : ""}
            </span>
            {question.timeLimit ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200">
                ⏱ {remainingTime !== null ? formatTime(remainingTime) : formatTime(question.timeLimit)}
              </span>
            ) : null}
          </div>
        </div>
        {question.media && question.media.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.media.map((item) => (
              <MediaResourcePreview key={item.id} resource={item} />
            ))}
          </div>
        ) : null}
      </div>

      {question.type === "open" ? (
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-200" htmlFor={`open-${question.id}`}>
            Votre réponse
          </label>
          <textarea
            id={`open-${question.id}`}
            value={openAnswer}
            onChange={(event) => setOpenAnswer(event.target.value)}
            disabled={hasSubmitted}
            rows={4}
            className="w-full resize-y rounded-xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:text-slate-400"
            placeholder="Tapez votre réponse libre ici..."
          />
        </div>
      ) : (
        <form className="grid gap-4">
          {choiceOptions.map((option) => {
            const isSelected = selectedOptionIds.includes(option.id);
            const showCorrectness = Boolean(response);
            const isCorrectOption = Boolean(response?.correctOptionIds.includes(option.id));
            const isCorrectSelection = Boolean(showCorrectness && response?.isCorrect && isSelected);
            const isIncorrectSelection = Boolean(showCorrectness && !isCorrectOption && isSelected);
            const shouldRevealCorrectOption = Boolean(showCorrectness && !response?.isCorrect && isCorrectOption);

            const baseStyles = "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition";
            const defaultStyles = isSelected ? "border-primary bg-primary/10" : "border-white/5 hover:border-primary/40";
            const stateStyles = isCorrectSelection
              ? "border-emerald-400/80 bg-emerald-500/20 text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
              : isIncorrectSelection
                ? "border-rose-400/60 bg-rose-500/10"
                : shouldRevealCorrectOption
                  ? "border-emerald-400/40 bg-emerald-400/5"
                  : "";

            return (
              <label key={option.id} className={`${baseStyles} ${defaultStyles} ${stateStyles}`.trim()}>
                <input
                  type={isSingleChoice(question.type) ? "radio" : "checkbox"}
                  name={question.id}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => handleSelection(option.id)}
                  disabled={hasSubmitted}
                  className="mt-1 h-4 w-4 shrink-0 accent-primary"
                />
                <span
                  className={`text-left text-base ${
                    isCorrectSelection
                      ? "font-semibold text-emerald-50"
                      : isIncorrectSelection
                        ? "text-rose-100"
                        : "text-slate-100"
                  }`}
                >
                  {option.text}
                </span>
              </label>
            );
          })}
        </form>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={(question.type === "open" ? !openAnswer.trim() : selectedOptionIds.length === 0) || hasSubmitted}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition enabled:hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Submit answer
        </button>
        {hasSubmitted && (
          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={handleNext}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/70 bg-slate-900/60 px-6 py-4 text-base font-semibold text-primary-light shadow-[0_12px_30px_-15px_rgba(56,189,248,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/15 hover:text-white hover:shadow-[0_18px_40px_-15px_rgba(56,189,248,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>{currentQuestionIndex === totalQuestions - 1 ? "View results" : "Next question"}</span>
              <span aria-hidden className="text-lg transition-transform duration-200 group-hover:translate-x-1">➡️</span>
            </button>
          </div>
        )}
      </div>
      {feedback && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">{feedback}</p>
          <p className="mt-2 text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function isSingleChoice(type: QuestionType) {
  return type === "single" || type === "true_false";
}

function getFeedback(response: { isCorrect: boolean; timedOut?: boolean }) {
  if (response.timedOut) {
    return "Time's up! Review the explanation and try again later.";
  }
  return response.isCorrect ? "Great job! You nailed this one." : "Not quite. Review the explanation and try again next time.";
}

function MediaResourcePreview({ resource }: { resource: MediaResource }) {
  if (resource.type === "image" || resource.type === "gif") {
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <img src={resource.url} alt={resource.label ?? "Illustration"} className="h-full w-full object-cover" />
        {resource.label ? (
          <figcaption className="px-3 py-2 text-xs text-slate-300">{resource.label}</figcaption>
        ) : null}
      </figure>
    );
  }

  if (resource.type === "video") {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <iframe
          src={resource.url}
          title={resource.label ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-48 w-full"
        />
        {resource.label ? (
          <p className="px-3 py-2 text-xs text-slate-300">{resource.label}</p>
        ) : null}
      </div>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      className="flex h-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary hover:border-primary/60 hover:bg-primary/10"
    >
      <span>{resource.label ?? resource.url}</span>
      <span aria-hidden>↗</span>
    </a>
  );
}
