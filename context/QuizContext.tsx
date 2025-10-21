"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  questions: Question[];
};

type Response = {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
};

type ShareConfig = {
  isPublic: boolean;
  shareToken?: string;
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
  shareSettings: Record<string, ShareConfig>;
  startQuiz: (quizId: string) => void;
  submitAnswer: (questionId: string, selectedOptionIds: string[]) => Response | undefined;
  goToNextQuestion: () => void;
  resetQuiz: () => void;
  score: number;
  totalQuestions: number;
  isQuizComplete: boolean;
  setQuizVisibility: (quizId: string, isPublic: boolean) => void;
  getShareLink: (quizId: string) => string | undefined;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [currentQuizId, setCurrentQuizId] = useState(quizzes[0]?.id ?? "");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [shareSettings, setShareSettings] = useState<Record<string, ShareConfig>>({});
  const [hasHydratedSharing, setHasHydratedSharing] = useState(false);

  useEffect(() => {
    setShareSettings((prev) => {
      let hasChanges = false;
      const next: Record<string, ShareConfig> = { ...prev };

      quizzes.forEach((quiz) => {
        if (!next[quiz.id]) {
          next[quiz.id] = { isPublic: false };
          hasChanges = true;
        }
      });

      const quizIds = new Set(quizzes.map((quiz) => quiz.id));
      Object.keys(next).forEach((quizId) => {
        if (!quizIds.has(quizId)) {
          delete next[quizId];
          hasChanges = true;
        }
      });

      return hasChanges ? next : prev;
    });
  }, [quizzes]);

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

  useEffect(() => {
    if (typeof window === "undefined" || hasHydratedSharing) {
      return;
    }

    try {
      const rawSharing = localStorage.getItem("quizzyquizz-sharing");
      if (!rawSharing) {
        setHasHydratedSharing(true);
        return;
      }

      const parsed = JSON.parse(rawSharing) as Record<string, ShareConfig>;
      setShareSettings((prev) => {
        const merged: Record<string, ShareConfig> = { ...prev };
        Object.entries(parsed).forEach(([quizId, config]) => {
          if (!quizzes.some((quiz) => quiz.id === quizId)) {
            return;
          }

          const isPublic = Boolean(config?.isPublic);
          merged[quizId] = {
            isPublic,
            shareToken: config?.shareToken ?? (isPublic ? createShareToken() : undefined)
          };
        });

        return merged;
      });
    } catch (error) {
      console.error("Failed to restore quiz sharing preferences", error);
      localStorage.removeItem("quizzyquizz-sharing");
    } finally {
      setHasHydratedSharing(true);
    }
  }, [hasHydratedSharing, quizzes]);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedSharing) {
      return;
    }

    localStorage.setItem("quizzyquizz-sharing", JSON.stringify(shareSettings));
  }, [hasHydratedSharing, shareSettings]);

  const setQuizVisibility = useCallback((quizId: string, isPublic: boolean) => {
    setShareSettings((prev) => {
      const current = prev[quizId] ?? { isPublic: false };
      const shareToken = isPublic ? current.shareToken ?? createShareToken() : current.shareToken;
      return {
        ...prev,
        [quizId]: {
          isPublic,
          shareToken
        }
      };
    });
  }, []);

  const getShareLink = useCallback(
    (quizId: string) => {
      const settings = shareSettings[quizId];
      if (!settings?.isPublic || !settings.shareToken) {
        return undefined;
      }

      const origin = typeof window === "undefined" ? "https://quizzyquizz.app" : window.location.origin;
      return `${origin}/quiz/${quizId}?invite=${settings.shareToken}`;
    },
    [shareSettings]
  );

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
    shareSettings,
    startQuiz,
    submitAnswer,
    goToNextQuestion,
    resetQuiz,
    score,
    totalQuestions,
    isQuizComplete,
    setQuizVisibility,
    getShareLink
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

function createShareToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
