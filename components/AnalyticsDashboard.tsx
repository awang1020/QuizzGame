"use client";

import { useMemo } from "react";
import { useQuiz } from "@/context/QuizContext";

export default function AnalyticsDashboard() {
  const { currentQuiz, attemptHistory } = useQuiz();

  const attempts = useMemo(
    () => attemptHistory.filter((attempt) => attempt.quizId === currentQuiz.id),
    [attemptHistory, currentQuiz.id]
  );

  if (attempts.length === 0) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-primary/10">
        <h2 className="text-2xl font-semibold text-white">📊 Analyse et résultats</h2>
        <p className="mt-3 text-sm text-slate-300">
          Les résultats détaillés apparaîtront dès qu&apos;un participant aura terminé ce quiz.
        </p>
      </section>
    );
  }

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((acc, attempt) => acc + attempt.score, 0);
  const averageScore = totalAttempts === 0 ? 0 : totalScore / totalAttempts;
  const averageAccuracy =
    totalAttempts === 0 ? 0 : attempts.reduce((acc, attempt) => acc + attempt.accuracy, 0) / totalAttempts;
  const averageDurationSeconds =
    totalAttempts === 0 ? 0 : attempts.reduce((acc, attempt) => acc + attempt.durationMs, 0) / (totalAttempts * 1000);
  const averageQuestionTimeSeconds =
    totalAttempts === 0
      ? 0
      : attempts.reduce((acc, attempt) => acc + attempt.averageQuestionTimeSeconds, 0) / totalAttempts;

  const questionStats = currentQuiz.questions.map((question) => {
    const incorrectCount = attempts.filter((attempt) => attempt.incorrectQuestionIds.includes(question.id)).length;
    const correctCount = attempts.filter((attempt) => attempt.correctQuestionIds.includes(question.id)).length;
    const accuracy =
      correctCount + incorrectCount === 0 ? 0 : (correctCount / (correctCount + incorrectCount)) * 100;
    const averageTimeForQuestion =
      totalAttempts === 0
        ? 0
        : attempts.reduce((acc, attempt) => acc + (attempt.questionDurations[question.id] ?? 0), 0) / totalAttempts;

    return {
      id: question.id,
      prompt: question.prompt,
      accuracy,
      incorrectCount,
      averageTime: averageTimeForQuestion
    };
  });

  const mostMissedQuestions = questionStats
    .filter((stat) => stat.incorrectCount > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const handleExportCsv = () => {
    if (attempts.length === 0) return;

    const header = [
      "Participant",
      "Score",
      "Questions",
      "Réussite (%)",
      "Temps moyen (s)",
      "Durée totale (s)",
      "Début",
      "Fin"
    ];

    const rows = attempts.map((attempt) => [
      attempt.participantLabel,
      `${attempt.score}`,
      `${attempt.totalQuestions}`,
      attempt.accuracy.toFixed(1),
      attempt.averageQuestionTimeSeconds.toFixed(1),
      (attempt.durationMs / 1000).toFixed(1),
      formatDateTime(attempt.startedAt),
      formatDateTime(attempt.completedAt)
    ]);

    const csvContent = [header, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, `${currentQuiz.id}-results.csv`);
  };

  const handleExportExcel = () => {
    if (attempts.length === 0) return;

    const headerCells = [
      "Participant",
      "Score",
      "Questions",
      "Réussite (%)",
      "Temps moyen (s)",
      "Durée totale (s)",
      "Début",
      "Fin"
    ]
      .map((cell) => `<th style="text-align:left;border:1px solid #ccc;padding:8px;">${cell}</th>`)
      .join("");

    const bodyRows = attempts
      .map((attempt) => {
        const cells = [
          attempt.participantLabel,
          `${attempt.score}`,
          `${attempt.totalQuestions}`,
          attempt.accuracy.toFixed(1),
          attempt.averageQuestionTimeSeconds.toFixed(1),
          (attempt.durationMs / 1000).toFixed(1),
          formatDateTime(attempt.startedAt),
          formatDateTime(attempt.completedAt)
        ]
          .map((cell) => `<td style="border:1px solid #eee;padding:8px;">${cell}</td>`)
          .join("");

        return `<tr>${cells}</tr>`;
      })
      .join("");

    const table = `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    const blob = new Blob(["\ufeff" + table], { type: "application/vnd.ms-excel" });
    downloadFile(blob, `${currentQuiz.id}-results.xls`);
  };

  const handleExportPdf = () => {
    const lines = [
      `Quiz : ${currentQuiz.title}`,
      `Participants : ${totalAttempts}`,
      `Taux de réussite moyen : ${averageAccuracy.toFixed(1)} %`,
      `Score moyen : ${averageScore.toFixed(1)} / ${currentQuiz.questions.length}`,
      `Durée moyenne : ${formatSeconds(averageDurationSeconds)}`,
      "",
      "Participants"
    ];

    attempts.forEach((attempt) => {
      lines.push(
        `${attempt.participantLabel} — ${attempt.score}/${attempt.totalQuestions} (${attempt.accuracy.toFixed(1)} %) — ` +
          `Temps moyen ${attempt.averageQuestionTimeSeconds.toFixed(1)} s — Durée ${formatSeconds(
            attempt.durationMs / 1000
          )}`
      );
    });

    if (mostMissedQuestions.length > 0) {
      lines.push("", "Questions les plus difficiles");
      mostMissedQuestions.forEach((question) => {
        lines.push(
          `${truncate(question.prompt, 80)} — Réussite ${question.accuracy.toFixed(1)} % — Temps moyen ${question.averageTime.toFixed(
            1
          )} s`
        );
      });
    }

    const pdfBytes = createPdfDocument(lines);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    downloadFile(blob, `${currentQuiz.id}-results.pdf`);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-primary/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">📊 Analyse et résultats</h2>
          <p className="mt-2 text-sm text-slate-300">
            Synthèse des tentatives enregistrées sur cet appareil pour « {currentQuiz.title} ».
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-white"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Participants" value={totalAttempts.toString()} helper="Total des tentatives" />
        <StatCard label="Taux de réussite moyen" value={`${averageAccuracy.toFixed(1)} %`} helper="Basé sur toutes les réponses" />
        <StatCard label="Score moyen" value={`${averageScore.toFixed(1)} / ${currentQuiz.questions.length}`} helper="Par tentative" />
        <StatCard label="Temps moyen / question" value={averageQuestionTimeSeconds.toFixed(1) + " s"} helper="Sur l&apos;ensemble des participants" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Résultats par participant</h3>
          <div className="grid gap-4">
            {attempts.map((attempt) => (
              <article
                key={attempt.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h4 className="text-base font-semibold text-white">{attempt.participantLabel}</h4>
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    {formatDateTime(attempt.completedAt)}
                  </span>
                </div>
                <dl className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                  <StatLine label="Score" value={`${attempt.score} / ${attempt.totalQuestions}`} />
                  <StatLine label="Réussite" value={`${attempt.accuracy.toFixed(1)} %`} />
                  <StatLine label="Temps moyen / question" value={`${attempt.averageQuestionTimeSeconds.toFixed(1)} s`} />
                  <StatLine label="Durée totale" value={formatSeconds(attempt.durationMs / 1000)} />
                </dl>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Questions les plus ratées</h3>
          {mostMissedQuestions.length === 0 ? (
            <p className="text-sm text-slate-300">
              Toutes les questions ont été maîtrisées pour le moment. Continuez à collecter des tentatives pour affiner ces
              statistiques.
            </p>
          ) : (
            <ul className="grid gap-3">
              {mostMissedQuestions.map((question) => (
                <li
                  key={question.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  <p className="font-semibold text-white">{question.prompt}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-rose-200">
                    Réussite {question.accuracy.toFixed(1)} % — Temps moyen {question.averageTime.toFixed(1)} s
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {question.incorrectCount} échec{question.incorrectCount > 1 ? "s" : ""} enregistré{question.incorrectCount > 1 ? "s" : ""}.
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{helper}</p>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-200">{value}</dd>
    </div>
  );
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toCsvValue(value: string) {
  if (value.includes(",") || value.includes("\"")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function formatSeconds(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "—";
  }

  if (value >= 60) {
    const minutes = Math.floor(value / 60);
    const seconds = Math.round(value % 60);
    return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
  }

  return `${value.toFixed(1)} s`;
}

function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function createPdfDocument(lines: string[]) {
  const encoder = new TextEncoder();
  const header = "%PDF-1.4\n";
  let pdf = header;
  const offsets: number[] = [0];
  let currentOffset = encoder.encode(pdf).length;

  const contentLines = [
    "BT",
    "/F1 12 Tf",
    "14 TL",
    "72 780 Td",
    ...lines.map((line, index) => {
      const escaped = escapePdfText(line);
      return index === 0 ? `(${escaped}) Tj` : `T* (${escaped}) Tj`;
    }),
    "ET"
  ].join("\n");

  const contentLength = encoder.encode(contentLines).length;

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${contentLength} >>\nstream\n${contentLines}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  objects.forEach((object, index) => {
    const objectString = `${index + 1} 0 obj\n${object}\nendobj\n`;
    offsets.push(currentOffset);
    pdf += objectString;
    currentOffset += encoder.encode(objectString).length;
  });

  const xrefPosition = currentOffset;
  let xref = "xref\n0 6\n";
  xref += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    xref += `${offsets[index].toString().padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n${xrefPosition}\n%%EOF`;

  pdf += xref;
  return encoder.encode(pdf);
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
