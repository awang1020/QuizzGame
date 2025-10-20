import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QuizProviders from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizzyQuizz",
  description: "Interactive quiz platform built with Next.js"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QuizProviders>{children}</QuizProviders>
      </body>
    </html>
  );
}
