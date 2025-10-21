# QuizzyQuizz

QuizzyQuizz is a modern learning experience built with Next.js and Tailwind CSS. It ships with a production-ready quiz flow featuring a marketing landing page, interactive assessments with instant feedback, and a rich results dashboard.

## Features

- **Responsive landing page** with a hero call-to-action and feature highlights.
- **Interactive quiz runner** supporting single, multiple, vrai/faux et réponses libres avec explications contextuelles.
- **Quiz Studio** to create, duplicate, edit, tag and delete quizzes via a guided visual builder with rich media support.
- **Real-time progress tracking** with per-question timers, points weighting and end-of-quiz analytics for learners.
- **Results dashboard** summarising scores, detailed breakdowns and personalised feedback.
- **Sharing tools** to copy a direct play link and launch sessions instantly from the studio.

## Project structure

```
.
├── app/
│   ├── api/quizzes/route.ts      # API route exposing quiz data
│   ├── layout.tsx                # Root layout with global providers and styles
│   ├── page.tsx                  # Landing page
│   ├── providers.tsx             # Client-side providers (Quiz context)
│   ├── quiz/page.tsx             # Quiz experience
│   └── results/page.tsx          # Results summary
├── components/                   # Shared UI building blocks
├── context/QuizContext.tsx       # Quiz state manager using React context
├── data/quizzes.ts               # Source of quiz definitions
├── public/                       # Static assets (add as needed)
├── tailwind.config.ts            # Tailwind theme configuration
└── ...                           # Configuration files (Next.js, ESLint, TypeScript)
```

## Getting started

1. **Install dependencies** (requires Node.js 18+):

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to explore the experience.

## Extending the quiz catalogue

Adding a new quiz can now be done entirely from the **Studio** (`/studio/create`) by filling out the builder form. Each question can include rich media, points, time limits and different answer formats. Existing quizzes can also be duplicated and edited from `/studio` without touching the codebase.

For teams that prefer seeding default content via code, the static definitions still live in `data/quizzes.ts`. Replace the array with a database or headless CMS call in `app/api/quizzes/route.ts`, then fetch the data inside the quiz context.

## Available scripts

- `npm run dev` – Start the development server with hot reloading.
- `npm run build` – Create an optimized production build.
- `npm start` – Serve the production build locally.
- `npm run lint` – Run ESLint using Next.js defaults.

## License

This project is provided as a learning resource. Adapt and extend it to fit your organisation’s requirements.
