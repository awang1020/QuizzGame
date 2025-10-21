import LandingHero from "@/components/LandingHero";
import QuizSelection from "@/components/QuizSelection";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col">
      <LandingHero />
      <QuizSelection />
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-20">
        <h2 className="text-3xl font-semibold text-white">Why teams choose QuizzyQuizz</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Frictionless setup",
              description:
                "Launch quizzes in minutes with structured data files or API integrations that keep content maintainable."
            },
            {
              title: "Actionable analytics",
              description:
                "Give learners instant feedback and give facilitators clarity on how the cohort performed."
            },
            {
              title: "Built for scale",
              description:
                "Add new quizzes by updating data sources—routing, theming, and state management stay consistent."
            }
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10"
            >
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
