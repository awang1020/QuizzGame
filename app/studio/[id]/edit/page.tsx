"use client";

import Link from "next/link";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import QuizBuilderForm from "@/components/studio/QuizBuilderForm";
import { useQuiz } from "@/context/QuizContext";

export default function EditQuizPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { quizzes, updateQuiz, defaultQuizIds, duplicateQuiz } = useQuiz();
  const quiz = useMemo(() => quizzes.find((item) => item.id === params.id), [params.id, quizzes]);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get("created") ? "Quiz créé avec succès ! Personnalisez-le avant de le partager." : null
  );

  if (!quiz) {
    return notFound();
  }

  const isDefault = defaultQuizIds.has(quiz.id);

  const handleSubmit = (definition: Parameters<typeof updateQuiz>[1]) => {
    if (isDefault) {
      const duplicated = duplicateQuiz(quiz.id);
      if (!duplicated) return;
      updateQuiz(duplicated.id, definition);
      setSuccessMessage("Le quiz d'origine a été dupliqué. Modifiez librement votre version personnalisée.");
      router.replace(`/studio/${duplicated.id}/edit`);
      return;
    }

    const updated = updateQuiz(quiz.id, definition);
    if (updated) {
      setSuccessMessage("Modifications enregistrées ✅");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            Édition
          </span>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Modifier : {quiz.title}</h1>
              <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
                Ajustez vos questions, ajoutez du contenu riche et publiez la version définitive pour vos apprenants.
              </p>
            </div>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:bg-primary/10 hover:text-white"
            >
              ← Retour au studio
            </Link>
          </div>
        </div>
        {isDefault ? (
          <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            Ce quiz provient de la bibliothèque officielle. À la sauvegarde, une copie personnalisable sera créée dans votre
            espace sans modifier l&apos;original.
          </p>
        ) : null}
        {successMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}
      </header>

      <QuizBuilderForm initialQuiz={quiz} submitLabel={isDefault ? "Dupliquer et modifier" : "Enregistrer les changements"} onSubmit={handleSubmit} />
    </main>
  );
}
