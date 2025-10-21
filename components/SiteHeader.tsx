"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "@/components/UserMenu";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`text-sm font-semibold transition hover:text-white ${
        isActive ? "text-white" : "text-slate-300"
      }`}
    >
      {label}
    </Link>
  );
}

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            Q
          </span>
          QuizzyQuizz
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink href="/" label="Accueil" />
          <NavLink href="/profile" label="Profil" />
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
