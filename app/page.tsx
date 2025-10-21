import LandingHero from "@/components/LandingHero";
import QuizSelection from "@/components/QuizSelection";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <LandingHero />
      <section
        id="quiz-overview"
        className="mx-auto w-full max-w-6xl px-6 pb-20"
        aria-labelledby="overview-heading"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 shadow-xl shadow-primary/10 sm:px-10">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-light md:self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              What&apos;s inside?
            </span>
            <h2 id="overview-heading" className="text-3xl font-semibold text-white sm:text-4xl">
              Everything you need for confident Fabric readiness
            </h2>
            <p className="text-base text-slate-300 sm:text-lg">
              Each quiz blends scenario-driven questions, instant explanations, and pacing guidance so your team stays focused on
              impact—not guesswork.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "25 curated questions",
                description: "Multiple-choice challenges spanning fundamentals, governance, and advanced operations.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-primary"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10" />
                    <path d="M7 12h6" />
                  </svg>
                )
              },
              {
                title: "Adaptive feedback",
                description: "Clear explanations after every answer help learners reinforce wins and close gaps instantly.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-primary"
                    aria-hidden="true"
                  >
                    <path d="M12 20h9" />
                    <path d="M16 4H8a2 2 0 0 0-2 2v12l6-3 6 3V6a2 2 0 0 0-2-2Z" />
                  </svg>
                )
              },
              {
                title: "Progress tracking",
                description:
                  "Smart recommendations and responsive dashboards keep teams aligned on what comes next.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10 text-primary"
                    aria-hidden="true"
                  >
                    <path d="M3 3v18h18" />
                    <path d="M7 16h.01" />
                    <path d="M11 12h.01" />
                    <path d="M15 8h.01" />
                    <path d="M7 16h4l4-4 4-8" />
                  </svg>
                )
              }
            ].map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-lg shadow-primary/10"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {feature.icon}
                </span>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <QuizSelection />
    </main>
  );
}
