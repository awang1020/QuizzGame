"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { creators } from "@/data/creators";
import { useQuiz } from "@/context/QuizContext";
import { useUser } from "@/context/UserContext";

const iconStyles = [
  "from-sky-400/80 via-blue-500/70 to-indigo-500/80",
  "from-emerald-400/80 via-green-500/70 to-teal-500/80",
  "from-amber-400/80 via-orange-500/70 to-rose-500/80"
];

function DifficultyIcon({ index }: { index: number }) {
  const gradient = iconStyles[index % iconStyles.length];

  return (
    <span
      aria-hidden="true"
      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/30`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
      >
        <path d="m9 18 6-6-6-6" />
        <path d="M5 5h4v4H5z" />
      </svg>
    </span>
  );
}

function formatDuration(seconds?: number) {
  if (!seconds) return "Self-paced";
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export default function QuizSelection() {
  const router = useRouter();
  const {
    quizzes,
    startQuiz,
    currentQuiz,
    hasOngoingSession,
    isQuizComplete,
    hasStarted,
    shareSettings,
    setQuizVisibility,
    getShareLink
  } = useQuiz();
  const { user, toggleLikeQuiz, toggleFollowCreator, openAuthDialog } = useUser();
  const [copiedQuizId, setCopiedQuizId] = useState<string | null>(null);

  const orderedQuizzes = useMemo(() => {
    return [...quizzes].sort((a, b) => (a.level ?? Number.MAX_SAFE_INTEGER) - (b.level ?? Number.MAX_SAFE_INTEGER));
  }, [quizzes]);

  if (orderedQuizzes.length === 0) {
    return null;
  }

  const currentIndex = useMemo(() => {
    if (!currentQuiz) return -1;
    return orderedQuizzes.findIndex((quiz) => quiz.id === currentQuiz.id);
  }, [currentQuiz, orderedQuizzes]);

  const recommendedQuiz = useMemo(() => {
    if (orderedQuizzes.length === 0) return undefined;
    if (!hasStarted) {
      return orderedQuizzes[0];
    }

    const fallbackQuiz = orderedQuizzes[Math.max(0, currentIndex)] ?? orderedQuizzes[0];

    if (hasOngoingSession) {
      return currentQuiz ?? fallbackQuiz;
    }

    if (isQuizComplete) {
      const nextQuiz = orderedQuizzes[Math.min(currentIndex + 1, orderedQuizzes.length - 1)];
      return nextQuiz ?? fallbackQuiz;
    }

    return fallbackQuiz;
  }, [currentIndex, currentQuiz, hasOngoingSession, hasStarted, isQuizComplete, orderedQuizzes]);

  const completedLevels = useMemo(() => {
    if (!hasStarted) return 0;
    if (currentIndex < 0) return 0;
    if (hasOngoingSession) return currentIndex;
    return Math.min(orderedQuizzes.length, currentIndex + (isQuizComplete ? 1 : 0));
  }, [currentIndex, hasOngoingSession, hasStarted, isQuizComplete, orderedQuizzes.length]);

  const progressPercentage = Math.round((completedLevels / orderedQuizzes.length) * 100);

  const handleStart = (quizId: string) => {
    const started = startQuiz(quizId);
    if (started) {
      router.push("/quiz");
    }
  };

  const handleVisibilityToggle = (quizId: string, isCurrentlyPublic: boolean) => {
    const nextVisibility = !isCurrentlyPublic;
    setQuizVisibility(quizId, nextVisibility);
    if (!nextVisibility && copiedQuizId === quizId) {
      setCopiedQuizId(null);
    }
  };

  const handleCopyLink = async (quizId: string) => {
    const shareLink = getShareLink(quizId);
    if (!shareLink) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else if (typeof document !== "undefined") {
        const textarea = document.createElement("textarea");
        textarea.value = shareLink;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedQuizId(quizId);
      window.setTimeout(() => {
        setCopiedQuizId((prev) => (prev === quizId ? null : prev));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy quiz share link", error);
    }
  };

  return (
    <section id="quiz-catalog" className="w-full px-6 pb-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-6 text-center md:text-left">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light md:self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Choose your quiz level
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Training designed for every stage</h2>
            <p className="text-base text-slate-300 sm:text-lg">
              Begin with the fundamentals, then advance through governance, workloads, and enterprise rollouts. Each level builds on the last with adaptive feedback and rich analytics.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200 shadow-lg shadow-primary/10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <svg viewBox="0 0 48 48" className="h-full w-full text-primary" aria-hidden="true">
                  <circle cx="24" cy="24" r="20" className="fill-primary/20" />
                  <path d="M16 28.5 21.5 33l11-17" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Level progress</p>
                <p>
                  {completedLevels} of {orderedQuizzes.length} levels completed
                </p>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" role="presentation">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPercentage}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs text-slate-400 md:self-end">{progressPercentage}% complete</span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3" role="list">
          {orderedQuizzes.map((quiz, index) => {
            const durationLabel = formatDuration(quiz.duration);
            const questionCount = quiz.questions.length;
            const isRecommended = recommendedQuiz?.id === quiz.id;
            const isActive = hasOngoingSession && currentQuiz?.id === quiz.id;
            const isComplete = completedLevels >= (quiz.level ?? index + 1);
            const shareConfig = shareSettings[quiz.id] ?? { isPublic: false };
            const shareLink = getShareLink(quiz.id);
            const isPublic = shareConfig.isPublic;
            const isCopied = copiedQuizId === quiz.id;
            const displayLevel = quiz.level ?? index + 1;
            const isLiked = Boolean(user?.likedQuizIds.includes(quiz.id));
            const baseLikes = quiz.communityLikes ?? 0;
            const likeTotal = baseLikes + (isLiked ? 1 : 0);

            const catalogCreator = creators.find((candidate) => candidate.id === quiz.creatorId);
            const ownerCreator = user && quiz.creatorId === user.id
              ? {
                  id: user.id,
                  name: user.name,
                  role: "Votre création",
                  avatarInitials: user.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join(""),
                  avatarColor: user.avatarColor ?? "from-primary/40 to-primary/20"
                }
              : null;
            const creator = catalogCreator ?? ownerCreator;
            const creatorId = creator?.id ?? quiz.creatorId;
            const isOwnCreator = Boolean(user && creatorId && user.id === creatorId);
            const isFollowingCreator = Boolean(creatorId && user?.followingCreatorIds.includes(creatorId));

            return (
              <article
                key={quiz.id}
                role="listitem"
                className={`group flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10 transition duration-200 hover:-translate-y-1 hover:border-primary/60 hover:bg-white/10 focus-within:-translate-y-1 focus-within:border-primary/60 focus-within:bg-white/10 ${
                  isActive ? "ring-2 ring-primary/70" : ""
                }`}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <DifficultyIcon index={index} />
                    <div className="flex flex-col items-end gap-2 text-right">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                        Level {displayLevel}
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-100">
                          {quiz.difficulty ?? "custom"}
                        </span>
                      </span>
                      {isRecommended ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-1 text-[11px] font-semibold text-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
                          Recommended for you
                        </span>
                      ) : null}
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                          In progress
                        </span>
                      ) : null}
                      {isComplete && !isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-200">
                          Completed
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-white">{quiz.title}</h3>
                    <p className="text-sm text-slate-300">{quiz.description}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Focus area</p>
                    <p className="mt-2 text-sm text-slate-200">{quiz.focusArea ?? "Quiz personnalisé"}</p>
                    <p className="mt-3 text-xs text-slate-400">{quiz.recommendedFor ?? "Partagez ce quiz avec votre audience"}</p>
                    {quiz.tags && quiz.tags.length > 0 ? (
                      <p className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-primary-light">
                        {quiz.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5">
                            #{tag}
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <dl className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      >
                        <path d="M4 4h16v16H4z" />
                        <path d="M8 8h8" />
                        <path d="M8 12h4" />
                      </svg>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Questions</dt>
                        <dd className="font-semibold text-white">{questionCount}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <polyline points="12 7 12 12 15 15" />
                      </svg>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Estimated time</dt>
                        <dd className="font-semibold text-white">{durationLabel}</dd>
                      </div>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => handleStart(quiz.id)}
                    aria-label={`Start the ${quiz.title} quiz`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {isActive ? "Resume quiz" : "Start quiz"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Sharing</p>
                          <p className="text-xs text-slate-300">
                            {isPublic ? "Public — anyone with the link can join" : "Private — only visible to you"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleVisibilityToggle(quiz.id, isPublic)}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                            isPublic
                              ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200"
                              : "border-white/20 bg-white/10 text-slate-200"
                          }`}
                        >
                          {isPublic ? "Public" : "Private"}
                        </button>
                      </div>
                      {isPublic && shareLink ? (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <span
                              className="flex-1 truncate rounded-lg bg-slate-950/60 px-3 py-2 text-left text-xs font-medium text-slate-200"
                              title={shareLink}
                            >
                              {shareLink}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(quiz.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-100 transition hover:border-primary/60 hover:text-white"
                            >
                              {isCopied ? "Copied" : "Copy link"}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                                aria-hidden="true"
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">Send this link to teammates to invite them to the quiz.</p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">Make the quiz public to generate a shareable invite link.</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white bg-gradient-to-br ${
                            creator?.avatarColor ?? "from-slate-500 to-slate-700"
                          }`}
                          aria-hidden="true"
                        >
                          {creator?.avatarInitials ?? "QQ"}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{creator?.name ?? "Créateur invité"}</p>
                          <p className="text-xs text-slate-400">{creator?.role ?? "Expert Fabric"}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!creatorId) return;
                          if (!user) {
                            openAuthDialog();
                            return;
                          }
                          if (isOwnCreator) return;
                          toggleFollowCreator(creatorId);
                        }}
                        disabled={isOwnCreator}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-wider transition ${
                          isFollowingCreator
                            ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-200"
                            : "border-white/10 bg-white/5 text-slate-100 hover:border-primary/50 hover:text-white"
                        } ${isOwnCreator ? "opacity-50" : ""}`.trim()}
                      >
                        {isOwnCreator ? "Vous" : isFollowingCreator ? "Suivi" : "Suivre"}
                      </button>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (!user) {
                            openAuthDialog();
                            return;
                          }
                          toggleLikeQuiz(quiz.id);
                        }}
                        aria-pressed={isLiked}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isLiked
                            ? "border-rose-400/60 bg-rose-500/10 text-rose-100"
                            : "border-white/10 bg-white/5 text-slate-100 hover:border-primary/50 hover:text-white"
                        }`}
                      >
                        <span aria-hidden>{isLiked ? "❤️" : "🤍"}</span>
                        <span>
                          {likeTotal} {likeTotal === 1 ? "like" : "likes"}
                        </span>
                      </button>
                      <p className="text-xs text-slate-400">Code PIN : {quiz.accessCode}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
