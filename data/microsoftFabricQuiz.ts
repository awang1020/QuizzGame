export type FabricQuestionType = "métier" | "technique";
export type FabricDifficulty = "beginner" | "intermediate" | "advanced";

export interface FabricQuizQuestion {
  question: string;
  choices: string[];
  answer: string;
  difficulty: FabricDifficulty;
  type: FabricQuestionType;
}

export interface FabricQuizLevel {
  id: "beginner" | "intermediate" | "advanced";
  title: string;
  description: string;
  questions: FabricQuizQuestion[];
}

export interface FabricQuiz {
  id: string;
  title: string;
  summary: string;
  levels: FabricQuizLevel[];
}

export const microsoftFabricQuiz: FabricQuiz = {
  id: "microsoft-fabric-tri-tier",
  title: "Microsoft Fabric 360° Mastery Quiz",
  summary:
    "A progressive quiz that evaluates Microsoft Fabric knowledge across business strategy and technical implementation, from fundamentals to advanced architecture.",
  levels: [
    {
      id: "beginner",
      title: "Beginner – Fundamentals & Concepts",
      description:
        "Establish the core vocabulary of Microsoft Fabric and understand how its unified workloads deliver business value.",
      questions: [
        {
          question:
            "Which statement best describes Microsoft Fabric from a business perspective?",
          choices: [
            "A unified analytics SaaS platform that simplifies data-to-insight delivery",
            "A replacement for Microsoft 365 licensing across the enterprise",
            "A virtual machine product only available through Azure Marketplace"
          ],
          answer:
            "A unified analytics SaaS platform that simplifies data-to-insight delivery",
          difficulty: "beginner",
          type: "métier"
        },
        {
          question:
            "What primary benefit does Fabric offer to executives evaluating analytics investments?",
          choices: [
            "Centralized governance over shared data assets without separate tools",
            "Guaranteed elimination of all data integration costs",
            "Automatic generation of quarterly financial statements without input"
          ],
          answer: "Centralized governance over shared data assets without separate tools",
          difficulty: "beginner",
          type: "métier"
        },
        {
          question:
            "Which Fabric workload is most associated with delivering trusted dashboards to business decision-makers?",
          choices: [
            "Power BI",
            "Data Science",
            "Real-Time Intelligence"
          ],
          answer: "Power BI",
          difficulty: "beginner",
          type: "métier"
        },
        {
          question:
            "When presenting Fabric to a line-of-business sponsor, which value proposition resonates most?",
          choices: [
            "Accelerated time-to-insight through an end-to-end, governed platform",
            "Availability of on-premises hardware managed by Microsoft",
            "Ability to replace customer relationship management (CRM) systems"
          ],
          answer:
            "Accelerated time-to-insight through an end-to-end, governed platform",
          difficulty: "beginner",
          type: "métier"
        },
        {
          question:
            "Which Fabric capability helps business teams reuse curated data across reports without rebuilding models?",
          choices: [
            "Certified semantic models in OneLake",
            "Azure DevOps repositories",
            "Power Apps connectors"
          ],
          answer: "Certified semantic models in OneLake",
          difficulty: "beginner",
          type: "métier"
        },
        {
          question:
            "From a technical standpoint, what is OneLake's primary role in Fabric?",
          choices: [
            "Serving as the unified data lake backing every Fabric workload",
            "Providing a directory for storing PowerPoint presentations",
            "Hosting Azure virtual machines for compute-intensive tasks"
          ],
          answer: "Serving as the unified data lake backing every Fabric workload",
          difficulty: "beginner",
          type: "technique"
        },
        {
          question: "Which Fabric workload should an engineer choose for orchestrating data pipelines?",
          choices: ["Data Factory", "Power BI", "Copilot"],
          answer: "Data Factory",
          difficulty: "beginner",
          type: "technique"
        },
        {
          question:
            "How do shortcuts in Fabric help technical teams collaborate on data?",
          choices: [
            "They virtualize external or shared data without copying it into OneLake",
            "They encrypt data using customer-managed keys by default",
            "They automatically convert dashboards into PowerPoint presentations"
          ],
          answer:
            "They virtualize external or shared data without copying it into OneLake",
          difficulty: "beginner",
          type: "technique"
        },
        {
          question:
            "Which component allows Fabric users to run notebooks against lakehouse data?",
          choices: ["Data Engineering workload", "Real-Time Intelligence workload", "Power Apps"],
          answer: "Data Engineering workload",
          difficulty: "beginner",
          type: "technique"
        },
        {
          question:
            "Why is the Delta table format fundamental to Fabric's storage strategy?",
          choices: [
            "It combines Parquet storage with ACID transactions for reliable multi-engine access",
            "It is the only format compatible with PowerPoint exports",
            "It stores data exclusively inside SQL Server virtual machines"
          ],
          answer:
            "It combines Parquet storage with ACID transactions for reliable multi-engine access",
          difficulty: "beginner",
          type: "technique"
        }
      ]
    },
    {
      id: "intermediate",
      title: "Intermediate – Usage & Scenarios",
      description:
        "Explore how Fabric workloads work together, emphasizing governance, collaboration, and practical solution choices.",
      questions: [
        {
          question:
            "How can business domain leads use Fabric workspaces to improve accountability?",
          choices: [
            "Assign workspace ownership aligned with business domains for clearer stewardship",
            "Provide unrestricted edit access to all employees across the tenant",
            "Disable workspace certifications to speed up publishing"
          ],
          answer:
            "Assign workspace ownership aligned with business domains for clearer stewardship",
          difficulty: "intermediate",
          type: "métier"
        },
        {
          question:
            "Why would a data product owner advocate for Fabric domains?",
          choices: [
            "They mirror organizational structures, easing governance and funding conversations",
            "They automatically translate reports into multiple languages",
            "They remove the need for data privacy assessments"
          ],
          answer:
            "They mirror organizational structures, easing governance and funding conversations",
          difficulty: "intermediate",
          type: "métier"
        },
        {
          question:
            "Which governance action increases stakeholder trust in reusable Fabric datasets?",
          choices: [
            "Applying certifications to semantic models after review",
            "Allowing everyone to publish uncertified datasets",
            "Disabling dataset endorsements to reduce notifications"
          ],
          answer: "Applying certifications to semantic models after review",
          difficulty: "intermediate",
          type: "métier"
        },
        {
          question:
            "What business outcome does mirroring operational databases into Fabric support?",
          choices: [
            "Timely decision-making using near-real-time analytics without straining source systems",
            "Elimination of any need for data refresh policies",
            "Replacement of enterprise resource planning (ERP) systems"
          ],
          answer:
            "Timely decision-making using near-real-time analytics without straining source systems",
          difficulty: "intermediate",
          type: "métier"
        },
        {
          question:
            "How does OneLake's open storage approach benefit procurement discussions?",
          choices: [
            "It avoids vendor lock-in by supporting open Delta tables accessible with standard tools",
            "It requires proprietary file formats that increase switching costs",
            "It mandates on-premises appliances for compliance"
          ],
          answer:
            "It avoids vendor lock-in by supporting open Delta tables accessible with standard tools",
          difficulty: "intermediate",
          type: "métier"
        },
        {
          question:
            "When should a technical team create a OneLake shortcut to an Azure Data Lake Storage Gen2 container?",
          choices: [
            "When they need to reference existing lake data in Fabric without duplicating it",
            "When they must permanently migrate data into Fabric and retire the source",
            "When they want to export reports to PowerPoint on a schedule"
          ],
          answer:
            "When they need to reference existing lake data in Fabric without duplicating it",
          difficulty: "intermediate",
          type: "technique"
        },
        {
          question:
            "Which Fabric feature allows analysts to transform data with reusable logic before modeling in Power BI?",
          choices: ["Dataflows Gen2", "Copilot", "Deployment pipelines"],
          answer: "Dataflows Gen2",
          difficulty: "intermediate",
          type: "technique"
        },
        {
          question:
            "How should a solution architect decide between Lakehouse and Warehouse workloads?",
          choices: [
            "Choose Lakehouse for code-first Spark processing and Warehouse for SQL-first managed tables",
            "Always choose Warehouse because it stores data cheaper than Lakehouse",
            "Always choose Lakehouse because Warehouses cannot serve Power BI"
          ],
          answer:
            "Choose Lakehouse for code-first Spark processing and Warehouse for SQL-first managed tables",
          difficulty: "intermediate",
          type: "technique"
        },
        {
          question:
            "Why might a team configure mirroring from Azure Cosmos DB into Fabric?",
          choices: [
            "To keep an analytics-ready replica synchronized with transactional workloads",
            "To automatically provision Power Apps screens",
            "To host serverless web applications"
          ],
          answer: "To keep an analytics-ready replica synchronized with transactional workloads",
          difficulty: "intermediate",
          type: "technique"
        },
        {
          question:
            "Which Fabric governance feature helps manage lifecycle and promotion across environments?",
          choices: ["Deployment pipelines", "Microsoft Teams", "SharePoint hubs"],
          answer: "Deployment pipelines",
          difficulty: "intermediate",
          type: "technique"
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced – Architecture, Security & Optimization",
      description:
        "Deep dive into enterprise-scale architectural choices, advanced security, and operational excellence in Microsoft Fabric.",
      questions: [
        {
          question:
            "How does Fabric support a medallion architecture from a governance viewpoint?",
          choices: [
            "By enabling Bronze, Silver, and Gold layers to align with data product certification stages",
            "By forcing teams to maintain separate lakes for each business unit",
            "By restricting business users from accessing Gold datasets"
          ],
          answer:
            "By enabling Bronze, Silver, and Gold layers to align with data product certification stages",
          difficulty: "advanced",
          type: "métier"
        },
        {
          question:
            "Why should executives sponsor Microsoft Purview integration with Fabric?",
          choices: [
            "It provides data cataloging, lineage, and policy enforcement to meet compliance mandates",
            "It automatically reduces Fabric licensing costs",
            "It removes the need for change management across data teams"
          ],
          answer:
            "It provides data cataloging, lineage, and policy enforcement to meet compliance mandates",
          difficulty: "advanced",
          type: "métier"
        },
        {
          question:
            "Which licensing conversation is critical when planning enterprise Fabric rollouts?",
          choices: [
            "Aligning F-SKU capacity sizes with workload concurrency and growth projections",
            "Negotiating free access for all external partners by default",
            "Committing to perpetual licenses for on-premises appliances"
          ],
          answer:
            "Aligning F-SKU capacity sizes with workload concurrency and growth projections",
          difficulty: "advanced",
          type: "métier"
        },
        {
          question:
            "How does Fabric's unified governance assist with regulatory audits?",
          choices: [
            "It offers end-to-end lineage, access reporting, and policy enforcement through Purview",
            "It disables change history to keep environments streamlined",
            "It removes the need to document data retention policies"
          ],
          answer:
            "It offers end-to-end lineage, access reporting, and policy enforcement through Purview",
          difficulty: "advanced",
          type: "métier"
        },
        {
          question:
            "What ROI narrative resonates with leadership for advanced Fabric adoption?",
          choices: [
            "Faster innovation by standardizing data products on a governed, scalable platform",
            "Guaranteed elimination of all third-party analytics tools",
            "Ability to replace customer support teams with automation"
          ],
          answer:
            "Faster innovation by standardizing data products on a governed, scalable platform",
          difficulty: "advanced",
          type: "métier"
        },
        {
          question:
            "Which security measure should architects implement to restrict row access in Fabric semantic models?",
          choices: ["Row-level security (RLS)", "Column-level security (CLS)", "Sensitivity labels"],
          answer: "Row-level security (RLS)",
          difficulty: "advanced",
          type: "technique"
        },
        {
          question:
            "How can engineers protect specific fields in Warehouse tables from unauthorized reads?",
          choices: [
            "Apply column-level security or dynamic data masking policies",
            "Store the columns in Excel and distribute manually",
            "Move the tables to on-premises SQL Server instances"
          ],
          answer: "Apply column-level security or dynamic data masking policies",
          difficulty: "advanced",
          type: "technique"
        },
        {
          question:
            "What combination enforces data governance policies across Fabric assets?",
          choices: [
            "Microsoft Purview sensitivity labels, data loss prevention policies, and monitoring",
            "PowerPoint templates and SharePoint announcements",
            "Local machine group policies managed by individual analysts"
          ],
          answer:
            "Microsoft Purview sensitivity labels, data loss prevention policies, and monitoring",
          difficulty: "advanced",
          type: "technique"
        },
        {
          question:
            "How should administrators plan for bursting and throttling on Fabric capacities?",
          choices: [
            "Monitor utilization metrics, scale F-SKU capacity, and enable autoscale where available",
            "Disable workloads during business hours to conserve resources",
            "Rely solely on Power BI Premium per user licenses"
          ],
          answer:
            "Monitor utilization metrics, scale F-SKU capacity, and enable autoscale where available",
          difficulty: "advanced",
          type: "technique"
        },
        {
          question:
            "What architectural practice ensures resilient data pipelines in Fabric?",
          choices: [
            "Orchestrate medallion layer processing with retry policies, monitoring, and isolated workspaces",
            "Run all transformations manually through Excel macros",
            "Disable alerting to avoid noisy notifications"
          ],
          answer:
            "Orchestrate medallion layer processing with retry policies, monitoring, and isolated workspaces",
          difficulty: "advanced",
          type: "technique"
        }
      ]
    }
  ]
};
