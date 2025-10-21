import type { Question, Quiz } from "@/context/QuizContext";

const fabricQuestionBank: Question[] = [
  {
    id: "fabric-fundamentals-overview",
    prompt:
      "Which statement best captures Microsoft Fabric's core value proposition for analytics teams?",
    type: "single",
    explanation:
      "Microsoft Fabric delivers a unified Software-as-a-Service analytics platform that combines data integration, engineering, warehousing, data science, and business intelligence on top of OneLake.",
    options: [
      {
        id: "a",
        text: "It is a standalone visualization tool that replaces Power BI Desktop.",
        isCorrect: false
      },
      {
        id: "b",
        text: "It unifies data integration, engineering, warehousing, data science, and BI workloads in a single SaaS experience.",
        isCorrect: true
      },
      {
        id: "c",
        text: "It is an Azure subscription tier used solely for hosting SQL Server virtual machines.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It is an add-on that only enhances Microsoft Purview catalogs.",
        isCorrect: false
      }
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
      {
        id: "c",
        text: "By forcing teams to export data to Excel for final analysis.",
        isCorrect: false
      },
      {
        id: "d",
        text: "By restricting BI workloads to on-premises gateways only.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-bi-accelerate",
    prompt:
      "Which Fabric capability most directly empowers business analysts to deliver trusted self-service BI faster?",
    type: "single",
    explanation:
      "Fabric couples Power BI with centrally governed, reusable semantic models stored in OneLake, enabling analysts to build dashboards against certified data.",
    options: [
      {
        id: "a",
        text: "Automatic conversion of PowerPoint slides into dashboards.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Shared, certified semantic models in OneLake that Power BI can reuse across reports.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Requiring analysts to write Scala code in notebooks for every dataset.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Limiting report development to Fabric administrators.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-workloads-scope",
    prompt:
      "Which option lists all seven core workloads available within Microsoft Fabric?",
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
      {
        id: "a",
        text: "A virtual network gateway used to expose Fabric resources to the internet.",
        isCorrect: false
      },
      {
        id: "b",
        text: "The unified, organization-wide data lake that underpins every Fabric workload.",
        isCorrect: true
      },
      {
        id: "c",
        text: "A desktop tool for designing Power BI reports offline.",
        isCorrect: false
      },
      {
        id: "d",
        text: "An Azure billing account dedicated solely to Fabric capacities.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-delta-format",
    prompt:
      "Why is the Delta Parquet format foundational to Fabric's data architecture?",
    type: "single",
    explanation:
      "Delta tables in Parquet deliver ACID transactions, schema enforcement, and time travel, enabling reliable analytics across Fabric workloads that share OneLake.",
    options: [
      {
        id: "a",
        text: "Because it is the only format compatible with CSV exports.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Because it combines Parquet storage with ACID transactions, enabling reliable multi-engine access.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Because it prevents Power BI from reading tables directly.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Because it stores table data exclusively in SQL Server instances.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-shortcuts",
    prompt:
      "When should you use OneLake shortcuts in a Fabric solution?",
    type: "single",
    explanation:
      "Shortcuts let teams virtualize external data lakes or other OneLake items without copying data, maintaining a single source of truth.",
    options: [
      {
        id: "a",
        text: "When you need to duplicate large datasets into OneLake for each workspace.",
        isCorrect: false
      },
      {
        id: "b",
        text: "When you want to reference external lake data or another OneLake item in place without ingesting it.",
        isCorrect: true
      },
      {
        id: "c",
        text: "When you need to encrypt files with customer-managed keys.",
        isCorrect: false
      },
      {
        id: "d",
        text: "When Power BI reports must be exported to Excel.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-mirroring",
    prompt:
      "What problem does Fabric's mirroring capability solve?",
    type: "single",
    explanation:
      "Mirroring continuously replicates operational databases like Cosmos DB or Azure SQL into OneLake-managed Delta tables for analytics without impacting source workloads.",
    options: [
      {
        id: "a",
        text: "It encrypts data in transit between on-premises gateways and Fabric.",
        isCorrect: false
      },
      {
        id: "b",
        text: "It keeps a near-real-time replica of operational databases in OneLake for analytics with minimal source impact.",
        isCorrect: true
      },
      {
        id: "c",
        text: "It automatically creates PowerPoint summaries of Fabric reports.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It converts Delta tables into Excel workbooks for business users.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-compute-storage",
    prompt:
      "Why does separating compute from storage matter in Microsoft Fabric?",
    type: "single",
    explanation:
      "With OneLake providing shared storage, each workload can scale compute independently, pausing or bursting engines without duplicating data, which reduces cost and improves performance isolation.",
    options: [
      {
        id: "a",
        text: "It allows Fabric to store all data inside Power BI datasets only.",
        isCorrect: false
      },
      {
        id: "b",
        text: "It lets each workload scale or pause compute without moving or duplicating the data in OneLake.",
        isCorrect: true
      },
      {
        id: "c",
        text: "It requires every workload to share the same Spark cluster at all times.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It prevents administrators from monitoring usage metrics.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-data-factory-selection",
    prompt:
      "Which scenario is the best fit for the Data Factory workload in Fabric?",
    type: "single",
    explanation:
      "Data Factory in Fabric provides no-code and low-code data movement and orchestration with over 200 connectors and pipeline scheduling capabilities.",
    options: [
      {
        id: "a",
        text: "Building semantic models for enterprise reporting.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Authoring pipelines that orchestrate ingestion from SaaS sources using prebuilt connectors and dataflows Gen2.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Running large-scale Spark notebooks for feature engineering.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Serving low-latency KPI scorecards through Direct Lake semantics.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-data-engineering-scenario",
    prompt:
      "A data engineer needs collaborative notebooks with Git integration to transform lakehouse tables. Which Fabric workload should they use?",
    type: "single",
    explanation:
      "The Data Engineering workload provides lakehouses backed by Spark notebooks, Git integration, and Lakehouse Explorer for collaborative transformations.",
    options: [
      {
        id: "a",
        text: "Power BI workload",
        isCorrect: false
      },
      {
        id: "b",
        text: "Data Engineering workload",
        isCorrect: true
      },
      {
        id: "c",
        text: "Real-Time Intelligence workload",
        isCorrect: false
      },
      {
        id: "d",
        text: "Copilot workload",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-data-warehouse-scenario",
    prompt:
      "What differentiates the Data Warehouse workload from the Lakehouse in Fabric?",
    type: "single",
    explanation:
      "Fabric warehouses expose a T-SQL endpoint with full transactional capabilities and workload management while still storing tables in OneLake as Delta.",
    options: [
      {
        id: "a",
        text: "Warehouses store data in proprietary formats unavailable to other workloads.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Warehouses deliver a dedicated SQL endpoint with full ACID semantics while persisting tables in OneLake.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Warehouses cannot be queried with T-SQL.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Warehouses require manual file management for every table.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-real-time-intelligence",
    prompt:
      "Which use case showcases the Real-Time Intelligence workload in Fabric?",
    type: "single",
    explanation:
      "Real-Time Intelligence leverages event streams and KQL databases to capture and analyze telemetry instantly for alerting and dashboards.",
    options: [
      {
        id: "a",
        text: "Batch loading quarterly financial statements into a lakehouse.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Monitoring IoT sensor events with event streams feeding a KQL database for anomaly detection.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Designing paginated reports for printing.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Authoring machine learning pipelines in notebooks.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-data-science-use",
    prompt:
      "How does the Data Science workload integrate with the rest of Fabric?",
    type: "single",
    explanation:
      "Data Science provides managed notebooks, experiment tracking, and MLflow integration that read and write Delta tables in OneLake so models can operationalize across workloads.",
    options: [
      {
        id: "a",
        text: "It stores models in isolated blob storage that other workloads cannot access.",
        isCorrect: false
      },
      {
        id: "b",
        text: "It uses managed notebooks and MLflow, reading and writing Delta tables shared through OneLake.",
        isCorrect: true
      },
      {
        id: "c",
        text: "It only supports exporting models as PowerPoint decks.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It requires provisioning separate Azure Databricks workspaces.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-copilot-powerbi",
    prompt:
      "Which Copilot capability accelerates Power BI development in Fabric?",
    type: "single",
    explanation:
      "Copilot in Power BI can generate report pages, DAX calculations, and narrative summaries from natural language prompts, speeding iterative design.",
    options: [
      {
        id: "a",
        text: "Automatically deploying datasets to Azure Synapse without review.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Generating visuals, DAX measures, and narratives from natural language descriptions.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Creating custom connectors for unsupported SaaS sources.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Provisioning new Fabric capacities automatically.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-copilot-accelerate",
    prompt:
      "Why does Copilot improve productivity for Fabric developers beyond Power BI?",
    type: "single",
    explanation:
      "Copilot assists across workloads by drafting dataflows, pipeline activities, Spark code, and KQL queries from prompts, reducing manual coding time.",
    options: [
      {
        id: "a",
        text: "It replaces all governance approvals so developers can bypass security.",
        isCorrect: false
      },
      {
        id: "b",
        text: "It can author pipeline activities, notebooks, and queries from natural language prompts, speeding up development.",
        isCorrect: true
      },
      {
        id: "c",
        text: "It disables version control to simplify notebooks.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It automatically tunes capacity SKUs without human input.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-purview-role",
    prompt:
      "What role does Microsoft Purview play within Fabric governance?",
    type: "single",
    explanation:
      "Purview supplies Fabric with cataloging, lineage, data classification, and policy enforcement, forming the backbone of enterprise governance in the platform.",
    options: [
      {
        id: "a",
        text: "Purview is optional and only used for billing Fabric capacities.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Purview provides centralized cataloging, lineage, classification, and policy management across Fabric data assets.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Purview is required only for on-premises data gateways.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Purview replaces the need for audit logs in Fabric.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-security-model",
    prompt:
      "Which combination exemplifies Fabric's universal security model for protecting data?",
    type: "single",
    explanation:
      "Fabric supports row-level security (RLS), column-level security (CLS), object-level security (OLS), and dynamic data masking to ensure fine-grained access control across workloads.",
    options: [
      {
        id: "a",
        text: "Workbook locking and Excel password protection only.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Row-level security, column-level security, object-level security, and dynamic data masking applied consistently across items.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Firewall rules and VPN tunnels managed outside Fabric.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Power BI sharing links without authentication.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-domains-governance",
    prompt:
      "How do domains and workspace approval workflows improve Fabric governance in large enterprises?",
    type: "single",
    explanation:
      "Domains align Fabric items with business areas while approval workflows ensure new workspaces meet governance standards before provisioning, supporting decentralized yet controlled operations.",
    options: [
      {
        id: "a",
        text: "They allow any user to create workspaces anonymously to speed experimentation.",
        isCorrect: false
      },
      {
        id: "b",
        text: "They group workspaces by business area and enforce approval policies for new workspace creation.",
        isCorrect: true
      },
      {
        id: "c",
        text: "They automatically delete inactive workspaces without review.",
        isCorrect: false
      },
      {
        id: "d",
        text: "They encrypt datasets using personal certificates.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-lineage-impact",
    prompt:
      "Why are lineage and impact analysis views important in Fabric deployments?",
    type: "single",
    explanation:
      "Lineage and impact analysis help stakeholders understand upstream dependencies and downstream effects of changes across pipelines, lakehouses, and reports, reducing regression risk.",
    options: [
      {
        id: "a",
        text: "They automatically upgrade capacities to the next SKU size.",
        isCorrect: false
      },
      {
        id: "b",
        text: "They reveal upstream and downstream relationships so teams can assess change impact before deployment.",
        isCorrect: true
      },
      {
        id: "c",
        text: "They disable sharing of certified datasets.",
        isCorrect: false
      },
      {
        id: "d",
        text: "They replace the need for deployment pipelines entirely.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-data-protection",
    prompt:
      "How do sensitivity labels and DLP policies protect data in Fabric?",
    type: "single",
    explanation:
      "Sensitivity labels classify data and enforce encryption or access restrictions, while DLP policies detect and prevent risky sharing or exports of protected content across Fabric and M365.",
    options: [
      {
        id: "a",
        text: "They only apply to files stored in local desktops, not Fabric.",
        isCorrect: false
      },
      {
        id: "b",
        text: "They classify and monitor data so protected content cannot be shared or exported in violation of policy.",
        isCorrect: true
      },
      {
        id: "c",
        text: "They automatically convert Delta tables into CSV files for auditing.",
        isCorrect: false
      },
      {
        id: "d",
        text: "They remove the need for audit logs because data is encrypted.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-audit",
    prompt:
      "Why should Fabric administrators enable unified audit logging?",
    type: "single",
    explanation:
      "Audit logs provide traceability for access, sharing, and configuration changes across Fabric items, supporting compliance investigations and proactive monitoring.",
    options: [
      {
        id: "a",
        text: "Because audit logs are required to schedule Data Factory pipelines.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Because audit logs capture user and service actions on Fabric items, enabling compliance and security reviews.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Because audit logs automatically create semantic models from raw data.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Because audit logs replace the need for workspace roles.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-licensing-comparison",
    prompt:
      "Which statement correctly compares Power BI Pro, Power BI Premium Per User (PPU), and Fabric capacity licenses?",
    type: "single",
    explanation:
      "Pro licenses provide report authoring and sharing in shared capacity, PPU adds premium features per user, while Fabric capacities (F SKUs) allocate dedicated compute for all Fabric workloads.",
    options: [
      {
        id: "a",
        text: "Pro and PPU both provide dedicated capacity, whereas Fabric capacities are pay-as-you-go for paginated reports only.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Power BI Pro uses shared capacity, PPU adds premium features on a per-user basis, and Fabric capacities deliver dedicated compute for the entire Fabric platform.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Fabric capacities can only run Power BI workloads, not Data Engineering.",
        isCorrect: false
      },
      {
        id: "d",
        text: "PPU eliminates the need for any capacity planning because workloads autoscale infinitely.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-shared-capacity",
    prompt:
      "What characterizes the shared capacity model in Fabric?",
    type: "single",
    explanation:
      "Shared capacity pools resources across tenants, using bursting and smoothing to balance demand but throttling workloads that exceed limits, making it suitable for light usage only.",
    options: [
      {
        id: "a",
        text: "Resources are dedicated per workspace, eliminating throttling altogether.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Workloads share pooled resources with automatic bursting and smoothing, but can be throttled if sustained demand is too high.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Only Power BI report rendering is allowed; other workloads are blocked.",
        isCorrect: false
      },
      {
        id: "d",
        text: "It is required for F64 and higher capacities.",
        isCorrect: false
      }
    ]
  },
  {
    id: "fabric-capacity-optimization",
    prompt:
      "Which approach helps optimize cost when running workloads on Fabric capacities such as F4 or F64?",
    type: "single",
    explanation:
      "Monitoring capacity metrics, pausing idle capacities, and right-sizing SKU levels based on actual utilization prevents over-provisioning and aligns spend to demand.",
    options: [
      {
        id: "a",
        text: "Leaving capacities running continuously regardless of workload demand.",
        isCorrect: false
      },
      {
        id: "b",
        text: "Regularly reviewing capacity metrics, scaling SKUs up or down, and pausing idle capacities during off-hours.",
        isCorrect: true
      },
      {
        id: "c",
        text: "Purchasing separate capacities for every workspace regardless of size.",
        isCorrect: false
      },
      {
        id: "d",
        text: "Disabling capacity metrics collection to reduce storage consumption.",
        isCorrect: false
      }
    ]
  }
];

const buildQuizQuestions = (start: number, end: number, prefix: string): Question[] => {
  const safeStart = Math.max(0, start);
  const safeEnd = Math.min(fabricQuestionBank.length, end);
  return fabricQuestionBank.slice(safeStart, safeEnd).map((question) => ({
    ...question,
    id: `\${prefix}-\${question.id}`,
    options: question.options.map((option) => ({ ...option }))
  }));
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
  joinLink
}: {
  id: string;
  title: string;
  description: string;
  focusArea: string;
  level: number;
  difficulty: Quiz["difficulty"];
  duration: number;
  recommendedFor: string;
  range: [number, number];
  accessCode: string;
  joinLink: string;
}): Quiz => ({
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
  questions: buildQuizQuestions(range[0], range[1], id)
});

export const quizzes: Quiz[] = [
  createQuiz({
    id: "fabric-foundations",
    title: "Fabric Foundations",
    description:
      "Build confidence with the core terminology, governance model, and OneLake basics that power Fabric.",
    focusArea: "Fundamentals & unified architecture",
    level: 1,
    difficulty: "beginner",
    duration: 900,
    recommendedFor: "New to Fabric or migrating from legacy analytics stacks.",
    range: [0, 8],
    accessCode: "482913",
    joinLink: "https://quizzyquizz.app/join/fabric-foundations"
  }),
  createQuiz({
    id: "fabric-practitioner",
    title: "Fabric Practitioner",
    description:
      "Validate how Fabric workloads collaborate, secure data, and orchestrate production-ready analytics.",
    focusArea: "Workloads, governance & collaboration",
    level: 2,
    difficulty: "intermediate",
    duration: 1500,
    recommendedFor: "Teams deploying Fabric at scale and refining operational excellence.",
    range: [8, 16],
    accessCode: "735204",
    joinLink: "https://quizzyquizz.app/join/fabric-practitioner"
  }),
  createQuiz({
    id: "fabric-expert",
    title: "Fabric Expert",
    description:
      "Prove mastery across capacity planning, real-time intelligence, and enterprise rollout strategies.",
    focusArea: "Optimization & advanced operations",
    level: 3,
    difficulty: "advanced",
    duration: 2100,
    recommendedFor: "Leaders architecting complex Fabric solutions with high governance requirements.",
    range: [16, fabricQuestionBank.length],
    accessCode: "951776",
    joinLink: "https://quizzyquizz.app/join/fabric-expert"
  })
];
