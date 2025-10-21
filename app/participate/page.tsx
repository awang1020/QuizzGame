import Link from "next/link";
import ParticipantJoinForm from "@/components/ParticipantJoinForm";

export default function ParticipateLandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-5 text-center md:text-left">
        <span className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-light md:self-start">
          Participation
        </span>
        <h1 className="text-4xl font-semibold text-white sm:text-5xl">Rejoignez un quiz en direct</h1>
        <p className="text-lg text-slate-200 sm:max-w-3xl">
          Saisissez le code PIN partagé par votre animateur ou utilisez directement le lien de participation. Dès que vous êtes connecté, vous suivrez les questions en temps réel, avec classement en direct et feedback instantané.
        </p>
      </header>
      <ParticipantJoinForm />
      <footer className="flex flex-col items-center gap-3 text-sm text-slate-400 md:flex-row md:justify-between">
        <p>Besoin d&apos;un compte animateur ? <Link href="/" className="text-primary underline-offset-4 hover:underline">Retourner à l&apos;accueil</Link></p>
        <p>Les sessions en direct attribuent des points pour chaque bonne réponse : soyez rapide et précis !</p>
      </footer>
    </main>
  );
}
