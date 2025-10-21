"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { quizzes as defaultQuizDefinitions } from "@/data/quizzes";
import { useUser } from "@/context/UserContext";

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
  level?: number;
  difficulty?: QuizDifficulty;
  focusArea?: string;
  recommendedFor?: string;
  accessCode: string;
  joinLink: string;
  creatorId?: string;
  communityLikes?: number;
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
  timeTakenSeconds?: number;
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
  submittedAt: number;
};

type ShareConfig = {
  isPublic: boolean;
  shareToken?: string;
};

type ParticipantAttempt = {
  id: string;
  participantLabel: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  averageQuestionTimeSeconds: number;
  questionDurations: Record<string, number>;
  correctQuestionIds: string[];
  incorrectQuestionIds: string[];
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
  recordQuestionDuration: (questionId: string, durationSeconds: number) => void;
  averageQuestionTimeSeconds: number;
  sessionDurationSeconds: number | null;
  attemptHistory: ParticipantAttempt[];
  createQuiz: (quiz: Omit<QuizDefinition, "id"> & { id?: string }) => Quiz;
  updateQuiz: (quizId: string, update: Partial<QuizDefinition>) => Quiz | undefined;
  deleteQuiz: (quizId: string) => void;
  duplicateQuiz: (quizId: string) => Quiz | undefined;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

const PROGRESS_STORAGE_KEY = "quizzyquizz-progress";
const CUSTOM_STORAGE_KEY = "quizzyquizz-custom-quizzes";
const SHARING_STORAGE_KEY = "quizzyquizz-sharing";
const HISTORY_STORAGE_KEY = "quizzyquizz-history";

const STATIC_QUIZZES: Quiz[] = defaultQuizDefinitions.map((quiz) => ({
  ...quiz,
  origin: "default" as const,
  createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString()
}));

const STATIC_QUIZ_IDS = new Set(STATIC_QUIZZES.map((quiz) => quiz.id));

const TRUE_FALSE_FALLBACK: Option[] = [
  { id: "true", text: "True", isCorrect: true },
  { id: "false", text: "False", isCorrect: false }
];

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const { recordQuizCompletion, recordQuizCreated, user } = useUser();
  const [customQuizzes, setCustomQuizzes] = useState<Quiz[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string>(STATIC_QUIZZES[0]?.id ?? "");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [shareSettings, setShareSettings] = useState<Record<string, ShareConfig>>({});
  const [questionDurations, setQuestionDurations] = useState<Record<string, number>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [sessionCompletedAt, setSessionCompletedAt] = useState<number | null>(null);
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState<number | null>(null);
  const [attemptHistory, setAttemptHistory] = useState<ParticipantAttempt[]>([]);
  const hasHydratedSharing = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Quiz[];
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
    } catch (error) {
      console.error("Failed to restore custom quizzes", error);
      window.localStorage.removeItem(CUSTOM_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ParticipantAttempt[];
      if (Array.isArray(parsed)) {
        setAttemptHistory(parsed);
      }
    } catch (error) {
      console.error("Failed to restore quiz history", error);
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) {
        setIsRestored(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        currentQuizId?: string;
        currentQuestionIndex?: number;
        responses?: Record<string, Response>;
        hasStarted?: boolean;
        questionOrder?: string[];
        questionDurations?: Record<string, number>;
        sessionId?: string | null;
        sessionStartedAt?: number | null;
      };

      if (parsed.currentQuizId) {
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
      if (parsed.questionDurations) {
        setQuestionDurations(parsed.questionDurations);
      }
      if (typeof parsed.hasStarted === "boolean") {
        setHasStarted(parsed.hasStarted);
      }
      if (parsed.sessionId) {
        setSessionId(parsed.sessionId);
      }
      if (typeof parsed.sessionStartedAt === "number") {
        setSessionStartedAt(parsed.sessionStartedAt);
      }
    } catch (error) {
      console.error("Failed to restore quiz progress", error);
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    } finally {
      setIsRestored(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(customQuizzes));
  }, [customQuizzes]);

  useEffect(() => {
    const combined = [...STATIC_QUIZZES, ...customQuizzes];
    setShareSettings((previous) => {
      const next: Record<string, ShareConfig> = { ...previous };
      let changed = false;

      combined.forEach((quiz) => {
        if (!next[quiz.id]) {
          next[quiz.id] = { isPublic: false };
          changed = true;
        }
      });

      Object.keys(next).forEach((quizId) => {
        if (!combined.some((quiz) => quiz.id === quizId)) {
          delete next[quizId];
          changed = true;
        }
      });

      return changed ? next : previous;
    });
  }, [customQuizzes]);

  useEffect(() => {
    if (typeof window === "undefined" || hasHydratedSharing.current) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(SHARING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ShareConfig>;
        if (parsed && typeof parsed === "object") {
          setShareSettings((previous) => ({ ...previous, ...parsed }));
        }
      }
    } catch (error) {
      console.error("Failed to restore sharing preferences", error);
      window.localStorage.removeItem(SHARING_STORAGE_KEY);
    } finally {
      hasHydratedSharing.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydratedSharing.current) {
      return;
    }
    window.localStorage.setItem(SHARING_STORAGE_KEY, JSON.stringify(shareSettings));
  }, [shareSettings]);

  useEffect(() => {
    if (typeof window === "undefined" || !isRestored) return;

    if (!hasStarted) {
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      return;
    }

    const payload = {
      currentQuizId,
      currentQuestionIndex,
      questionOrder,
      responses,
      hasStarted,
      questionDurations,
      sessionId,
      sessionStartedAt
    };

    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload));
  }, [
    currentQuizId,
    currentQuestionIndex,
    hasStarted,
    isRestored,
    questionOrder,
    questionDurations,
    responses,
    sessionId,
    sessionStartedAt
  ]);

  const quizzes = useMemo(() => {
    const combined = [...STATIC_QUIZZES, ...customQuizzes];
    return combined.sort((a, b) => {
      const aIsStatic = STATIC_QUIZ_IDS.has(a.id);
      const bIsStatic = STATIC_QUIZ_IDS.has(b.id);
      if (aIsStatic && bIsStatic) {
        return (a.level ?? Number.MAX_SAFE_INTEGER) - (b.level ?? Number.MAX_SAFE_INTEGER);
      }
      if (aIsStatic !== bIsStatic) {
        return aIsStatic ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [customQuizzes]);

  const currentQuiz = useMemo(() => {
    return quizzes.find((quiz) => quiz.id === currentQuizId) ?? quizzes[0];
  }, [currentQuizId, quizzes]);

  useEffect(() => {
    if (!currentQuiz && quizzes.length > 0) {
      setCurrentQuizId(quizzes[0].id);
    }
  }, [currentQuiz, quizzes]);

  useEffect(() => {
    if (!currentQuiz) return;
    const ids = currentQuiz.questions.map((question) => question.id);
    setQuestionOrder((previous) => {
      const filtered = previous.filter((id) => ids.includes(id));
      return filtered.length === ids.length ? filtered : ids;
    });
  }, [currentQuiz]);

  const currentQuestion = useMemo(() => {
    if (!currentQuiz) return undefined;
    const order = questionOrder.length === currentQuiz.questions.length ? questionOrder : currentQuiz.questions.map((q) => q.id);
    const questionId = order[currentQuestionIndex];
    return currentQuiz.questions.find((question) => question.id === questionId) ?? currentQuiz.questions[0];
  }, [currentQuestionIndex, currentQuiz, questionOrder]);

  const totalQuestions = currentQuiz?.questions.length ?? 0;

  const totalAvailablePoints = useMemo(() => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
  }, [currentQuiz]);

  const score = useMemo(() => {
    return Object.values(responses).reduce((acc, response) => acc + response.earnedPoints, 0);
  }, [responses]);

  const isQuizComplete = hasStarted && totalQuestions > 0 && Object.keys(responses).length === totalQuestions;
  const hasOngoingSession = hasStarted && !isQuizComplete;

  const averageQuestionTimeSeconds = useMemo(() => {
    const durations = Object.values(questionDurations);
    if (durations.length === 0) return 0;
    const total = durations.reduce((acc, value) => acc + value, 0);
    return total / durations.length;
  }, [questionDurations]);

  const recordQuestionDuration = useCallback((questionId: string, durationSeconds: number) => {
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
      return;
    }
    setQuestionDurations((previous) => ({ ...previous, [questionId]: durationSeconds }));
  }, []);

  const finalizeAttempt = useCallback(
    (quiz: Quiz, allResponses: Record<string, Response>) => {
      const startedAt = sessionStartedAt ?? Date.now();
      const completedAt = Date.now();
      const durationMs = completedAt - startedAt;
      setSessionCompletedAt(completedAt);
      setSessionDurationSeconds(durationMs / 1000);

      const durations: Record<string, number> = { ...questionDurations };
      quiz.questions.forEach((question) => {
        if (durations[question.id] !== undefined) return;
        if (allResponses[question.id]?.timedOut && question.timeLimit) {
          durations[question.id] = question.timeLimit;
        }
      });

      const recordedDurations = Object.values(durations);
      const averageTime = recordedDurations.length
        ? recordedDurations.reduce((acc, value) => acc + value, 0) / recordedDurations.length
        : 0;

      const correctIds = Object.values(allResponses)
        .filter((response) => response.isCorrect)
        .map((response) => response.questionId);
      const incorrectIds = Object.values(allResponses)
        .filter((response) => !response.isCorrect)
        .map((response) => response.questionId);

      const totalQuestionCount = quiz.questions.length;
      const maxPoints = quiz.questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
      const accuracy = maxPoints === 0 ? 0 : Math.round((score / maxPoints) * 100);
      const attemptId = sessionId ?? createSessionId();
      const quizAttempts = attemptHistory.filter((attempt) => attempt.quizId === quiz.id);
      const participantLabel = `Participant ${quizAttempts.length + 1}`;

      const attempt: ParticipantAttempt = {
        id: attemptId,
        participantLabel,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        totalQuestions: totalQuestionCount,
        accuracy,
        startedAt,
        completedAt,
        durationMs,
        averageQuestionTimeSeconds: averageTime,
        questionDurations: durations,
        correctQuestionIds: correctIds,
        incorrectQuestionIds: incorrectIds
      };

      setAttemptHistory((previous) => {
        const next = [attempt, ...previous.filter((entry) => entry.id !== attempt.id)];
        const trimmed = next.slice(0, 50);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
        }
        return trimmed;
      });

      if (recordQuizCompletion) {
        recordQuizCompletion(quiz.id, score, quiz.questions.length);
      }
    },
    [attemptHistory, questionDurations, recordQuizCompletion, score, sessionId, sessionStartedAt]
  );

  const startQuiz = useCallback(
    (quizId: string) => {
      const quiz = quizzes.find((item) => item.id === quizId);
      if (!quiz) {
        return false;
      }

      setCurrentQuizId(quizId);
      setCurrentQuestionIndex(0);
      setQuestionOrder(quiz.questions.map((question) => question.id));
      setResponses({});
      setHasStarted(true);
      setQuestionDurations({});
      const newSessionId = createSessionId();
      setSessionId(newSessionId);
      setSessionStartedAt(Date.now());
      setSessionCompletedAt(null);
      setSessionDurationSeconds(null);

      return true;
    },
    [quizzes]
  );

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((index) => Math.min(index + 1, Math.max(0, totalQuestions - 1)));
  }, [totalQuestions]);

  const submitAnswer = useCallback(
    (questionId: string, payload: SubmitAnswerPayload) => {
      const quiz = quizzes.find((item) => item.id === currentQuizId);
      const question = quiz?.questions.find((item) => item.id === questionId);
      if (!quiz || !question) {
        return undefined;
      }

      let selectedOptionIds: string[] = [];
      let correctOptionIds: string[] = [];
      let freeformText: string | undefined;
      let isCorrect = false;

      if (question.type === "open") {
        freeformText = payload.freeformText?.trim();
        const expected = normalizeText(question.answer ?? "");
        const received = normalizeText(freeformText ?? "");
        isCorrect = Boolean(expected) && expected === received;
      } else {
        const options =
          question.type === "true_false" && question.options.length === 0 ? TRUE_FALSE_FALLBACK : question.options;
        correctOptionIds = options
          .filter((option) => option.isCorrect)
          .map((option) => option.id)
          .sort();
        selectedOptionIds = [...(payload.selectedOptionIds ?? [])].sort();
        isCorrect =
          selectedOptionIds.length === correctOptionIds.length &&
          selectedOptionIds.every((value, index) => value === correctOptionIds[index]);
      }

      const totalPoints = question.points ?? 1;
      const response: Response = {
        questionId,
        selectedOptionIds,
        correctOptionIds,
        freeformText,
        isCorrect,
        earnedPoints: isCorrect ? totalPoints : 0,
        totalPoints,
        timedOut: payload.timedOut,
        submittedAt: Date.now()
      };

      if (typeof payload.timeTakenSeconds === "number") {
        recordQuestionDuration(questionId, Math.max(0, payload.timeTakenSeconds));
      }

      setResponses((previous) => {
        const next = { ...previous, [questionId]: response };
        if (Object.keys(next).length === quiz.questions.length) {
          finalizeAttempt(quiz, next);
        }
        return next;
      });

      if (!sessionStartedAt) {
        setSessionStartedAt(Date.now());
      }

      return response;
    },
    [currentQuizId, finalizeAttempt, quizzes, recordQuestionDuration, sessionStartedAt]
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
      window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
    }
  }, []);

  const setQuizVisibility = useCallback((quizId: string, isPublic: boolean) => {
    setShareSettings((previous) => {
      const current = previous[quizId] ?? { isPublic: false };
      const shareToken = isPublic ? current.shareToken ?? createShareToken() : undefined;
      return {
        ...previous,
        [quizId]: { isPublic, shareToken }
      };
    });
  }, []);

  const getShareLink = useCallback(
    (quizId: string) => {
      const config = shareSettings[quizId];
      if (!config?.isPublic) return undefined;
      const token = config.shareToken ?? createShareToken();
      if (!config.shareToken) {
        setShareSettings((previous) => ({
          ...previous,
          [quizId]: { isPublic: true, shareToken: token }
        }));
      }
      const origin = typeof window === "undefined" ? "https://quizzyquizz.app" : window.location.origin;
      return `${origin}/quiz?id=${quizId}&invite=${token}`;
    },
    [shareSettings]
  );

  const createQuiz = useCallback(
    (definition: Omit<QuizDefinition, "id"> & { id?: string }) => {
      const id = definition.id?.trim() || generateId();
      const now = new Date().toISOString();
      const quiz: Quiz = {
        ...definition,
        id,
        origin: "custom",
        createdAt: now,
        updatedAt: now,
        creatorId: definition.creatorId ?? user?.id,
        communityLikes: definition.communityLikes ?? 0,
        tags: definition.tags ?? []
      };

      setCustomQuizzes((previous) => [quiz, ...previous.filter((item) => item.id !== quiz.id)]);
      if (recordQuizCreated) {
        recordQuizCreated(quiz.id);
      }
      return quiz;
    },
    [recordQuizCreated, user?.id]
  );

  const updateQuiz = useCallback(
    (quizId: string, update: Partial<QuizDefinition>) => {
      let updatedQuiz: Quiz | undefined;
      setCustomQuizzes((previous) =>
        previous.map((quiz) => {
          if (quiz.id !== quizId) return quiz;
          updatedQuiz = {
            ...quiz,
            ...update,
            tags: update.tags ?? quiz.tags,
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
    setCustomQuizzes((previous) => previous.filter((quiz) => quiz.id !== quizId));
  }, []);

  const duplicateQuiz = useCallback(
    (quizId: string) => {
      const source = quizzes.find((quiz) => quiz.id === quizId);
      if (!source) return undefined;
      const id = generateId();
      const now = new Date().toISOString();
      const duplicated: Quiz = {
        ...source,
        id,
        origin: "custom",
        createdAt: now,
        updatedAt: now,
        title: `${source.title} (copie)`,
        creatorId: user?.id ?? source.creatorId,
        communityLikes: 0
      };
      setCustomQuizzes((previous) => [duplicated, ...previous]);
      return duplicated;
    },
    [quizzes, user?.id]
  );

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
    totalAvailablePoints,
    isQuizComplete,
    setQuizVisibility,
    getShareLink,
    recordQuestionDuration,
    averageQuestionTimeSeconds,
    sessionDurationSeconds,
    attemptHistory,
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

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase();
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

function createShareToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export type { ParticipantAttempt, Response };
