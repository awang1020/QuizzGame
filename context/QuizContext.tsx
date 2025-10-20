"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { quizzes } from "@/data/quizzes";

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  prompt: string;
  type: "single" | "multiple";
  options: Option[];
  explanation: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  duration?: number;
  questions: Question[];
};

type Response = {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
};

type QuizContextValue = {
  quizzes: Quiz[];
  currentQuiz: Quiz;
  currentQuestionIndex: number;
  currentQuestion: Question | undefined;
  responses: Record<string, Response>;
  hasStarted: boolean;
  startQuiz: (quizId: string) => void;
  submitAnswer: (questionId: string, selectedOptionIds: string[]) => Response | undefined;
  goToNextQuestion: () => void;
  resetQuiz: () => void;
  score: number;
  totalQuestions: number;
  isQuizComplete: boolean;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [currentQuizId, setCurrentQuizId] = useState(quizzes[0]?.id ?? "");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hasStarted, setHasStarted] = useState(false);

  const currentQuiz = useMemo(() => {
    return quizzes.find((quiz) => quiz.id === currentQuizId) ?? quizzes[0];
  }, [currentQuizId]);

  const currentQuestion = useMemo(() => {
    return currentQuiz?.questions[currentQuestionIndex];
  }, [currentQuiz, currentQuestionIndex]);

  const totalQuestions = currentQuiz?.questions.length ?? 0;

  const score = useMemo(() => {
    return Object.values(responses).reduce((acc, response) => {
      return acc + (response.isCorrect ? 1 : 0);
    }, 0);
  }, [responses]);

  const isQuizComplete = hasStarted && Object.keys(responses).length === totalQuestions;

  const startQuiz = (quizId: string) => {
    setCurrentQuizId(quizId);
    setCurrentQuestionIndex(0);
    setResponses({});
    setHasStarted(true);
  };

  const resetQuiz = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
    setHasStarted(false);
  };

  const submitAnswer = (questionId: string, selectedOptionIds: string[]) => {
    const question = currentQuiz?.questions.find((item) => item.id === questionId);
    if (!question) {
      return undefined;
    }

    const correctOptionIds = question.options
      .filter((option) => option.isCorrect)
      .map((option) => option.id)
      .sort();

    const normalizedSelection = [...selectedOptionIds].sort();
    const isCorrect =
      normalizedSelection.length === correctOptionIds.length &&
      normalizedSelection.every((value, index) => value === correctOptionIds[index]);

    const response: Response = {
      questionId,
      selectedOptionIds: normalizedSelection,
      correctOptionIds,
      isCorrect
    };

    setResponses((prev) => ({ ...prev, [questionId]: response }));

    return response;
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prev) => {
      if (!currentQuiz) return prev;
      const nextIndex = Math.min(prev + 1, currentQuiz.questions.length - 1);
      return nextIndex;
    });
  };

  const value: QuizContextValue = {
    quizzes,
    currentQuiz: currentQuiz!,
    currentQuestionIndex,
    currentQuestion,
    responses,
    hasStarted,
    startQuiz,
    submitAnswer,
    goToNextQuestion,
    resetQuiz,
    score,
    totalQuestions,
    isQuizComplete
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }

  return context;
}
