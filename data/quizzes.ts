import type { Quiz } from "@/context/QuizContext";

export const quizzes: Quiz[] = [
  {
    id: "web-fundamentals",
    title: "Web Fundamentals",
    description: "Test your knowledge of HTML, CSS, JavaScript, and accessibility.",
    duration: 600,
    questions: [
      {
        id: "html5-semantic",
        prompt: "Which HTML5 elements are best suited for improving semantic structure?",
        type: "multiple",
        explanation:
          "<header>, <main>, <article>, <section>, and <footer> add semantic meaning, improving accessibility and SEO.",
        options: [
          { id: "a", text: "<div>", isCorrect: false },
          { id: "b", text: "<section>", isCorrect: true },
          { id: "c", text: "<article>", isCorrect: true },
          { id: "d", text: "<span>", isCorrect: false }
        ]
      },
      {
        id: "css-specificity",
        prompt: "Arrange the following CSS selectors from lowest to highest specificity.",
        type: "single",
        explanation:
          "Type selectors have the lowest specificity, followed by class selectors, while ID selectors have the highest.",
        options: [
          { id: "a", text: "#nav", isCorrect: false },
          { id: "b", text: ".menu", isCorrect: false },
          { id: "c", text: "nav", isCorrect: true },
          { id: "d", text: "They all have the same specificity", isCorrect: false }
        ]
      },
      {
        id: "js-promises",
        prompt: "Which statements about JavaScript Promises are correct?",
        type: "multiple",
        explanation:
          "Promises represent the eventual completion of async operations, support chaining via then/catch, and can settle only once.",
        options: [
          { id: "a", text: "A promise can resolve multiple times.", isCorrect: false },
          { id: "b", text: "Promise.prototype.then returns a new promise.", isCorrect: true },
          { id: "c", text: "Promises can be chained to handle sequential async tasks.", isCorrect: true },
          { id: "d", text: "A rejected promise cannot be handled.", isCorrect: false }
        ]
      },
      {
        id: "a11y-aria",
        prompt: "When should ARIA roles be used in web applications?",
        type: "single",
        explanation:
          "ARIA roles supplement semantics when native HTML elements are insufficient. Prefer semantic HTML before reaching for ARIA.",
        options: [
          { id: "a", text: "Always, even if native elements convey semantics", isCorrect: false },
          { id: "b", text: "Only when semantic HTML cannot convey the required meaning", isCorrect: true },
          { id: "c", text: "Never, ARIA is deprecated", isCorrect: false },
          { id: "d", text: "Only for styling purposes", isCorrect: false }
        ]
      }
    ]
  }
];
