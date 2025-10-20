"use client";

import { QuizProvider } from "@/context/QuizContext";

export default function QuizProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return <QuizProvider>{children}</QuizProvider>;
}
