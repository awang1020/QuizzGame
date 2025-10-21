"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type AuthProvider = "email" | "google" | "microsoft";

type QuizHistoryEntry = {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
};

type StoredUser = {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  avatarColor: string;
  createdQuizIds: string[];
  likedQuizIds: string[];
  followingCreatorIds: string[];
  history: QuizHistoryEntry[];
};

type StoredState = {
  currentUserId: string | null;
  users: Record<string, StoredUser>;
};

type UserContextValue = {
  hydrated: boolean;
  user: StoredUser | null;
  users: Record<string, StoredUser>;
  signInWithEmail: (input: { name: string; email: string }) => void;
  signInWithProvider: (provider: AuthProvider) => void;
  signOut: () => void;
  toggleLikeQuiz: (quizId: string) => void;
  toggleFollowCreator: (creatorId: string) => void;
  recordQuizCompletion: (quizId: string, score: number, totalQuestions: number) => void;
  recordQuizCreated: (quizId: string) => void;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  isAuthDialogOpen: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const STORAGE_KEY = "quizzyquizz-user";
const COLOR_PALETTE = [
  "bg-gradient-to-br from-sky-500 to-indigo-500",
  "bg-gradient-to-br from-emerald-500 to-teal-500",
  "bg-gradient-to-br from-amber-500 to-orange-500",
  "bg-gradient-to-br from-rose-500 to-pink-500",
  "bg-gradient-to-br from-purple-500 to-violet-500"
];

function createUserId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function deriveNameFromEmail(email: string) {
  const [name] = email.split("@");
  if (!name) return "Explorateur";
  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}

function pickAvatarColor(index: number) {
  return COLOR_PALETTE[index % COLOR_PALETTE.length];
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredState>({ currentUserId: null, users: {} });
  const [hydrated, setHydrated] = useState(false);
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || hasRestoredRef.current) return;

    hasRestoredRef.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredState;
      if (parsed && typeof parsed === "object") {
        setState({
          currentUserId: parsed.currentUserId ?? null,
          users: parsed.users ?? {}
        });
      }
    } catch (error) {
      console.error("Unable to restore user session", error);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const user = useMemo(() => {
    if (!state.currentUserId) return null;
    return state.users[state.currentUserId] ?? null;
  }, [state.currentUserId, state.users]);

  const signInWithEmail = (input: { name: string; email: string }) => {
    const email = normalizeEmail(input.email);
    if (!email) return;

    setState((previous) => {
      const existingUser = Object.values(previous.users).find((candidate) => candidate.email === email);
      if (existingUser) {
        return { ...previous, currentUserId: existingUser.id };
      }

      const id = createUserId();
      const name = input.name.trim() || deriveNameFromEmail(email);
      const newUser: StoredUser = {
        id,
        name,
        email,
        provider: "email",
        avatarColor: pickAvatarColor(Object.keys(previous.users).length),
        createdQuizIds: [],
        likedQuizIds: [],
        followingCreatorIds: [],
        history: []
      };

      return {
        currentUserId: id,
        users: {
          ...previous.users,
          [id]: newUser
        }
      };
    });
    setAuthDialogOpen(false);
  };

  const signInWithProvider = (provider: AuthProvider) => {
    const fallbackEmail = `${provider}-user@quizzyquizz.dev`;
    const fallbackName =
      provider === "google" ? "Compte Google" : provider === "microsoft" ? "Compte Microsoft" : "Explorateur";

    setState((previous) => {
      const existingUser = Object.values(previous.users).find((candidate) => candidate.provider === provider);
      if (existingUser) {
        return { ...previous, currentUserId: existingUser.id };
      }

      const id = createUserId();
      const newUser: StoredUser = {
        id,
        name: fallbackName,
        email: fallbackEmail,
        provider,
        avatarColor: pickAvatarColor(Object.keys(previous.users).length + 3),
        createdQuizIds: [],
        likedQuizIds: [],
        followingCreatorIds: [],
        history: []
      };

      return {
        currentUserId: id,
        users: {
          ...previous.users,
          [id]: newUser
        }
      };
    });
    setAuthDialogOpen(false);
  };

  const signOut = () => {
    setState((previous) => ({ ...previous, currentUserId: null }));
  };

  const toggleLikeQuiz = (quizId: string) => {
    if (!state.currentUserId) {
      setAuthDialogOpen(true);
      return;
    }

    setState((previous) => {
      const current = previous.users[previous.currentUserId ?? ""];
      if (!current) {
        return previous;
      }

      const hasLiked = current.likedQuizIds.includes(quizId);
      const likedQuizIds = hasLiked
        ? current.likedQuizIds.filter((id) => id !== quizId)
        : [...current.likedQuizIds, quizId];

      return {
        ...previous,
        users: {
          ...previous.users,
          [current.id]: {
            ...current,
            likedQuizIds
          }
        }
      };
    });
  };

  const toggleFollowCreator = (creatorId: string) => {
    if (!state.currentUserId) {
      setAuthDialogOpen(true);
      return;
    }

    setState((previous) => {
      const current = previous.users[previous.currentUserId ?? ""];
      if (!current) return previous;

      const isFollowing = current.followingCreatorIds.includes(creatorId);
      const followingCreatorIds = isFollowing
        ? current.followingCreatorIds.filter((id) => id !== creatorId)
        : [...current.followingCreatorIds, creatorId];

      return {
        ...previous,
        users: {
          ...previous.users,
          [current.id]: {
            ...current,
            followingCreatorIds
          }
        }
      };
    });
  };

  const recordQuizCompletion = (quizId: string, score: number, totalQuestions: number) => {
    if (!state.currentUserId) return;

    setState((previous) => {
      const current = previous.users[previous.currentUserId ?? ""];
      if (!current) return previous;

      const timestamp = new Date().toISOString();
      const existingIndex = current.history.findIndex((entry) => entry.quizId === quizId);
      const history = [...current.history];

      if (existingIndex >= 0) {
        history[existingIndex] = { quizId, score, totalQuestions, completedAt: timestamp };
      } else {
        history.unshift({ quizId, score, totalQuestions, completedAt: timestamp });
      }

      return {
        ...previous,
        users: {
          ...previous.users,
          [current.id]: {
            ...current,
            history
          }
        }
      };
    });
  };

  const recordQuizCreated = (quizId: string) => {
    if (!state.currentUserId) return;

    setState((previous) => {
      const current = previous.users[previous.currentUserId ?? ""];
      if (!current) return previous;

      if (current.createdQuizIds.includes(quizId)) {
        return previous;
      }

      return {
        ...previous,
        users: {
          ...previous.users,
          [current.id]: {
            ...current,
            createdQuizIds: [...current.createdQuizIds, quizId]
          }
        }
      };
    });
  };

  const openAuthDialog = () => setAuthDialogOpen(true);
  const closeAuthDialog = () => setAuthDialogOpen(false);

  return (
    <UserContext.Provider
      value={{
        hydrated,
        user,
        users: state.users,
        signInWithEmail,
        signInWithProvider,
        signOut,
        toggleLikeQuiz,
        toggleFollowCreator,
        recordQuizCompletion,
        recordQuizCreated,
        openAuthDialog,
        closeAuthDialog,
        isAuthDialogOpen
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export type { StoredUser as User, QuizHistoryEntry };
