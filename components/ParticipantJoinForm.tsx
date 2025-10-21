"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { quizzes } from "@/data/quizzes";

export default function ParticipantJoinForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  const availableCodes = useMemo(() => {
    return quizzes.map((quiz) => ({
      id: quiz.id,
      code: quiz.accessCode,
      link: quiz.joinLink,
      title: quiz.title
    }));
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedCode = code.replace(/\s+/g, "").toLowerCase();
    const normalizedLink = link.trim().toLowerCase();

    const matchedQuiz = quizzes.find((quiz) => {
      const codeMatch = quiz.accessCode.toLowerCase() === normalizedCode && normalizedCode.length > 0;
      const linkMatch =
        normalizedLink.length > 0 &&
        (quiz.joinLink.toLowerCase() === normalizedLink || normalizedLink.endsWith(`/${quiz.id.toLowerCase()}`));
      return codeMatch || linkMatch;
    });

    if (!matchedQuiz) {
      setError("Aucun quiz correspondant trouvé. Vérifiez le code PIN ou le lien partagé.");
      return;
    }

    router.push(`/participate/session?quiz=${matchedQuiz.id}`);
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-primary/10">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="pin" className="text-sm font-semibold uppercase tracking-wide text-primary-light">
            Rejoindre avec un code PIN
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="pin"
              inputMode="numeric"
              pattern="[0-9]*"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Ex : 482913"
              className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 transition hover:bg-primary/90"
            >
              Rejoindre la session
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">ou</span>
          <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="link" className="text-sm font-semibold uppercase tracking-wide text-primary-light">
            Rejoindre avec un lien
          </label>
          <input
            id="link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="Collez ici le lien de participation"
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
      </form>

      <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Codes disponibles</p>
        <ul className="mt-3 flex flex-col gap-3">
          {availableCodes.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-1 rounded-xl border border-white/5 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-white">{entry.title}</span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Code PIN : {entry.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 break-all">Lien : {entry.link}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
