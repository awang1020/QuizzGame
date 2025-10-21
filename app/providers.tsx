"use client";

import { QuizProvider } from "@/context/QuizContext";
import { UserProvider } from "@/context/UserContext";

export default function QuizProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <QuizProvider>{children}</QuizProvider>
    </UserProvider>
  );
}
