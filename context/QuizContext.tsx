"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { quizzes } from "@/data/quizzes";
import { quizzes as defaultQuizDefinitions } from "@/data/quizzes";

export type MediaType = "image" | "video" | "gif" | "link";

export type MediaResource = {
  id: string;
  type: MediaType;
  url: string;
  label?: string;
};

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  media?: MediaResource[];
};

export type QuestionType = "single" | "multiple" | "true_false" | "open";

export type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
  options: Option[];
  explanation: string;
  points?: number;
  timeLimit?: number;
  answer?: string;
  media?: MediaResource[];
};

export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export type QuizDefinition = {
  id: string;
  title: string;
  description: string;
  duration?: number;
  level: number;
  difficulty: QuizDifficulty;
  focusArea: string;
  recommendedFor: string;
  accessCode: string;
  joinLink: string;
  level?: number;
  difficulty?: QuizDifficulty;
  focusArea?: string;
  recommendedFor?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  questions: Question[];
};

export type Quiz = QuizDefinition & {
  origin: "default" | "custom";
  createdAt: string;
  updatedAt: string;
};

type SubmitAnswerPayload = {
  selectedOptionIds?: string[];
  freeformText?: string;
  timedOut?: boolean;
};

type Response = {
  questionId: string;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  freeformText?: string;
  isCorrect: boolean;
  earnedPoints: number;
  totalPoints: number;
  timedOut?: boolean;
};

type ShareConfig = {
  isPublic: boolean;
  shareToken?: string;
};

type QuizContextValue = {
  quizzes: Quiz[];
  customQuizzes: Quiz[];
  defaultQuizIds: Set<string>;
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
  startQuiz: (quizId: string) => boolean;
  submitAnswer: (questionId: string, payload: SubmitAnswerPayload) => Response | undefined;
  goToNextQuestion: () => void;
  resetQuiz: () => void;
  score: number;
  totalQuestions: number;
  totalAvailablePoints: number;
  isQuizComplete: boolean;
  setQuizVisibility: (quizId: string, isPublic: boolean) => void;
  getShareLink: (quizId: string) => string | undefined;
  createQuiz: (quiz: Omit<QuizDefinition, "id"> & { id?: string }) => Quiz;
  updateQuiz: (quizId: string, update: Partial<QuizDefinition>) => Quiz | undefined;
  deleteQuiz: (quizId: string) => void;
  duplicateQuiz: (quizId: string) => Quiz | undefined;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

const PROGRESS_STORAGE_KEY = "quizzyquizz-progress";
const CUSTOM_STORAGE_KEY = "quizzyquizz-custom-quizzes";

const STATIC_QUIZZES: Quiz[] = defaultQuizDefinitions.map((quiz) => ({
  ...quiz,
  origin: "default" as const,
  createdAt: new Date("2023-01-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2023-01-01T00:00:00.000Z").toISOString()
}));

const STATIC_QUIZ_IDS = new Set(STATIC_QUIZZES.map((quiz) => quiz.id));

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

const normalizeText = (text: string) => text.trim().toLocaleLowerCase();

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string>(STATIC_QUIZZES[0]?.id ?? "");
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
  const [questionDurations, setQuestionDurations] = useState<Record<string, number>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [sessionCompletedAt, setSessionCompletedAt] = useState<number | null>(null);
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState<number | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<ParticipantAttempt[]>([]);
  const [isHistoryRestored, setIsHistoryRestored] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawCustom = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (rawCustom) {
        const parsed = JSON.parse(rawCustom) as Quiz[];
        if (Array.isArray(parsed)) {
          setCustomQuizzes(
            parsed.map((quiz) => ({
              ...quiz,
              origin: "custom" as const,
              createdAt: quiz.createdAt ?? new Date().toISOString(),
              updatedAt: quiz.updatedAt ?? new Date().toISOString()
            }))
          );
        }
      }
    } catch (error) {
      console.error("Failed to restore custom quizzes", error);
      localStorage.removeItem(CUSTOM_STORAGE_KEY);
    }
  }, []);

  const quizzes = useMemo(() => {
    return [...STATIC_QUIZZES, ...customQuizzes].sort((a, b) => {
      if (a.origin === b.origin) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      return a.origin === "default" ? -1 : 1;
    });
  }, [customQuizzes]);

  const currentQuiz = useMemo(() => {
    return quizzes.find((quiz) => quiz.id === currentQuizId) ?? quizzes[0];
  }, [quizzes, currentQuizId]);

  useEffect(() => {
    if (!currentQuiz && quizzes.length > 0) {
      setCurrentQuizId(quizzes[0].id);
    }
  }, [currentQuiz, quizzes]);

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

  const totalAvailablePoints = useMemo(() => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
  }, [currentQuiz]);

  const score = useMemo(() => {
    return Object.values(responses).reduce((acc, response) => acc + response.earnedPoints, 0);
  }, [responses]);

  const isQuizComplete = hasStarted && Object.keys(responses).length === totalQuestions;
  const hasOngoingSession = hasStarted && !isQuizComplete;

  const averageQuestionTime = useMemo(() => {
    const durations = Object.values(questionDurations);
    if (durations.length === 0) {
      return 0;
    }

    const total = durations.reduce((acc, duration) => acc + duration, 0);
    return total / durations.length;
  }, [questionDurations]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawState = localStorage.getItem(PROGRESS_STORAGE_KEY);
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
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } finally {
      setIsRestored(true);
    }
  }, [quizzes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customQuizzes));
  }, [customQuizzes]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawHistory = localStorage.getItem("quizzyquizz-history");
      if (!rawHistory) {
        setIsHistoryRestored(true);
        return;
      }

      const parsedHistory = JSON.parse(rawHistory) as ParticipantAttempt[];
      if (Array.isArray(parsedHistory)) {
        setAttemptHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Failed to restore quiz history", error);
      localStorage.removeItem("quizzyquizz-history");
    } finally {
      setIsHistoryRestored(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isRestored) return;

    if (!hasStarted) {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
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
  const startQuiz = useCallback(
    (quizId: string) => {
      const quiz = quizzes.find((item) => item.id === quizId);
      if (!quiz) {
        return false;
      }

      setCurrentQuizId(quizId);
      setCurrentQuestionIndex(0);
      setQuestionOrder(shuffle(quiz.questions.map((question) => question.id)));
      setResponses({});
      setHasStarted(true);

      return true;
    },
    [quizzes]
  );

  const resetQuiz = useCallback(() => {
    setResponses({});
    setCurrentQuestionIndex(0);
    setHasStarted(false);
    setQuestionOrder([]);
    setQuestionDurations({});
    setSessionId(null);
    setSessionStartedAt(null);
    setSessionCompletedAt(null);
    setSessionDurationSeconds(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  }, []);

  const submitAnswer = useCallback(
    (questionId: string, payload: SubmitAnswerPayload) => {
      const quiz = quizzes.find((item) => item.id === currentQuizId);
      const question = quiz?.questions.find((item) => item.id === questionId);
      if (!question) {
        return undefined;
      }

      let selectedOptionIds: string[] = [...(payload.selectedOptionIds ?? [])];
      let correctOptionIds: string[] = [];
      let isCorrect = false;

      if (question.type === "open") {
        const expected = normalizeText(question.answer ?? "");
        const received = normalizeText(payload.freeformText ?? "");
        correctOptionIds = [];
        isCorrect = Boolean(expected) && expected === received;
        selectedOptionIds = [];
      } else {
        const choiceOptions =
          question.type === "true_false" && question.options.length === 0
            ? [
                { id: "true", text: "True", isCorrect: true },
                { id: "false", text: "False", isCorrect: false }
              ]
            : question.options;

        correctOptionIds = choiceOptions
          .filter((option) => option.isCorrect)
          .map((option) => option.id)
          .sort();

        const normalizedSelection = [...selectedOptionIds].sort();
        isCorrect =
          normalizedSelection.length === correctOptionIds.length &&
          normalizedSelection.every((value, index) => value === correctOptionIds[index]);
        selectedOptionIds = normalizedSelection;
      }

      const totalPoints = question.points ?? 1;
      const earnedPoints = payload.timedOut ? 0 : isCorrect ? totalPoints : 0;

      const response: Response = {
        questionId,
        selectedOptionIds,
        correctOptionIds,
        freeformText: payload.freeformText,
        isCorrect,
        earnedPoints,
        totalPoints,
        timedOut: payload.timedOut
      };

      setResponses((prev) => ({ ...prev, [questionId]: response }));

      return response;
    },
    [currentQuizId, quizzes]
  );

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      if (!currentQuiz) return prev;
      const nextIndex = Math.min(prev + 1, currentQuiz.questions.length - 1);
      return nextIndex;
    });
  }, [currentQuiz]);

  const createQuiz = useCallback(
    (quizDefinition: Omit<QuizDefinition, "id"> & { id?: string }) => {
      const id = quizDefinition.id ?? generateId();
      const timestamp = new Date().toISOString();
      const newQuiz: Quiz = {
        ...quizDefinition,
        id,
        origin: "custom",
        createdAt: timestamp,
        updatedAt: timestamp
      };

      setCustomQuizzes((prev) => [...prev, newQuiz]);

      return newQuiz;
    },
    []
  );

  const updateQuiz = useCallback(
    (quizId: string, update: Partial<QuizDefinition>) => {
      let updatedQuiz: Quiz | undefined;
      setCustomQuizzes((prev) =>
        prev.map((quiz) => {
          if (quiz.id !== quizId) return quiz;
          updatedQuiz = {
            ...quiz,
            ...update,
            updatedAt: new Date().toISOString()
          };
          return updatedQuiz;
        })
      );
      return updatedQuiz;
    },
    []
  );

  const deleteQuiz = useCallback((quizId: string) => {
    if (STATIC_QUIZ_IDS.has(quizId)) {
      console.warn("Default quizzes cannot be deleted");
      return;
    }

    setCustomQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));

    if (currentQuizId === quizId) {
      setCurrentQuizId(STATIC_QUIZZES[0]?.id ?? "");
      setCurrentQuestionIndex(0);
      setResponses({});
      setHasStarted(false);
    }
  }, [currentQuizId]);

  const duplicateQuiz = useCallback(
    (quizId: string) => {
      const sourceQuiz = quizzes.find((quiz) => quiz.id === quizId);
      if (!sourceQuiz) return undefined;

      const clone = (question: Question): Question => ({
        ...question,
        id: generateId(),
        options: question.options.map((option) => ({ ...option, id: generateId() })),
        media: question.media?.map((item) => ({ ...item, id: generateId() }))
      });

      const duplicated = createQuiz({
        ...sourceQuiz,
        id: undefined,
        title: `${sourceQuiz.title} (Copy)`,
        questions: sourceQuiz.questions.map(clone)
      });

      return duplicated;
    },
    [createQuiz, quizzes]
  );

  const recordQuestionDuration = (questionId: string, durationSeconds: number) => {
    setQuestionDurations((prev) => {
      if (prev[questionId] !== undefined) {
        return prev;
      }

      return {
        ...prev,
        [questionId]: Math.max(0, Number.isFinite(durationSeconds) ? durationSeconds : 0)
      };
    });
  };

  useEffect(() => {
    if (!isQuizComplete || !sessionId || !sessionStartedAt || sessionCompletedAt) {
      return;
    }

    const completedAt = Date.now();
    const durationMs = completedAt - sessionStartedAt;
    const durationSeconds = durationMs / 1000;
    setSessionCompletedAt(completedAt);
    setSessionDurationSeconds(durationSeconds);

    const recordedDurations = Object.values(questionDurations);
    const averageQuestionTimeSeconds =
      recordedDurations.length === 0
        ? 0
        : recordedDurations.reduce((acc, value) => acc + value, 0) / recordedDurations.length;

    const correctQuestionIds = Object.values(responses)
      .filter((response) => response.isCorrect)
      .map((response) => response.questionId);
    const incorrectQuestionIds = Object.values(responses)
      .filter((response) => !response.isCorrect)
      .map((response) => response.questionId);

    const accuracy = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);

    setAttemptHistory((prev) => {
      const withoutCurrent = prev.filter((attempt) => attempt.id !== sessionId);
      const quizAttempts = withoutCurrent.filter((attempt) => attempt.quizId === currentQuiz.id);
      const participantLabel = `Participant ${quizAttempts.length + 1}`;
      const nextAttempt: ParticipantAttempt = {
        id: sessionId,
        participantLabel,
        quizId: currentQuiz.id,
        quizTitle: currentQuiz.title,
        score,
        totalQuestions,
        accuracy,
        startedAt: sessionStartedAt,
        completedAt,
        durationMs,
        averageQuestionTimeSeconds,
        questionDurations: { ...questionDurations },
        correctQuestionIds,
        incorrectQuestionIds
      };

      const nextHistory = [...withoutCurrent, nextAttempt].sort((a, b) => b.completedAt - a.completedAt);
      return nextHistory.slice(0, 50);
    });
  }, [
    isQuizComplete,
    sessionId,
    sessionStartedAt,
    sessionCompletedAt,
    questionDurations,
    responses,
    currentQuiz,
    score,
    totalQuestions
  ]);

  const value: QuizContextValue = {
    quizzes,
    customQuizzes,
    defaultQuizIds: STATIC_QUIZ_IDS,
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
    totalAvailablePoints,
    isQuizComplete,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    duplicateQuiz
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
function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
