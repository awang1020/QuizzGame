import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import QuizProviders from "./providers";
import SiteHeader from "@/components/SiteHeader";

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
      <body className={`${inter.className} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100`}>
        <QuizProviders>
          <div className="min-h-screen">
            <AppHeader />
            {children}
          </div>
        </QuizProviders>
      </body>
    </html>
  );
}
