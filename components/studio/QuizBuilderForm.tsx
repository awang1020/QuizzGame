"use client";

import { useMemo, useState } from "react";
import type {
  MediaResource,
  MediaType,
  Option,
  Question,
  QuestionType,
  Quiz,
  QuizDefinition,
  QuizDifficulty
} from "@/context/QuizContext";

const mediaTypes: { label: string; value: MediaType }[] = [
  { label: "Image", value: "image" },
  { label: "Vidéo (iframe)", value: "video" },
  { label: "GIF", value: "gif" },
  { label: "Lien externe", value: "link" }
];

const questionTypes: { label: string; value: QuestionType }[] = [
  { label: "Choix unique", value: "single" },
  { label: "Choix multiples", value: "multiple" },
  { label: "Vrai / Faux", value: "true_false" },
  { label: "Réponse libre", value: "open" }
];

const difficulties: QuizDifficulty[] = ["beginner", "intermediate", "advanced"];

type QuizBuilderFormProps = {
  initialQuiz?: Quiz;
  onSubmit: (quiz: Omit<QuizDefinition, "id"> & { id?: string }) => void;
  submitLabel?: string;
};

export default function QuizBuilderForm({ initialQuiz, onSubmit, submitLabel = "Enregistrer" }: QuizBuilderFormProps) {
  const [title, setTitle] = useState(initialQuiz?.title ?? "");
  const [description, setDescription] = useState(initialQuiz?.description ?? "");
  const [coverImage, setCoverImage] = useState(initialQuiz?.coverImage ?? "");
  const [category, setCategory] = useState(initialQuiz?.category ?? "");
  const [tagsInput, setTagsInput] = useState(initialQuiz?.tags?.join(", ") ?? "");
  const [difficulty, setDifficulty] = useState<QuizDifficulty | "">(initialQuiz?.difficulty ?? "");
  const [level, setLevel] = useState<number | "">(initialQuiz?.level ?? "");
  const [duration, setDuration] = useState<number | "">(initialQuiz?.duration ?? "");
  const [focusArea, setFocusArea] = useState(initialQuiz?.focusArea ?? "");
  const [recommendedFor, setRecommendedFor] = useState(initialQuiz?.recommendedFor ?? "");
  const [questions, setQuestions] = useState<Question[]>(
    initialQuiz?.questions ?? [createBlankQuestion()]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPoints = useMemo(() => {
    return questions.reduce((sum, question) => sum + (question.points ?? 1), 0);
  }, [questions]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createBlankQuestion()]);
  };

  const handleUpdateQuestion = (questionId: string, update: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        const nextType = update.type ?? question.type;
        const nextOptions =
          update.type ? adaptOptionsForType(update.type, question.options) : update.options ?? question.options;

        return {
          ...question,
          ...update,
          type: nextType,
          options: nextOptions
        };
      })
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (questions.length === 1) {
      setError("Votre quiz doit contenir au moins une question.");
      return;
    }
    setQuestions((prev) => prev.filter((question) => question.id !== questionId));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          options: [...question.options, createBlankOption(false)]
        };
      })
    );
  };

  const handleUpdateOption = (questionId: string, optionId: string, update: Partial<Option>) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  ...update
                }
              : option
          )
        };
      })
    );
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        const updated = question.options.filter((option) => option.id !== optionId);
        return {
          ...question,
          options: updated.length > 0 ? updated : [createBlankOption(true), createBlankOption(false)]
        };
      })
    );
  };

  const handleToggleCorrectOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        if (question.type === "multiple") {
          return {
            ...question,
            options: question.options.map((option) =>
              option.id === optionId ? { ...option, isCorrect: !option.isCorrect } : option
            )
          };
        }

        return {
          ...question,
          options: question.options.map((option) => ({
            ...option,
            isCorrect: option.id === optionId
          }))
        };
      })
    );
  };

  const handleAddMedia = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              media: [...(question.media ?? []), createBlankMedia()]
            }
          : question
      )
    );
  };

  const handleUpdateMedia = (questionId: string, mediaId: string, update: Partial<MediaResource>) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          media: question.media?.map((item) =>
            item.id === mediaId
              ? {
                  ...item,
                  ...update
                }
              : item
          )
        };
      })
    );
  };

  const handleDeleteMedia = (questionId: string, mediaId: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;
        return {
          ...question,
          media: (question.media ?? []).filter((item) => item.id !== mediaId)
        };
      })
    );
  };

  const handleSubmit = () => {
    setError(null);

    const validationError = validateQuiz(title, description, questions);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const quiz: Omit<QuizDefinition, "id"> & { id?: string } = {
      id: initialQuiz?.id,
      title: title.trim(),
      description: description.trim(),
      coverImage: coverImage.trim() || undefined,
      category: category.trim() || undefined,
      tags: parseTags(tagsInput),
      difficulty: difficulty || undefined,
      level: typeof level === "number" ? level : undefined,
      duration: typeof duration === "number" ? duration : undefined,
      focusArea: focusArea.trim() || undefined,
      recommendedFor: recommendedFor.trim() || undefined,
      questions: questions.map((question) => ({
        ...question,
        options:
          question.type === "open"
            ? []
            : question.options.map((option) => ({
                ...option,
                text: option.text.trim()
              })),
        answer: question.type === "open" ? question.answer?.trim() : undefined,
        media: question.media?.map((item) => ({
          ...item,
          url: item.url.trim(),
          label: item.label?.trim() || undefined
        }))
      }))
    };

    onSubmit(quiz);
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10">
        <header className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-white">Informations générales</h2>
          <p className="text-sm text-slate-300">
            Définissez les éléments principaux de votre quiz avant de construire vos questions.
          </p>
        </header>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-200">
            Titre
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nom du quiz"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Catégorie
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Ex : Pédagogie, Onboarding..."
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="md:col-span-2 grid gap-2 text-sm text-slate-200">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="Présentez le but du quiz et le public visé"
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Image de couverture (URL)
            <input
              type="url"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
              placeholder="https://..."
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Tags (séparés par des virgules)
            <input
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="formation, marketing, onboarding"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Difficulté
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value as QuizDifficulty | "")}
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            >
              <option value="">Non définie</option>
              {difficulties.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Niveau / Ordre
            <input
              type="number"
              min={1}
              value={level}
              onChange={(event) => setLevel(event.target.value ? Number(event.target.value) : "")}
              placeholder="1"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Durée estimée (secondes)
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(event) => setDuration(event.target.value ? Number(event.target.value) : "")}
              placeholder="600"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Focus pédagogique
            <input
              type="text"
              value={focusArea}
              onChange={(event) => setFocusArea(event.target.value)}
              placeholder="Ex : Gouvernance data"
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-200">
            Recommandé pour
            <input
              type="text"
              value={recommendedFor}
              onChange={(event) => setRecommendedFor(event.target.value)}
              placeholder="Managers, nouveaux arrivants..."
              className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Total de points attribués : {totalPoints}</p>
          <p className="mt-1 text-xs text-slate-400">
            Ajustez les points de chaque question pour calibrer la difficulté et motiver vos participants.
          </p>
        </div>
      </section>

      <section className="grid gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Questions ({questions.length})</h2>
            <p className="text-sm text-slate-300">Ajoutez des médias, gérez les points et configurez le temps limite.</p>
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light transition hover:border-primary hover:bg-primary/20 hover:text-white"
          >
            + Nouvelle question
          </button>
        </header>
        <div className="grid gap-6">
          {questions.map((question, index) => (
            <article
              key={question.id}
              className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-primary/10"
            >
              <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Question {index + 1}</p>
                  <input
                    type="text"
                    value={question.prompt}
                    onChange={(event) => handleUpdateQuestion(question.id, { prompt: event.target.value })}
                    placeholder="Intitulé de la question"
                    className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-200 md:w-64">
                  <label className="grid gap-1">
                    Type de question
                    <select
                      value={question.type}
                      onChange={(event) =>
                        handleUpdateQuestion(question.id, {
                          type: event.target.value as QuestionType,
                          options: adaptOptionsForType(event.target.value as QuestionType, question.options)
                        })
                      }
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1">
                    Points
                    <input
                      type="number"
                      min={0}
                      value={question.points ?? 1}
                      onChange={(event) => handleUpdateQuestion(question.id, { points: Number(event.target.value) })}
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                  <label className="grid gap-1">
                    Temps limite (secondes)
                    <input
                      type="number"
                      min={0}
                      value={question.timeLimit ?? 0}
                      onChange={(event) => handleUpdateQuestion(question.id, { timeLimit: Number(event.target.value) })}
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                </div>
              </header>

              {question.type === "open" ? (
                <div className="grid gap-3">
                  <label className="grid gap-1 text-sm text-slate-200">
                    Réponse attendue
                    <input
                      type="text"
                      value={question.answer ?? ""}
                      onChange={(event) => handleUpdateQuestion(question.id, { answer: event.target.value })}
                      placeholder="Saisissez la réponse correcte"
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-3">
                  <p className="text-sm font-semibold text-slate-200">Options de réponse</p>
                  <div className="grid gap-3">
                    {question.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:gap-4"
                      >
                        <label className="flex items-center gap-2 text-sm text-slate-200">
                          <input
                            type={question.type === "multiple" ? "checkbox" : "radio"}
                            checked={option.isCorrect}
                            onChange={() => handleToggleCorrectOption(question.id, option.id)}
                            className="h-4 w-4 accent-primary"
                          />
                          Correct
                        </label>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(event) => handleUpdateOption(question.id, option.id, { text: event.target.value })}
                          placeholder="Texte de la réponse"
                          className="flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(question.id, option.id)}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400 hover:bg-rose-500/10 hover:text-rose-100"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                  {question.type !== "true_false" ? (
                    <button
                      type="button"
                      onClick={() => handleAddOption(question.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-primary hover:bg-primary/10 hover:text-white"
                    >
                      + Ajouter une option
                    </button>
                  ) : null}
                </div>
              )}

              <div className="grid gap-3">
                <label className="grid gap-1 text-sm text-slate-200">
                  Explication / Feedback
                  <textarea
                    value={question.explanation}
                    onChange={(event) => handleUpdateQuestion(question.id, { explanation: event.target.value })}
                    rows={2}
                    placeholder="Commentaires affichés après la réponse"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  />
                </label>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-200">Contenu enrichi</p>
                  <button
                    type="button"
                    onClick={() => handleAddMedia(question.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-primary hover:bg-primary/10 hover:text-white"
                  >
                    + Ajouter un média
                  </button>
                </div>
                {(question.media ?? []).length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                    Ajoutez des images, vidéos, GIF ou liens pour contextualiser la question.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(question.media ?? []).map((media) => (
                      <div key={media.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <label className="grid gap-1 text-xs text-slate-300">
                          Type de média
                          <select
                            value={media.type}
                            onChange={(event) => handleUpdateMedia(question.id, media.id, { type: event.target.value as MediaType })}
                            className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                          >
                            {mediaTypes.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 text-xs text-slate-300">
                          URL / Lien intégré
                          <input
                            type="url"
                            value={media.url}
                            onChange={(event) => handleUpdateMedia(question.id, media.id, { url: event.target.value })}
                            placeholder="https://..."
                            className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                          />
                        </label>
                        <label className="grid gap-1 text-xs text-slate-300">
                          Légende (facultative)
                          <input
                            type="text"
                            value={media.label ?? ""}
                            onChange={(event) => handleUpdateMedia(question.id, media.id, { label: event.target.value })}
                            placeholder="Description courte"
                            className="rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(question.id, media.id)}
                          className="self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400 hover:bg-rose-500/10 hover:text-rose-100"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/20"
                >
                  Supprimer la question
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm text-rose-200">{error}</p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function createBlankQuestion(): Question {
  return {
    id: generateId(),
    prompt: "",
    type: "single",
    explanation: "",
    options: [createBlankOption(true), createBlankOption(false)],
    points: 1,
    timeLimit: 60
  };
}

function createBlankOption(isCorrect: boolean): Option {
  return {
    id: generateId(),
    text: "",
    isCorrect
  };
}

function createBlankMedia(): MediaResource {
  return {
    id: generateId(),
    type: "image",
    url: ""
  };
}

function adaptOptionsForType(type: QuestionType, current: Option[]): Option[] {
  if (type === "true_false") {
    return [
      { id: generateId(), text: "Vrai", isCorrect: true },
      { id: generateId(), text: "Faux", isCorrect: false }
    ];
  }

  if (type === "open") {
    return [];
  }

  if (current.length === 0) {
    return [createBlankOption(true), createBlankOption(false)];
  }

  return current;
}

function parseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function validateQuiz(title: string, description: string, questions: Question[]) {
  if (!title.trim()) {
    return "Le titre du quiz est obligatoire.";
  }

  if (!description.trim()) {
    return "Ajoutez une description pour contextualiser le quiz.";
  }

  if (questions.length === 0) {
    return "Ajoutez au moins une question.";
  }

  for (const question of questions) {
    if (!question.prompt.trim()) {
      return "Chaque question doit avoir un intitulé.";
    }

    if (question.type === "open") {
      if (!question.answer?.trim()) {
        return "Les questions à réponse libre doivent contenir une réponse attendue.";
      }
      continue;
    }

    if (question.options.length < 2) {
      return "Chaque question à choix doit comporter au moins deux options.";
    }

    const hasCorrect = question.options.some((option) => option.isCorrect);
    if (!hasCorrect) {
      return "Sélectionnez au moins une réponse correcte.";
    }

    const emptyOption = question.options.find((option) => !option.text.trim());
    if (emptyOption) {
      return "Toutes les options doivent contenir du texte.";
    }
  }

  return null;
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}
