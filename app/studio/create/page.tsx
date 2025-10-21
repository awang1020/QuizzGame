"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizBuilderForm from "@/components/studio/QuizBuilderForm";
import { useQuiz } from "@/context/QuizContext";

export default function CreateQuizPage() {
  const router = useRouter();
  const { createQuiz } = useQuiz();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (quizDefinition: Parameters<typeof createQuiz>[0]) => {
    const newQuiz = createQuiz(quizDefinition);
    setSuccessMessage("Votre quiz a été créé ! Vous pouvez maintenant le partager ou le personnaliser davantage.");
    router.push(`/studio/${newQuiz.id}/edit?created=1`);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-6 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/10">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
            Création
          </span>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Créer un nouveau quiz interactif</h1>
          <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
            Composez un quiz sur-mesure : médias interactifs, réponses libres, points personnalisés et chronomètre par question.
            Une fois publié, partagez le lien pour faire jouer votre audience en direct ou en autonomie.
          </p>
        </div>
        {successMessage ? (
          <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </p>
        ) : null}
      </header>

      <QuizBuilderForm submitLabel="Créer le quiz" onSubmit={handleSubmit} />
    </main>
  );
}
