// app/components/rd/rdMockData.ts

import {
  InitiativeGroup,
  MarketingCampaign,
  Task,
} from "./rdTypes";

/**
 * Helper to build ISO dates more readably.
 */
function d(dateStr: string): string {
  // Expecting "2025-01-10" etc.
  return dateStr;
}

// Owners for flavour
const owners = {
  globalHead: "Global Head of Food",
  ukHead: "UK Head of Food",
  meHead: "Middle East Head of Food",
  iranHead: "Iran Food Lead",
  iraqHead: "Iraq Food Lead",
  innovationLead: "Menu Innovation Lead",
  opsLead: "Central Kitchen Ops Lead",
};

/**
 * TASK BUILDERS
 */
const tasks: Task[] = [
  // 1. EL&N Winter 24/25 Menu Refresh – UK
  {
    id: "t-winter-uk-brief",
    initiativeId: "i-winter-uk",
    name: "Creative brief & customer insight review",
    start: d("2024-11-01"),
    end: d("2024-11-08"),
    owner: owners.ukHead,
    status: "planning",
    type: "task",
    progress: 40,
  },
  {
    id: "t-winter-uk-rd-sprint",
    initiativeId: "i-winter-uk",
    name: "R&D sprint – hot drinks & desserts",
    start: d("2024-11-09"),
    end: d("2024-11-25"),
    owner: owners.innovationLead,
    status: "in-progress",
    type: "task",
    progress: 55,
    isCritical: true,
  },
  {
    id: "t-winter-uk-costing",
    initiativeId: "i-winter-uk",
    name: "Costing, GP guardrails & supplier lock-in",
    start: d("2024-11-18"),
    end: d("2024-11-29"),
    owner: owners.opsLead,
    status: "planning",
    type: "task",
    progress: 20,
    marketingLinked: true,
  },
  {
    id: "t-winter-uk-training",
    initiativeId: "i-winter-uk",
    name: "Training content & video for baristas",
    start: d("2024-12-01"),
    end: d("2024-12-10"),
    owner: owners.ukHead,
    status: "idea",
    type: "task",
    progress: 0,
  },

  // 2. EL&N Ramadan 25 Menu & Campaign – GCC
  {
    id: "t-ramadan-menu",
    initiativeId: "i-ramadan-gcc",
    name: "Ramadan menu concept & localisation",
    start: d("2025-01-05"),
    end: d("2025-01-20"),
    owner: owners.meHead,
    status: "planning",
    type: "task",
    progress: 30,
    isCritical: true,
  },
  {
    id: "t-ramadan-suppliers",
    initiativeId: "i-ramadan-gcc",
    name: "Secure dates, pistachio & dairy contracts",
    start: d("2025-01-15"),
    end: d("2025-02-01"),
    owner: owners.opsLead,
    status: "idea",
    type: "task",
    progress: 10,
  },
  {
    id: "t-ramadan-rollout",
    initiativeId: "i-ramadan-gcc",
    name: "Rollout plan by city & mall opening hours",
    start: d("2025-02-05"),
    end: d("2025-02-20"),
    owner: owners.meHead,
    status: "idea",
    type: "task",
    progress: 0,
  },

  // 3. New Store – EL&N Tehran Mall
  {
    id: "t-tehran-layout",
    initiativeId: "i-tehran-opening",
    name: "Kitchen & bar layout sign-off",
    start: d("2025-01-10"),
    end: d("2025-01-25"),
    owner: owners.iranHead,
    status: "in-progress",
    type: "task",
    progress: 60,
    isCritical: true,
  },
  {
    id: "t-tehran-menu-adapt",
    initiativeId: "i-tehran-opening",
    name: "Menu adaptation to local regulations",
    start: d("2025-01-20"),
    end: d("2025-02-10"),
    owner: owners.iranHead,
    status: "planning",
    type: "task",
    progress: 25,
  },
  {
    id: "t-tehran-soft-opening",
    initiativeId: "i-tehran-opening",
    name: "Soft opening & stress test",
    start: d("2025-03-01"),
    end: d("2025-03-05"),
    owner: owners.globalHead,
    status: "idea",
    type: "milestone",
    progress: 0,
    isCritical: true,
  },

  // 4. New Store – EL&N Baghdad
  {
    id: "t-baghdad-feasibility",
    initiativeId: "i-baghdad-opening",
    name: "Feasibility & landlord negotiations",
    start: d("2025-02-01"),
    end: d("2025-02-28"),
    owner: owners.iraqHead,
    status: "planning",
    type: "task",
    progress: 15,
  },
  {
    id: "t-baghdad-menu",
    initiativeId: "i-baghdad-opening",
    name: "Menu framework & cultural review",
    start: d("2025-03-01"),
    end: d("2025-03-25"),
    owner: owners.iraqHead,
    status: "idea",
    type: "task",
    progress: 0,
  },

  // 5. Global Valentine’s 2025 Limited Edition
  {
    id: "t-val-creative",
    initiativeId: "i-valentines-global",
    name: "Creative concept & hero SKUs",
    start: d("2024-12-20"),
    end: d("2025-01-05"),
    owner: owners.globalHead,
    status: "planning",
    type: "task",
    progress: 40,
  },
  {
    id: "t-val-photo",
    initiativeId: "i-valentines-global",
    name: "Photo shoot & asset pack",
    start: d("2025-01-06"),
    end: d("2025-01-15"),
    owner: owners.globalHead,
    status: "idea",
    type: "task",
    progress: 0,
    marketingLinked: true,
  },

  // 6. Summer 2025 Iced Drinks Lab
  {
    id: "t-summer-lab-1",
    initiativeId: "i-summer-lab",
    name: "Phase 1 – flavour mapping & competitor scan",
    start: d("2025-02-10"),
    end: d("2025-02-25"),
    owner: owners.innovationLead,
    status: "idea",
    type: "task",
    progress: 0,
  },
  {
    id: "t-summer-lab-2",
    initiativeId: "i-summer-lab",
    name: "Phase 2 – tasting panels & cost checks",
    start: d("2025-02-26"),
    end: d("2025-03-15"),
    owner: owners.innovationLead,
    status: "idea",
    type: "task",
    progress: 0,
  },

  // 7. Central Kitchen Capacity Upgrade – London
  {
    id: "t-ck-capacity-map",
    initiativeId: "i-ck-upgrade",
    name: "Map peak demand by store & daypart",
    start: d("2025-01-05"),
    end: d("2025-01-20"),
    owner: owners.opsLead,
    status: "in-progress",
    type: "task",
    progress: 50,
  },
  {
    id: "t-ck-equipment",
    initiativeId: "i-ck-upgrade",
    name: "Equipment list & supplier quotes",
    start: d("2025-01-15"),
    end: d("2025-02-05"),
    owner: owners.opsLead,
    status: "planning",
    type: "task",
    progress: 20,
  },
];

const campaigns: MarketingCampaign[] = [
  {
    id: "c-winter-uk-social",
    initiativeId: "i-winter-uk",
    title: "Winter launch – IG & TikTok teasers",
    start: d("2024-12-05"),
    end: d("2024-12-20"),
    channel: "social",
    intensity: 3,
    colorClass: "bg-emerald-400/70",
  },
  {
    id: "c-ramadan-pr",
    initiativeId: "i-ramadan-gcc",
    title: "Ramadan press & mall partnerships",
    start: d("2025-02-15"),
    end: d("2025-03-10"),
    channel: "pr",
    intensity: 2,
    colorClass: "bg-amber-400/70",
  },
  {
    id: "c-val-global",
    initiativeId: "i-valentines-global",
    title: "Global Valentine’s campaign",
    start: d("2025-01-20"),
    end: d("2025-02-14"),
    channel: "social",
    intensity: 3,
    colorClass: "bg-pink-500/70",
  },
  {
    id: "c-summer-lab-tease",
    initiativeId: "i-summer-lab",
    title: "“Summer Lab” behind-the-scenes content",
    start: d("2025-03-10"),
    end: d("2025-03-25"),
    channel: "influencers",
    intensity: 1,
    colorClass: "bg-sky-400/70",
  },
];

export const initiativeGroups: InitiativeGroup[] = [
  {
    id: "i-winter-uk",
    name: "Winter 24/25 Menu Refresh – UK",
    type: "menu",
    brand: "EL&N",
    region: "UK & Ireland",
    country: "United Kingdom",
    city: "London",
    owner: owners.ukHead,
    status: "in-progress",
    colorClass: "emerald",
    sortOrder: 1,
    start: d("2024-11-01"),
    end: d("2024-12-20"),
    tasks: tasks.filter((t) => t.initiativeId === "i-winter-uk"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-winter-uk"
    ),
  },
  {
    id: "i-ramadan-gcc",
    name: "Ramadan 2025 Menu & Campaign – GCC",
    type: "seasonal",
    brand: "EL&N",
    region: "Middle East",
    country: "UAE / KSA / Qatar",
    city: "Dubai / Riyadh / Doha",
    owner: owners.meHead,
    status: "planning",
    colorClass: "amber",
    sortOrder: 2,
    start: d("2025-01-05"),
    end: d("2025-03-20"),
    tasks: tasks.filter((t) => t.initiativeId === "i-ramadan-gcc"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-ramadan-gcc"
    ),
  },
  {
    id: "i-tehran-opening",
    name: "New Store Opening – Tehran Mega Mall",
    type: "opening",
    brand: "EL&N",
    region: "Middle East",
    country: "Iran",
    city: "Tehran",
    owner: owners.iranHead,
    status: "in-progress",
    colorClass: "sky",
    sortOrder: 3,
    start: d("2025-01-10"),
    end: d("2025-03-10"),
    tasks: tasks.filter((t) => t.initiativeId === "i-tehran-opening"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-tehran-opening"
    ),
  },
  {
    id: "i-baghdad-opening",
    name: "New Store Feasibility – Baghdad",
    type: "opening",
    brand: "EL&N",
    region: "Middle East",
    country: "Iraq",
    city: "Baghdad",
    owner: owners.iraqHead,
    status: "idea",
    colorClass: "violet",
    sortOrder: 4,
    start: d("2025-02-01"),
    end: d("2025-03-31"),
    tasks: tasks.filter((t) => t.initiativeId === "i-baghdad-opening"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-baghdad-opening"
    ),
  },
  {
    id: "i-valentines-global",
    name: "Valentine’s 2025 Limited Edition – Global",
    type: "seasonal",
    brand: "EL&N",
    region: "Global",
    country: "Multi-country",
    city: "Key Flagship Cities",
    owner: owners.globalHead,
    status: "planning",
    colorClass: "pink",
    sortOrder: 5,
    start: d("2024-12-20"),
    end: d("2025-02-14"),
    tasks: tasks.filter((t) => t.initiativeId === "i-valentines-global"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-valentines-global"
    ),
  },
  {
    id: "i-summer-lab",
    name: "Summer 2025 Iced Drinks Lab",
    type: "menu",
    brand: "EL&N",
    region: "Global",
    country: "Multi-country",
    city: "Lab / Test Markets",
    owner: owners.innovationLead,
    status: "idea",
    colorClass: "cyan",
    sortOrder: 6,
    start: d("2025-02-10"),
    end: d("2025-03-31"),
    tasks: tasks.filter((t) => t.initiativeId === "i-summer-lab"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-summer-lab"
    ),
  },
  {
    id: "i-ck-upgrade",
    name: "Central Kitchen Capacity Upgrade – London",
    type: "ops-improvement",
    brand: "EL&N",
    region: "UK & Ireland",
    country: "United Kingdom",
    city: "London",
    owner: owners.opsLead,
    status: "in-progress",
    colorClass: "slate",
    sortOrder: 7,
    start: d("2025-01-05"),
    end: d("2025-02-28"),
    tasks: tasks.filter((t) => t.initiativeId === "i-ck-upgrade"),
    marketingCampaigns: campaigns.filter(
      (c) => c.initiativeId === "i-ck-upgrade"
    ),
  },
];

export { campaigns as marketingCampaigns };
