"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";

type Props = {
  questionId: string;
  onAnswered: (isLastQuestion: boolean) => void;
};

export default function QuestionCard({ questionId, onAnswered }: Props) {
  const { currentQuiz, currentQuestionIndex, responses, submitAnswer, goToNextQuestion, totalQuestions } = useQuiz();
  const question = currentQuiz.questions.find((item) => item.id === questionId);
  const storedResponse = responses[questionId];
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(storedResponse?.selectedOptionIds ?? []);
  const [feedback, setFeedback] = useState<string | null>(storedResponse ? getFeedback(storedResponse.isCorrect) : null);

  useEffect(() => {
    setSelectedOptionIds(storedResponse?.selectedOptionIds ?? []);
    setFeedback(storedResponse ? getFeedback(storedResponse.isCorrect) : null);
  }, [storedResponse, questionId]);

  if (!question) {
    return null;
  }

  const handleSelection = (optionId: string) => {
    if (question.type === "single") {
      setSelectedOptionIds([optionId]);
    } else {
      setSelectedOptionIds((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    }
  };

  const handleSubmit = () => {
    if (selectedOptionIds.length === 0) return;
    const response = submitAnswer(question.id, selectedOptionIds);
    if (!response) return;
    setFeedback(getFeedback(response.isCorrect));
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    if (isLastQuestion) {
      onAnswered(true);
      return;
    }

    setSelectedOptionIds([]);
    setFeedback(null);
    goToNextQuestion();
    onAnswered(false);
  };

  const hasSubmitted = Boolean(feedback);

  return (
    <div className="grid gap-6 rounded-2xl border border-white/10 bg-slate-900/60 p-8 shadow-xl shadow-primary/10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-light">Question {currentQuestionIndex + 1}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{question.prompt}</h2>
      </div>
      <form className="grid gap-4">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const response = responses[question.id];
          const showCorrectness = response !== undefined;
          const isCorrectOption = response && response.correctOptionIds.includes(option.id);
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
            <label
              key={option.id}
              className={`${baseStyles} ${defaultStyles} ${stateStyles}`.trim()}
            >
              <input
                type={question.type === "single" ? "radio" : "checkbox"}
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedOptionIds.length === 0 || hasSubmitted}
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
              <span>
                {currentQuestionIndex === totalQuestions - 1 ? "View results" : "Next question"}
              </span>
              <span aria-hidden className="text-lg transition-transform duration-200 group-hover:translate-x-1">
                ➡️
              </span>
            </button>
          </div>
        )}
      </div>
      {hasSubmitted && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          <p className="font-semibold text-white">{feedback}</p>
          <p className="mt-2 text-slate-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

function getFeedback(isCorrect: boolean) {
  return isCorrect ? "Great job! You nailed this one." : "Not quite. Review the explanation and try again next time.";
}
