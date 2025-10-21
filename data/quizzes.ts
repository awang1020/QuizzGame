import type { Question, QuizDefinition } from "@/context/QuizContext";

const fabricQuestionBank: Question[] = [
  {
    id: "fabric-fundamentals-overview",
    prompt: "Which statement best captures Microsoft Fabric's core value proposition for analytics teams?",
    type: "single",
    explanation:
      "Microsoft Fabric delivers a unified Software-as-a-Service analytics platform that combines data integration, engineering, warehousing, data science, and business intelligence on top of OneLake.",
    options: [
      { id: "a", text: "It is a standalone visualization tool that replaces Power BI Desktop.", isCorrect: false },
      {
        id: "b",
        text: "It unifies data integration, engineering, warehousing, data science, and BI workloads in a single SaaS experience.",
        isCorrect: true
      },
      { id: "c", text: "It is an Azure subscription tier used solely for hosting SQL Server virtual machines.", isCorrect: false },
      { id: "d", text: "It is an add-on that only enhances Microsoft Purview catalogs.", isCorrect: false }
    ]
  },
  {
    id: "fabric-traditional-challenges",
    prompt:
      "A retail enterprise struggles with silos between ETL pipelines, data lakes, and BI dashboards maintained on separate platforms. How does Microsoft Fabric specifically address this pain?",
    type: "single",
    explanation:
      "Fabric eliminates cross-platform friction by providing shared governance, storage, and lifecycle management across all workloads so teams can collaborate within one managed environment.",
    options: [
      {
        id: "a",
        text: "By replacing the need for data lakes entirely and storing everything in embedded Power BI datasets.",
        isCorrect: false
      },
      {
        id: "b",
        text: "By offering a unified workspace experience where pipelines, notebooks, warehouses, and reports share governance and storage.",
        isCorrect: true
      },
      { id: "c", text: "By forcing teams to export data to Excel for final analysis.", isCorrect: false },
      { id: "d", text: "By restricting BI workloads to on-premises gateways only.", isCorrect: false }
    ]
  },
  {
    id: "fabric-bi-accelerate",
    prompt: "Which Fabric capability most directly empowers business analysts to deliver trusted self-service BI faster?",
    type: "single",
    explanation:
      "Fabric couples Power BI with centrally governed, reusable semantic models stored in OneLake, enabling analysts to build dashboards against certified data.",
    options: [
      { id: "a", text: "Automatic conversion of PowerPoint slides into dashboards.", isCorrect: false },
      {
        id: "b",
        text: "Shared, certified semantic models in OneLake that Power BI can reuse across reports.",
        isCorrect: true
      },
      { id: "c", text: "Requiring analysts to write Scala code in notebooks for every dataset.", isCorrect: false },
      { id: "d", text: "Limiting report development to Fabric administrators.", isCorrect: false }
    ]
  },
  {
    id: "fabric-workloads-scope",
    prompt: "Which option lists all seven core workloads available within Microsoft Fabric?",
    type: "single",
    explanation:
      "Fabric's workloads include Data Factory, Data Engineering, Data Warehouse, Data Science, Real-Time Intelligence, Power BI, and Copilot experiences woven across them.",
    options: [
      {
        id: "a",
        text: "Data Factory, Data Engineering, Data Warehouse, Data Science, Real-Time Intelligence, Power BI, Copilot",
        isCorrect: true
      },
      {
        id: "b",
        text: "Azure Synapse, Azure ML, Power Apps, Power Automate, Logic Apps, SQL Server, Stream Analytics",
        isCorrect: false
      },
      {
        id: "c",
        text: "Data Factory, Azure Databricks, Azure Monitor, Power BI, Fabric Admin, Fabric Insights, OneDrive",
        isCorrect: false
      },
      {
        id: "d",
        text: "Data Explorer, Azure Functions, Virtual Machines, Event Hub, Power BI, SharePoint, Teams",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-onelake-concept",
    prompt: "What is the primary role of OneLake within Microsoft Fabric?",
    type: "single",
    explanation:
      "OneLake acts as the single, unified data lake for Fabric, providing centralized storage with built-in governance, much like OneDrive for organizational data.",
    options: [
      { id: "a", text: "A virtual network gateway used to expose Fabric resources to the internet.", isCorrect: false },
      {
        id: "b",
        text: "The unified, organization-wide data lake that underpins every Fabric workload.",
        isCorrect: true
      },
      { id: "c", text: "A desktop tool for designing Power BI reports offline.", isCorrect: false },
      { id: "d", text: "An Azure billing account dedicated solely to Fabric capacities.", isCorrect: false }
    ]
  },
  {
    id: "fabric-delta-format",
    prompt: "Why is the Delta Parquet format foundational to Fabric's data architecture?",
    type: "single",
    explanation:
      "Delta tables in Parquet deliver ACID transactions, schema enforcement, and time travel, enabling reliable analytics across Fabric workloads that share OneLake.",
    options: [
      { id: "a", text: "Because it is the only format compatible with CSV exports.", isCorrect: false },
      {
        id: "b",
        text: "Because it combines Parquet storage with ACID transactions, enabling reliable multi-engine access.",
        isCorrect: true
      },
      { id: "c", text: "Because it prevents Power BI from reading tables directly.", isCorrect: false },
      { id: "d", text: "Because it stores table data exclusively in SQL Server instances.", isCorrect: false }
    ]
  },
  {
    id: "fabric-shortcuts",
    prompt: "When should you use OneLake shortcuts in a Fabric solution?",
    type: "single",
    explanation:
      "Shortcuts let teams virtualize external data lakes or other OneLake items without copying data, maintaining a single source of truth.",
    options: [
      { id: "a", text: "When you need to duplicate large datasets into OneLake for each workspace.", isCorrect: false },
      {
        id: "b",
        text: "When you want to reference external lake data or another OneLake item in place without ingesting it.",
        isCorrect: true
      },
      { id: "c", text: "When you want to permanently move data from Azure Data Lake Storage Gen2.", isCorrect: false },
      { id: "d", text: "When you must cache every dataset locally for performance.", isCorrect: false }
    ]
  },
  {
    id: "fabric-security",
    prompt: "Which Fabric feature ensures fine-grained access control for items stored in OneLake?",
    type: "single",
    explanation:
      "Item-level security leverages the Microsoft Purview access model so administrators can define permissions on every Fabric artifact.",
    options: [
      { id: "a", text: "Azure Front Door", isCorrect: false },
      { id: "b", text: "Item-level security with Microsoft Purview integration", isCorrect: true },
      { id: "c", text: "Microsoft Entra ID conditional access", isCorrect: false },
      { id: "d", text: "Power BI row-level security", isCorrect: false }
    ]
  },
  {
    id: "fabric-datafactory-orchestration",
    prompt: "What advantage does the Fabric Data Factory experience provide over classic pipelines?",
    type: "single",
    explanation:
      "Fabric Data Factory brings low-code data movement and transformation together with unified monitoring inside Fabric workspaces.",
    options: [
      { id: "a", text: "It eliminates the need for triggers or schedules.", isCorrect: false },
      { id: "b", text: "It unifies low-code pipelines with Fabric monitoring and governance.", isCorrect: true },
      { id: "c", text: "It can only run copy activities between Fabric items.", isCorrect: false },
      { id: "d", text: "It requires Azure Synapse Studio for every deployment.", isCorrect: false }
    ]
  },
  {
    id: "fabric-governance-center",
    prompt: "How do governance policies apply across Fabric workspaces?",
    type: "single",
    explanation:
      "Purview-based policies flow through Fabric workspaces so administrators can centrally manage governance for every item stored in OneLake.",
    options: [
      { id: "a", text: "Policies only apply to Power BI datasets.", isCorrect: false },
      { id: "b", text: "Policies propagate across workspaces via Microsoft Purview.", isCorrect: true },
      { id: "c", text: "Policies must be recreated for each workspace manually.", isCorrect: false },
      { id: "d", text: "Policies apply only when capacity is paused.", isCorrect: false }
    ]
  },
  {
    id: "fabric-capacity-modes",
    prompt: "Which capability is unique to Fabric capacity units (F SKUs)?",
    type: "single",
    explanation:
      "Fabric capacities provide unified compute that automatically allocates resources across workloads like Data Engineering and Power BI.",
    options: [
      { id: "a", text: "Dedicated resources limited to SQL-only workloads.", isCorrect: false },
      { id: "b", text: "Unified compute that dynamically serves multiple Fabric workloads.", isCorrect: true },
      { id: "c", text: "Exclusive GPU acceleration for machine learning.", isCorrect: false },
      { id: "d", text: "Reserved storage quotas per workspace.", isCorrect: false }
    ]
  },
  {
    id: "fabric-workspace-collaboration",
    prompt: "Why are Fabric workspaces important for cross-team collaboration?",
    type: "single",
    explanation:
      "Workspaces provide role-based access and shared lifecycle management so engineers, analysts, and BI authors can contribute to the same solution.",
    options: [
      { id: "a", text: "They replace OneLake as the storage layer.", isCorrect: false },
      { id: "b", text: "They deliver shared roles, deployment pipelines, and item governance.", isCorrect: true },
      { id: "c", text: "They restrict notebooks and pipelines from coexisting.", isCorrect: false },
      { id: "d", text: "They allow only administrators to publish items.", isCorrect: false }
    ]
  },
  {
    id: "fabric-notebooks-choice",
    prompt: "Which languages are supported out of the box for Fabric notebooks?",
    type: "single",
    explanation:
      "Fabric notebooks support multiple languages including PySpark, Spark SQL, and Scala to empower data engineers and scientists.",
    options: [
      { id: "a", text: "Only Python is allowed.", isCorrect: false },
      { id: "b", text: "PySpark, Spark SQL, and Scala are available.", isCorrect: true },
      { id: "c", text: "Only Transact-SQL is supported.", isCorrect: false },
      { id: "d", text: "Notebook languages must be installed via custom extensions.", isCorrect: false }
    ]
  },
  {
    id: "fabric-lakehouses",
    prompt: "What is the primary benefit of Fabric lakehouses for analytics teams?",
    type: "single",
    explanation:
      "Lakehouses blend the openness of a lake with managed tables so teams can work with Delta data using SQL or Spark without data duplication.",
    options: [
      { id: "a", text: "They store only CSV data for low-cost archival.", isCorrect: false },
      { id: "b", text: "They provide a Delta-backed experience accessible via SQL and Spark.", isCorrect: true },
      { id: "c", text: "They enforce relational schemas with no file access.", isCorrect: false },
      { id: "d", text: "They are required solely for Power BI semantic models.", isCorrect: false }
    ]
  },
  {
    id: "fabric-semantic-models",
    prompt: "How do Fabric semantic models accelerate BI delivery?",
    type: "single",
    explanation:
      "Shared semantic models host reusable business definitions so report authors build dashboards on consistent data.",
    options: [
      { id: "a", text: "They duplicate data per workspace to avoid conflicts.", isCorrect: false },
      { id: "b", text: "They centralize business logic for reuse across reports.", isCorrect: true },
      { id: "c", text: "They are limited to Pro-licensed authors only.", isCorrect: false },
      { id: "d", text: "They require separate deployment tooling outside Fabric.", isCorrect: false }
    ]
  },
  {
    id: "fabric-real-time-intelligence",
    prompt: "Which scenario best aligns with the Real-Time Intelligence workload?",
    type: "single",
    explanation:
      "Real-Time Intelligence ingests streaming data, applies event processing, and visualizes insights with minimal latency.",
    options: [
      { id: "a", text: "Batch loading nightly sales into a warehouse.", isCorrect: false },
      { id: "b", text: "Monitoring IoT telemetry with streaming dashboards.", isCorrect: true },
      { id: "c", text: "Archiving cold data to Azure Blob Storage.", isCorrect: false },
      { id: "d", text: "Designing paginated reports for finance teams.", isCorrect: false }
    ]
  },
  {
    id: "fabric-devops-deployment",
    prompt: "How do deployment pipelines help manage Fabric solutions?",
    type: "single",
    explanation:
      "Deployment pipelines provide stage-based promotion, configuration rules, and impact analysis for Fabric items.",
    options: [
      { id: "a", text: "They automatically create new capacities per workspace.", isCorrect: false },
      { id: "b", text: "They orchestrate promotion between development, test, and production stages.", isCorrect: true },
      { id: "c", text: "They are limited to SQL warehouses only.", isCorrect: false },
      { id: "d", text: "They replace Microsoft Purview for governance.", isCorrect: false }
    ]
  },
  {
    id: "fabric-shortcut-scenarios",
    prompt: "Which use case is ideal for OneLake shortcuts?",
    type: "single",
    explanation:
      "Shortcuts expose remote folders or data lakes as if they were native OneLake items, avoiding duplication.",
    options: [
      { id: "a", text: "Replicating tables between two Fabric capacities.", isCorrect: false },
      { id: "b", text: "Referencing external data stored in Azure Data Lake without copying it.", isCorrect: true },
      { id: "c", text: "Compressing CSV files for offline export.", isCorrect: false },
      { id: "d", text: "Migrating SQL Server backups into Fabric.", isCorrect: false }
    ]
  },
  {
    id: "fabric-data-warehouse",
    prompt: "What differentiates the Fabric data warehouse from traditional MPP warehouses?",
    type: "single",
    explanation:
      "The Fabric warehouse stores tables directly in OneLake Delta format, providing open access for Spark and SQL engines alike.",
    options: [
      { id: "a", text: "It stores data only in proprietary formats.", isCorrect: false },
      { id: "b", text: "It exposes tables as Delta so multiple engines can query the same data.", isCorrect: true },
      { id: "c", text: "It disables workload management.", isCorrect: false },
      { id: "d", text: "It requires separate storage accounts per warehouse.", isCorrect: false }
    ]
  },
  {
    id: "fabric-powerbi-integration",
    prompt: "How does Fabric simplify publishing Power BI reports?",
    type: "single",
    explanation:
      "Because Fabric hosts semantic models and reports together, publishing a report automatically uses the same OneLake-backed model.",
    options: [
      { id: "a", text: "Reports must be exported to PBIX and uploaded manually.", isCorrect: false },
      { id: "b", text: "Reports can be authored directly on Fabric semantic models within the same workspace.", isCorrect: true },
      { id: "c", text: "Reports require DirectQuery connections to Azure SQL Database.", isCorrect: false },
      { id: "d", text: "Reports cannot coexist with warehouses in a workspace.", isCorrect: false }
    ]
  },
  {
    id: "fabric-onelake-shortcut-governance",
    prompt: "What should teams evaluate before granting shortcut access?",
    type: "single",
    explanation:
      "Shortcut permissions should reflect source data governance because users can traverse upstream datasets when shortcuts are exposed.",
    options: [
      { id: "a", text: "Whether the data is stored in CSV format.", isCorrect: false },
      { id: "b", text: "Whether access aligns with the governance applied to the source system.", isCorrect: true },
      { id: "c", text: "Whether the shortcut contains at least 10 TB of data.", isCorrect: false },
      { id: "d", text: "Whether the shortcut is used only for Power BI.", isCorrect: false }
    ]
  },
  {
    id: "fabric-copilot-usage",
    prompt: "How can Copilot accelerate Fabric adoption?",
    type: "single",
    explanation:
      "Copilot assists with natural language queries, pipeline creation, and report summaries to reduce manual effort for builders.",
    options: [
      { id: "a", text: "By automatically creating new capacities when usage spikes.", isCorrect: false },
      { id: "b", text: "By generating queries, pipelines, and report insights with natural language prompts.", isCorrect: true },
      { id: "c", text: "By encrypting datasets using customer-managed keys.", isCorrect: false },
      { id: "d", text: "By provisioning Microsoft Purview accounts automatically.", isCorrect: false }
    ]
  },
  {
    id: "fabric-synapse-migration",
    prompt: "What is a recommended first step when migrating Synapse workloads to Fabric?",
    type: "single",
    explanation:
      "Cataloging assets and understanding data lineage with Purview helps prioritize which workloads to migrate to Fabric first.",
    options: [
      { id: "a", text: "Disable existing data pipelines immediately.", isCorrect: false },
      { id: "b", text: "Assess existing assets with Microsoft Purview to plan migration waves.", isCorrect: true },
      { id: "c", text: "Convert all notebooks to SQL scripts before migration.", isCorrect: false },
      { id: "d", text: "Move Power BI datasets to on-premises servers temporarily.", isCorrect: false }
    ]
  },
  {
    id: "fabric-performance-optimization",
    prompt: "Which action improves performance for a busy Fabric capacity?",
    type: "single",
    explanation:
      "Monitoring usage metrics and scaling capacity or applying workload settings ensures critical jobs receive resources.",
    options: [
      { id: "a", text: "Disable capacity metrics to reduce noise.", isCorrect: false },
      { id: "b", text: "Review metrics and adjust capacity scale or workload settings accordingly.", isCorrect: true },
      { id: "c", text: "Limit workspaces to a single author at a time.", isCorrect: false },
      { id: "d", text: "Export OneLake data to CSV on a schedule.", isCorrect: false }
    ]
  }
];

const buildQuizQuestions = (start: number, end: number, prefix: string): Question[] => {
  const safeStart = Math.max(0, start);
  const safeEnd = Math.min(fabricQuestionBank.length, end);
  return fabricQuestionBank.slice(safeStart, safeEnd).map((question) => ({
    ...question,
    id: `${prefix}-${question.id}`,
    options: question.options.map((option) => ({ ...option }))
  }));
};

type CreateQuizArgs = {
  id: string;
  title: string;
  description: string;
  focusArea: string;
  level: number;
  difficulty: QuizDefinition["difficulty"];
  duration: number;
  recommendedFor: string;
  range: [number, number];
  accessCode: string;
  joinLink: string;
  creatorId: string;
  communityLikes: number;
  tags?: string[];
};

const createQuiz = ({
  id,
  title,
  description,
  focusArea,
  level,
  difficulty,
  duration,
  recommendedFor,
  range,
  accessCode,
  joinLink,
  creatorId,
  communityLikes,
  tags
}: CreateQuizArgs): QuizDefinition => ({
  id,
  title,
  description,
  focusArea,
  level,
  difficulty,
  duration,
  recommendedFor,
  accessCode,
  joinLink,
  creatorId,
  communityLikes,
  tags: tags ?? [],
  questions: buildQuizQuestions(range[0], range[1], id)
});

export const quizzes: QuizDefinition[] = [
  createQuiz({
    id: "fabric-foundations",
    title: "Fabric Foundations",
    description: "Build confidence with the core terminology, governance model, and OneLake basics that power Fabric.",
    focusArea: "Fundamentals & unified architecture",
    level: 1,
    difficulty: "beginner",
    duration: 900,
    recommendedFor: "New to Fabric or migrating from legacy analytics stacks.",
    range: [0, 8],
    accessCode: "482913",
    joinLink: "https://quizzyquizz.app/join/fabric-foundations",
    creatorId: "creator-amelia",
    communityLikes: 186,
    tags: ["fabric", "onelake", "governance"]
  }),
  createQuiz({
    id: "fabric-practitioner",
    title: "Fabric Practitioner",
    description: "Validate how Fabric workloads collaborate, secure data, and orchestrate production-ready analytics.",
    focusArea: "Workloads, governance & collaboration",
    level: 2,
    difficulty: "intermediate",
    duration: 1500,
    recommendedFor: "Teams deploying Fabric at scale and refining operational excellence.",
    range: [8, 16],
    accessCode: "735204",
    joinLink: "https://quizzyquizz.app/join/fabric-practitioner",
    creatorId: "creator-ethan",
    communityLikes: 247,
    tags: ["automation", "governance", "analytics"]
  }),
  createQuiz({
    id: "fabric-expert",
    title: "Fabric Expert",
    description: "Prove mastery across capacity planning, real-time intelligence, and enterprise rollout strategies.",
    focusArea: "Optimization & advanced operations",
    level: 3,
    difficulty: "advanced",
    duration: 2100,
    recommendedFor: "Leaders architecting complex Fabric solutions with high governance requirements.",
    range: [16, fabricQuestionBank.length],
    accessCode: "951776",
    joinLink: "https://quizzyquizz.app/join/fabric-expert",
    creatorId: "creator-zoe",
    communityLikes: 312,
    tags: ["architecture", "realtime", "scale"]
  })
];

export { fabricQuestionBank };
