export type ToolRisk = "high" | "medium" | "low" | "none";

export type ToolExposure = {
  label: string;
  risk: ToolRisk;
  detail: string;
};

export type ScorecardTool = {
  id: string;
  name: string;
  category: string;
  exposure: ToolExposure[];
};

export const SCORECARD_TOOLS: ScorecardTool[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Messaging",
    exposure: [
      { label: "Reads your messages", risk: "high", detail: "Slack holds the encryption keys; their team has technical access to all channels." },
      { label: "Reads your files", risk: "high", detail: "Files in channels and DMs are stored in cleartext on Slack infrastructure." },
      { label: "Trains AI on your content", risk: "medium", detail: "Slack AI uses workspace data per plan; opt-out exists but defaults vary." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Can hand over messages and files to third parties on external request." },
      { label: "Used by your sub-processors", risk: "medium", detail: "Slack has dozens of sub-processors with varying degrees of access." },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    category: "Messaging",
    exposure: [
      { label: "Reads your messages", risk: "high", detail: "Text messages stored in cleartext (voice/video uses DAVE E2E since late 2024)." },
      { label: "Reads your files", risk: "high", detail: "All uploaded media stored on Discord infrastructure." },
      { label: "Trains AI on your content", risk: "low", detail: "Discord has stated they don't train on user messages for AI as of 2025." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Hands over text content on external request." },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    category: "Docs",
    exposure: [
      { label: "Reads your documents", risk: "high", detail: "Server-side encryption; Notion holds keys, employees have access." },
      { label: "Reads attached files", risk: "high", detail: "Stored unencrypted on Notion infrastructure." },
      { label: "Trains AI on your content", risk: "medium", detail: "Notion AI can be configured to use workspace data per plan." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Can hand over document contents on external request." },
    ],
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    category: "Productivity",
    exposure: [
      { label: "Reads your documents", risk: "high", detail: "Default tiers store everything in cleartext (CSE only on Enterprise Plus with customer KMS)." },
      { label: "Reads your emails", risk: "high", detail: "Gmail content is server-readable; no E2E by default." },
      { label: "Reads your files", risk: "high", detail: "Drive files are server-side encrypted with Google-held keys." },
      { label: "Trains AI on your content", risk: "medium", detail: "Workspace AI use depends on plan, region, and admin settings." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Can produce document contents, email bodies, and files on external request." },
    ],
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365 / Teams",
    category: "Productivity",
    exposure: [
      { label: "Reads your messages", risk: "high", detail: "Teams chats are server-readable by Microsoft (Customer Key only on E5)." },
      { label: "Reads your documents", risk: "high", detail: "Word, Excel, and OneDrive files are server-side encrypted with Microsoft-held keys." },
      { label: "Trains AI on your content", risk: "medium", detail: "Copilot grounding uses workspace content per tenant configuration." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Can produce content on external request." },
    ],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "Storage",
    exposure: [
      { label: "Reads your files", risk: "high", detail: "Server-side encrypted; Dropbox holds keys and has access." },
      { label: "Trains AI on your content", risk: "medium", detail: "Dropbox Dash and AI features may access content per plan." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Hands over files on external request." },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (free or Plus)",
    category: "AI",
    exposure: [
      { label: "Stores your prompts", risk: "high", detail: "Conversations stored by OpenAI and may be used for training (unless explicitly opted out)." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "OpenAI can produce conversation logs on external request (NYT case in point)." },
      { label: "Used by employees", risk: "medium", detail: "Common shadow-IT — staff paste client/customer data into prompts without realizing." },
    ],
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Calls",
    exposure: [
      { label: "Reads recordings", risk: "high", detail: "Cloud recordings stored server-readable (E2EE for calls is opt-in and disables some features)." },
      { label: "Trains AI on your content", risk: "medium", detail: "Zoom AI Companion may use meeting content per tenant settings." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Recordings and transcripts available on external request." },
    ],
  },
  {
    id: "gmail",
    name: "Gmail (consumer)",
    category: "Email",
    exposure: [
      { label: "Reads your messages", risk: "high", detail: "No E2E encryption; Google has technical access to all email content." },
      { label: "Trains AI on your content", risk: "medium", detail: "Google has stated consumer Gmail content is no longer used for ads as of 2017 but Gemini features may surface it." },
      { label: "Discloses content to third parties on request", risk: "high", detail: "Hands over email bodies on external request." },
    ],
  },
  {
    id: "icloud",
    name: "iCloud (default)",
    category: "Storage",
    exposure: [
      { label: "Reads your files", risk: "medium", detail: "Server-readable unless Advanced Data Protection is on (off by default)." },
      { label: "Discloses content to third parties on request", risk: "medium", detail: "Apple discloses content on external request unless ADP is enabled." },
    ],
  },
];

export type Grade = {
  letter: "A" | "B" | "C" | "D" | "F";
  label: string;
  /** Tailwind className tint for in-app rendering */
  className: string;
  /** Raw hex for OG image rendering */
  hex: string;
};

export type ScorecardResult = {
  tools: ScorecardTool[];
  high: number;
  medium: number;
  low: number;
  totalRisks: number;
  pct: number;
  grade: Grade;
};

export function computeResult(picked: ScorecardTool[]): ScorecardResult {
  const allRisks = picked.flatMap((t) => t.exposure);
  const high = allRisks.filter((r) => r.risk === "high").length;
  const medium = allRisks.filter((r) => r.risk === "medium").length;
  const low = allRisks.filter((r) => r.risk === "low").length;
  const totalRisks = allRisks.length;
  const totalPossible = totalRisks * 3;
  const totalScore = high * 3 + medium * 2 + low;
  const pct = totalPossible === 0 ? 0 : Math.round((totalScore / totalPossible) * 100);
  const grade: Grade =
    pct >= 75
      ? { letter: "F", label: "Heavy exposure", className: "text-red-400", hex: "#f87171" }
      : pct >= 55
      ? { letter: "D", label: "Significant exposure", className: "text-orange-400", hex: "#fb923c" }
      : pct >= 35
      ? { letter: "C", label: "Moderate exposure", className: "text-amber-400", hex: "#fbbf24" }
      : pct >= 15
      ? { letter: "B", label: "Some exposure", className: "text-yellow-400", hex: "#facc15" }
      : { letter: "A", label: "Low exposure", className: "text-green-400", hex: "#4ade80" };
  return { tools: picked, high, medium, low, totalRisks, pct, grade };
}

/** Url-safe encoding of picks. Tools IDs contain `-`, so we join with `_`. */
export function encodePicks(ids: string[]): string {
  return ids.filter((x) => SCORECARD_TOOLS.some((t) => t.id === x)).join("_");
}

export function decodePicks(slug: string): ScorecardTool[] {
  const ids = slug.split("_").filter(Boolean);
  return ids
    .map((id) => SCORECARD_TOOLS.find((t) => t.id === id))
    .filter((t): t is ScorecardTool => !!t);
}
