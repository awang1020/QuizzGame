"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

export default function StudioPage() {
  const router = useRouter();
  const { quizzes, customQuizzes, duplicateQuiz, deleteQuiz, defaultQuizIds, startQuiz } = useQuiz();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    customQuizzes.forEach((quiz) => quiz.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [customQuizzes]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    customQuizzes.forEach((quiz) => {
      if (quiz.category) set.add(quiz.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [customQuizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchesSearch = `${quiz.title} ${quiz.description} ${quiz.tags?.join(" ") ?? ""}`
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase());
      const matchesCategory = selectedCategory === "all" || quiz.category === selectedCategory;
      const matchesTag =
        selectedTag === "all" || (quiz.tags?.map((tag) => tag.toLocaleLowerCase()).includes(selectedTag.toLocaleLowerCase()) ?? false);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [quizzes, searchTerm, selectedCategory, selectedTag]);

  const totalCustom = customQuizzes.length;

  const handleDuplicate = (quizId: string) => {
    const duplicated = duplicateQuiz(quizId);
    if (duplicated) {
      router.push(`/studio/${duplicated.id}/edit`);
    }
  };

  const handleDelete = (quizId: string) => {
    const confirmation = window.confirm("Supprimer définitivement ce quiz ?");
    if (!confirmation) return;
    deleteQuiz(quizId);
  };

  const handleShare = async (quizId: string) => {
    const shareUrl = `${window.location.origin}/quiz?id=${quizId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Lien de partage copié dans le presse-papier ✨");
      setTimeout(() => setShareMessage(null), 4000);
    } catch (error) {
      console.error("Unable to copy share link", error);
      setShareMessage("Impossible de copier le lien automatiquement. Essayez manuellement : " + shareUrl);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              Studio
            </span>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Votre studio de quiz interactifs</h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Créez, personnalisez et organisez vos quiz en quelques clics. Ajoutez des médias, des questions à choix multiples,
              vrai/faux ou réponses libres puis partagez le résultat instantanément avec votre communauté.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-sm text-slate-200">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
              <span>Total de quiz</span>
              <span className="text-base font-semibold text-white">{quizzes.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
              <span>Quiz personnalisés</span>
              <span className="text-base font-semibold text-white">{totalCustom}</span>
            </div>
            <Link
              href="/studio/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              + Créer un nouveau quiz
            </Link>
          </div>
        </div>
        {shareMessage ? (
          <p className="mt-4 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary-light">{shareMessage}</p>
        ) : null}
      </header>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10">
        <h2 className="text-xl font-semibold text-white">Filtrer vos quiz</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm text-slate-200">
            Recherche
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Titre, description, tag..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Catégorie
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">Toutes</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Tag
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">Tous</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-white">Bibliothèque de quiz</h2>
          <p className="text-sm text-slate-300">
            {filteredQuizzes.length} quiz{filteredQuizzes.length > 1 ? "s" : ""} répondent à vos critères.
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          {filteredQuizzes.map((quiz) => {
            const isCustom = !defaultQuizIds.has(quiz.id);
            const totalPoints = quiz.questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
            return (
              <article
                key={quiz.id}
                className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-white">{quiz.title}</h3>
                      <p className="text-sm text-slate-300">{quiz.description}</p>
                    </div>
                    {quiz.coverImage ? (
                      <img
                        src={quiz.coverImage}
                        alt="Illustration du quiz"
                        className="h-20 w-20 rounded-2xl border border-white/10 object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    {quiz.category ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        {quiz.category}
                      </span>
                    ) : null}
                    {quiz.tags?.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <dl className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="text-primary">❓</span>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Questions</dt>
                        <dd className="font-semibold text-white">{quiz.questions.length}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <span className="text-primary">⭐</span>
                      <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-400">Points</dt>
                        <dd className="font-semibold text-white">{totalPoints}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      startQuiz(quiz.id);
                      router.push("/quiz");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                  >
                    Lancer
                  </button>
                  <Link
                    href={`/studio/${quiz.id}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:bg-primary/10 hover:text-white"
                  >
                    Modifier
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(quiz.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:bg-primary/10 hover:text-white"
                  >
                    Dupliquer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(quiz.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light transition hover:border-primary hover:bg-primary/20 hover:text-white"
                  >
                    Partager
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(quiz.id)}
                    disabled={!isCustom}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-400"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            );
          })}
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-sm text-slate-300">
              Aucun quiz ne correspond à votre recherche. Essayez d&apos;ajuster les filtres ou créez un nouveau quiz personnalisé.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
