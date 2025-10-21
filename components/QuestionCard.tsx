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
    if (!isLastQuestion) {
      goToNextQuestion();
    }
    onAnswered(isLastQuestion);
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
            ? "border-emerald-400/70 bg-emerald-500/15 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
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
          <button
            type="button"
            onClick={handleNext}
            className="text-sm font-semibold text-slate-200 transition hover:text-white"
          >
            {currentQuestionIndex === totalQuestions - 1 ? "View results" : "Next question"}
          </button>
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
