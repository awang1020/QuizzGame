import React from "react";

interface BeginnerQuestion {
  id: string;
  prompt: string;
  options: {
    id: string;
    text: string;
  }[];
  answer: string;
  explanation: string;
}

const beginnerQuestions: BeginnerQuestion[] = [
  {
    id: "fabric-purpose",
    prompt: "What is Microsoft Fabric designed to help organizations do?",
    options: [
      { id: "a", text: "Create mobile apps without any coding." },
      { id: "b", text: "Bring data integration, storage, and analytics together in one place." },
      { id: "c", text: "Replace email with instant messaging." }
    ],
    answer: "b",
    explanation:
      "Microsoft Fabric unifies data engineering, storage, and analytics so teams can work from a single platform."
  },
  {
    id: "power-bi-role",
    prompt: "How does Power BI help business users?",
    options: [
      { id: "a", text: "It sends automated marketing emails." },
      { id: "b", text: "It turns data into interactive dashboards and reports." },
      { id: "c", text: "It designs company logos automatically." }
    ],
    answer: "b",
    explanation:
      "Power BI focuses on visualizing data, helping people explore numbers through dashboards and reports."
  },
  {
    id: "fabric-onelake",
    prompt: "What is OneLake within Microsoft Fabric?",
    options: [
      { id: "a", text: "A shared data lake that stores information for all Fabric experiences." },
      { id: "b", text: "A desktop app used to build PowerPoint slides." },
      { id: "c", text: "A tool that creates marketing campaigns." },
      { id: "d", text: "A place to host company websites." }
    ],
    answer: "a",
    explanation:
      "OneLake is the central storage layer for Fabric, keeping data in one trusted location."
  },
  {
    id: "power-bi-desktop",
    prompt: "Why do beginners often start with Power BI Desktop?",
    options: [
      { id: "a", text: "It lets them build and preview reports on their computer before sharing them." },
      { id: "b", text: "It is the only way to send emails in Fabric." },
      { id: "c", text: "It automatically writes blog posts." }
    ],
    answer: "a",
    explanation:
      "Power BI Desktop provides a friendly workspace to model data and design reports locally."
  },
  {
    id: "fabric-workspaces",
    prompt: "What is a workspace in Microsoft Fabric and Power BI?",
    options: [
      { id: "a", text: "A folder where you store and collaborate on related analytics items." },
      { id: "b", text: "A chat room for customer service." },
      { id: "c", text: "A tool for editing videos." }
    ],
    answer: "a",
    explanation:
      "Workspaces organize datasets, reports, pipelines, and notebooks so teams can manage them together."
  },
  {
    id: "fabric-dataflows",
    prompt: "How do dataflows support beginners building reports?",
    options: [
      { id: "a", text: "They clean and prepare data in the browser, then reuse it in different Power BI reports." },
      { id: "b", text: "They schedule company holidays." },
      { id: "c", text: "They replace the need for any data connections." }
    ],
    answer: "a",
    explanation:
      "Dataflows offer low-code data preparation that can feed multiple Power BI reports without repeating work."
  },
  {
    id: "fabric-real-time",
    prompt: "Which scenario is a good fit for Real-Time Intelligence in Fabric?",
    options: [
      { id: "a", text: "Monitoring live sensor data from factory machines." },
      { id: "b", text: "Designing company logos." },
      { id: "c", text: "Writing employee handbooks." }
    ],
    answer: "a",
    explanation:
      "Real-Time Intelligence captures streaming data so teams can react to changes as they happen."
  },
  {
    id: "power-bi-sharing",
    prompt: "What is one simple way to share a finished Power BI report with coworkers?",
    options: [
      { id: "a", text: "Publish it to the Power BI service and grant them access." },
      { id: "b", text: "Email the .pbix file without any permissions." },
      { id: "c", text: "Print every page and mail it." }
    ],
    answer: "a",
    explanation:
      "Publishing to the Power BI service makes the report available online with controlled access."
  },
  {
    id: "fabric-copilot",
    prompt: "How can Copilot in Microsoft Fabric assist beginners?",
    options: [
      { id: "a", text: "By suggesting code, queries, or descriptions based on natural-language prompts." },
      { id: "b", text: "By sending meeting invitations automatically." },
      { id: "c", text: "By designing company logos from scratch." }
    ],
    answer: "a",
    explanation:
      "Copilot brings AI assistance to Fabric, helping users draft code, summaries, or visualizations faster."
  },
  {
    id: "power-bi-datasets",
    prompt: "Why is it helpful to create a reusable dataset in Power BI?",
    options: [
      { id: "a", text: "So multiple reports can trust the same clean data without rebuilding it each time." },
      { id: "b", text: "So reports can work without any data." },
      { id: "c", text: "So you can export the report as a video." }
    ],
    answer: "a",
    explanation:
      "Reusable datasets provide one source of truth that many reports can reference, reducing rework."
  }
];

const BeginnerFabricQuiz: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-primary/10">
      <h2 className="text-3xl font-semibold text-white">Microsoft Fabric &amp; Power BI Beginner Quiz</h2>
      <p className="mt-3 text-base text-slate-200">
        Explore the questions below to reinforce the core ideas behind Microsoft Fabric and Power BI. Each question
        includes a quick explanation to keep your learning on track.
      </p>
      <ol className="mt-6 space-y-6">
        {beginnerQuestions.map((question, index) => {
          const correctOption = question.options.find((option) => option.id === question.answer);
          return (
            <li key={question.id} className="rounded-xl border border-white/10 bg-slate-950/40 p-6">
              <h3 className="text-lg font-semibold text-white">
                Question {index + 1}. {question.prompt}
              </h3>
              <ul className="mt-4 space-y-2">
                {question.options.map((option) => (
                  <li
                    key={option.id}
                    className="flex items-start gap-3 rounded-lg border border-transparent bg-white/5 p-3 text-sm text-slate-200 hover:border-primary/40"
                    data-correct={option.id === question.answer}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="leading-relaxed">{option.text}</span>
                  </li>
                ))}
              </ul>
              {correctOption ? (
                <p className="mt-4 text-sm text-emerald-300">
                  Correct answer: <span className="font-semibold">{correctOption.text}</span>
                </p>
              ) : null}
              <p className="mt-2 text-sm text-slate-300">{question.explanation}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default BeginnerFabricQuiz;
