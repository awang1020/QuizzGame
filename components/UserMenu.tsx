"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

function Avatar({ name, color }: { name: string; color: string }) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .padEnd(2, "");
  }, [name]);

  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${color}`.trim()}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

type AuthDialogProps = {
  open: boolean;
  onClose: () => void;
  onEmailSignIn: (payload: { name: string; email: string }) => void;
  onProviderSignIn: (provider: "google" | "microsoft") => void;
};

function AuthDialog({ open, onClose, onEmailSignIn, onProviderSignIn }: AuthDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Merci d'indiquer une adresse e-mail valide.");
      return;
    }
    setError(null);
    onEmailSignIn({ name, email });
  };

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm" onMouseDown={handleOverlayClick}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-left shadow-2xl shadow-primary/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Rejoignez QuizzyQuizz</h2>
            <p className="mt-1 text-sm text-slate-300">
              Créez un compte pour suivre vos quiz, aimer des contenus et suivre vos créateurs favoris.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/10 p-1 text-slate-300 transition hover:border-primary/50 hover:text-white"
            aria-label="Fermer la fenêtre de connexion"
          >
            ✕
          </button>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="auth-name" className="text-sm font-medium text-white">
              Nom
            </label>
            <input
              id="auth-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Votre prénom"
              className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="name"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="auth-email" className="text-sm font-medium text-white">
              Adresse e-mail
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@example.com"
              className="rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="email"
              required
            />
          </div>
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
          >
            Continuer avec l'e-mail
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-400">ou</p>
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => onProviderSignIn("google")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary/50 hover:text-white"
            >
              <span aria-hidden>🔐</span>
              Continuer avec Google
            </button>
            <button
              type="button"
              onClick={() => onProviderSignIn("microsoft")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary/50 hover:text-white"
            >
              <span aria-hidden>🪟</span>
              Continuer avec Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserMenu() {
  const pathname = usePathname();
  const {
    hydrated,
    user,
    signInWithEmail,
    signInWithProvider,
    signOut,
    openAuthDialog,
    closeAuthDialog,
    isAuthDialogOpen
  } = useUser();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    signOut();
    setMenuOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={menuRef}>
      {user ? (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 pr-3 text-sm font-semibold text-slate-100 transition hover:border-primary/50 hover:text-white"
          >
            <Avatar name={user.name} color={user.avatarColor} />
            <span className="hidden sm:inline">{user.name}</span>
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl shadow-primary/20">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
              <div className="mt-4 grid gap-2 text-sm">
                <Link
                  href="/profile"
                  className="rounded-lg border border-white/5 px-3 py-2 text-slate-200 transition hover:border-primary/50 hover:text-white"
                >
                  Voir mon profil
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg border border-white/5 px-3 py-2 text-left text-slate-200 transition hover:border-primary/50 hover:text-white"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <button
          type="button"
          onClick={openAuthDialog}
          disabled={!hydrated}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary/50 hover:text-white disabled:opacity-60"
        >
          Se connecter
        </button>
      )}
      <AuthDialog
        open={isAuthDialogOpen}
        onClose={closeAuthDialog}
        onEmailSignIn={signInWithEmail}
        onProviderSignIn={(provider) => signInWithProvider(provider)}
      />
    </div>
  );
}
