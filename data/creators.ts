export type Creator = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarInitials: string;
  avatarColor: string;
  expertise: string[];
  followers: number;
};

export const creators: Creator[] = [
  {
    id: "creator-amelia",
    name: "Amélia Durand",
    role: "Fabric Adoption Strategist",
    bio: "Accompagne les organisations dans leurs migrations vers OneLake et les bonnes pratiques de gouvernance.",
    avatarInitials: "AD",
    avatarColor: "from-sky-500 to-blue-500",
    expertise: ["Fabric Foundations", "Gouvernance", "OneLake"],
    followers: 1280
  },
  {
    id: "creator-ethan",
    name: "Ethan Martin",
    role: "Architecte Analytics",
    bio: "Optimise les workloads Fabric multi-équipes et les pipelines de données orientés produit.",
    avatarInitials: "EM",
    avatarColor: "from-emerald-500 to-teal-500",
    expertise: ["Data Factory", "Ops", "Collaboration"],
    followers: 980
  },
  {
    id: "creator-zoe",
    name: "Zoé Bernard",
    role: "Lead Modern BI",
    bio: "Spécialiste des architectures temps réel et des déploiements Fabric à grande échelle.",
    avatarInitials: "ZB",
    avatarColor: "from-amber-500 to-rose-500",
    expertise: ["Real-time", "Observabilité", "Capacités"],
    followers: 1523
  }
];
