export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-lg shadow-primary/10">
        <p className="text-sm uppercase tracking-[0.2em] text-primary-light">Oups...</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Page introuvable</h1>
        <p className="mt-3 text-sm text-slate-300">
          Le contenu que vous recherchez n&apos;existe plus ou a été déplacé. Retournez à l&apos;accueil ou ouvrez le studio pour créer
          un nouveau quiz.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            Retour à l&apos;accueil
          </a>
          <a
            href="/studio"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-primary hover:bg-primary/10 hover:text-white"
          >
            Ouvrir le studio
          </a>
        </div>
      </div>
    </main>
  );
}
