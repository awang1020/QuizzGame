"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  duration?: number;
  level: number;
  difficulty: QuizDifficulty;
  focusArea: string;
  recommendedFor: string;
  creatorId: string;
  communityLikes: number;
  tags?: string[];
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
  isRestored: boolean;
  hasOngoingSession: boolean;
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
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  const currentQuiz = useMemo(() => {
    return quizzes.find((quiz) => quiz.id === currentQuizId) ?? quizzes[0];
  }, [currentQuizId]);

  useEffect(() => {
    if (!currentQuiz) return;

    setQuestionOrder((prev) => {
      const questionIds = currentQuiz.questions.map((question) => question.id);
      const filtered = prev.filter((id) => questionIds.includes(id));

      if (filtered.length === questionIds.length) {
        return filtered;
      }

      if (hasStarted) {
        return shuffle(questionIds);
      }

      return questionIds;
    });
  }, [currentQuiz, hasStarted]);

  const currentQuestion = useMemo(() => {
    if (!currentQuiz) return undefined;

    const questions = currentQuiz.questions;
    const normalizedOrder =
      questionOrder.length === questions.length
        ? questionOrder
        : questions.map((question) => question.id);

    const questionId = normalizedOrder[currentQuestionIndex];
    if (!questionId) {
      return questions[0];
    }

    return questions.find((question) => question.id === questionId);
  }, [currentQuestionIndex, currentQuiz, questionOrder]);

  const totalQuestions = currentQuiz?.questions.length ?? 0;

  const score = useMemo(() => {
    return Object.values(responses).reduce((acc, response) => {
      return acc + (response.isCorrect ? 1 : 0);
    }, 0);
  }, [responses]);

  const isQuizComplete = hasStarted && Object.keys(responses).length === totalQuestions;
  const hasOngoingSession = hasStarted && !isQuizComplete;

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawState = localStorage.getItem("quizzyquizz-progress");
      if (!rawState) {
        setIsRestored(true);
        return;
      }

      const parsed = JSON.parse(rawState) as {
        currentQuizId?: string;
        currentQuestionIndex?: number;
        responses?: Record<string, Response>;
        hasStarted?: boolean;
        questionOrder?: string[];
      };

      if (parsed.currentQuizId && quizzes.some((quiz) => quiz.id === parsed.currentQuizId)) {
        setCurrentQuizId(parsed.currentQuizId);
      }

      if (typeof parsed.currentQuestionIndex === "number") {
        setCurrentQuestionIndex(parsed.currentQuestionIndex);
      }

      if (parsed.responses) {
        setResponses(parsed.responses);
      }

      if (Array.isArray(parsed.questionOrder)) {
        setQuestionOrder(parsed.questionOrder);
      }

      if (typeof parsed.hasStarted === "boolean") {
        setHasStarted(parsed.hasStarted);
      }
    } catch (error) {
      console.error("Failed to restore quiz progress", error);
      localStorage.removeItem("quizzyquizz-progress");
    } finally {
      setIsRestored(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isRestored) return;

    if (!hasStarted) {
      localStorage.removeItem("quizzyquizz-progress");
      return;
    }

    const state = {
      currentQuizId,
      currentQuestionIndex,
      questionOrder,
      responses,
      hasStarted
    };

    localStorage.setItem("quizzyquizz-progress", JSON.stringify(state));
  }, [currentQuizId, currentQuestionIndex, hasStarted, isRestored, questionOrder, responses]);

  const startQuiz = (quizId: string) => {
    setCurrentQuizId(quizId);
    setCurrentQuestionIndex(0);
    setQuestionOrder(() => {
      const quiz = quizzes.find((item) => item.id === quizId);
      if (!quiz) return [];

      return shuffle(quiz.questions.map((question) => question.id));
    });
    setResponses({});
    setHasStarted(true);
  };

  const resetQuiz = () => {
    setResponses({});
    setCurrentQuestionIndex(0);
    setHasStarted(false);
    setQuestionOrder([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("quizzyquizz-progress");
    }
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
    isRestored,
    hasOngoingSession,
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

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}
