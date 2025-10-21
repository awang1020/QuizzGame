"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { creators } from "@/data/creators";
import { quizzes } from "@/data/quizzes";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date inconnue";
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export default function ProfilePage() {
  const { hydrated, user, openAuthDialog } = useUser();

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg text-slate-200">Chargement de votre espace personnel…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl font-semibold text-white">Connectez-vous pour accéder à votre profil</h1>
        <p className="max-w-xl text-sm text-slate-300">
          Historique des quiz, créateurs suivis et favoris vous attendent ici. Connectez-vous pour retrouver votre progression.
        </p>
        <button
          type="button"
          onClick={openAuthDialog}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
        >
          Se connecter
        </button>
      </main>
    );
  }

  const playedHistory = user.history;
  const createdQuizzes = useMemo(() => quizzes.filter((quiz) => quiz.creatorId === user.id), [user.id]);
  const likedQuizzes = useMemo(
    () => quizzes.filter((quiz) => user.likedQuizIds.includes(quiz.id)),
    [user.likedQuizIds]
  );
  const followingCreators = useMemo(
    () => creators.filter((creator) => user.followingCreatorIds.includes(creator.id)),
    [user.followingCreatorIds]
  );

  const totalQuizzesPlayed = playedHistory.length;
  const totalQuestionsAnswered = playedHistory.reduce((acc, entry) => acc + entry.totalQuestions, 0);
  const averageAccuracy = totalQuizzesPlayed
    ? Math.round(
        (playedHistory.reduce((acc, entry) => acc + (entry.totalQuestions ? entry.score / entry.totalQuestions : 0), 0) /
          totalQuizzesPlayed) *
          100
      )
    : 0;
  const bestPerformance = playedHistory.reduce((best, entry) => {
    if (entry.totalQuestions === 0) return best;
    const accuracy = Math.round((entry.score / entry.totalQuestions) * 100);
    return Math.max(best, accuracy);
  }, 0);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-900/40 p-8 shadow-2xl shadow-primary/20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary-light">Profil</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Ravi de vous revoir, {user.name} 👋</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300">
              Retrouvez vos performances, vos quiz favoris et les experts Microsoft Fabric que vous suivez.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-primary/20 text-xl font-semibold text-white">
              {user.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("")}
            </div>
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-white">{user.email}</p>
              <p>{followingCreators.length} créateurs suivis • {user.likedQuizIds.length} quiz likés</p>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Quiz terminés</p>
            <p className="mt-2 text-3xl font-semibold text-white">{totalQuizzesPlayed}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Questions répondues</p>
            <p className="mt-2 text-3xl font-semibold text-white">{totalQuestionsAnswered}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Précision moyenne</p>
            <p className="mt-2 text-3xl font-semibold text-white">{averageAccuracy}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Meilleure performance</p>
            <p className="mt-2 text-3xl font-semibold text-white">{bestPerformance}%</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Historique de vos quiz</h2>
          <p className="text-sm text-slate-300">Suivez vos progrès et comparez vos résultats au fil du temps.</p>
        </div>
        {playedHistory.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Vous n'avez pas encore terminé de quiz. Lancez-vous dès aujourd'hui !
          </p>
        ) : (
          <div className="grid gap-4">
            {playedHistory.map((entry) => {
              const quiz = quizzes.find((item) => item.id === entry.quizId);
              const accuracy = entry.totalQuestions ? Math.round((entry.score / entry.totalQuestions) * 100) : 0;
              return (
                <article
                  key={`${entry.quizId}-${entry.completedAt}`}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{quiz?.title ?? "Quiz inconnu"}</p>
                    <p className="text-xs text-slate-400">Terminé le {formatDate(entry.completedAt)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {accuracy}%
                    </span>
                    <span className="text-sm text-slate-300">
                      Score {entry.score} / {entry.totalQuestions}
                    </span>
                    <Link
                      href="/"
                      className="text-sm font-semibold text-primary-light transition hover:text-primary"
                    >
                      Rejouer
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Quiz que vous aimez</h2>
          <p className="text-sm text-slate-300">Retrouvez rapidement vos favoris pour y replonger ou les partager.</p>
        </div>
        {likedQuizzes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Aucun quiz liké pour le moment. Ajoutez vos préférés depuis le catalogue.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {likedQuizzes.map((quiz) => (
              <article key={quiz.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-primary/10">
                <p className="text-sm font-semibold text-white">{quiz.title}</p>
                <p className="mt-2 text-sm text-slate-300">{quiz.description}</p>
                <p className="mt-3 text-xs text-slate-400">{quiz.focusArea}</p>
                <Link
                  href="/quiz"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-light transition hover:text-primary"
                >
                  Reprendre ce quiz
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Créateurs que vous suivez</h2>
          <p className="text-sm text-slate-300">Restez à jour des dernières créations d'experts Fabric.</p>
        </div>
        {followingCreators.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Commencez à suivre vos créateurs favoris pour découvrir leurs nouveaux quiz.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {followingCreators.map((creator) => (
              <article key={creator.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${creator.avatarColor} text-sm font-semibold text-white`}
                  aria-hidden="true"
                >
                  {creator.avatarInitials}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{creator.name}</p>
                  <p className="text-xs text-slate-400">{creator.role}</p>
                  <p className="text-xs text-slate-500">{creator.followers.toLocaleString("fr-FR")} abonnés</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold text-white">Vos créations</h2>
        {createdQuizzes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Vous n'avez pas encore publié de quiz. Inspirez-vous du catalogue pour créer votre premier contenu.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {createdQuizzes.map((quiz) => (
              <article key={quiz.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-primary/10">
                <p className="text-sm font-semibold text-white">{quiz.title}</p>
                <p className="mt-2 text-sm text-slate-300">{quiz.description}</p>
                <p className="mt-3 text-xs text-slate-400">{quiz.focusArea}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
