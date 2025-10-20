"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { useQuiz } from "@/context/QuizContext";

export default function QuizPage() {
  const router = useRouter();
  const { hasStarted, startQuiz, currentQuiz, currentQuestion, currentQuestionIndex, totalQuestions } = useQuiz();

  useEffect(() => {
    if (!hasStarted) {
      startQuiz(currentQuiz.id);
    }
  }, [hasStarted, startQuiz, currentQuiz.id]);

  if (!currentQuestion) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-lg text-slate-200">Fetching your quiz...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-wide text-primary-light">{currentQuiz.title}</p>
        <h1 className="text-3xl font-semibold text-white">Let&apos;s test your knowledge</h1>
        <p className="text-slate-300">{currentQuiz.description}</p>
        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
      </header>
      <QuestionCard
        questionId={currentQuestion.id}
        onAnswered={(isLastQuestion) => {
          if (isLastQuestion) {
            router.push("/results");
          }
        }}
      />
    </main>
  );
}
