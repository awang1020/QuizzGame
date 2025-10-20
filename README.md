# QuizzyQuizz

QuizzyQuizz is a modern learning experience built with Next.js and Tailwind CSS. It ships with a production-ready quiz flow featuring a marketing landing page, interactive assessments with instant feedback, and a rich results dashboard.

## Features

- **Responsive landing page** with a hero call-to-action and feature highlights.
- **Interactive quiz runner** supporting single and multiple choice questions with contextual explanations.
- **Real-time progress tracking** and end-of-quiz analytics for learners.
- **Results dashboard** summarising score, question breakdowns, and retry/back-to-home actions.
- **API-ready architecture** using Next.js App Router and API routes for scalable quiz data retrieval.

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

Adding a new quiz is as simple as updating `data/quizzes.ts`:

1. Append a new quiz object with a unique `id`, metadata, and an array of `questions`.
2. Each question supports `single` or `multiple` choice via the `type` field. Set `isCorrect` on each option accordingly.
3. The Next.js router automatically picks up `/quiz` and `/results` routes using the newly selected quiz.

For dynamic data sources, replace the static array with a database or headless CMS call in `app/api/quizzes/route.ts`, then fetch the data inside the quiz context.

## Available scripts

- `npm run dev` – Start the development server with hot reloading.
- `npm run build` – Create an optimized production build.
- `npm start` – Serve the production build locally.
- `npm run lint` – Run ESLint using Next.js defaults.

## License

This project is provided as a learning resource. Adapt and extend it to fit your organisation’s requirements.
